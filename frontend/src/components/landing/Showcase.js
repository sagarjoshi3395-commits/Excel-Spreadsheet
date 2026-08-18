import { Reveal, Chapter } from "./Reveal";
import { TABS } from "@/lib/landingData";
import { Receipt } from "lucide-react";

export default function Showcase() {
  return (
    <section
      id="showcase"
      className="px-5 sm:px-8 py-20 sm:py-32 bg-[#ebeae6] border-y border-[#0f0f0f]"
      data-testid="showcase-section"
    >
      <div className="max-w-[1400px] mx-auto">
        <Chapter number="02" label="Take A Look Inside" />
        <Reveal className="mb-10 max-w-3xl">
          <h2 className="font-display font-black text-4xl sm:text-6xl leading-[0.95] tracking-tighter">
            One file. Ten dashboards. Zero formulas to write.
          </h2>
          <p className="mt-5 text-[#595959] text-base sm:text-lg leading-relaxed">
            See every dashboard at a glance. Each tab updates itself the moment you type a number.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" data-testid="showcase-grid">
          {TABS.map((tab, index) => (
            <Reveal key={tab.label} delay={Math.min(index * 0.03, 0.2)}>
              <article className="group h-full bg-white border border-[#0f0f0f] hard-shadow-sm hover:-translate-y-1 transition-transform duration-200" data-testid={`showcase-card-${index}`}>
                <div className="flex items-center justify-between gap-3 px-3 py-2.5 border-b border-[#0f0f0f] bg-[#f6f5f2]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#595959]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display font-extrabold text-base sm:text-lg tracking-tight">{tab.label}</h3>
                </div>
                <div className="bg-[#f4f4f2] aspect-[5/3] overflow-hidden border-b border-[#0f0f0f] flex items-center justify-center">
                  <img
                    src={tab.img}
                    alt={`${tab.label} preview`}
                    loading={index < 3 ? "eager" : "lazy"}
                    decoding="async"
                    className="block w-full h-full object-contain group-hover:scale-[1.01] transition-transform duration-300"
                    data-testid={`showcase-image-${index}`}
                  />
                </div>
                <p className="px-3 py-3 text-sm text-[#595959] leading-relaxed">{tab.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-6 bg-white border border-[#0f0f0f] hard-shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <span className="grid place-items-center w-12 h-12 bg-[#d4ff11] border border-[#0f0f0f] shrink-0">
              <Receipt className="w-6 h-6 text-[#0f0f0f]" />
            </span>
            <p className="font-display font-extrabold text-xl sm:text-2xl leading-tight text-[#0f0f0f]">
              Even your taxes are calculated for you.
              <span className="text-[#595959] font-body font-normal text-base sm:text-lg block sm:inline sm:ml-2">
                Tax collected vs paid, tracked every month — no accountant needed.
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
