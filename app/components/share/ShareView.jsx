"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SavingsHero from "../results/SavingsHero";
import ToolBreakdownTable from "../results/ToolBreakdown";
import AISummary from "../results/AISummary";
import NextSteps from "../results/NextSteps";
import ShareMenu from "../results/ShareMenu";

function ArrowUpRightIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export default function ShareView({ auditId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/audit/${auditId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setData)
      .catch(() => setError("This audit report was not found or has expired."))
      .finally(() => setLoading(false));
  }, [auditId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c0a06]">
        <div className="w-8 h-8 border-2 border-[#f3ead8]/20 border-t-[#f3ead8] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c0a06]">
        <div className="text-center max-w-md">
          <p className="font-body text-[#f3ead8]/60 mb-6">{error}</p>
          <a href="/audit" className="inline-flex px-6 py-3 bg-[#f3ead8] text-[#0c0a06] rounded-full font-body font-medium text-sm">
            Run your own audit →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0a06] text-[#f3ead8] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <header className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
                <img src="/logo.png" alt="Veridex" className="w-8 h-8 rounded-full" />
                <span className="font-heading italic text-xl">Veridex</span>
              </a>
              <span className="font-body text-[10px] uppercase tracking-widest text-[#f3ead8]/30 border border-[#f3ead8]/10 rounded-full px-3 py-1">
                Shared report
              </span>
            </div>
            <ShareMenu auditId={auditId} totalSavings={data.totalMonthlySavings} />
          </header>

          <SavingsHero
            totalMonthly={data.totalMonthlySavings}
            totalAnnual={data.totalAnnualSavings}
            isOptimal={data.isOptimal}
            toolCount={data.toolCount}
            teamSize={data.teamSize}
            totalCurrentSpend={data.totalCurrentSpend}
            totalRecommendedSpend={data.totalRecommendedSpend}
            percentReduction={data.percentReduction}
          />

          <AISummary summary={data.summary} auditId={auditId} />

          <ToolBreakdownTable recommendations={data.recommendations} />

          {data.nextSteps?.length > 0 && (
            <NextSteps steps={data.nextSteps} />
          )}

          {/* Run audit CTA */}
          <div className="mt-16 text-center">
            <a
              href="/audit"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#f3ead8] text-[#0c0a06] rounded-full font-body font-semibold text-sm hover:bg-[#f3ead8]/90 transition-colors"
            >
              Run your free audit
              <ArrowUpRightIcon />
            </a>
            <p className="font-body text-xs text-[#f3ead8]/20 mt-3">
              Takes 2 minutes · No credit card required
            </p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-[#f3ead8]/6 flex items-center justify-between">
            <span className="font-body text-[11px] tracking-[0.1em] text-[#f3ead8]/20">
              VERIDEX© {new Date().getFullYear()}
            </span>
            <span className="font-body text-xs text-[#f3ead8]/20">
              Powered by <a href="/" className="underline hover:text-[#f3ead8]/40 transition-colors">Veridex</a>
            </span>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
