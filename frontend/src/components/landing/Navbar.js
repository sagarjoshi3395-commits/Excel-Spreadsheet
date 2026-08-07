import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useBuy } from "@/hooks/useBuy";
import { PRICE } from "@/lib/landingData";

export default function Navbar() {
  const { setOpen } = useBuy();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "bg-[#f6f5f2]/85 backdrop-blur-md border-[#0f0f0f]/15"
          : "bg-transparent border-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="font-display font-extrabold text-lg tracking-tight" data-testid="nav-logo">
          LEDGER<span className="text-[#0f0f0f]/40">/</span>KIT
          <span className="inline-block w-2 h-2 bg-[#d4ff11] ml-1 border border-[#0f0f0f]" />
        </a>
        <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-[0.14em]">
          <a href="#showcase" className="hover:text-[#0f0f0f]/50 transition-colors" data-testid="nav-features">Features</a>
          <a href="#how" className="hover:text-[#0f0f0f]/50 transition-colors" data-testid="nav-how">How it works</a>
          <a href="#faq" className="hover:text-[#0f0f0f]/50 transition-colors" data-testid="nav-faq">FAQ</a>
        </div>
        <button
          data-testid="nav-buy-button"
          onClick={() => setOpen(true)}
          className="font-mono text-xs uppercase tracking-[0.12em] font-medium bg-[#0f0f0f] text-[#f6f5f2] px-5 py-2.5 border border-[#0f0f0f] hover:bg-[#d4ff11] hover:text-[#0f0f0f] transition-colors duration-300"
        >
          Buy · ₹{PRICE}
        </button>
      </div>
    </motion.nav>
  );
}
