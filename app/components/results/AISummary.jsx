"use client";
import { motion } from "framer-motion";

export default function AISummary({ summary }) {
  if (!summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-8 border border-[#f3ead8]/8 rounded-2xl p-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">✨</span>
          <span className="font-heading italic text-lg">Your Personalized Audit</span>
        </div>
        <span className="font-body text-[10px] uppercase tracking-widest text-[#f3ead8]/30 border border-[#f3ead8]/10 rounded-full px-3 py-1">
          AI Assessment
        </span>
      </div>
      <p className="font-body text-[#f3ead8]/70 leading-relaxed text-[15px]">
        {summary}
      </p>
    </motion.div>
  );
}
