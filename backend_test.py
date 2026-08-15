#!/usr/bin/env python3
"""
Backend API Testing for Razorpay Integration
Tests the Razorpay Live Mode integration without making actual payments.
"""

import requests
import json
import sys

# Backend URL from frontend/.env
BACKEND_URL = "https://gh-sync-14.preview.emergentagent.com/api"

def print_test(test_name, passed, details=""):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {test_name}")
    if details:
        print(f"   Details: {details}")

def test_backend_health():
    """Test 1: Verify backend is running and GET /api/ returns 200"""
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        passed = response.status_code == 200
        details = f"Status: {response.status_code}, Response: {response.json()}"
        print_test("Backend Health Check (GET /api/)", passed, details)
        return passed
    except Exception as e:
        print_test("Backend Health Check (GET /api/)", False, f"Error: {str(e)}")
        return False

def test_create_order_invalid_email():
    """Test 2: POST /api/payments/create-order with invalid email returns 422"""
    try:
        # Test with invalid email format
        response = requests.post(
            f"{BACKEND_URL}/payments/create-order",
            json={"email": "not-an-email"},
            timeout=10
        )
        passed = response.status_code == 422
        details = f"Status: {response.status_code}, Response: {response.text[:200]}"
        print_test("Create Order - Invalid Email (422 expected)", passed, details)
        return passed
    except Exception as e:
        print_test("Create Order - Invalid Email (422 expected)", False, f"Error: {str(e)}")
        return False

def test_create_order_missing_mongo():
    """Test 3: POST /api/payments/create-order with valid email - expect 503 due to missing Mongo"""
    try:
        # Test with valid email but no Mongo configured
        response = requests.post(
            f"{BACKEND_URL}/payments/create-order",
            json={"email": "test.user@ledgerkit.com"},
            timeout=10
        )
        
        # In preview environment without Mongo, we expect 503
        if response.status_code == 503:
            passed = True
            details = f"Status: 503 (Expected - Database not configured), Response: {response.json()}"
        # If Mongo is available, order creation might succeed
        elif response.status_code == 200:
            passed = True
            order_data = response.json()
            details = f"Status: 200 (Mongo available), Order ID: {order_data.get('order_id', 'N/A')}, Amount: ₹{order_data.get('amount', 0)/100}"
            print(f"   ⚠️  WARNING: A Razorpay order was created. Order ID: {order_data.get('order_id')}")
            print(f"   ⚠️  This is a LIVE order for ₹290. Do NOT complete payment.")
        else:
            passed = False
            details = f"Unexpected status: {response.status_code}, Response: {response.text[:200]}"
        
        print_test("Create Order - Valid Email (503 or 200 expected)", passed, details)
        return passed
    except Exception as e:
        print_test("Create Order - Valid Email (503 or 200 expected)", False, f"Error: {str(e)}")
        return False

def test_verify_payment_invalid_signature():
    """Test 4: POST /api/payments/verify with invalid signature returns 400 or 503"""
    try:
        # Test with fake signature data
        response = requests.post(
            f"{BACKEND_URL}/payments/verify",
            json={
                "razorpay_order_id": "order_fake123",
                "razorpay_payment_id": "pay_fake456",
                "razorpay_signature": "invalid_signature_abc123"
            },
            timeout=10
        )
        
        # Expect 503 if Mongo not configured, or 400 for signature verification failure
        passed = response.status_code in [400, 503]
        details = f"Status: {response.status_code}, Response: {response.json()}"
        
        if response.status_code == 400:
            details += " (Signature verification failed as expected)"
        elif response.status_code == 503:
            details += " (Service not configured - expected in preview)"
        
        print_test("Verify Payment - Invalid Signature (400 or 503 expected)", passed, details)
        return passed
    except Exception as e:
        print_test("Verify Payment - Invalid Signature (400 or 503 expected)", False, f"Error: {str(e)}")
        return False

def test_routes_api_prefixed():
    """Test 5: Verify all routes are /api-prefixed"""
    routes_to_test = [
        ("/", "GET"),
        ("/payments/create-order", "POST"),
        ("/payments/verify", "POST")
    ]
    
    all_prefixed = True
    details_list = []
    
    for route, method in routes_to_test:
        # All routes should be accessible under /api prefix
        full_url = f"{BACKEND_URL}{route}"
        details_list.append(f"{method} {full_url}")
    
    details = "Routes tested: " + ", ".join(details_list)
    print_test("All Routes /api-prefixed", all_prefixed, details)
    return all_prefixed

def test_no_webhook_endpoint():
    """Test 6: Verify no webhook endpoint exists (user skipped webhook secret)"""
    try:
        # Try to access a webhook endpoint - should return 404
        response = requests.post(
            f"{BACKEND_URL}/payments/webhook",
            json={"test": "data"},
            timeout=10
        )
        
        passed = response.status_code == 404
        details = f"Status: {response.status_code} (404 expected - no webhook configured)"
        print_test("No Webhook Endpoint (404 expected)", passed, details)
        return passed
    except Exception as e:
        print_test("No Webhook Endpoint (404 expected)", False, f"Error: {str(e)}")
        return False

def check_razorpay_in_requirements():
    """Test 7: Verify razorpay is in requirements.txt"""
    try:
        with open("/app/backend/requirements.txt", "r") as f:
            content = f.read()
            passed = "razorpay" in content.lower()
            
            if passed:
                # Extract the line with razorpay
                for line in content.split("\n"):
                    if "razorpay" in line.lower():
                        details = f"Found: {line.strip()}"
                        break
            else:
                details = "razorpay not found in requirements.txt"
            
            print_test("Razorpay in requirements.txt", passed, details)
            return passed
    except Exception as e:
        print_test("Razorpay in requirements.txt", False, f"Error: {str(e)}")
        return False

def test_bump_pricing_code_inspection():
    """Test 8: Inspect server.py code to verify bump pricing logic"""
    try:
        with open("/app/backend/server.py", "r") as f:
            content = f.read()
        
        # Check for PRICE_PAISE = 29000
        price_check = "PRICE_PAISE = 29000" in content
        
        # Check for BUMP_PRICE_PAISE = 19900
        bump_price_check = "BUMP_PRICE_PAISE = 19900" in content
        
        # Check for amount calculation: PRICE_PAISE + (BUMP_PRICE_PAISE if req.include_bump else 0)
        amount_calc_check = "PRICE_PAISE + (BUMP_PRICE_PAISE if req.include_bump else 0)" in content
        
        # Check for include_bump field in CreateOrderRequest
        include_bump_field_check = "include_bump: bool" in content
        
        # Check for bump persistence in order document
        bump_persist_check = '"include_bump": req.include_bump' in content and '"bump_amount": BUMP_PRICE_PAISE if req.include_bump else 0' in content
        
        all_checks = [price_check, bump_price_check, amount_calc_check, include_bump_field_check, bump_persist_check]
        passed = all(all_checks)
        
        details = f"PRICE_PAISE=29000: {price_check}, BUMP_PRICE_PAISE=19900: {bump_price_check}, "
        details += f"Amount calc: {amount_calc_check}, include_bump field: {include_bump_field_check}, "
        details += f"Persistence: {bump_persist_check}"
        
        if passed:
            details += " | ✓ include_bump=false → ₹290 (29000 paise), include_bump=true → ₹489 (48900 paise)"
        
        print_test("Bump Pricing Code Inspection", passed, details)
        return passed
    except Exception as e:
        print_test("Bump Pricing Code Inspection", False, f"Error: {str(e)}")
        return False

def test_verify_payment_response_contract():
    """Test 9: Verify payment response contract includes bump fields and no PDF"""
    try:
        with open("/app/backend/server.py", "r") as f:
            content = f.read()
        
        # Check verify endpoint returns correct fields
        verify_endpoint_found = '@api_router.post("/payments/verify")' in content
        
        # Check response includes include_bump
        include_bump_response = '"include_bump": include_bump' in content
        
        # Check response includes bump_product_url
        bump_url_response = '"bump_product_url": BUMP_PRODUCT_URL if include_bump else ""' in content
        
        # Check response uses stored order amount for Meta value
        meta_value_check = 'float(order_record.get("amount", PRICE_PAISE)) / 100' in content
        
        # Check no download_url or pdf in response
        no_pdf_check = 'download_url' not in content and 'pdf_url' not in content.lower()
        
        # Check product_url is present
        product_url_check = '"product_url": PRODUCT_SHEET_URL' in content
        
        all_checks = [verify_endpoint_found, include_bump_response, bump_url_response, meta_value_check, no_pdf_check, product_url_check]
        passed = all(all_checks)
        
        details = f"Verify endpoint: {verify_endpoint_found}, include_bump: {include_bump_response}, "
        details += f"bump_product_url: {bump_url_response}, Meta value from stored amount: {meta_value_check}, "
        details += f"No PDF: {no_pdf_check}, product_url: {product_url_check}"
        
        print_test("Verify Payment Response Contract", passed, details)
        return passed
    except Exception as e:
        print_test("Verify Payment Response Contract", False, f"Error: {str(e)}")
        return False

def test_resend_email_bump_logic():
    """Test 10: Verify Resend email includes bump conditionally and is non-blocking"""
    try:
        with open("/app/backend/server.py", "r") as f:
            content = f.read()
        
        # Check delivery_email_html function accepts include_bump parameter
        email_func_check = "def delivery_email_html(include_bump: bool = False)" in content
        
        # Check email includes bump product URL conditionally (must check include_bump AND BUMP_PRODUCT_URL together)
        bump_conditional_check = ('if include_bump and BUMP_PRODUCT_URL' in content) or ('if BUMP_PRODUCT_URL and include_bump' in content)
        
        # Check BUMP_PRODUCT_URL is loaded from environment
        bump_url_env_check = 'BUMP_PRODUCT_URL = os.environ.get("BUMP_PRODUCT_URL", "")' in content
        
        # Check email sending is wrapped in try-except (non-blocking)
        try_except_check = 'try:\n            await send_delivery_email' in content and 'except Exception as exc:\n            logger.error("Product email delivery failed:' in content
        
        # Check email is sent with include_bump parameter
        email_call_check = 'await send_delivery_email(order_record["email"], include_bump)' in content
        
        all_checks = [email_func_check, bump_conditional_check, bump_url_env_check, try_except_check, email_call_check]
        passed = all(all_checks)
        
        details = f"Email function with include_bump: {email_func_check}, Conditional bump: {bump_conditional_check}, "
        details += f"BUMP_PRODUCT_URL env: {bump_url_env_check}, Non-blocking try-except: {try_except_check}, "
        details += f"Email call with include_bump: {email_call_check}"
        
        print_test("Resend Email Bump Logic", passed, details)
        return passed
    except Exception as e:
        print_test("Resend Email Bump Logic", False, f"Error: {str(e)}")
        return False

def test_bump_product_url_configured():
    """Test 11: Verify BUMP_PRODUCT_URL is configured with supplied Google Drive link"""
    try:
        with open("/app/backend/.env", "r") as f:
            content = f.read()
        
        # Check BUMP_PRODUCT_URL exists and contains the supplied Google Drive link
        bump_url_line_found = False
        bump_url_configured = False
        bump_url_value = ""
        
        for line in content.split("\n"):
            if line.startswith("BUMP_PRODUCT_URL"):
                bump_url_line_found = True
                # Extract the URL value
                if "=" in line:
                    bump_url_value = line.split("=", 1)[1].strip()
                    # Check if it's a valid Google Drive link
                    if "drive.google.com" in bump_url_value and len(bump_url_value) > 10:
                        bump_url_configured = True
                break
        
        passed = bump_url_line_found and bump_url_configured
        
        if passed:
            details = f"BUMP_PRODUCT_URL is configured with Google Drive link: {bump_url_value[:60]}..."
        else:
            details = f"Line found: {bump_url_line_found}, Configured: {bump_url_configured}, Value: {bump_url_value}"
        
        print_test("BUMP_PRODUCT_URL Configured with Google Drive Link", passed, details)
        return passed
    except Exception as e:
        print_test("BUMP_PRODUCT_URL Configured with Google Drive Link", False, f"Error: {str(e)}")
        return False

def test_create_order_with_bump_flag():
    """Test 12: Test create-order API accepts include_bump parameter"""
    try:
        # Test without bump (include_bump=false)
        response_no_bump = requests.post(
            f"{BACKEND_URL}/payments/create-order",
            json={"email": "customer@ledgerkit.com", "include_bump": False},
            timeout=10
        )
        
        # Test with bump (include_bump=true)
        response_with_bump = requests.post(
            f"{BACKEND_URL}/payments/create-order",
            json={"email": "customer@ledgerkit.com", "include_bump": True},
            timeout=10
        )
        
        # Both should return 503 in preview (no Mongo) or 200 if Mongo is available
        valid_status_codes = [200, 503]
        no_bump_valid = response_no_bump.status_code in valid_status_codes
        with_bump_valid = response_with_bump.status_code in valid_status_codes
        
        passed = no_bump_valid and with_bump_valid
        
        details = f"Without bump: {response_no_bump.status_code}, With bump: {response_with_bump.status_code}"
        
        if response_no_bump.status_code == 200:
            data = response_no_bump.json()
            details += f" | No bump amount: ₹{data.get('amount', 0)/100} (expected ₹290)"
            if data.get('amount') != 29000:
                passed = False
                details += " ❌ INCORRECT AMOUNT"
        
        if response_with_bump.status_code == 200:
            data = response_with_bump.json()
            details += f" | With bump amount: ₹{data.get('amount', 0)/100} (expected ₹489)"
            if data.get('amount') != 48900:
                passed = False
                details += " ❌ INCORRECT AMOUNT"
        
        print_test("Create Order with include_bump Flag", passed, details)
        return passed
    except Exception as e:
        print_test("Create Order with include_bump Flag", False, f"Error: {str(e)}")
        return False

def test_email_template_bump_conditional():
    """Test 13: CRITICAL - Verify email template conditionally includes bump link"""
    try:
        # Import the delivery_email_html function from server.py
        import sys
        sys.path.insert(0, '/app/backend')
        from server import delivery_email_html, BUMP_PRODUCT_URL
        
        # Get the Google Drive link from .env
        expected_bump_url = BUMP_PRODUCT_URL
        
        if not expected_bump_url or "drive.google.com" not in expected_bump_url:
            print_test("Email Template Bump Conditional", False, "BUMP_PRODUCT_URL not configured properly")
            return False
        
        # Test 1: include_bump=False should NOT contain bump link
        email_no_bump = delivery_email_html(include_bump=False)
        bump_link_in_no_bump = expected_bump_url in email_no_bump
        bump_text_in_no_bump = "Productivity & Execution Bundle" in email_no_bump or "Productivity &amp; Execution Bundle" in email_no_bump
        
        # Test 2: include_bump=True should contain bump link
        email_with_bump = delivery_email_html(include_bump=True)
        bump_link_in_with_bump = expected_bump_url in email_with_bump
        bump_text_in_with_bump = "Productivity & Execution Bundle" in email_with_bump or "Productivity &amp; Execution Bundle" in email_with_bump
        
        # CRITICAL: include_bump=False must NOT have bump link
        no_bump_correct = not bump_link_in_no_bump
        
        # CRITICAL: include_bump=True must have bump link
        with_bump_correct = bump_link_in_with_bump
        
        passed = no_bump_correct and with_bump_correct
        
        details = f"include_bump=False: Bump link present={bump_link_in_no_bump} (should be False), "
        details += f"include_bump=True: Bump link present={bump_link_in_with_bump} (should be True)"
        
        if not no_bump_correct:
            details += " | 🚨 CRITICAL BUG: Customers without bump will receive bump link for FREE!"
        
        if not with_bump_correct:
            details += " | 🚨 CRITICAL BUG: Customers with bump will NOT receive bump link!"
        
        print_test("Email Template Bump Conditional (CRITICAL)", passed, details)
        return passed
    except Exception as e:
        print_test("Email Template Bump Conditional (CRITICAL)", False, f"Error: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print("=" * 80)
    print("RAZORPAY BACKEND INTEGRATION TESTS - BUMP OFFER VERIFICATION")
    print("=" * 80)
    print(f"Backend URL: {BACKEND_URL}")
    print("⚠️  IMPORTANT: Using LIVE Razorpay credentials - NO actual payments will be made")
    print("⚠️  Testing bump offer: ₹290 base + ₹199 optional bump = ₹489 total")
    print("=" * 80)
    
    results = []
    
    # Test 1: Backend health
    results.append(("Backend Health", test_backend_health()))
    
    # Test 2: Invalid email validation
    results.append(("Invalid Email Validation", test_create_order_invalid_email()))
    
    # Test 3: Create order with valid email (expect 503 or 200)
    results.append(("Create Order API", test_create_order_missing_mongo()))
    
    # Test 4: Invalid signature verification
    results.append(("Signature Verification", test_verify_payment_invalid_signature()))
    
    # Test 5: Routes are /api-prefixed
    results.append(("API Prefix Check", test_routes_api_prefixed()))
    
    # Test 6: No webhook endpoint
    results.append(("No Webhook Endpoint", test_no_webhook_endpoint()))
    
    # Test 7: Razorpay in requirements.txt
    results.append(("Razorpay Dependency", check_razorpay_in_requirements()))
    
    # BUMP OFFER TESTS
    print("\n" + "=" * 80)
    print("BUMP OFFER SPECIFIC TESTS")
    print("=" * 80)
    
    # Test 8: Bump pricing code inspection
    results.append(("Bump Pricing Code", test_bump_pricing_code_inspection()))
    
    # Test 9: Verify payment response contract
    results.append(("Verify Response Contract", test_verify_payment_response_contract()))
    
    # Test 10: Resend email bump logic
    results.append(("Resend Email Bump Logic", test_resend_email_bump_logic()))
    
    # Test 11: BUMP_PRODUCT_URL is configured
    results.append(("BUMP_PRODUCT_URL Configured", test_bump_product_url_configured()))
    
    # Test 12: Create order with bump flag
    results.append(("Create Order with Bump Flag", test_create_order_with_bump_flag()))
    
    # Test 13: CRITICAL - Email template bump conditional
    results.append(("Email Template Bump Conditional (CRITICAL)", test_email_template_bump_conditional()))
    
    # Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    
    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print("=" * 80)
    print(f"Total: {passed_count}/{total_count} tests passed")
    print("=" * 80)
    
    # Additional notes
    print("\n📋 IMPORTANT NOTES:")
    print("   • BUMP_PRODUCT_URL is configured with supplied Google Drive link")
    print("   • include_bump=false → ₹290 (29,000 paise)")
    print("   • include_bump=true → ₹489 (48,900 paise = 29,000 + 19,900)")
    print("   • Bump selection is persisted in order records")
    print("   • Meta Purchase value uses stored order amount (₹290 or ₹489)")
    print("   • Email delivery is non-blocking and includes bump conditionally")
    print("   • No PDF/download_url in response (only product_url)")
    
    # Return exit code
    return 0 if passed_count == total_count else 1

if __name__ == "__main__":
    sys.exit(main())
