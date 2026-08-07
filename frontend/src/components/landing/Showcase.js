import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, Chapter } from "./Reveal";
import { TABS } from "@/lib/landingData";
import { Receipt } from "lucide-react";

const DURATION = 4200;

export default function Showcase() {
  const [active, setActive] = useState(3);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState(1);
  const tab = TABS[active];

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      setDir(1);
      setActive((a) => (a + 1) % TABS.length);
    }, DURATION);
    return () => clearTimeout(t);
  }, [active, paused]);

  const pick = (i) => {
    setDir(i > active ? 1 : -1);
    setActive(i);
  };

  return (
    <section
      id="showcase"
      className="px-5 sm:px-8 py-24 sm:py-32 bg-[#ebeae6] border-y border-[#0f0f0f]"
      data-testid="showcase-section"
    >
      <div className="max-w-[1400px] mx-auto">
        <Chapter number="02" label="Take A Look Inside" />
        <Reveal className="mb-12 max-w-3xl">
          <h2 className="font-display font-black text-4xl sm:text-6xl leading-[0.95] tracking-tighter">
            One file. Ten dashboards. Zero formulas to write.
          </h2>
          <p className="mt-5 text-[#595959] text-lg leading-relaxed">
            Every tab updates itself the moment you type a number. Watch it cycle through
            the real sheets — or click any tab to explore.
          </p>
        </Reveal>

        <div
          className="grid lg:grid-cols-12 gap-6 items-start"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Tab list */}
          <Reveal className="lg:col-span-3">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" data-testid="showcase-tabs">
              {TABS.map((t, i) => (
                <button
                  key={t.label}
                  data-testid={`showcase-tab-${i}`}
                  onClick={() => pick(i)}
                  className={`relative shrink-0 lg:w-full text-left flex items-center gap-3 px-4 py-3 border border-[#0f0f0f] font-mono text-xs uppercase tracking-[0.1em] transition-colors duration-200 overflow-hidden ${
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
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#0f0f0f] bg-[#f6f5f2]">
                <span className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full border border-[#0f0f0f] bg-white" />
                  <span className="w-3 h-3 rounded-full border border-[#0f0f0f] bg-[#d4ff11]" />
                  <span className="w-3 h-3 rounded-full border border-[#0f0f0f] bg-white" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#595959] truncate">
                  business-toolkit.xlsx — {tab.label} tab
                </span>
                <span className="ml-auto hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#595959]">
                  <span className={`w-1.5 h-1.5 rounded-full ${paused ? "bg-[#595959]" : "bg-[#d4ff11] animate-pulse"}`} />
                  {paused ? "Paused" : "Auto-play"}
                </span>
              </div>
              <div className="relative aspect-[16/9] bg-[#f4f4f2] overflow-hidden">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.img
                    key={tab.img}
                    src={tab.img}
                    alt={`${tab.label} dashboard`}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -40 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full object-contain object-top"
                    data-testid="showcase-image"
                  />
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-t border-[#0f0f0f]">
                <p className="text-[#0f0f0f] font-medium" data-testid="showcase-caption">
                  <span className="font-display font-extrabold">{tab.label} · </span>
                  <span className="text-[#595959]">{tab.desc}</span>
                </p>
                <span className="hidden sm:block font-mono text-[11px] uppercase tracking-[0.12em] text-[#595959] whitespace-nowrap">
                  {active + 1} / {TABS.length}
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-6 bg-[#0f0f0f] text-[#f6f5f2] border border-[#0f0f0f] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Receipt className="w-8 h-8 text-[#d4ff11] shrink-0" />
            <p className="font-display font-extrabold text-xl sm:text-2xl leading-tight">
              Even your taxes are calculated for you.
              <span className="text-[#f6f5f2]/60 font-body font-normal text-base sm:text-lg block sm:inline sm:ml-2">
                Tax collected vs paid, tracked every month — no accountant needed.
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
