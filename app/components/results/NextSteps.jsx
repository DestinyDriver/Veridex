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
        <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 1 4 12.7V17H8v-2.3A7 7 0 0 1 12 2z" />
        </svg>
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
