"use client";
import { motion } from "framer-motion";
import CountUp from "./CountUp";

export default function SavingsHero({ totalMonthly, totalAnnual, isOptimal, toolCount, teamSize }) {
  if (isOptimal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 text-sm font-body font-medium">Optimized</span>
        </div>
        <h1 className="font-heading italic text-4xl md:text-5xl mb-4">
          You&apos;re spending well.
        </h1>
        <p className="font-body text-lg text-[#f3ead8]/50 max-w-lg mx-auto">
          Across {toolCount} tool{toolCount !== 1 ? "s" : ""} and {teamSize} team member{teamSize !== 1 ? "s" : ""}, your AI spend is already well-optimized.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="text-center py-12"
    >
      <p className="font-body text-sm uppercase tracking-wider text-[#f3ead8]/40 mb-3">
        Total potential savings
      </p>
      <div className="flex items-baseline justify-center gap-3 mb-2">
        <span className="font-heading italic text-6xl md:text-8xl">
          $<CountUp end={totalMonthly} />
        </span>
        <span className="font-body text-xl text-[#f3ead8]/40">/mo</span>
      </div>
      <p className="font-body text-lg text-[#f3ead8]/50">
        <span className="text-[#f3ead8]/80 font-medium">${totalAnnual.toLocaleString()}</span> per year · {toolCount} tool{toolCount !== 1 ? "s" : ""} audited · team of {teamSize}
      </p>
    </motion.div>
  );
}
