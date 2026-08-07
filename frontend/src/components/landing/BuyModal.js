import { AnimatePresence, motion } from "framer-motion";
import { useBuy } from "@/hooks/useBuy";
import { X, ShieldCheck, ExternalLink } from "lucide-react";
import { PAYMENT_URL, PRICE } from "@/lib/landingData";

export default function BuyModal() {
  const { open, setOpen } = useBuy();

  const close = () => setOpen(false);

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
              <p className="font-display font-black text-3xl leading-tight tracking-tight">
                Business Toolkit
              </p>
              <div className="flex items-end gap-2 mt-2 mb-6">
                <span className="font-display font-black text-4xl">₹{PRICE}</span>
                <span className="font-mono text-xs text-[#595959] mb-1.5">one-time</span>
              </div>
              <p className="text-sm text-[#595959] leading-relaxed">
                Continue to the secure Profo checkout to complete your purchase and receive the toolkit with its included bonuses.
              </p>
              <a
                href={PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="buy-checkout-link"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#d4ff11] text-[#0f0f0f] border border-[#0f0f0f] py-3.5 font-mono text-sm uppercase tracking-[0.12em] font-semibold hover:bg-[#c2eb0f] transition-colors"
              >
                Continue to secure checkout <ExternalLink className="w-4 h-4" />
              </a>
              <p className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#595959]">
                <ShieldCheck className="w-3 h-3" /> Checkout hosted securely by Profo
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
