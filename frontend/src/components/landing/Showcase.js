import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Reveal, Chapter } from "./Reveal";
import { TABS } from "@/lib/landingData";
import { Receipt, MoveHorizontal } from "lucide-react";

const DURATION = 4200;

export default function Showcase() {
  const [active, setActive] = useState(3);
  const [paused, setPaused] = useState(false);
  const tab = TABS[active];

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % TABS.length), DURATION);
    return () => clearTimeout(t);
  }, [active, paused]);

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
            Every tab updates itself the moment you type a number. Watch it cycle through
            the real sheets — or tap any tab to explore.
          </p>
        </Reveal>

        <div
          className="grid lg:grid-cols-12 gap-4 sm:gap-6 items-start"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Tab list */}
          <Reveal className="lg:col-span-3">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-1 px-1" data-testid="showcase-tabs">
              {TABS.map((t, i) => (
                <button
                  key={t.label}
                  data-testid={`showcase-tab-${i}`}
                  onClick={() => setActive(i)}
                  className={`relative shrink-0 lg:w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border border-[#0f0f0f] font-mono text-[11px] sm:text-xs uppercase tracking-[0.1em] transition-colors duration-200 overflow-hidden ${
                    active === i ? "bg-[#0f0f0f] text-[#f6f5f2]" : "bg-white text-[#0f0f0f] hover:bg-[#d4ff11]"
                  }`}
                >
                  {active === i && !paused && (
                    <motion.span
                      key={active}
                      className="absolute left-0 bottom-0 h-0.5 bg-[#d4ff11]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: DURATION / 1000, ease: "linear" }}
                    />
                  )}
                  <span className={active === i ? "text-[#d4ff11]" : "text-[#595959]"}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t.label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Browser frame preview */}
          <Reveal className="lg:col-span-9" delay={0.1}>
            <div className="border border-[#0f0f0f] bg-white hard-shadow">
              <div className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[#0f0f0f] bg-[#f6f5f2]">
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-[#0f0f0f] bg-white" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-[#0f0f0f] bg-[#d4ff11]" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-[#0f0f0f] bg-white" />
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-[#595959] truncate">
                  {tab.label} tab
                </span>
                <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#595959]">
                  <span className={`w-1.5 h-1.5 rounded-full ${paused ? "bg-[#595959]" : "bg-[#d4ff11] animate-pulse"}`} />
                  <span className="hidden xs:inline sm:inline">{paused ? "Paused" : "Auto"}</span>
                </span>
              </div>

              {/* mobile: horizontal-scroll full image; desktop: contained aspect box */}
              <div className="relative overflow-x-auto sm:overflow-hidden bg-[#f4f4f2]">
                <div className="w-[760px] sm:w-auto sm:relative sm:aspect-[16/9]">
                  <motion.img
                    key={tab.img}
                    src={tab.img}
                    alt={`${tab.label} dashboard`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="block w-full sm:absolute sm:inset-0 sm:w-full sm:h-full object-contain object-top"
                    data-testid="showcase-image"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3 sm:py-4 border-t border-[#0f0f0f]">
                <p className="text-[#0f0f0f] text-sm sm:text-base font-medium" data-testid="showcase-caption">
                  <span className="font-display font-extrabold">{tab.label} · </span>
                  <span className="text-[#595959]">{tab.desc}</span>
                </p>
                <span className="hidden sm:block font-mono text-[11px] uppercase tracking-[0.12em] text-[#595959] whitespace-nowrap">
                  {active + 1} / {TABS.length}
                </span>
              </div>
            </div>
            <p className="sm:hidden mt-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#595959]">
              <MoveHorizontal className="w-3.5 h-3.5" /> Swipe the sheet to see it all
            </p>
          </Reveal>
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
