import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBuy } from "@/hooks/useBuy";
import { X, Download, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { DOWNLOAD_FILE, PRICE } from "@/lib/landingData";

export default function BuyModal() {
  const { open, setOpen } = useBuy();
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState("form"); // form | processing | done

  const close = () => {
    setOpen(false);
    setTimeout(() => { setStage("form"); setEmail(""); }, 300);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setStage("processing");
    setTimeout(() => setStage("done"), 1600);
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
              <span className="font-mono text-xs uppercase tracking-[0.14em]">Checkout · Demo</span>
              <button onClick={close} data-testid="buy-modal-close" className="hover:rotate-90 transition-transform duration-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {stage === "form" && (
                <form onSubmit={submit} data-testid="buy-form">
                  <p className="font-display font-black text-3xl leading-tight tracking-tight">
                    Business Toolkit
                  </p>
                  <div className="flex items-end gap-2 mt-2 mb-6">
                    <span className="font-display font-black text-4xl">₹{PRICE}</span>
                    <span className="font-mono text-xs text-[#595959] mb-1.5">one-time</span>
                  </div>
                  <label className="font-mono text-xs uppercase tracking-[0.12em] text-[#595959]">Email for delivery</label>
                  <input
                    type="email"
                    data-testid="buy-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@business.com"
                    required
                    className="mt-2 w-full bg-white border border-[#0f0f0f] px-4 py-3 outline-none focus:hard-shadow-sm transition-shadow font-body"
                  />
                  <button
                    type="submit"
                    data-testid="buy-submit"
                    className="mt-5 w-full bg-[#d4ff11] text-[#0f0f0f] border border-[#0f0f0f] py-3.5 font-mono text-sm uppercase tracking-[0.12em] font-semibold hover:bg-[#c2eb0f] transition-colors"
                  >
                    Complete purchase
                  </button>
                  <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-[#595959]">
                    Demo checkout — no real payment taken
                  </p>
                </form>
              )}

              {stage === "processing" && (
                <div className="py-12 flex flex-col items-center text-center" data-testid="buy-processing">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <p className="mt-5 font-mono text-sm uppercase tracking-[0.12em]">Processing payment…</p>
                </div>
              )}

              {stage === "done" && (
                <div className="text-center" data-testid="buy-success">
                  <CheckCircle2 className="w-14 h-14 mx-auto text-[#0f0f0f]" strokeWidth={1.5} />
                  <p className="font-display font-black text-3xl mt-4 tracking-tight">You're in!</p>
                  <div className="flex items-center justify-center gap-2 mt-3 text-[#595959]">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Link sent to <b className="text-[#0f0f0f]">{email}</b></span>
                  </div>
                  <a
                    href={DOWNLOAD_FILE}
                    download
                    data-testid="buy-download-button"
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#0f0f0f] text-[#f6f5f2] py-3.5 font-mono text-sm uppercase tracking-[0.12em] font-medium hover:bg-[#d4ff11] hover:text-[#0f0f0f] border border-[#0f0f0f] transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download the toolkit
                  </a>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#595959]">
                    (Demo file — email delivery is simulated)
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
