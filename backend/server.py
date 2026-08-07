from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List
import asyncio
import uuid
import razorpay
import resend
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection. The deployment environment supplies these values through backend/.env.
mongo_url = os.environ.get("MONGO_URL")
db_name = os.environ.get("DB_NAME")
client = AsyncIOMotorClient(mongo_url) if mongo_url else None
db = client[db_name] if client and db_name else None

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET")
razorpay_client = (
    razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
    else None
)
PRICE_PAISE = 29000
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL")
SUPPORT_EMAIL = os.environ.get("SUPPORT_EMAIL", "ledgerkitsupport@gmail.com")
PRODUCT_SHEET_URL = os.environ.get("PRODUCT_SHEET_URL")
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


def delivery_email_html() -> str:
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f2;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #0f0f0f;">
          <tr><td style="background:#0f0f0f;padding:22px 28px;">
            <span style="color:#d4ff11;font-size:20px;font-weight:bold;letter-spacing:1px;">LEDGER/KIT</span>
          </td></tr>
          <tr><td style="padding:32px 28px;">
            <h1 style="margin:0 0 8px;font-size:26px;color:#0f0f0f;">Your Business Toolkit is ready</h1>
            <p style="margin:0 0 20px;font-size:15px;color:#595959;line-height:1.6;">
              Thank you for your purchase. Use the button below to open your editable Google Sheet product.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="background:#d4ff11;border:1px solid #0f0f0f;">
              <a href="{PRODUCT_SHEET_URL}" style="display:inline-block;padding:14px 26px;font-size:14px;font-weight:bold;color:#0f0f0f;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
                Open your Google Sheet
              </a>
            </td></tr></table>
            <p style="margin:0;font-size:12px;color:#999;line-height:1.6;">
              Need help or did not receive your product? Contact {SUPPORT_EMAIL}.
            </p>
          </td></tr>
          <tr><td style="background:#ebeae6;padding:16px 28px;border-top:1px solid #0f0f0f;">
            <span style="font-size:11px;color:#595959;">© LedgerKit · Business Management Toolkit</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


async def send_delivery_email(recipient: str):
    if not RESEND_API_KEY or not SENDER_EMAIL or not PRODUCT_SHEET_URL:
        raise RuntimeError("Email delivery is not configured")
    params = {
        "from": SENDER_EMAIL,
        "to": [recipient],
        "subject": "Your LedgerKit Business Toolkit is ready",
        "html": delivery_email_html(),
        "reply_to": [SUPPORT_EMAIL],
    }
    return await asyncio.to_thread(resend.Emails.send, params)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured")
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured")
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks



class CreateOrderRequest(BaseModel):
    email: EmailStr


class VerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@api_router.post("/payments/create-order")
async def create_order(req: CreateOrderRequest):
    if razorpay_client is None:
        raise HTTPException(status_code=503, detail="Razorpay is not configured")
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured")

    try:
        order = razorpay_client.order.create({
            "amount": PRICE_PAISE,
            "currency": "INR",
            "payment_capture": 1,
            "receipt": str(uuid.uuid4())[:40],
            "notes": {"email": req.email, "product": "Business Management Toolkit"},
        })
    except Exception as exc:
        logger.error("Razorpay order create failed: %s", exc)
        raise HTTPException(status_code=502, detail="Could not create payment order") from exc

    doc = {
        "id": str(uuid.uuid4()),
        "order_id": order["id"],
        "email": req.email,
        "amount": PRICE_PAISE,
        "currency": "INR",
        "status": "created",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.orders.insert_one(doc)
    return {
        "order_id": order["id"],
        "amount": PRICE_PAISE,
        "currency": "INR",
        "key_id": RAZORPAY_KEY_ID,
    }


@api_router.post("/payments/verify")
async def verify_payment(req: VerifyRequest):
    if razorpay_client is None or db is None:
        raise HTTPException(status_code=503, detail="Payment service is not configured")

    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": req.razorpay_order_id,
            "razorpay_payment_id": req.razorpay_payment_id,
            "razorpay_signature": req.razorpay_signature,
        })
    except razorpay.errors.SignatureVerificationError as exc:
        await db.orders.update_one(
            {"order_id": req.razorpay_order_id},
            {"$set": {"status": "signature_failed"}},
        )
        raise HTTPException(status_code=400, detail="Payment verification failed") from exc

    order_record = await db.orders.find_one(
        {"order_id": req.razorpay_order_id},
        {"_id": 0, "email": 1, "email_sent": 1},
    )
    if not order_record:
        raise HTTPException(status_code=404, detail="Payment order not found")

    await db.orders.update_one(
        {"order_id": req.razorpay_order_id, "status": {"$ne": "paid"}},
        {"$set": {
            "status": "paid",
            "payment_id": req.razorpay_payment_id,
            "paid_at": datetime.now(timezone.utc).isoformat(),
        }},
    )

    email_sent = bool(order_record.get("email_sent"))
    if order_record.get("email") and not email_sent:
        try:
            await send_delivery_email(order_record["email"])
            email_sent = True
            await db.orders.update_one(
                {"order_id": req.razorpay_order_id},
                {"$set": {"email_sent": True}},
            )
        except Exception as exc:
            logger.error("Product email delivery failed: %s", exc)

    return {
        "status": "paid",
        "product_url": PRODUCT_SHEET_URL,
        "event_id": f"purchase_{req.razorpay_order_id}",
        "value": PRICE_PAISE / 100,
        "currency": "INR",
        "email_sent": email_sent,
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()