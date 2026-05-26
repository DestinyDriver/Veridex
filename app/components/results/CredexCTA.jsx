"use client";
import { motion } from "framer-motion";

export default function CredexCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="mt-8 border border-emerald-500/20 bg-emerald-500/[0.03] rounded-2xl p-8"
    >
      <p className="font-body text-[10px] uppercase tracking-widest text-emerald-400/70 mb-3">
        Special Partner Savings
      </p>
      <h3 className="font-heading italic text-xl mb-3">
        Want to capture even more savings?
      </h3>
      <p className="font-body text-sm text-[#f3ead8]/60 leading-relaxed mb-4">
        Credex sells discounted AI credits at up to 40% off retail pricing for OpenAI, Anthropic, and other major APIs.
      </p>
      <a
        href="https://credex.rocks"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-body text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
      >
        → Book a free consultation at credex.rocks
      </a>
    </motion.div>
  );
}
