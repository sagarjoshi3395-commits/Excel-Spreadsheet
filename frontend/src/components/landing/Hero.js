import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useBuy } from "@/hooks/useBuy";
import { VoltButton } from "./VoltButton";
import { IMAGES, PRICE } from "@/lib/landingData";
import { Check } from "lucide-react";

const lines = ["The last", "spreadsheet", "you'll ever", "need."];

const lineParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const lineChild = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const { setOpen } = useBuy();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 150, damping: 20 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 20 });

  const handleMouse = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <section id="top" className="relative pt-32 sm:pt-40 pb-16 px-5 sm:px-8" data-testid="hero-section">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-10 items-center">
        {/* Left */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] border border-[#0f0f0f] px-3 py-1.5 mb-8 bg-[#d4ff11]"
          >
            <span className="w-1.5 h-1.5 bg-[#0f0f0f] rounded-full" />
            One Excel file · No software · Lifetime
          </motion.div>

          <motion.h1
            variants={lineParent}
            initial="hidden"
            animate="show"
            className="font-display font-black text-[3.2rem] sm:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-tighter"
          >
            {lines.map((l, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span variants={lineChild} className="block">
                  {i === 3 ? (
                    <span>need<span className="text-[#0f0f0f] bg-[#d4ff11] px-1">.</span></span>
                  ) : (
                    l
                  )}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="mt-7 text-lg text-[#595959] max-w-md leading-relaxed"
          >
            Track income, expenses, profit &amp; loss, taxes and monthly, quarterly &amp;
            annual dashboards — all automatically, with clean graphs. Works in Excel or
            Google Sheets.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-5"
          >
            <VoltButton testid="hero-cta-buy" onClick={() => setOpen(true)}>
              Get lifetime access · ₹{PRICE}
            </VoltButton>
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-[#595959]">
              <span className="line-through opacity-50">₹999</span> · one-time payment
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.1em] text-[#595959]"
          >
            {["Fully editable", "Auto-calculated", "Instant download"].map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0f0f0f]" /> {f}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right - tilted mockup */}
        <div className="lg:col-span-6 [perspective:1200px]" onMouseMove={handleMouse} onMouseLeave={reset}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative"
          >
            <div className="absolute -inset-3 bg-[#d4ff11] border border-[#0f0f0f] translate-x-3 translate-y-3 -z-10" />
            <img
              src={IMAGES.hero}
              alt="Business management Excel dashboard with charts"
              className="w-full border border-[#0f0f0f] object-cover"
              data-testid="hero-image"
            />
            <div className="absolute -bottom-5 -left-5 bg-[#0f0f0f] text-[#f6f5f2] px-4 py-3 border border-[#0f0f0f] font-mono text-xs uppercase tracking-[0.1em] hard-shadow-volt">
              Net Profit ▲ +9.5%
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
