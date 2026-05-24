"use client";
import { motion } from "framer-motion";

export default function DuplicateWarning({ duplicates }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-12"
    >
      <h2 className="font-heading italic text-2xl mb-4">Overlapping tools</h2>
      {duplicates.map((dup, i) => (
        <div
          key={i}
          className="border border-amber-400/15 bg-amber-400/[0.03] rounded-2xl p-6 mb-4"
        >
          <div className="flex items-start gap-3">
            <span className="text-amber-400 text-lg mt-0.5">⚠</span>
            <div>
              <p className="font-body font-medium text-amber-400 mb-1">{dup.category}</p>
              <p className="font-body text-sm text-[#f3ead8]/60">{dup.recommendation}</p>
              {dup.potentialSavings > 0 && (
                <p className="font-body text-xs text-[#f3ead8]/30 mt-2">
                  Estimated overlap waste: ~${dup.potentialSavings}/mo
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </motion.section>
  );
}
