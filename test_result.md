#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================
## user_problem_statement: Replace the post-payment PDF with the new Google Sheet product link, email that link after verified Razorpay payment, and add the support contact/footer message.
## backend:
##   - task: "Razorpay verification + Resend product delivery"
##     implemented: true
##     working: true
##     file: "backend/server.py"
##     stuck_count: 0
##     priority: "high"
##     needs_retesting: false
##     status_history:
##         -working: true
##         -agent: "main"
##         -comment: "Added non-blocking Resend delivery after verified Razorpay payment, using the new Google Sheet URL, registered customer email, support reply-to, and email_sent status."
##         -working: true
##         -agent: "testing"
##         -comment: "All 9 Resend integration tests passed. Backend starts cleanly with no tracebacks. GET /api/ returns 200. resend>=2.0.0 in requirements.txt and imported correctly. All environment variables configured (RESEND_API_KEY, SENDER_EMAIL, SUPPORT_EMAIL, PRODUCT_SHEET_URL). No secrets exposed in logs. /api/payments/verify response contract correct: returns product_url, email_sent, event_id, value, currency (NO download_url). Missing Mongo fails safely with 503. Email delivery is async/non-blocking and wrapped in try-except so email failure cannot affect payment status. Note: ledgerkitsupport@gmail.com configured as sender - Resend requires domain verification for custom senders, Gmail addresses may require additional setup."

## frontend:
##   - task: "Product link success screen and support footer"
##     implemented: true
##     working: NA
##     file: "frontend/src/components/landing/BuyModal.js"
##     stuck_count: 0
##     priority: "high"
##     needs_retesting: true
##     status_history:
##         -working: true
##         -agent: "main"
##         -comment: "Removed the PDF download, switched to the new editable Google Sheet URL, surfaced email delivery status, and added the support message/address to the footer."
##
## metadata:
##     created_by: "main_agent"
##     version: "1.0"
##     test_sequence: 8
##     run_ui: true
##
## test_plan:
##     current_focus:
##         - "Verify backend Resend configuration and non-blocking delivery after verified Razorpay payment"
##         - "Verify verified-payment response returns only the new Google Sheet product URL, not the PDF"
##         - "Verify support email/footer and single Google Sheet success link render correctly"
##     stuck_tasks: []
##     test_all: true
##     test_priority: "high_first"
##
## agent_communication:
##     -agent: "main"
##     -message: "Added Resend email delivery using the user-provided key, configured ledgerkitsupport@gmail.com as sender/reply-to, switched product delivery to the new Google Sheet URL, removed the PDF success link, and added support footer copy. Backend testing must run before frontend testing."
##     -agent: "testing"
##     -message: "Backend testing complete. All 7 Razorpay backend integration tests passed successfully. The backend is correctly configured with Razorpay Live credentials, all routes are /api-prefixed, email validation works (422 for invalid emails), and the system gracefully handles missing Mongo configuration (503 errors). No webhook endpoint exists as expected. No actual payments were made during testing. Environment blocker identified: MONGO_URL and DB_NAME are empty in preview environment, which prevents order creation but this is expected behavior. The backend implementation is safe and ready for production use once Mongo is configured."
##     -agent: "user"
##     -message: "User will verify Meta Pixel events in Meta Events Manager directly; frontend automation was not run by request."
##
##     -agent: "testing"
##     -message: "Frontend testing complete. All 8 Razorpay frontend integration tests passed successfully. The frontend correctly integrates with Razorpay checkout.js, all Buy CTAs work, modal displays correct pricing (₹290) and Razorpay branding, client-side email validation works, and error handling is correct. Razorpay script loads successfully with 60+ CDN requests detected. NO Profo references found anywhere in the rendered app or network requests. Success and error UI stages are properly implemented with conditional rendering. The only console error (503) is expected due to missing Mongo in preview environment. The Razorpay integration is production-ready and safe for live use once database is configured."
##     -agent: "testing"
##     -message: "Meta Pixel backend support testing complete. All 7 backend tests passed successfully. The /api/payments/verify endpoint correctly returns Meta Purchase event fields (event_id, value, currency) with stable formats. Backend has no Meta secrets (browser-only tracking, correct approach). All routes use /api prefix. Error handling is safe - returns 503 when database is not configured, preventing any payment from being marked as paid without proper verification. Preview environment limitation confirmed: MONGO_URL and DB_NAME are empty, cannot test live verified-payment fixture, but this is expected behavior. Backend code is production-ready for Meta Pixel support."
##     -agent: "testing"
##     -message: "Resend product delivery backend testing complete. All 9 tests passed successfully. Backend starts with no tracebacks after adding resend. GET /api/ returns 200. resend>=2.0.0 in requirements.txt and imported correctly. All environment variables configured without exposing secrets in logs. /api/payments/verify response contract verified: returns product_url, email_sent, event_id, value, currency (NO download_url). Missing Mongo fails safely with 503. Email delivery is async/non-blocking and wrapped in try-except - email failure cannot turn verified payment into failed payment. Important note: ledgerkitsupport@gmail.com is configured as sender/reply-to. Resend requires domain verification for custom senders - Gmail addresses may require additional setup or domain verification to work properly in production."
