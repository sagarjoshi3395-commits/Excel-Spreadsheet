import { Link } from "react-router-dom";
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
              Keep Your Business Records Organized in One Editable File.
              <span className="text-[#f6f5f2]/60 block text-base sm:text-lg font-body font-normal mt-4">Get the LedgerKit Business Record Template for ₹290.</span>
            </h2>
          </div>
          <VoltButton testid="footer-cta-buy" onClick={() => setOpen(true)} dark>
            Get the Editable Template
          </VoltButton>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pt-8">
          <div className="font-display font-extrabold text-3xl tracking-tight">
            LEDGER<span className="text-[#f6f5f2]/40">/</span>KIT
            <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#f6f5f2]/50 mt-1">Business Toolkit · Digital Templates</span>
          </div>
          <div className="max-w-sm font-mono text-xs leading-relaxed text-[#f6f5f2]/60">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#d4ff11] mb-1">LedgerKit support</p>
            <p>
              Business Toolkit is a digital Excel/Google Sheets template. Need delivery help or have a query? Email{" "}
              <a href="mailto:ledgerkitsupport@gmail.com" className="text-[#f6f5f2] underline underline-offset-2 hover:text-[#d4ff11] transition-colors">
                ledgerkitsupport@gmail.com
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-[0.12em] text-[#f6f5f2]/50">
            <a href="#showcase" className="hover:text-[#d4ff11] transition-colors">Features</a>
            <a href="#faq" className="hover:text-[#d4ff11] transition-colors">FAQ</a>
            <a href="#pricing" className="hover:text-[#d4ff11] transition-colors">Pricing</a>
            <Link to="/terms" className="hover:text-[#d4ff11] transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-[#d4ff11] transition-colors">Privacy</Link>
            <Link to="/refunds" className="hover:text-[#d4ff11] transition-colors">Refunds</Link>
            <Link to="/support" className="hover:text-[#d4ff11] transition-colors">Support</Link>
          </div>
          <p className="font-mono text-xs text-[#f6f5f2]/40">© 2026 LedgerKit · Made for small businesses</p>
        </div>
      </div>
    </footer>
  );
}
