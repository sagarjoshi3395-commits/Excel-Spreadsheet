import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function VoltButton({ children, onClick, testid, className = "", dark = false }) {
  return (
    <motion.button
      data-testid={testid}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`group inline-flex items-center gap-2 px-7 py-4 font-mono text-sm uppercase tracking-[0.12em] font-medium border border-[#0f0f0f] ${
        dark
          ? "bg-[#d4ff11] text-[#0f0f0f] hard-shadow"
          : "bg-[#0f0f0f] text-[#f6f5f2] hard-shadow-volt"
      } ${className}`}
    >
      {children}
      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.button>
  );
}
