import { Reveal, Chapter } from "./Reveal";
import { X } from "lucide-react";

const pains = [
  "Paying ₹500–₹2000 every month for accounting software you barely use.",
  "Copy-pasting numbers between apps and still not knowing your real profit.",
  "Confusing dashboards, hidden features and steep learning curves.",
  "No clear picture of taxes, expenses or where the money actually goes.",
];

export default function Problem() {
  return (
    <section className="px-5 sm:px-8 py-24 sm:py-32" data-testid="problem-section">
      <div className="max-w-[1400px] mx-auto">
        <Chapter number="01" label="The Problem" />
        <div className="grid lg:grid-cols-12 gap-10">
          <Reveal className="lg:col-span-7">
            <h2 className="font-display font-black text-4xl sm:text-6xl leading-[0.95] tracking-tighter">
              Running a business is hard.
              <br />
              <span className="text-[#595959]">Managing the money shouldn't be.</span>
            </h2>
          </Reveal>
          <div className="lg:col-span-5 space-y-4">
            {pains.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="flex gap-4 items-start border-l-2 border-[#0f0f0f] pl-4 py-1">
                  <X className="w-5 h-5 mt-0.5 shrink-0 text-[#0f0f0f]" strokeWidth={2.5} />
                  <p className="text-[#595959] leading-relaxed">{p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
