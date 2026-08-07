#!/usr/bin/env python3
"""
Backend API Testing Script
Tests the FastAPI backend endpoints to verify deployment-safe configuration
"""

import requests
import json
import sys

# Backend URL - using internal port since REACT_APP_BACKEND_URL is empty in .env
BASE_URL = "http://localhost:8001"
API_BASE = f"{BASE_URL}/api"

def test_root_endpoint():
    """Test GET /api/ returns 200"""
    print("\n" + "="*60)
    print("TEST 1: GET /api/ - Root Endpoint")
    print("="*60)
    try:
        response = requests.get(f"{API_BASE}/", timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ PASS: Root endpoint returns 200")
            return True
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ FAIL: Exception occurred - {str(e)}")
        return False

def test_status_post_without_mongo():
    """Test POST /api/status returns 503 when Mongo is not configured"""
    print("\n" + "="*60)
    print("TEST 2: POST /api/status - Without Mongo Configuration")
    print("="*60)
    try:
        payload = {"client_name": "test_client"}
        response = requests.post(f"{API_BASE}/status", json=payload, timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 503:
            detail = response.json().get("detail", "")
            if "Database is not configured" in detail:
                print("✅ PASS: Status POST returns 503 with correct error message")
                return True
            else:
                print(f"❌ FAIL: Got 503 but wrong error message: {detail}")
                return False
        else:
            print(f"❌ FAIL: Expected 503, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ FAIL: Exception occurred - {str(e)}")
        return False

def test_status_get_without_mongo():
    """Test GET /api/status returns 503 when Mongo is not configured"""
    print("\n" + "="*60)
    print("TEST 3: GET /api/status - Without Mongo Configuration")
    print("="*60)
    try:
        response = requests.get(f"{API_BASE}/status", timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 503:
            detail = response.json().get("detail", "")
            if "Database is not configured" in detail:
                print("✅ PASS: Status GET returns 503 with correct error message")
                return True
            else:
                print(f"❌ FAIL: Got 503 but wrong error message: {detail}")
                return False
        else:
            print(f"❌ FAIL: Expected 503, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ FAIL: Exception occurred - {str(e)}")
        return False

def test_removed_payment_endpoints():
    """Verify that removed Razorpay payment endpoints return 404"""
    print("\n" + "="*60)
    print("TEST 4: Verify Removed Payment Endpoints")
    print("="*60)
    
    # Test endpoints that should no longer exist
    removed_endpoints = [
        "/api/create-order",
        "/api/verify-payment",
        "/api/payment"
    ]
    
    all_pass = True
    for endpoint in removed_endpoints:
        try:
            response = requests.post(f"{BASE_URL}{endpoint}", json={}, timeout=5)
            print(f"\n{endpoint}: Status {response.status_code}")
            if response.status_code == 404:
                print(f"  ✅ Correctly returns 404 (endpoint removed)")
            else:
                print(f"  ⚠️  Returns {response.status_code} (expected 404)")
                all_pass = False
        except Exception as e:
            print(f"  ❌ Exception: {str(e)}")
            all_pass = False
    
    if all_pass:
        print("\n✅ PASS: All payment endpoints correctly removed")
    else:
        print("\n⚠️  WARNING: Some payment endpoints may still exist")
    
    return all_pass

def main():
    print("\n" + "="*60)
    print("BACKEND API TEST SUITE")
    print("Testing deployment-safe backend without Razorpay/email")
    print("="*60)
    
    results = []
    
    # Run all tests
    results.append(("Root Endpoint", test_root_endpoint()))
    results.append(("Status POST (no Mongo)", test_status_post_without_mongo()))
    results.append(("Status GET (no Mongo)", test_status_get_without_mongo()))
    results.append(("Removed Payment Endpoints", test_removed_payment_endpoints()))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Backend is deployment-safe.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
