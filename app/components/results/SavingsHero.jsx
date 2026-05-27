"use client";
import { motion } from "framer-motion";
import CountUp from "./CountUp";

export default function SavingsHero({
  totalMonthly,
  totalAnnual,
  isOptimal,
  toolCount,
  teamSize,
  totalCurrentSpend,
  totalRecommendedSpend,
  percentReduction,
}) {
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
    >
      {/* Main savings banner */}
      <div className="text-center py-10 px-6 border border-emerald-500/20 rounded-3xl bg-emerald-500/[0.03] mb-8">
        <p className="font-body text-xs uppercase tracking-widest text-emerald-400/70 mb-4 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          Spend Audit Completed
        </p>
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className="font-heading italic text-6xl md:text-8xl text-emerald-400">
            $<CountUp end={totalMonthly} />
          </span>
          <span className="font-body text-xl text-[#f3ead8]/40">/mo</span>
        </div>
        <p className="font-body text-lg text-[#f3ead8]/60 mb-1">
          You could save <span className="text-[#f3ead8]/90 font-semibold">${totalAnnual.toLocaleString()}</span> annually
        </p>
        {percentReduction > 0 && (
          <p className="font-body text-sm text-[#f3ead8]/40">
            That is a {percentReduction}% reduction of your current AI SaaS burn rate
          </p>
        )}
      </div>

      {/* Three-column summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-[#f3ead8]/10 rounded-2xl p-5 text-center">
          <p className="font-body text-[10px] uppercase tracking-widest text-red-400/70 mb-2">Current Spend</p>
          <p className="font-heading italic text-2xl md:text-3xl">
            ${totalCurrentSpend?.toLocaleString() || "—"}<span className="text-base text-[#f3ead8]/40">/mo</span>
          </p>
        </div>
        <div className="border border-[#f3ead8]/10 rounded-2xl p-5 text-center">
          <p className="font-body text-[10px] uppercase tracking-widest text-emerald-400/70 mb-2">Recommended Spend</p>
          <p className="font-heading italic text-2xl md:text-3xl">
            ${totalRecommendedSpend?.toLocaleString() || "—"}<span className="text-base text-[#f3ead8]/40">/mo</span>
          </p>
        </div>
        <div className="border border-emerald-500/20 bg-emerald-500/[0.03] rounded-2xl p-5 text-center">
          <p className="font-body text-[10px] uppercase tracking-widest text-emerald-400/70 mb-2">Annual Savings</p>
          <p className="font-heading italic text-2xl md:text-3xl text-emerald-400">
            ${totalAnnual?.toLocaleString() || "—"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
