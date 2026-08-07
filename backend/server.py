from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
import httpx
import razorpay
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay
RAZORPAY_KEY_ID = os.environ['RAZORPAY_KEY_ID']
RAZORPAY_KEY_SECRET = os.environ['RAZORPAY_KEY_SECRET']
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
PRICE_PAISE = 29000  # ₹290

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Email (Emergent-managed Resend). Base URL is a constant so it survives deployment.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
PRODUCT_PDF_URL = os.environ["PRODUCT_PDF_URL"]
GOOGLE_SHEET_URL = os.environ.get("GOOGLE_SHEET_URL", "")
SUPPORT_EMAIL = os.environ.get("SUPPORT_EMAIL", "")


def delivery_email_html() -> str:
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f2;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #0f0f0f;">
          <tr><td style="background:#0f0f0f;padding:22px 28px;">
            <span style="color:#d4ff11;font-size:20px;font-weight:bold;letter-spacing:1px;">CREVVO</span>
          </td></tr>
          <tr><td style="padding:32px 28px;">
            <h1 style="margin:0 0 8px;font-size:26px;color:#0f0f0f;">Success! Your Bookkeeping System is ready 🎉</h1>
            <p style="margin:0 0 20px;font-size:15px;color:#595959;line-height:1.6;">
              Thank you for your purchase. Your <b>Business Bookkeeping Sheet System</b> is ready.
              Click below to save your own copy of the Google Sheet, then follow the video tutorial to get started.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin:8px 0 12px;"><tr><td style="background:#d4ff11;border:1px solid #0f0f0f;">
              <a href="{GOOGLE_SHEET_URL}" style="display:inline-block;padding:14px 26px;font-size:14px;font-weight:bold;color:#0f0f0f;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
                📊 Get your Google Sheet (make a copy)
              </a>
            </td></tr></table>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;"><tr><td style="border:1px solid #0f0f0f;">
              <a href="{PRODUCT_PDF_URL}" style="display:inline-block;padding:12px 22px;font-size:13px;font-weight:bold;color:#0f0f0f;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
                📄 Video tutorial + Excel version (PDF)
              </a>
            </td></tr></table>
            <p style="margin:0 0 6px;font-size:13px;color:#595959;line-height:1.6;">
              Your access includes:
            </p>
            <ul style="margin:0 0 20px;padding-left:18px;font-size:13px;color:#595959;line-height:1.7;">
              <li>📊 Google Sheets — click above, then "Make a copy" to get your own editable version</li>
              <li>▶ Video tutorial — how to use the system (in the PDF)</li>
              <li>📥 Microsoft Excel download (in the PDF)</li>
            </ul>
            <p style="margin:0;font-size:12px;color:#999;line-height:1.6;">
              Keep this email for your records. Need help? Reply to this email{f" or write to {SUPPORT_EMAIL}" if SUPPORT_EMAIL else ""}.
            </p>
          </td></tr>
          <tr><td style="background:#ebeae6;padding:16px 28px;border-top:1px solid #0f0f0f;">
            <span style="font-size:11px;color:#595959;">© Crevvo · Business Bookkeeping Sheet System</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


async def send_delivery_email(recipient: str):
    payload = {
        "to": [recipient],
        "subject": "Your Business Bookkeeping Sheet System is ready 🎉",
        "html": delivery_email_html(),
        "from_name": EMAIL_FROM_NAME,
    }
    if SUPPORT_EMAIL:
        payload["contact_email"] = SUPPORT_EMAIL
    async with httpx.AsyncClient(timeout=30) as http_client:
        resp = await http_client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")

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
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ---- Razorpay payment endpoints ----
class CreateOrderRequest(BaseModel):
    email: EmailStr

class VerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@api_router.post("/payments/create-order")
async def create_order(req: CreateOrderRequest):
    try:
        order = razorpay_client.order.create({
            "amount": PRICE_PAISE,
            "currency": "INR",
            "payment_capture": 1,
            "notes": {"email": req.email, "product": "Business Management Toolkit"},
        })
    except Exception as e:
        logger.error(f"Razorpay order create failed: {e}")
        raise HTTPException(status_code=502, detail="Could not create payment order")

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
    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": req.razorpay_order_id,
            "razorpay_payment_id": req.razorpay_payment_id,
            "razorpay_signature": req.razorpay_signature,
        })
    except razorpay.errors.SignatureVerificationError:
        await db.orders.update_one(
            {"order_id": req.razorpay_order_id},
            {"$set": {"status": "signature_failed"}},
        )
        raise HTTPException(status_code=400, detail="Payment verification failed")

    await db.orders.update_one(
        {"order_id": req.razorpay_order_id, "status": {"$ne": "paid"}},
        {"$set": {
            "status": "paid",
            "payment_id": req.razorpay_payment_id,
            "paid_at": datetime.now(timezone.utc).isoformat(),
        }},
    )

    # Deliver the product PDF by email (don't fail the purchase if email errors)
    email_sent = False
    order = await db.orders.find_one({"order_id": req.razorpay_order_id}, {"_id": 0, "email": 1})
    if order and order.get("email"):
        try:
            await send_delivery_email(order["email"])
            email_sent = True
            await db.orders.update_one({"order_id": req.razorpay_order_id}, {"$set": {"email_sent": True}})
        except Exception as e:
            logger.error(f"Delivery email failed for {order.get('email')}: {e}")

    return {"status": "paid", "download_url": "/business-bookkeeping-system.pdf", "email_sent": email_sent}


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
    client.close()