import { Reveal } from "./Reveal";
import { useBuy } from "@/hooks/useBuy";
import { motion } from "framer-motion";
import { PRICE } from "@/lib/landingData";
import { Check } from "lucide-react";

const includes = [
  "Income & expense tracker",
  "Auto profit & loss statement",
  "Monthly sales dashboard",
  "Quarterly & annual dashboards",
  "Tax summary calculator",
  "Ready-made graphs & charts",
  "Works in Excel & Google Sheets",
  "Fully editable · lifetime updates",
];

export default function Pricing() {
  const { setOpen } = useBuy();
  return (
    <section id="pricing" className="px-5 sm:px-8 py-20 sm:py-32" data-testid="pricing-section">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-white border border-[#0f0f0f] hard-shadow relative overflow-hidden">
          <div className="grid lg:grid-cols-12">
            {/* left copy */}
            <div className="lg:col-span-7 p-7 sm:p-14">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#0f0f0f] bg-[#d4ff11] px-2 py-1 border border-[#0f0f0f]">
                One plan · Everything included
              </span>
              <Reveal className="mt-6">
                <h2 className="font-display font-black text-4xl sm:text-6xl leading-[0.92] tracking-tighter text-[#0f0f0f]">
                  Your entire business finance system.
                  <span className="text-[#595959]"> One file.</span>
                </h2>
              </Reveal>
              <div className="mt-9 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {includes.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-[#0f0f0f]">
                    <span className="grid place-items-center w-5 h-5 bg-[#d4ff11] border border-[#0f0f0f] shrink-0">
                      <Check className="w-3 h-3 text-[#0f0f0f]" strokeWidth={3} />
                    </span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* right price - volt panel */}
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#0f0f0f] p-7 sm:p-14 flex flex-col justify-center bg-[#d4ff11]">
              <div className="font-mono text-sm uppercase tracking-[0.12em] text-[#0f0f0f]/70">
                <span className="line-through">₹999</span> Launch price
              </div>
              <div className="flex items-end gap-2 mt-2">
                <span className="font-display font-black text-7xl sm:text-8xl leading-none text-[#0f0f0f]">₹{PRICE}</span>
                <span className="font-mono text-sm text-[#0f0f0f]/70 mb-3">/ one-time</span>
              </div>
              <p className="text-[#0f0f0f]/80 mt-4 leading-relaxed">Pay once. Own it forever. No monthly fees, no logins, no lock-in.</p>
              <motion.button
                data-testid="pricing-cta-buy"
                onClick={() => setOpen(true)}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -2 }}
                className="mt-8 w-full bg-[#0f0f0f] text-[#f6f5f2] border border-[#0f0f0f] py-4 font-mono text-sm uppercase tracking-[0.12em] font-semibold hover:bg-[#161616] transition-colors duration-300"
              >
                Buy now · Instant access
              </motion.button>
              <p className="text-center font-mono text-[11px] uppercase tracking-[0.1em] text-[#0f0f0f]/60 mt-4">
                Instant access after payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
