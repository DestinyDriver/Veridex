"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

export default function ShareMenu({ auditId, totalSavings }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${auditId}`
      : `/share/${auditId}`
  );
  const ref = useRef(null);

  // Generate short share link on first open
  useEffect(() => {
    if (!open) return;
    fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auditId }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.shareUrl) setShareUrl(d.shareUrl); })
      .catch(() => {});
  }, [open, auditId]);

  const shareText =
    totalSavings > 0
      ? `Just found $${totalSavings.toLocaleString()}/mo in AI tool savings with Veridex. Free audit:`
      : "Just audited my AI tool spend with Veridex. Free audit:";

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
    setOpen(false);
  }

  function shareTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
    setOpen(false);
  }

  function shareLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
    setOpen(false);
  }

  function downloadPDF() {
    window.open(`/api/report/${auditId}`, "_blank");
    setOpen(false);
  }

  const items = [
    { label: "Share on X", icon: <XIcon />, action: shareTwitter },
    { label: "Share on LinkedIn", icon: <LinkedInIcon />, action: shareLinkedIn },
    { label: copied ? "Copied!" : "Copy link", icon: <LinkIcon />, action: copyLink },
    { label: "Download PDF", icon: <DownloadIcon />, action: downloadPDF },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full flex items-center justify-center text-[#f3ead8]/50 hover:text-[#f3ead8] hover:bg-[#f3ead8]/5 transition-colors"
        aria-label="Share & export"
      >
        <DotsIcon />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-52 rounded-xl overflow-hidden"
            style={{
              background: "#141210",
              border: "1px solid rgba(243,234,216,0.1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {items.map((item, i) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-[#f3ead8]/70 hover:text-[#f3ead8] hover:bg-[#f3ead8]/5 transition-colors text-left"
                style={
                  i < items.length - 1
                    ? { borderBottom: "1px solid rgba(243,234,216,0.06)" }
                    : {}
                }
              >
                <span className="text-[#f3ead8]/40">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
