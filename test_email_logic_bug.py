#!/usr/bin/env python3
"""Detailed test to verify email template bump logic bug"""

import sys
sys.path.insert(0, '/app/backend')

from server import delivery_email_html, BUMP_PRODUCT_URL, PRODUCT_SHEET_URL

print('=' * 80)
print('CRITICAL EMAIL TEMPLATE LOGIC TEST')
print('=' * 80)
print(f'BUMP_PRODUCT_URL configured: {BUMP_PRODUCT_URL}')
print(f'PRODUCT_SHEET_URL configured: {PRODUCT_SHEET_URL}')
print('=' * 80)

# Test 1: Customer who did NOT purchase bump (include_bump=False)
print('\n🧪 TEST 1: Customer who paid ₹290 WITHOUT bump (include_bump=False)')
print('-' * 80)
email_no_bump = delivery_email_html(include_bump=False)

has_bump_button = 'Open your Productivity & Execution Bundle' in email_no_bump
has_bump_link = BUMP_PRODUCT_URL in email_no_bump

print(f'Email contains bump button: {has_bump_button}')
print(f'Email contains bump link: {has_bump_link}')

if has_bump_button or has_bump_link:
    print('❌ CRITICAL BUG: Customer who did NOT purchase bump will receive bump product!')
    print('   This means customers who paid ₹290 get the ₹199 bump for FREE.')
    print('   Expected: No bump section in email when include_bump=False')
    test1_passed = False
else:
    print('✅ PASS: Bump section correctly excluded for non-bump customers')
    test1_passed = True

# Test 2: Customer who DID purchase bump (include_bump=True)
print('\n🧪 TEST 2: Customer who paid ₹489 WITH bump (include_bump=True)')
print('-' * 80)
email_with_bump = delivery_email_html(include_bump=True)

has_bump_button = 'Open your Productivity & Execution Bundle' in email_with_bump
has_bump_link = BUMP_PRODUCT_URL in email_with_bump

print(f'Email contains bump button: {has_bump_button}')
print(f'Email contains bump link: {has_bump_link}')

if not has_bump_button or not has_bump_link:
    print('❌ FAIL: Customer who purchased bump should receive bump product link')
    test2_passed = False
else:
    print('✅ PASS: Bump section correctly included for bump customers')
    test2_passed = True

# Summary
print('\n' + '=' * 80)
print('TEST SUMMARY')
print('=' * 80)
print(f'Test 1 (No bump customer): {"✅ PASS" if test1_passed else "❌ FAIL"}')
print(f'Test 2 (With bump customer): {"✅ PASS" if test2_passed else "❌ FAIL"}')
print('=' * 80)

if not test1_passed:
    print('\n🚨 CRITICAL BUG DETECTED:')
    print('   The email template logic is incorrect. It checks BUMP_PRODUCT_URL first,')
    print('   which means ALL customers will receive the bump product link, regardless')
    print('   of whether they purchased the bump offer or not.')
    print()
    print('   Current logic: if BUMP_PRODUCT_URL else if include_bump else ""')
    print('   Correct logic: if include_bump and BUMP_PRODUCT_URL else if include_bump else ""')
    print()
    print('   This needs to be fixed immediately before going to production!')
    sys.exit(1)
else:
    print('\n✅ All email template logic tests passed')
    sys.exit(0)
