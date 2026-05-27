"use client";
import { useState } from "react";
import { motion } from "framer-motion";

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

export default function ConsultCTA() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "consultation" }),
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
        className="mt-16 flex items-center justify-center gap-3 py-6 border border-emerald-500/15 bg-emerald-500/[0.02] rounded-2xl"
      >
        <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <span className="font-body text-sm text-emerald-400 font-medium">
          We&apos;ll be in touch within 24 hours.
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-16"
    >
      <div className="border border-[#f3ead8]/8 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-body text-sm text-[#f3ead8]/80 font-medium">
            Need help implementing these savings?
          </p>
          <p className="font-body text-xs text-[#f3ead8]/35 mt-0.5">
            Book a free consultation — we'll build your savings roadmap.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-52 bg-[#f3ead8]/5 border border-[#f3ead8]/10 rounded-full px-4 py-2.5 text-[#f3ead8] font-body text-sm placeholder:text-[#f3ead8]/20 focus:outline-none focus:border-[#f3ead8]/25 transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f3ead8] text-[#0c0a06] rounded-full font-body font-medium text-sm hover:bg-[#f3ead8]/90 transition-colors disabled:opacity-50 shrink-0 whitespace-nowrap"
          >
            {submitting ? "Sending..." : "Book consultation"}
            <ArrowIcon />
          </button>
        </form>
      </div>
      {error && (
        <p className="mt-2 text-red-400 text-xs font-body text-center">{error}</p>
      )}
    </motion.div>
  );
}
