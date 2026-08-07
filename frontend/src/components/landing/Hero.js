import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useBuy } from "@/hooks/useBuy";
import { VoltButton } from "./VoltButton";
import { IMAGES, PRICE } from "@/lib/landingData";
import { Check, TrendingUp, LayoutGrid, Zap } from "lucide-react";

const lines = ["The last", "spreadsheet", "you'll ever", "need."];

const lineParent = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } };
const lineChild = { hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } };

const float = (d) => ({
  animate: { y: [0, -10, 0] },
  transition: { duration: 4 + d, repeat: Infinity, ease: "easeInOut" },
});

function Chip({ icon: Icon, label, value, className, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div {...float(delay)} className="flex items-center gap-2 bg-white border border-[#0f0f0f] px-3 py-2 hard-shadow-sm">
        <span className="grid place-items-center w-7 h-7 bg-[#d4ff11] border border-[#0f0f0f]">
          <Icon className="w-4 h-4 text-[#0f0f0f]" />
        </span>
        <div className="leading-none">
          <p className="font-display font-extrabold text-sm">{value}</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#595959] mt-0.5">{label}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const { setOpen } = useBuy();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 20 });

  const handleMouse = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <section id="top" className="relative pt-28 sm:pt-40 pb-16 px-5 sm:px-8 overflow-hidden" data-testid="hero-section">
      {/* decorative background */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(#0f0f0f 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse 80% 60% at 70% 30%, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 70% 30%, #000 30%, transparent 75%)",
        }}
      />
      <div className="absolute -top-10 right-[8%] w-72 h-72 bg-[#d4ff11] rounded-full blur-[90px] opacity-40 -z-10" />

      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        {/* Left */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] border border-[#0f0f0f] px-3 py-1.5 mb-7 bg-[#d4ff11]"
          >
            <span className="w-1.5 h-1.5 bg-[#0f0f0f] rounded-full" />
            One Excel file · No software · Lifetime
          </motion.div>

          <motion.h1 variants={lineParent} initial="hidden" animate="show" className="font-display font-black text-[3rem] sm:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-tighter">
            {lines.map((l, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span variants={lineChild} className="block">
                  {i === 3 ? (<span>need<span className="text-[#0f0f0f] bg-[#d4ff11] px-1">.</span></span>) : l}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.7 }} className="mt-6 text-base sm:text-lg text-[#595959] max-w-md leading-relaxed">
            Track income, expenses, profit &amp; loss, taxes and monthly, quarterly &amp;
            annual dashboards — all automatically, with clean graphs. Works in Excel or
            Google Sheets.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.7 }} className="mt-8 flex flex-wrap items-center gap-4 sm:gap-5">
            <VoltButton testid="hero-cta-buy" onClick={() => setOpen(true)}>
              Get lifetime access · ₹{PRICE}
            </VoltButton>
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-[#595959]">
              <span className="line-through opacity-50">₹999</span> · one-time
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.1em] text-[#595959]">
            {["Fully editable", "Auto-calculated", "Instant download"].map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0f0f0f]" /> {f}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right - tilted mockup with vectors + floating chips */}
        <div className="lg:col-span-6 [perspective:1200px]" onMouseMove={handleMouse} onMouseLeave={reset}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative"
          >
            {/* volt offset backing */}
            <div className="absolute -inset-3 bg-[#d4ff11] border border-[#0f0f0f] translate-x-3 translate-y-3 -z-10" />

            {/* upward trend vector */}
            <svg className="absolute -top-8 -left-6 w-28 h-16 -z-10 hidden sm:block" viewBox="0 0 120 70" fill="none">
              <path d="M4 62 L38 40 L62 50 L112 8" stroke="#0f0f0f" strokeWidth="3" fill="none" />
              <path d="M112 8 L96 12 M112 8 L108 24" stroke="#0f0f0f" strokeWidth="3" />
            </svg>

            <img
              src={IMAGES.hero}
              alt="Business management Excel dashboard with charts"
              className="w-full border border-[#0f0f0f] object-cover"
              data-testid="hero-image"
            />

            {/* floating stat chips */}
            <Chip icon={TrendingUp} value="+9.5%" label="Net profit" className="-bottom-6 -left-4 sm:-left-6" delay={1.4} />
            <Chip icon={LayoutGrid} value="10" label="Dashboards" className="-top-5 -right-3 sm:-right-5" delay={1.6} />
            <Chip icon={Zap} value="Live" label="Auto updates" className="top-1/2 -right-4 sm:-right-8" delay={1.8} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
