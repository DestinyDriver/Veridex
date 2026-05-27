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
          <svg className="w-5 h-5 text-[#f3ead8]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
          </svg>
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
