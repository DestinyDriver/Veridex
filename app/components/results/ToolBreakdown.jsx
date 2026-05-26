"use client";
import { motion } from "framer-motion";

const cardStyle = {
  background: "#0e0c08",
  border: "1px solid rgba(243,234,216,0.08)",
  boxShadow:
    "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(243,234,216,0.04)",
};

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
          Detailed recommendations sorted by savings impact.
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl overflow-hidden" style={cardStyle}>
        <table className="w-full text-left">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(243,234,216,0.06)" }}>
              <th className="px-5 py-4 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f3ead8]/35">Tool</th>
              <th className="px-4 py-4 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f3ead8]/35">Plan</th>
              <th className="px-4 py-4 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f3ead8]/35 text-right">Seats</th>
              <th className="px-4 py-4 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f3ead8]/35 text-right">Current</th>
              <th className="px-4 py-4 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f3ead8]/35">Recommended</th>
              <th className="px-4 py-4 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f3ead8]/35 text-right">You Save</th>
              <th className="px-5 py-4 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f3ead8]/35">Why</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec, i) => {
              const isCancel = rec.recommended === "Cancel";
              const isOptimized = rec.isOptimized;

              return (
                <tr
                  key={rec.toolId}
                  className="group transition-colors hover:bg-[#f3ead8]/[0.02] align-top"
                  style={
                    i < recommendations.length - 1
                      ? { borderBottom: "1px solid rgba(243,234,216,0.04)" }
                      : {}
                  }
                >
                  <td className="px-5 py-5">
                    <span className="font-body font-semibold text-sm text-[#f3ead8]">
                      {rec.toolName}
                    </span>
                  </td>
                  <td className="px-4 py-5 font-body text-sm text-[#f3ead8]/60">
                    {rec.plan}
                  </td>
                  <td className="px-4 py-5 font-body text-sm text-[#f3ead8]/60 text-right tabular-nums">
                    {rec.seats}
                  </td>
                  <td className="px-4 py-5 font-body text-sm text-[#f3ead8]/60 text-right tabular-nums whitespace-nowrap">
                    ${rec.currentMonthly.toLocaleString()}<span className="text-[#f3ead8]/30">/mo</span>
                  </td>
                  <td className="px-4 py-5">
                    {isCancel ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        Cancel
                      </span>
                    ) : isOptimized ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ✓ Optimized
                      </span>
                    ) : (
                      <span className="font-body text-sm font-semibold text-amber-400">
                        {rec.recommended}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-5 text-right">
                    {rec.youSave > 0 ? (
                      <span className="font-heading italic text-base text-emerald-400">
                        +${rec.youSave.toLocaleString()}
                      </span>
                    ) : (
                      <span className="font-body text-sm text-[#f3ead8]/25">—</span>
                    )}
                  </td>
                  <td className="px-5 py-5 font-body text-xs text-[#f3ead8]/45 leading-relaxed max-w-[280px]">
                    {rec.why}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {recommendations.map((rec, i) => {
          const isCancel = rec.recommended === "Cancel";
          const isOptimized = rec.isOptimized;

          return (
            <motion.div
              key={rec.toolId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
              className="rounded-2xl p-5"
              style={cardStyle}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-body font-semibold text-base text-[#f3ead8]">{rec.toolName}</h3>
                  <p className="font-body text-xs text-[#f3ead8]/35 mt-0.5">
                    {rec.plan} · {rec.seats} {rec.seats === 1 ? "seat" : "seats"} · ${rec.currentMonthly.toLocaleString()}/mo
                  </p>
                </div>
                {isOptimized ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-body font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    ✓ Optimized
                  </span>
                ) : rec.youSave > 0 ? (
                  <span className="font-heading italic text-lg text-emerald-400 shrink-0">
                    +${rec.youSave.toLocaleString()}
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="font-body text-[10px] uppercase tracking-wider text-[#f3ead8]/25">Recommended</span>
                {isCancel ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                    Cancel
                  </span>
                ) : isOptimized ? (
                  <span className="font-body text-xs text-[#f3ead8]/50">No changes needed</span>
                ) : (
                  <span className="font-body text-sm font-semibold text-amber-400">{rec.recommended}</span>
                )}
              </div>

              <p className="font-body text-xs text-[#f3ead8]/40 leading-relaxed">
                {rec.why}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
