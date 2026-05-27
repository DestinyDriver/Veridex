"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ShareBar({ auditId, totalSavings }) {
  const [copied, setCopied] = useState(false);
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const shareUrl = `${baseUrl}/share/${auditId}`;

  const shareText = totalSavings > 0
    ? `Just found $${totalSavings.toLocaleString()}/mo in AI tool savings with Veridex. Free audit:`
    : "Just audited my AI tool spend with Veridex. Free audit:";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function shareTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  }

  function shareLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mt-12 flex items-center justify-center gap-3"
    >
      <span className="font-body text-xs text-[#f3ead8]/30 mr-2">Share</span>
      <button
        onClick={copyLink}
        className="px-4 py-2 border border-[#f3ead8]/10 rounded-full font-body text-xs text-[#f3ead8]/50 hover:text-[#f3ead8]/80 hover:border-[#f3ead8]/20 transition-colors"
      >
        {copied ? "Copied ✓" : "Copy link"}
      </button>
      <button
        onClick={shareTwitter}
        className="px-4 py-2 border border-[#f3ead8]/10 rounded-full font-body text-xs text-[#f3ead8]/50 hover:text-[#f3ead8]/80 hover:border-[#f3ead8]/20 transition-colors"
      >
        𝕏
      </button>
      <button
        onClick={shareLinkedIn}
        className="px-4 py-2 border border-[#f3ead8]/10 rounded-full font-body text-xs text-[#f3ead8]/50 hover:text-[#f3ead8]/80 hover:border-[#f3ead8]/20 transition-colors"
      >
        LinkedIn
      </button>
    </motion.div>
  );
}
