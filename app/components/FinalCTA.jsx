"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "./Icons";

const reveal = (delay = 0) => ({
  initial: { filter: "blur(10px)", opacity: 0, y: 24 },
  whileInView: { filter: "blur(0px)", opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.9, ease: "easeOut", delay },
});

const skyImage = "/footer.png";
const ink = "#0a0907";
const surface = "#ebe6db";

export default function FinalCTA() {
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

  return (
    <section
      data-screen-label="final-cta" id="contact"
      className="relative w-full overflow-hidden"
      style={{ background: surface, color: ink }}
    >
      <div className="relative max-w-7xl mx-auto px-8 md:px-16 lg:px-20 pt-28 md:pt-36 pb-10 flex flex-col items-center text-center">
        <motion.div
          {...reveal(0)}
          className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{
            background: "rgba(10,9,7,0.06)",
            border: "1px solid rgba(10,9,7,0.08)",
          }}
        >
          <img
            src="/logo.png"
            alt="Veridex"
            className="w-12 h-12 object-cover"
          />
        </motion.div>

        <motion.h2
          {...reveal(0.1)}
          className="mt-8 font-heading italic text-5xl md:text-6xl lg:text-[5rem] leading-[0.95] max-w-3xl tracking-[-2px]"
          style={{ color: ink }}
        >
          Stop paying for AI
          <br />
          you don&apos;t use.
        </motion.h2>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex items-center gap-3 rounded-full px-6 py-3"
            style={{
              background: "rgba(10,9,7,0.06)",
              border: "1px solid rgba(10,9,7,0.08)",
            }}
          >
            <span className="text-emerald-700 text-lg">✓</span>
            <span className="text-sm font-body font-medium" style={{ color: ink }}>
              We&apos;ll be in touch within 24 hours.
            </span>
          </motion.div>
        ) : (
          <motion.form
            {...reveal(0.2)}
            onSubmit={handleSubmit}
            className="mt-10 flex items-center rounded-full pl-5 pr-1.5 py-1.5 w-full max-w-md"
            style={{
              background: "rgba(10,9,7,0.06)",
              border: "1px solid rgba(10,9,7,0.08)",
            }}
          >
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent outline-none border-0 text-sm font-body py-2"
              style={{ color: ink }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap disabled:opacity-50"
              style={{ background: ink, color: surface }}
            >
              {submitting ? "Sending..." : "Book the Consultation"}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </motion.form>
        )}

        {error && (
          <p className="mt-3 text-red-600 text-xs font-body">{error}</p>
        )}

        <style>{`
          [data-screen-label="final-cta"] input::placeholder {
            color: rgba(10,9,7,0.45);
          }
        `}</style>
      </div>

      {/* Giant wordmark */}
      <div className="relative w-full overflow-hidden px-4 md:px-8">
        <motion.h3
          {...reveal(0.3)}
          aria-label="Veridex"
          className="font-heading italic text-center leading-none select-none whitespace-nowrap"
          style={{
            fontSize: "clamp(120px, 30vw, 520px)",
            backgroundImage: `url("${skyImage}")`,
            backgroundSize: "120% auto",
            backgroundPosition: "center 35%",
            backgroundRepeat: "no-repeat",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.045em",
            marginBottom: "-0.18em",
            marginTop: "-0.04em",
          }}
        >
          Veridex
        </motion.h3>
      </div>

      <div style={{ borderTop: "1px solid rgba(10,9,7,0.08)" }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20 py-6 flex items-center justify-between flex-wrap gap-3">
          <span
            className="text-xs font-body tracking-[0.12em]"
            style={{ color: "rgba(10,9,7,0.6)" }}
          >
            VERIDEX© 2026
          </span>
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-xs font-body"
              style={{ color: "rgba(10,9,7,0.6)" }}
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-xs font-body"
              style={{ color: "rgba(10,9,7,0.6)" }}
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
