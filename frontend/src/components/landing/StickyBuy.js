import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBuy } from "@/hooks/useBuy";
import { PRICE } from "@/lib/landingData";
import { FileSpreadsheet, Clock } from "lucide-react";

const WINDOW_MS = 15 * 60 * 1000;

function useCountdown() {
  const [left, setLeft] = useState(WINDOW_MS);
  useEffect(() => {
    let dl = Number(localStorage.getItem("lk_deadline"));
    if (!dl || dl < Date.now()) {
      dl = Date.now() + WINDOW_MS;
      localStorage.setItem("lk_deadline", String(dl));
    }
    const tick = () => {
      let rem = dl - Date.now();
      if (rem <= 0) {
        dl = Date.now() + WINDOW_MS;
        localStorage.setItem("lk_deadline", String(dl));
        rem = WINDOW_MS;
      }
      setLeft(rem);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(left / 60000)).padStart(2, "0");
  const s = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
  return { m, s };
}

export default function StickyBuy() {
  const { setOpen, open } = useBuy();
  const [show, setShow] = useState(false);
  const { m, s } = useCountdown();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom = y + window.innerHeight > document.body.scrollHeight - 240;
      setShow(y > 760 && !nearBottom);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && !open && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#0f0f0f] bg-[#f6f5f2]/92 backdrop-blur-md"
          data-testid="sticky-buy-bar"
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="hidden xs:grid sm:grid place-items-center w-10 h-10 bg-[#0f0f0f] text-[#d4ff11] border border-[#0f0f0f] shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display font-extrabold text-sm sm:text-base leading-none truncate">
                  Business Toolkit
                </p>
                <p className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0f0f0f] mt-1">
                  <Clock className="w-3 h-3 text-[#0f0f0f]" />
                  Price rises to ₹999 in
                  <span className="bg-[#0f0f0f] text-[#d4ff11] px-1.5 py-0.5 tabular-nums" data-testid="countdown">
                    {m}:{s}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <span className="hidden sm:block font-display font-black text-2xl">₹{PRICE}</span>
              <motion.button
                data-testid="sticky-buy-button"
                onClick={() => setOpen(true)}
                whileTap={{ scale: 0.95 }}
                whileHover={{ y: -2 }}
                className="bg-[#d4ff11] text-[#0f0f0f] border border-[#0f0f0f] px-5 sm:px-7 py-2.5 sm:py-3 font-mono text-xs uppercase tracking-[0.12em] font-semibold hover:bg-[#c2eb0f] transition-colors hard-shadow-sm"
              >
                Buy now
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
