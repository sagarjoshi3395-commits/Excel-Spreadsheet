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
- Payment is MOCKED (no gateway).
- Email delivery is SIMULATED (no email actually sent).
- Excel file is a PLACEHOLDER sample, not the final product.

## Backlog
- P1: Real payment (Razorpay ₹290) + real email delivery (Resend).
- P1: Upload the actual final Excel template.
- P2: Testimonials/social proof, refund policy, animated dashboard preview.
