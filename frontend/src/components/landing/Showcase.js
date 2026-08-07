import { Reveal, Chapter } from "./Reveal";
import { IMAGES } from "@/lib/landingData";
import { TrendingUp, PieChart, Receipt, Settings2 } from "lucide-react";

function Card({ children, className = "", testid }) {
  return (
    <div
      data-testid={testid}
      className={`group relative bg-white border border-[#0f0f0f] overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}

export default function Showcase() {
  return (
    <section id="showcase" className="px-5 sm:px-8 py-24 sm:py-32 bg-[#ebeae6] border-y border-[#0f0f0f]" data-testid="showcase-section">
      <div className="max-w-[1400px] mx-auto">
        <Chapter number="02" label="What's Inside" />
        <Reveal className="mb-14 max-w-2xl">
          <h2 className="font-display font-black text-4xl sm:text-6xl leading-[0.95] tracking-tighter">
            Everything updates itself. You just watch the graphs.
          </h2>
        </Reveal>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[minmax(0,1fr)]">
          {/* Big monthly dashboard */}
          <Reveal className="md:col-span-8" delay={0.05}>
            <Card testid="feature-monthly" className="h-full">
              <div className="p-6 flex items-center gap-3 border-b border-[#0f0f0f]">
                <TrendingUp className="w-5 h-5" />
                <div>
                  <p className="font-display font-extrabold text-xl leading-none">Monthly Sales Dashboard</p>
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#595959] mt-1.5">Revenue · Profit · Growth</p>
                </div>
              </div>
              <img src={IMAGES.monthly} alt="Monthly sales dashboard" className="w-full h-64 sm:h-80 object-cover object-top bg-white" />
            </Card>
          </Reveal>

          {/* Taxes */}
          <Reveal className="md:col-span-4" delay={0.1}>
            <Card testid="feature-taxes" className="h-full bg-[#0f0f0f] text-[#f6f5f2]">
              <div className="p-6 h-full flex flex-col">
                <Receipt className="w-6 h-6 text-[#d4ff11]" />
                <p className="font-display font-extrabold text-2xl mt-auto leading-tight">Tax summary, calculated for you</p>
                <p className="text-[#f6f5f2]/60 mt-3 leading-relaxed">Know exactly what you owe. No formulas to write, no guesswork.</p>
              </div>
            </Card>
          </Reveal>

          {/* Profit & loss */}
          <Reveal className="md:col-span-4" delay={0.05}>
            <Card testid="feature-pnl" className="h-full">
              <div className="p-6 flex items-center gap-3 border-b border-[#0f0f0f]">
                <PieChart className="w-5 h-5" />
                <p className="font-display font-extrabold text-lg">Income Tracker</p>
              </div>
              <img src={IMAGES.income} alt="Income tracker sheet" className="w-full h-52 object-cover object-top bg-white" />
            </Card>
          </Reveal>

          {/* Expenses */}
          <Reveal className="md:col-span-4" delay={0.1}>
            <Card testid="feature-expenses" className="h-full">
              <div className="p-6 flex items-center gap-3 border-b border-[#0f0f0f]">
                <TrendingUp className="w-5 h-5" />
                <p className="font-display font-extrabold text-lg">Expense Tracker</p>
              </div>
              <img src={IMAGES.expenses} alt="Expense tracker sheet" className="w-full h-52 object-cover object-top bg-white" />
            </Card>
          </Reveal>

          {/* Quarterly / annual */}
          <Reveal className="md:col-span-4" delay={0.15}>
            <Card testid="feature-annual" className="h-full">
              <div className="p-6 flex items-center gap-3 border-b border-[#0f0f0f]">
                <Settings2 className="w-5 h-5" />
                <p className="font-display font-extrabold text-lg">One-Click Setup</p>
              </div>
              <img src={IMAGES.setup} alt="Setup and customization sheet" className="w-full h-52 object-cover object-top bg-white" />
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
