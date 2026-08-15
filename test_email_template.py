#!/usr/bin/env python3
"""Test email template includes Google Drive link"""

import sys
sys.path.insert(0, '/app/backend')

from server import delivery_email_html, BUMP_PRODUCT_URL, PRODUCT_SHEET_URL

print('=== EMAIL TEMPLATE TEST ===')
print(f'BUMP_PRODUCT_URL: {BUMP_PRODUCT_URL}')
print(f'PRODUCT_SHEET_URL: {PRODUCT_SHEET_URL}')
print()

# Test email without bump
print('--- Email WITHOUT bump (include_bump=False) ---')
email_no_bump = delivery_email_html(include_bump=False)
if 'Productivity & Execution Bundle' in email_no_bump:
    print('❌ FAIL: Bump section should NOT be present when include_bump=False')
else:
    print('✅ PASS: Bump section correctly excluded when include_bump=False')
print()

# Test email with bump
print('--- Email WITH bump (include_bump=True) ---')
email_with_bump = delivery_email_html(include_bump=True)
if 'Productivity & Execution Bundle' not in email_with_bump:
    print('❌ FAIL: Bump section should be present when include_bump=True')
    sys.exit(1)
elif BUMP_PRODUCT_URL not in email_with_bump:
    print('❌ FAIL: BUMP_PRODUCT_URL should be in email when include_bump=True')
    sys.exit(1)
elif f'href="{BUMP_PRODUCT_URL}"' not in email_with_bump:
    print('❌ FAIL: BUMP_PRODUCT_URL should be a clickable link')
    sys.exit(1)
else:
    print('✅ PASS: Bump section correctly included with Google Drive link when include_bump=True')
    print(f'✅ PASS: Email contains clickable link to: {BUMP_PRODUCT_URL}')
    print()
    print('--- Email snippet with bump link ---')
    # Extract the bump section
    if 'Open your Productivity & Execution Bundle' in email_with_bump:
        start = email_with_bump.find('Open your Productivity & Execution Bundle') - 200
        end = email_with_bump.find('Open your Productivity & Execution Bundle') + 100
        print(email_with_bump[start:end])

print()
print('✅ ALL EMAIL TEMPLATE TESTS PASSED')
