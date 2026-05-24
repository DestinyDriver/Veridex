"use client";
import { motion } from "framer-motion";

const ACTION_COLORS = {
  downgrade: "text-amber-400",
  idle_seats: "text-red-400",
  credex: "text-emerald-400",
};

const ACTION_BADGES = {
  downgrade: { label: "Downgrade", bg: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  idle_seats: { label: "Idle seats", bg: "bg-red-400/10 text-red-400 border-red-400/20" },
  credex: { label: "Credex savings", bg: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
};

export default function ToolBreakdown({ rec, index }) {
  const hasActions = rec.actions.length > 0;
  const primary = rec.primaryAction;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
      className="border border-[#f3ead8]/8 rounded-2xl p-6 hover:border-[#f3ead8]/15 transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-body font-semibold text-lg">{rec.toolName}</h3>
          <p className="font-body text-sm text-[#f3ead8]/40">
            {rec.planName} · {rec.seats} seat{rec.seats !== 1 ? "s" : ""} · ${rec.currentMonthly}/mo
          </p>
        </div>
        {rec.totalSavings > 0 && (
          <div className="text-right flex-shrink-0">
            <p className="font-body font-semibold text-emerald-400 text-lg">
              −${rec.totalSavings}/mo
            </p>
          </div>
        )}
      </div>

      {hasActions ? (
        <div className="space-y-3">
          {rec.actions.map((action, i) => {
            const badge = ACTION_BADGES[action.type] || ACTION_BADGES.credex;
            return (
              <div key={i} className="flex items-start gap-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium border flex-shrink-0 mt-0.5 ${badge.bg}`}>
                  {badge.label}
                </span>
                <div className="min-w-0">
                  <p className="font-body text-sm text-[#f3ead8]/80">
                    {action.action}
                    {action.savings > 0 && (
                      <span className="text-[#f3ead8]/40"> · saves ${action.savings}/mo</span>
                    )}
                  </p>
                  <p className="font-body text-xs text-[#f3ead8]/30 mt-0.5">{action.reason}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="font-body text-sm text-emerald-400/60">
          ✓ This tool is well-configured for your usage.
        </p>
      )}
    </motion.div>
  );
}
