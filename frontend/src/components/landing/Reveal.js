import { motion } from "framer-motion";

export function Reveal({ children, delay = 0, y = 40, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Chapter({ number, label }) {
  return (
    <Reveal className="flex items-center gap-4 mb-10">
      <span className="font-mono text-sm text-[#0f0f0f]">[ {number} ]</span>
      <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#595959]">{label}</span>
      <span className="flex-1 h-px bg-[#0f0f0f]/20" />
    </Reveal>
  );
}
