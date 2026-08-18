import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBuy } from "@/hooks/useBuy";
import { X, ShieldCheck, CheckCircle2, Loader2, AlertTriangle, FileSpreadsheet } from "lucide-react";
import { SHEET_URL, BUMP_PRODUCT_IMAGE, BUMP_PRICE, PRICE } from "@/lib/landingData";
import { trackMetaEvent } from "@/lib/metaPixel";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const ENABLE_BUMP_OFFER = false;

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BuyModal() {
  const { open, setOpen } = useBuy();
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState("form");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [includeBump, setIncludeBump] = useState(false);
  const [bumpProductUrl, setBumpProductUrl] = useState("");

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setStage("form");
      setEmail("");
      setError("");
      setEmailSent(false);
      setIncludeBump(false);
      setBumpProductUrl("");
    }, 300);
  };

  const fail = (message) => {
    setError(message);
    setStage("error");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setStage("processing");

    try {
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) return fail("Could not load the payment window. Check your connection and try again.");

      const response = await fetch(`${API}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, include_bump: includeBump }),
      });
      if (!response.ok) return fail("Could not start the payment. Please try again.");
      const order = await response.json();
      trackMetaEvent(
        "InitiateCheckout",
        {
          value: order.amount / 100,
          currency: order.currency,
          num_items: includeBump ? 2 : 1,
          content_ids: includeBump ? ["business-management-toolkit", "productivity-execution-bundle"] : ["business-management-toolkit"],
          content_type: "product",
        },
        `checkout_${order.order_id}`,
      );

      const checkout = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "LedgerKit",
        description: includeBump
          ? "Business Management Toolkit + Productivity & Execution Bundle"
          : "Business Management Toolkit — lifetime access",
        prefill: { email },
        theme: { color: "#0f0f0f" },
        modal: { ondismiss: () => setStage("form") },
        handler: async (payment) => {
          try {
            const verification = await fetch(`${API}/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: payment.razorpay_order_id,
                razorpay_payment_id: payment.razorpay_payment_id,
                razorpay_signature: payment.razorpay_signature,
              }),
            });
            if (!verification.ok) return fail("We couldn't verify your payment. If money was deducted, contact support with your payment ID.");
            const verified = await verification.json();
            setEmailSent(Boolean(verified.email_sent));
            setBumpProductUrl(verified.bump_product_url || "");
            const purchaseEventId = verified.event_id || `purchase_${payment.razorpay_order_id}`;
            const purchaseStorageKey = `meta-purchase-${purchaseEventId}`;
            if (!sessionStorage.getItem(purchaseStorageKey)) {
              trackMetaEvent(
                "Purchase",
                {
                  value: verified.value ?? order.amount / 100,
                  currency: verified.currency ?? order.currency,
                  content_ids: ["business-management-toolkit"],
                  content_type: "product",
                },
                purchaseEventId,
              );
              sessionStorage.setItem(purchaseStorageKey, "1");
            }
            setStage("done");
          } catch {
            fail("Verification error. If money was deducted, please contact support.");
          }
        },
      });

      checkout.on("payment.failed", () => fail("Payment failed or was cancelled. You have not been charged."));
      checkout.open();
    } catch {
      fail("Something went wrong starting the payment. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          data-testid="buy-modal"
        >
          <div className="absolute inset-0 bg-[#0f0f0f]/60 backdrop-blur-sm" onClick={close} />
          <motion.div
            initial={{ scale: 0.92, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative w-full max-w-md max-h-[calc(100dvh-1rem)] overflow-hidden bg-[#f6f5f2] border border-[#0f0f0f] hard-shadow"
          >
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-[#0f0f0f]">
              <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em]">
                <ShieldCheck className="w-4 h-4" /> Secure checkout
              </span>
              <button onClick={close} data-testid="buy-modal-close" className="hover:rotate-90 transition-transform duration-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 sm:p-6">
              {stage === "form" && (
                <form onSubmit={submit} data-testid="buy-form">
                  <p className="font-display font-black text-2xl sm:text-3xl leading-tight tracking-tight">Business Toolkit</p>
                  <div className="flex items-end gap-2 mt-1 mb-3">
                    <span className="font-display font-black text-3xl sm:text-4xl">₹{includeBump ? "439" : PRICE}</span>
                    <span className="font-mono text-[10px] text-[#595959] mb-1.5">one-time total</span>
                  </div>
                  {ENABLE_BUMP_OFFER && (
                    <>
                      <div className="mb-3 flex items-center justify-between gap-2 border border-[#0f0f0f] bg-[#d4ff11] px-2.5 py-1.5">
                        <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.08em] font-semibold">Limited-time bundle deal</span>
                        <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.04em]">Save ₹1,848</span>
                      </div>
                      <div className="border border-[#0f0f0f] bg-white p-2.5 sm:p-3 mb-3" data-testid="bump-offer">
                        <div className="flex items-center gap-2.5">
                          <img src={BUMP_PRODUCT_IMAGE} alt="Productivity and Execution Bundle" className="w-14 h-16 sm:w-16 sm:h-20 object-cover border border-[#0f0f0f] shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-display font-black text-base sm:text-lg leading-tight">Productivity & Execution Bundle</p>
                                <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.06em] text-[#595959] mt-0.5">200+ premium Excel templates included</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-display font-black text-base sm:text-lg">₹{BUMP_PRICE}</p>
                                <p className="font-mono text-[8px] text-[#595959] line-through">₹1,997</p>
                              </div>
                            </div>
                            <p className="mt-1 text-[10px] sm:text-[11px] text-[#595959] leading-snug">Habit & Goal Tracker · 3,200+ AI prompts · Landing Page + Ebook Bundle · 1,000+ Emails · 1,000+ Reel Ideas</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 border-t border-[#0f0f0f]/15 pt-2">
                          <input
                            type="checkbox"
                            checked={includeBump}
                            onChange={(event) => setIncludeBump(event.target.checked)}
                            data-testid="bump-checkbox"
                            className="h-4 w-4 accent-[#0f0f0f] shrink-0"
                          />
                          <button
                            type="button"
                            onClick={() => setIncludeBump((selected) => !selected)}
                            data-testid="bump-add-to-cart"
                            className={`flex-1 border border-[#0f0f0f] py-2 font-mono text-[10px] uppercase tracking-[0.08em] font-semibold transition-colors ${includeBump ? "bg-[#0f0f0f] text-[#f6f5f2]" : "bg-[#d4ff11] text-[#0f0f0f] hover:bg-[#c2eb0f]"}`}
                          >
                            {includeBump ? "Added · ₹" : "Add to cart · ₹"}{BUMP_PRICE}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-[#595959]">Email for receipt & delivery</label>
                  <input
                    type="email"
                    data-testid="buy-email-input"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@business.com"
                    required
                    className="mt-1.5 w-full bg-white border border-[#0f0f0f] px-3 py-2.5 outline-none focus:hard-shadow-sm transition-shadow font-body text-sm"
                  />
                  <button
                    type="submit"
                    data-testid="buy-submit"
                    className="mt-3 w-full bg-[#d4ff11] text-[#0f0f0f] border border-[#0f0f0f] py-3 font-mono text-xs sm:text-sm uppercase tracking-[0.08em] font-semibold hover:bg-[#c2eb0f] transition-colors"
                  >
                    Pay ₹{includeBump ? "439" : PRICE} securely
                  </button>
                  <p className="mt-1.5 flex items-center justify-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-[#595959]">
                    <ShieldCheck className="w-3 h-3" /> Payments secured by Razorpay
                  </p>
                </form>
              )}

              {stage === "processing" && (
                <div className="py-12 flex flex-col items-center text-center" data-testid="buy-processing">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <p className="mt-5 font-mono text-sm uppercase tracking-[0.12em]">Opening secure payment…</p>
                </div>
              )}

              {stage === "done" && (
                <div className="text-center" data-testid="buy-success">
                  <CheckCircle2 className="w-14 h-14 mx-auto text-[#0f0f0f]" strokeWidth={1.5} />
                  <p className="font-display font-black text-3xl mt-4 tracking-tight">Payment successful!</p>
                  <p className="text-sm text-[#595959] mt-3">
                    {emailSent
                      ? <>The product link was sent to <b className="text-[#0f0f0f]">{email}</b>.</>
                      : <>Payment is confirmed, but the email could not be sent. Please contact <b className="text-[#0f0f0f]">ledgerkitsupport@gmail.com</b>.</>}
                  </p>
                  <a
                    href={SHEET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="buy-sheet-button"
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#d4ff11] text-[#0f0f0f] py-3.5 font-mono text-sm uppercase tracking-[0.12em] font-semibold border border-[#0f0f0f] hover:bg-[#c2eb0f] transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Get your Google Sheet
                  </a>
                  {includeBump && bumpProductUrl && (
                    <a
                      href={bumpProductUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="buy-bump-button"
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-white text-[#0f0f0f] py-3 font-mono text-xs uppercase tracking-[0.12em] font-medium hover:bg-[#ebeae6] border border-[#0f0f0f] transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4" /> Open Productivity Bundle
                    </a>
                  )}
                  {includeBump && !bumpProductUrl && (
                    <p className="mt-3 text-xs text-[#595959]">Your bundle is included. Its access link will be added once the bundle link is configured.</p>
                  )}
                </div>
              )}

              {stage === "error" && (
                <div className="text-center" data-testid="buy-error">
                  <AlertTriangle className="w-14 h-14 mx-auto text-[#0f0f0f]" strokeWidth={1.5} />
                  <p className="font-display font-black text-2xl mt-4 tracking-tight">Payment not completed</p>
                  <p className="text-sm text-[#595959] mt-3">{error}</p>
                  <button
                    onClick={() => { setError(""); setStage("form"); }}
                    data-testid="buy-retry"
                    className="mt-6 w-full bg-[#d4ff11] text-[#0f0f0f] border border-[#0f0f0f] py-3.5 font-mono text-sm uppercase tracking-[0.12em] font-semibold hover:bg-[#c2eb0f] transition-colors"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
