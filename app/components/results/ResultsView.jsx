"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SavingsHero from "./SavingsHero";
import ToolBreakdownTable from "./ToolBreakdown";
import AISummary from "./AISummary";
import NextSteps from "./NextSteps";
import ShareMenu from "./ShareMenu";
import ConsultCTA from "./ConsultCTA";

export default function ResultsView({ auditId }) {
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
      .catch(() => setError("Audit not found. It may have expired."))
      .finally(() => setLoading(false));
  }, [auditId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c0a06]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#f3ead8]/20 border-t-[#f3ead8] rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-sm text-[#f3ead8]/40">Loading your audit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c0a06]">
        <div className="text-center max-w-md">
          <p className="font-body text-[#f3ead8]/60 mb-6">{error}</p>
          <a href="/audit" className="inline-flex items-center gap-2 px-6 py-3 bg-[#f3ead8] text-[#0c0a06] rounded-full font-body font-medium text-sm hover:bg-[#f3ead8]/90 transition-colors">
            Run a new audit →
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
            <a href="/" className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
              <img src="/logo.png" alt="Veridex" className="w-8 h-8 rounded-full" />
              <span className="font-heading italic text-xl">Veridex</span>
            </a>
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

          <ConsultCTA />

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-[#f3ead8]/6 flex items-center justify-between">
            <span className="font-body text-[11px] tracking-[0.1em] text-[#f3ead8]/20">
              VERIDEX© {new Date().getFullYear()}
            </span>
            <a href="/audit" className="font-body text-xs text-[#f3ead8]/30 hover:text-[#f3ead8]/60 transition-colors">
              Run another audit →
            </a>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
