"use client";
import { motion } from "framer-motion";

export default function NextSteps({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-12 border border-amber-400/15 bg-amber-400/[0.02] rounded-2xl p-8"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">💡</span>
        <h3 className="font-heading italic text-xl text-amber-400">Recommended Next Steps</h3>
      </div>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="font-body text-sm text-amber-400/60 font-medium flex-shrink-0 mt-0.5">
              {i + 1}.
            </span>
            <span className="font-body text-sm text-[#f3ead8]/70 leading-relaxed">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}
