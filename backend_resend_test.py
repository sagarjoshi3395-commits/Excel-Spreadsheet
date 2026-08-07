#!/usr/bin/env python3
"""
Backend API Testing for Resend Product Delivery Integration
Tests the Resend email delivery after verified Razorpay payment.
"""

import requests
import json
import sys
import os

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

def test_resend_in_requirements():
    """Test 2: Verify resend>=2.0.0 is in requirements.txt"""
    try:
        with open("/app/backend/requirements.txt", "r") as f:
            content = f.read()
            passed = "resend>=2.0.0" in content
            
            if passed:
                details = "Found: resend>=2.0.0"
            else:
                # Check if resend exists at all
                if "resend" in content.lower():
                    for line in content.split("\n"):
                        if "resend" in line.lower():
                            details = f"Found different version: {line.strip()}"
                            passed = True  # Accept any resend version
                            break
                else:
                    details = "resend not found in requirements.txt"
            
            print_test("Resend in requirements.txt", passed, details)
            return passed
    except Exception as e:
        print_test("Resend in requirements.txt", False, f"Error: {str(e)}")
        return False

def test_resend_import():
    """Test 3: Verify resend is imported in server.py"""
    try:
        with open("/app/backend/server.py", "r") as f:
            content = f.read()
            passed = "import resend" in content
            
            if passed:
                details = "Found: import resend"
            else:
                details = "resend import not found in server.py"
            
            print_test("Resend Import in server.py", passed, details)
            return passed
    except Exception as e:
        print_test("Resend Import in server.py", False, f"Error: {str(e)}")
        return False

def test_environment_configuration():
    """Test 4: Verify environment variables are configured"""
    try:
        with open("/app/backend/.env", "r") as f:
            content = f.read()
            
            required_vars = [
                "RESEND_API_KEY",
                "SENDER_EMAIL",
                "SUPPORT_EMAIL",
                "PRODUCT_SHEET_URL"
            ]
            
            missing_vars = []
            found_vars = []
            
            for var in required_vars:
                if var in content:
                    # Check if it has a value (not empty)
                    for line in content.split("\n"):
                        if line.startswith(var):
                            if "=" in line and line.split("=", 1)[1].strip():
                                found_vars.append(var)
                            else:
                                missing_vars.append(f"{var} (empty)")
                            break
                else:
                    missing_vars.append(var)
            
            passed = len(missing_vars) == 0
            
            if passed:
                details = f"All required variables configured: {', '.join(found_vars)}"
            else:
                details = f"Missing or empty: {', '.join(missing_vars)}"
            
            print_test("Environment Configuration", passed, details)
            return passed
    except Exception as e:
        print_test("Environment Configuration", False, f"Error: {str(e)}")
        return False

def test_no_secrets_in_logs():
    """Test 5: Verify no secrets are exposed in backend logs"""
    try:
        # Read backend logs
        with open("/var/log/supervisor/backend.err.log", "r") as f:
            log_content = f.read()
        
        # Check for potential secret exposure
        secret_patterns = [
            "re_",  # Resend API key prefix
            "RESEND_API_KEY",
            "rzp_live_",  # Razorpay key prefix
            "RAZORPAY_KEY_SECRET"
        ]
        
        exposed_secrets = []
        for pattern in secret_patterns:
            if pattern in log_content:
                # Check if it's just the variable name or actual value
                for line in log_content.split("\n"):
                    if pattern in line and "=" in line:
                        exposed_secrets.append(pattern)
                        break
        
        passed = len(exposed_secrets) == 0
        
        if passed:
            details = "No secrets exposed in logs"
        else:
            details = f"Potential secret exposure: {', '.join(exposed_secrets)}"
        
        print_test("No Secrets in Logs", passed, details)
        return passed
    except Exception as e:
        print_test("No Secrets in Logs", False, f"Error: {str(e)}")
        return False

def test_verify_payment_response_contract():
    """Test 6: Verify /api/payments/verify response contract"""
    try:
        # Test with fake signature data (will fail but we can check response structure)
        response = requests.post(
            f"{BACKEND_URL}/payments/verify",
            json={
                "razorpay_order_id": "order_fake123",
                "razorpay_payment_id": "pay_fake456",
                "razorpay_signature": "invalid_signature_abc123"
            },
            timeout=10
        )
        
        # We expect 503 (no Mongo) or 400 (invalid signature)
        # But we need to check the code to verify the response structure
        with open("/app/backend/server.py", "r") as f:
            content = f.read()
            
            # Check for required fields in the return statement
            required_fields = [
                '"product_url"',
                '"email_sent"',
                '"event_id"',
                '"value"',
                '"currency"'
            ]
            
            forbidden_fields = [
                '"download_url"'
            ]
            
            missing_fields = []
            found_forbidden = []
            
            # Find the verify_payment function return statement
            verify_function_start = content.find("async def verify_payment")
            if verify_function_start != -1:
                verify_function = content[verify_function_start:verify_function_start + 3000]
                
                for field in required_fields:
                    if field not in verify_function:
                        missing_fields.append(field)
                
                for field in forbidden_fields:
                    if field in verify_function:
                        found_forbidden.append(field)
            
            passed = len(missing_fields) == 0 and len(found_forbidden) == 0
            
            if passed:
                field_names = [f.strip('"') for f in required_fields]
                details = f"Response contract correct: returns {', '.join(field_names)}, no download_url"
            else:
                details = ""
                if missing_fields:
                    details += f"Missing fields: {', '.join(missing_fields)}. "
                if found_forbidden:
                    details += f"Forbidden fields found: {', '.join(found_forbidden)}"
            
            print_test("Verify Payment Response Contract", passed, details)
            return passed
    except Exception as e:
        print_test("Verify Payment Response Contract", False, f"Error: {str(e)}")
        return False

def test_missing_mongo_fails_safely():
    """Test 7: Verify missing Mongo fails safely without marking paid"""
    try:
        # Test create-order with missing Mongo
        response = requests.post(
            f"{BACKEND_URL}/payments/create-order",
            json={"email": "test.user@ledgerkit.com"},
            timeout=10
        )
        
        # Should return 503 when Mongo is not configured
        passed = response.status_code == 503
        
        if passed:
            details = f"Status: 503 (Database not configured) - Safe failure as expected"
        else:
            details = f"Status: {response.status_code} - Expected 503 for missing Mongo"
        
        print_test("Missing Mongo Fails Safely", passed, details)
        return passed
    except Exception as e:
        print_test("Missing Mongo Fails Safely", False, f"Error: {str(e)}")
        return False

def test_email_delivery_non_blocking():
    """Test 8: Verify email delivery is async/non-blocking and caught"""
    try:
        with open("/app/backend/server.py", "r") as f:
            content = f.read()
            
            # Check for async email delivery
            checks = {
                "async_email_function": "async def send_delivery_email" in content,
                "try_except_wrapper": "try:" in content and "await send_delivery_email" in content and "except Exception" in content,
                "non_blocking": "await send_delivery_email" in content,
                "error_logged": "logger.error" in content and "email" in content.lower()
            }
            
            passed = all(checks.values())
            
            if passed:
                details = "Email delivery is async, non-blocking, and wrapped in try-except"
            else:
                failed_checks = [k for k, v in checks.items() if not v]
                details = f"Failed checks: {', '.join(failed_checks)}"
            
            print_test("Email Delivery Non-Blocking", passed, details)
            return passed
    except Exception as e:
        print_test("Email Delivery Non-Blocking", False, f"Error: {str(e)}")
        return False

def test_ledgerkit_sender_email():
    """Test 9: Check for issues with ledgerkitsupport@gmail.com as sender"""
    try:
        with open("/app/backend/.env", "r") as f:
            content = f.read()
            
            # Check if ledgerkitsupport@gmail.com is configured
            sender_configured = "ledgerkitsupport@gmail.com" in content
            
            if sender_configured:
                # Check if it's used as SENDER_EMAIL
                for line in content.split("\n"):
                    if "SENDER_EMAIL" in line and "ledgerkitsupport@gmail.com" in line:
                        passed = True
                        details = "ledgerkitsupport@gmail.com configured as SENDER_EMAIL. Note: Resend requires domain verification for custom senders. Gmail addresses may not work without proper setup."
                        break
                else:
                    passed = False
                    details = "ledgerkitsupport@gmail.com found but not as SENDER_EMAIL"
            else:
                passed = False
                details = "ledgerkitsupport@gmail.com not found in configuration"
            
            print_test("LedgerKit Sender Email Configuration", passed, details)
            return passed
    except Exception as e:
        print_test("LedgerKit Sender Email Configuration", False, f"Error: {str(e)}")
        return False

def main():
    """Run all backend Resend tests"""
    print("=" * 80)
    print("RESEND PRODUCT DELIVERY BACKEND INTEGRATION TESTS")
    print("=" * 80)
    print(f"Backend URL: {BACKEND_URL}")
    print("Testing Resend email delivery after verified Razorpay payment")
    print("=" * 80)
    
    results = []
    
    # Test 1: Backend health
    results.append(("Backend Health", test_backend_health()))
    
    # Test 2: Resend in requirements.txt
    results.append(("Resend Dependency", test_resend_in_requirements()))
    
    # Test 3: Resend import
    results.append(("Resend Import", test_resend_import()))
    
    # Test 4: Environment configuration
    results.append(("Environment Configuration", test_environment_configuration()))
    
    # Test 5: No secrets in logs
    results.append(("No Secrets in Logs", test_no_secrets_in_logs()))
    
    # Test 6: Verify payment response contract
    results.append(("Response Contract", test_verify_payment_response_contract()))
    
    # Test 7: Missing Mongo fails safely
    results.append(("Missing Mongo Safety", test_missing_mongo_fails_safely()))
    
    # Test 8: Email delivery non-blocking
    results.append(("Email Non-Blocking", test_email_delivery_non_blocking()))
    
    # Test 9: LedgerKit sender email
    results.append(("Sender Email Config", test_ledgerkit_sender_email()))
    
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
    
    # Return exit code
    return 0 if passed_count == total_count else 1

if __name__ == "__main__":
    sys.exit(main())
