import { useBuy } from "@/hooks/useBuy";
import { VoltButton } from "./VoltButton";
import { PRICE } from "@/lib/landingData";

export default function Footer() {
  const { setOpen } = useBuy();
  return (
    <footer className="px-5 sm:px-8 pt-20 pb-10 bg-[#0f0f0f] text-[#f6f5f2]" data-testid="footer">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 pb-16 border-b border-[#f6f5f2]/15">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#d4ff11] mb-4">Ready when you are</p>
            <h2 className="font-display font-black text-4xl sm:text-6xl leading-[0.92] tracking-tighter max-w-2xl">
              Stop guessing. Start seeing your numbers clearly.
            </h2>
          </div>
          <VoltButton testid="footer-cta-buy" onClick={() => setOpen(true)} dark>
            Get it for ₹{PRICE}
          </VoltButton>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-8">
          <div className="font-display font-extrabold text-3xl tracking-tight">
            LEDGER<span className="text-[#f6f5f2]/40">/</span>KIT
          </div>
          <div className="flex gap-6 font-mono text-xs uppercase tracking-[0.12em] text-[#f6f5f2]/50">
            <a href="#showcase" className="hover:text-[#d4ff11] transition-colors">Features</a>
            <a href="#faq" className="hover:text-[#d4ff11] transition-colors">FAQ</a>
            <a href="#pricing" className="hover:text-[#d4ff11] transition-colors">Pricing</a>
          </div>
          <p className="font-mono text-xs text-[#f6f5f2]/40">© 2026 LedgerKit · Made for small businesses</p>
        </div>
      </div>
    </footer>
  );
}
