"use client";
import { motion } from "framer-motion";

export default function ToolBreakdownTable({ recommendations }) {
  if (!recommendations?.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-16"
    >
      <div className="mb-6">
        <h2 className="font-heading italic text-2xl mb-1">Per-Tool Breakdown</h2>
        <p className="font-body text-sm text-[#f3ead8]/40">
          Detailed recommendations sorted by optimization benefits.
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block border border-[#f3ead8]/8 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#f3ead8]/8">
              <th className="px-5 py-4 font-body text-xs font-medium uppercase tracking-wider text-[#f3ead8]/40">Tool</th>
              <th className="px-4 py-4 font-body text-xs font-medium uppercase tracking-wider text-[#f3ead8]/40">Plan</th>
              <th className="px-4 py-4 font-body text-xs font-medium uppercase tracking-wider text-[#f3ead8]/40">Seats</th>
              <th className="px-4 py-4 font-body text-xs font-medium uppercase tracking-wider text-[#f3ead8]/40">Current</th>
              <th className="px-4 py-4 font-body text-xs font-medium uppercase tracking-wider text-[#f3ead8]/40">Recommended</th>
              <th className="px-4 py-4 font-body text-xs font-medium uppercase tracking-wider text-[#f3ead8]/40">You Save</th>
              <th className="px-5 py-4 font-body text-xs font-medium uppercase tracking-wider text-[#f3ead8]/40">Why</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3ead8]/5">
            {recommendations.map((rec, i) => (
              <tr key={rec.toolId} className="hover:bg-[#f3ead8]/[0.02] transition-colors align-top">
                <td className="px-5 py-5 font-body font-semibold text-sm whitespace-nowrap">
                  {rec.toolName}
                </td>
                <td className="px-4 py-5 font-body text-sm text-[#f3ead8]/70">
                  {rec.plan}
                </td>
                <td className="px-4 py-5 font-body text-sm text-[#f3ead8]/70 whitespace-nowrap">
                  {rec.seats} {rec.seats === 1 ? "seat" : "seats"}
                </td>
                <td className="px-4 py-5 font-body text-sm text-[#f3ead8]/70 whitespace-nowrap">
                  ${rec.currentMonthly.toLocaleString()}/mo
                </td>
                <td className="px-4 py-5 font-body text-sm font-semibold whitespace-nowrap">
                  <span className={
                    rec.recommended === "Cancel"
                      ? "text-red-400"
                      : rec.isOptimized
                        ? "text-[#f3ead8]/70"
                        : "text-[#f3ead8]"
                  }>
                    {rec.recommended}
                  </span>
                </td>
                <td className="px-4 py-5 font-body text-sm font-semibold whitespace-nowrap">
                  {rec.isOptimized ? (
                    <span className="text-emerald-400">✓ Optimized</span>
                  ) : (
                    <span className="text-emerald-400">
                      +${rec.youSave.toLocaleString()}/mo
                    </span>
                  )}
                </td>
                <td className="px-5 py-5 font-body text-xs text-[#f3ead8]/50 leading-relaxed max-w-xs">
                  {rec.why}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.toolId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
            className="border border-[#f3ead8]/8 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-body font-semibold text-base">{rec.toolName}</h3>
                <p className="font-body text-xs text-[#f3ead8]/40">
                  {rec.plan} · {rec.seats} {rec.seats === 1 ? "seat" : "seats"} · ${rec.currentMonthly.toLocaleString()}/mo
                </p>
              </div>
              {rec.isOptimized ? (
                <span className="text-emerald-400 text-xs font-body font-medium bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-0.5">
                  ✓ Optimized
                </span>
              ) : (
                <span className="text-emerald-400 font-body font-semibold text-sm">
                  +${rec.youSave.toLocaleString()}/mo
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="font-body text-xs text-[#f3ead8]/30">Recommended:</span>
              <span className={`font-body text-sm font-semibold ${rec.recommended === "Cancel" ? "text-red-400" : "text-[#f3ead8]/80"}`}>
                {rec.recommended}
              </span>
            </div>

            <p className="font-body text-xs text-[#f3ead8]/50 leading-relaxed">
              {rec.why}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
