# LedgerKit — Static HTML/CSS/JS Landing Page

A dependency-free version of your landing page. Just three files + an assets folder.
Works on any static host: Netlify, Vercel, GitHub Pages, Hostinger, GoDaddy, Cloudflare Pages, S3, etc.

## Files
- `index.html` — all the markup
- `styles.css` — all the styling + animations
- `script.js` — interactions (gallery auto-play, countdown, modal, Razorpay)
- `assets/shots/*.webp` — the 10 dashboard screenshots
- `assets/business-bookkeeping-system.pdf` — the product PDF (video tutorial + Excel)

## How to host
Upload the ENTIRE folder (keep the structure) to your host's public/root directory.
Open `index.html` — that's your live page. No build step, no Node, nothing to install.

## IMPORTANT — after you deploy your backend
Payments + email are handled by your FastAPI backend. Open `script.js` and edit the top config:

```js
const BACKEND_URL = "https://YOUR-BACKEND-DOMAIN";  // <-- change to your deployed backend origin
const SHEET_URL   = "https://docs.google.com/.../copy"; // your Google Sheet copy link
```

- `BACKEND_URL` currently points to the Emergent preview backend. Change it to wherever your
  backend is deployed. The backend must allow CORS from your site's domain (it currently allows all).
- Your Razorpay keys and the email key stay ONLY on the backend — never in these files. Good.

## Notes
- These are LIVE Razorpay keys on the backend → real ₹290 charges.
- The PDF ships inside `assets/` so the on-screen download works even without the backend.
- The countdown is a marketing timer stored in the visitor's browser (localStorage).
