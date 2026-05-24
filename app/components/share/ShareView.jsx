"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SavingsHero from "../results/SavingsHero";
import ToolBreakdown from "../results/ToolBreakdown";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#f3ead8]/20 border-t-[#f3ead8] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <p className="font-body text-[#f3ead8]/60 mb-6">{error}</p>
          <a href="/audit" className="inline-flex px-6 py-3 bg-[#f3ead8] text-[#0c0a06] rounded-full font-body font-medium text-sm">
            Run your own audit →
          </a>
        </div>
      </div>
    );
  }

  // Strip identifying details for public view
  const publicRecs = data.recommendations?.map((rec) => ({
    ...rec,
  }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <header className="text-center mb-6">
          <a href="/" className="inline-block font-heading italic text-2xl mb-8 opacity-60 hover:opacity-100 transition-opacity">a</a>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f3ead8]/10 mb-4">
            <span className="font-body text-xs text-[#f3ead8]/40">Shared audit report</span>
          </div>
        </header>

        <SavingsHero
          totalMonthly={data.totalMonthlySavings}
          totalAnnual={data.totalAnnualSavings}
          isOptimal={data.isOptimal}
          toolCount={data.toolCount}
          teamSize={data.teamSize}
        />

        <section className="mt-16">
          <h2 className="font-heading italic text-2xl mb-8">Breakdown</h2>
          <div className="space-y-4">
            {publicRecs?.map((rec, i) => (
              <ToolBreakdown key={rec.toolId} rec={rec} index={i} />
            ))}
          </div>
        </section>

        <div className="mt-20 text-center border-t border-[#f3ead8]/8 pt-12">
          <p className="font-body text-[#f3ead8]/40 mb-6">
            Want to find your own savings?
          </p>
          <a
            href="/audit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#f3ead8] text-[#0c0a06] rounded-full font-body font-semibold text-base hover:bg-[#f3ead8]/90 transition-colors"
          >
            Run your free audit →
          </a>
          <p className="font-body text-xs text-[#f3ead8]/20 mt-4">
            Powered by <a href="/" className="underline hover:text-[#f3ead8]/40">Veridex</a> · Takes 2 minutes
          </p>
        </div>
      </motion.div>
    </div>
  );
}
