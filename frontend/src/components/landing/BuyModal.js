import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBuy } from "@/hooks/useBuy";
import { X, Download, ShieldCheck, CheckCircle2, Loader2, AlertTriangle, FileSpreadsheet } from "lucide-react";
import { DOWNLOAD_FILE, SHEET_URL, PRICE } from "@/lib/landingData";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

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

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setStage("form");
      setEmail("");
      setError("");
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
        body: JSON.stringify({ email }),
      });
      if (!response.ok) return fail("Could not start the payment. Please try again.");
      const order = await response.json();

      const checkout = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "LedgerKit",
        description: "Business Management Toolkit — lifetime access",
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
            className="relative w-full max-w-md bg-[#f6f5f2] border border-[#0f0f0f] hard-shadow"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#0f0f0f]">
              <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em]">
                <ShieldCheck className="w-4 h-4" /> Secure checkout
              </span>
              <button onClick={close} data-testid="buy-modal-close" className="hover:rotate-90 transition-transform duration-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {stage === "form" && (
                <form onSubmit={submit} data-testid="buy-form">
                  <p className="font-display font-black text-3xl leading-tight tracking-tight">Business Toolkit</p>
                  <div className="flex items-end gap-2 mt-2 mb-6">
                    <span className="font-display font-black text-4xl">₹{PRICE}</span>
                    <span className="font-mono text-xs text-[#595959] mb-1.5">one-time</span>
                  </div>
                  <label className="font-mono text-xs uppercase tracking-[0.12em] text-[#595959]">Email for your receipt & file</label>
                  <input
                    type="email"
                    data-testid="buy-email-input"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@business.com"
                    required
                    className="mt-2 w-full bg-white border border-[#0f0f0f] px-4 py-3 outline-none focus:hard-shadow-sm transition-shadow font-body"
                  />
                  <button
                    type="submit"
                    data-testid="buy-submit"
                    className="mt-5 w-full bg-[#d4ff11] text-[#0f0f0f] border border-[#0f0f0f] py-3.5 font-mono text-sm uppercase tracking-[0.12em] font-semibold hover:bg-[#c2eb0f] transition-colors"
                  >
                    Pay ₹{PRICE} securely
                  </button>
                  <p className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#595959]">
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
                  <p className="text-sm text-[#595959] mt-3">Your access is ready below.</p>
                  <a
                    href={SHEET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="buy-sheet-button"
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#d4ff11] text-[#0f0f0f] py-3.5 font-mono text-sm uppercase tracking-[0.12em] font-semibold border border-[#0f0f0f] hover:bg-[#c2eb0f] transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Get your Google Sheet
                  </a>
                  <a
                    href={DOWNLOAD_FILE}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="buy-download-button"
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-[#0f0f0f] text-[#f6f5f2] py-3 font-mono text-xs uppercase tracking-[0.12em] font-medium hover:bg-[#161616] border border-[#0f0f0f] transition-colors"
                  >
                    <Download className="w-4 h-4" /> Video tutorial + Excel (PDF)
                  </a>
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
