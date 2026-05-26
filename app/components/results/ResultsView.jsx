"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SavingsHero from "./SavingsHero";
import ToolBreakdownTable from "./ToolBreakdown";
import AISummary from "./AISummary";
import CredexCTA from "./CredexCTA";
import NextSteps from "./NextSteps";
import LeadCapture from "./LeadCapture";
import ShareBar from "./ShareBar";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#f3ead8]/20 border-t-[#f3ead8] rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-sm text-[#f3ead8]/40">Loading your audit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
    <div className="max-w-5xl mx-auto px-6 py-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <header className="text-center mb-6">
          <a href="/" className="inline-block font-heading italic text-2xl mb-12 opacity-60 hover:opacity-100 transition-opacity">a</a>
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

        {!data.isOptimal && <CredexCTA />}

        <AISummary summary={data.summary} auditId={auditId} />

        <ToolBreakdownTable recommendations={data.recommendations} />

        {data.nextSteps?.length > 0 && (
          <NextSteps steps={data.nextSteps} />
        )}

        <LeadCapture
          auditId={auditId}
          highSavings={data.highSavings}
          isOptimal={data.isOptimal}
        />

        <ShareBar auditId={auditId} totalSavings={data.totalMonthlySavings} />

        <footer className="text-center mt-20 pb-12">
          <a href="/audit" className="font-body text-sm text-[#f3ead8]/30 hover:text-[#f3ead8]/60 transition-colors">
            ← Run another audit
          </a>
        </footer>
      </motion.div>
    </div>
  );
}
