import Marquee from "react-fast-marquee";

const items = [
  "PROFIT & LOSS",
  "MONTHLY DASHBOARDS",
  "AUTO-CALCULATIONS",
  "TAX SUMMARY",
  "INCOME & EXPENSES",
  "QUARTERLY REPORTS",
  "NO SUBSCRIPTIONS",
  "ANNUAL OVERVIEW",
];

export default function Ribbon() {
  return (
    <section className="border-y border-[#0f0f0f] bg-[#0f0f0f] py-5 overflow-hidden" data-testid="marquee">
      <Marquee speed={40} gradient={false} autoFill>
        {items.map((t, i) => (
          <span key={i} className="mx-8 font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#f6f5f2] inline-flex items-center gap-8">
            {t}
            <span className="w-2.5 h-2.5 bg-[#d4ff11] inline-block" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
