# PRD — Business Management Excel Toolkit Landing Page ("LedgerKit")

## Original Problem Statement
Sell a business management Excel template toolkit (income & expenses, profit & loss, monthly/quarterly/annual dashboards, taxes) in a single, fully-editable Excel/Google Sheets file with automatic calculations and graphs. One-time price ₹290; buyer gets it on email + on-screen download. Build a landing page with strong problem/benefit/hook copy, product images, and 2-3 CTAs. Generate a landing page design.

## User Choices
- Buy button: DESIGN MOCKUP only (no real payment)
- Delivery: both email + on-screen download (email is SIMULATED)
- Visuals: AI-generated Excel dashboard mockups
- Design: expert-chosen fresh modern look
- File: placeholder download for now

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + lenis (smooth scroll) + react-fast-marquee. No backend logic needed (static landing).
- Design: High-Contrast Swiss Editorial — Bone White #F6F5F2, Ink #0F0F0F, Electric Volt #D4FF11; fonts Cabinet Grotesk / IBM Plex Mono / General Sans; hard shadows, 1px black borders, grain overlay.
- Placeholder deliverable: `/app/frontend/public/business-management-toolkit.xlsx` (real xlsx with sample dashboard + chart).

## Implemented (2026-06)
- Kinetic hero: masked line-by-line reveal + mouse-driven 3D tilt on product mockup, price hook ₹290.
- Editorial marquee ribbon of features.
- Manifesto chapters: 01 Problem, 02 Bento dashboard showcase (AI mockups), 03 How it works (3 steps), 04 FAQ.
- Dark full-width pricing card (single ₹290 plan, feature checklist).
- Demo Buy modal: email capture → simulated processing → success with real .xlsx download + simulated email note.
- 5 CTAs (nav, hero, how-it-works, pricing, footer) all open the demo checkout.

## Mock / Not Real
- Excel file is a PLACEHOLDER sample, not the final product.

## Email Delivery (Resend, Emergent-managed) — added 2026-06
- On successful Razorpay verify, buyer is emailed their access file via Emergent Resend (from_name="Crevvo", reply-to support@crevvo.com).
- Product delivered as the uploaded PDF (`/business-bookkeeping-system.pdf`, hosted on our domain) which contains the Google Sheets + Excel links and the video tutorial. Email links to the PDF (proxy has no attachment support); the PDF also opens on-screen after payment.
- Email failure never blocks payment confirmation; verify returns an email_sent flag.
- NOTE: `PRODUCT_PDF_URL` in backend/.env is the preview host — update it to the production domain after deploying so emailed links point to prod.
- Tested: iteration_7.json (backend 100%, email_sent:true to delivered@resend.dev, invalid signature sends nothing).

## Payments — Razorpay (LIVE) — added 2026-06
- Real ₹290 one-time checkout via Razorpay. LIVE keys in backend/.env (RAZORPAY_KEY_ID/SECRET) — real money.
- Backend: POST /api/payments/create-order (amount 29000 paise, stores order in Mongo db.orders), POST /api/payments/verify (HMAC-SHA256 signature check, idempotent, marks order 'paid'/'signature_failed').
- Frontend: BuyModal loads Razorpay checkout.js, opens Checkout, verifies signature, then reveals the download.
- Tested: iteration_6.json (backend 100%, signature valid/invalid, checkout iframe opens). Real UI payment not auto-tested (LIVE keys need OTP/real card).

## Backlog
- P1: Real payment (Razorpay ₹290) + real email delivery (Resend).
- P1: Upload the actual final Excel template.
- P2: Testimonials/social proof, refund policy, animated dashboard preview.
