import { Reveal, Chapter } from "./Reveal";
import { TABS, SHEET_URL } from "@/lib/landingData";
import { Receipt, ExternalLink } from "lucide-react";

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
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <h2 className="font-display font-black text-4xl sm:text-6xl leading-[0.95] tracking-tighter">
                One Editable File With Organized Views.
              </h2>
              <p className="mt-5 text-[#595959] text-base sm:text-lg leading-relaxed">
                Choose the sections you need, customize the categories, and enter your records. Built-in spreadsheet formulas update the relevant views automatically.
              </p>
            </div>
            <a
              href={SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="showcase-preview-link"
              className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#d4ff11] text-[#0f0f0f] border border-[#0f0f0f] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] font-semibold hover:bg-[#c2eb0f] transition-colors"
            >
              Preview the template <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" data-testid="showcase-grid">
          {TABS.map((tab, index) => (
            <Reveal key={tab.label} delay={Math.min(index * 0.03, 0.2)}>
              <article className="group h-full bg-white border border-[#0f0f0f] hard-shadow-sm" data-testid={`showcase-card-${index}`}>
                <div className="flex items-center justify-between gap-3 px-3 py-2.5 border-b border-[#0f0f0f] bg-[#f6f5f2]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#595959]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display font-extrabold text-base sm:text-lg tracking-tight">{tab.label}</h3>
                </div>
                <div className="bg-[#f4f4f2] overflow-hidden border-b border-[#0f0f0f]">
                  <img
                    src={tab.img}
                    alt={`${tab.label} preview`}
                    loading={index < 3 ? "eager" : "lazy"}
                    decoding="async"
                    className="block w-full h-auto object-contain group-hover:scale-[1.01] transition-transform duration-300"
                    data-testid={`showcase-image-${index}`}
                  />
                </div>
                <p className="px-3 py-2 text-sm text-[#595959] leading-relaxed">{tab.desc}</p>
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
              See the real template before you buy.
              <span className="text-[#595959] font-body font-normal text-base sm:text-lg block sm:inline sm:ml-2">
                Open the editable Google Sheet preview and review the tabs, layout, and included fields.
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
