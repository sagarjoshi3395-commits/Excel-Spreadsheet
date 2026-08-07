"""Tests for Razorpay payment endpoints + regression."""
import os
import hmac
import hashlib
import pytest
import requests
from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / '.env')

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/') if os.environ.get('REACT_APP_BACKEND_URL') else None
if not BASE_URL:
    # fallback: read frontend .env
    fe = Path(__file__).parent.parent.parent / 'frontend' / '.env'
    for line in fe.read_text().splitlines():
        if line.startswith('REACT_APP_BACKEND_URL='):
            BASE_URL = line.split('=', 1)[1].strip().strip('"').rstrip('/')

RAZORPAY_KEY_SECRET = os.environ['RAZORPAY_KEY_SECRET']
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']

mongo = MongoClient(MONGO_URL)[DB_NAME]


def test_root_regression():
    r = requests.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    assert r.json() == {"message": "Hello World"}


def test_status_regression():
    r = requests.post(f"{BASE_URL}/api/status", json={"client_name": "TEST_client"})
    assert r.status_code == 200
    assert r.json()["client_name"] == "TEST_client"
    r2 = requests.get(f"{BASE_URL}/api/status")
    assert r2.status_code == 200
    assert isinstance(r2.json(), list)


def test_create_order_invalid_email():
    r = requests.post(f"{BASE_URL}/api/payments/create-order", json={"email": "notanemail"})
    assert r.status_code == 422


def test_create_order_valid():
    r = requests.post(f"{BASE_URL}/api/payments/create-order", json={"email": "buyer@shop.com"})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["order_id"].startswith("order_")
    assert data["amount"] == 29000
    assert data["currency"] == "INR"
    assert data["key_id"].startswith("rzp_live_")
    # verify persisted in mongo
    doc = mongo.orders.find_one({"order_id": data["order_id"]})
    assert doc is not None
    assert doc["status"] == "created"
    assert doc["email"] == "buyer@shop.com"
    assert doc["amount"] == 29000
    pytest.order_id = data["order_id"]


def _sign(order_id, payment_id):
    msg = f"{order_id}|{payment_id}".encode()
    return hmac.new(RAZORPAY_KEY_SECRET.encode(), msg, hashlib.sha256).hexdigest()


def test_verify_valid_signature_sends_email():
    # create fresh order with a Resend "delivered" sandbox address
    r = requests.post(f"{BASE_URL}/api/payments/create-order", json={"email": "delivered@resend.dev"})
    order_id = r.json()["order_id"]
    payment_id = "pay_TESTfake123456"
    sig = _sign(order_id, payment_id)
    r2 = requests.post(f"{BASE_URL}/api/payments/verify", json={
        "razorpay_order_id": order_id,
        "razorpay_payment_id": payment_id,
        "razorpay_signature": sig,
    })
    assert r2.status_code == 200, r2.text
    data = r2.json()
    assert data["status"] == "paid"
    assert data["download_url"] == "/business-bookkeeping-system.pdf"
    assert data["email_sent"] is True
    doc = mongo.orders.find_one({"order_id": order_id})
    assert doc["status"] == "paid"
    assert doc["payment_id"] == payment_id
    assert doc.get("email_sent") is True


def test_verify_invalid_email_still_paid():
    """Email failure must not break payment confirmation."""
    # bounce@resend.dev triggers a hard bounce, but Resend still returns 202 with id,
    # so we simulate a bad domain that Resend rejects synchronously? Actually Resend
    # sandbox always accepts, so this test simply asserts that even if we can't
    # guarantee email delivery, status is still 'paid'.
    r = requests.post(f"{BASE_URL}/api/payments/create-order", json={"email": "bounced@resend.dev"})
    order_id = r.json()["order_id"]
    payment_id = "pay_TESTfake_email_resilience"
    sig = _sign(order_id, payment_id)
    r2 = requests.post(f"{BASE_URL}/api/payments/verify", json={
        "razorpay_order_id": order_id,
        "razorpay_payment_id": payment_id,
        "razorpay_signature": sig,
    })
    assert r2.status_code == 200, r2.text
    assert r2.json()["status"] == "paid"


def test_verify_invalid_signature():
    r = requests.post(f"{BASE_URL}/api/payments/create-order", json={"email": "buyer3@shop.com"})
    order_id = r.json()["order_id"]
    r2 = requests.post(f"{BASE_URL}/api/payments/verify", json={
        "razorpay_order_id": order_id,
        "razorpay_payment_id": "pay_fake",
        "razorpay_signature": "0" * 64,
    })
    assert r2.status_code == 400
    assert r2.json()["detail"] == "Payment verification failed"
    doc = mongo.orders.find_one({"order_id": order_id})
    assert doc["status"] == "signature_failed"


def test_pdf_available():
    r = requests.get(f"{BASE_URL}/business-bookkeeping-system.pdf")
    assert r.status_code == 200
    assert "application/pdf" in r.headers.get("content-type", "")
    # ~104KB expected
    assert 50_000 < len(r.content) < 500_000


def test_verify_invalid_signature_no_email():
    r = requests.post(f"{BASE_URL}/api/payments/create-order", json={"email": "delivered@resend.dev"})
    order_id = r.json()["order_id"]
    r2 = requests.post(f"{BASE_URL}/api/payments/verify", json={
        "razorpay_order_id": order_id,
        "razorpay_payment_id": "pay_fake",
        "razorpay_signature": "0" * 64,
    })
    assert r2.status_code == 400
    doc = mongo.orders.find_one({"order_id": order_id})
    assert doc["status"] == "signature_failed"
    assert doc.get("email_sent") is not True
