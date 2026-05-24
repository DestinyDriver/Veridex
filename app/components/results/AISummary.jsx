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
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-[#f3ead8]/40" />
        <span className="font-body text-xs uppercase tracking-wider text-[#f3ead8]/30">
          Audit summary
        </span>
      </div>
      <p className="font-body text-[#f3ead8]/70 leading-relaxed text-[15px]">
        {summary}
      </p>
    </motion.div>
  );
}
