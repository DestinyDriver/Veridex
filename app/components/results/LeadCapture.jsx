"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LeadCapture({ auditId, highSavings, isOptimal }) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId, email, companyName, role, honeypot }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-16 text-center py-12 border border-emerald-500/15 bg-emerald-500/[0.02] rounded-2xl"
      >
        <div className="w-10 h-10 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-emerald-400 text-lg">✓</span>
        </div>
        <p className="font-body font-medium text-emerald-400 mb-1">Report saved</p>
        <p className="font-body text-sm text-[#f3ead8]/40">
          {highSavings
            ? "We'll reach out within 24 hours to help you capture these savings."
            : "We'll notify you when new optimizations apply to your stack."}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-16"
    >
      <div className={`rounded-2xl p-8 border ${highSavings ? "border-emerald-500/20 bg-emerald-500/[0.02]" : "border-[#f3ead8]/8"}`}>
        <h3 className="font-heading italic text-2xl mb-2">
          {highSavings ? "Let Credex capture these savings" : isOptimal ? "Stay in the loop" : "Save this report"}
        </h3>
        <p className="font-body text-sm text-[#f3ead8]/50 mb-6">
          {highSavings
            ? "Your audit shows significant savings. Credex provides discounted AI infrastructure credits — we'll show you exactly how much more you could save."
            : isOptimal
            ? "AI pricing changes fast. We'll notify you when new optimization opportunities apply to your stack."
            : "Get a copy of your audit and we'll notify you when new savings opportunities emerge."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            name="company_url"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="absolute opacity-0 pointer-events-none h-0 w-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="work@company.com"
              className="w-full bg-[#f3ead8]/5 border border-[#f3ead8]/10 rounded-lg px-4 py-3 text-[#f3ead8] font-body text-sm placeholder:text-[#f3ead8]/20 focus:outline-none focus:border-[#f3ead8]/30 transition-colors"
            />
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company name (optional)"
              className="w-full bg-[#f3ead8]/5 border border-[#f3ead8]/10 rounded-lg px-4 py-3 text-[#f3ead8] font-body text-sm placeholder:text-[#f3ead8]/20 focus:outline-none focus:border-[#f3ead8]/30 transition-colors"
            />
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Your role (optional)"
              className="flex-1 bg-[#f3ead8]/5 border border-[#f3ead8]/10 rounded-lg px-4 py-3 text-[#f3ead8] font-body text-sm placeholder:text-[#f3ead8]/20 focus:outline-none focus:border-[#f3ead8]/30 transition-colors"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#f3ead8] text-[#0c0a06] rounded-full font-body font-medium text-sm hover:bg-[#f3ead8]/90 transition-colors disabled:opacity-50 flex-shrink-0"
            >
              {submitting ? "Saving..." : highSavings ? "Book consultation" : "Save report"}
            </button>
          </div>

          {error && <p className="text-red-400 text-xs font-body">{error}</p>}
        </form>
      </div>
    </motion.section>
  );
}
