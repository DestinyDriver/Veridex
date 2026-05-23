"use client";
import { motion } from "framer-motion";

const reveal = (delay = 0) => ({
  initial: { filter: "blur(10px)", opacity: 0, y: 24 },
  whileInView: { filter: "blur(0px)", opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.9, ease: "easeOut", delay },
});

const quotes = [
  {
    n: "01",
    quote:
      "We were burning four figures a month on idle Cursor seats and didn't know it. The first audit paid for the year.",
    name: "Maya Okafor",
    initials: "MO",
  },
  {
    n: "02",
    quote:
      "Our AI bill grew faster than headcount. The dashboard turned a quarterly panic into a weekly decision.",
    name: "Daniel Hsu",
    initials: "DH",
  },
];

const cardStyle = {
  background: "#0e0c08",
  border: "1px solid rgba(243,234,216,0.08)",
  boxShadow:
    "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(243,234,216,0.04)",
};

const avatarStyle = {
  background: "rgba(243,234,216,0.08)",
  border: "1px solid rgba(243,234,216,0.14)",
};

function QuoteCard({ q }) {
  return (
    <div className="rounded-[1.5rem] p-6 w-full" style={cardStyle}>
      <span className="font-body text-xs text-[#f3ead8]/45">({q.n})</span>
      <blockquote className="mt-3 font-body font-light text-[#f3ead8]/95 text-[15px] leading-[1.45]">
        {q.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={avatarStyle}
        >
          <span className="text-[10px] font-body font-medium text-[#f3ead8]">
            {q.initials}
          </span>
        </div>
        <span className="text-sm font-body text-[#f3ead8]">{q.name}</span>
      </figcaption>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      data-screen-label="testimonials"
      className="relative w-full bg-[#0c0a06] px-8 md:px-16 lg:px-20 py-28 md:py-36 border-t border-[#f3ead8]/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Giant headline */}
          <motion.div
            {...reveal(0.1)}
            aria-hidden="true"
            className="text-center font-heading italic leading-[0.85] select-none pointer-events-none"
            style={{
              color: "rgba(243,234,216,0.32)",
              letterSpacing: "-5px",
              fontSize: "clamp(96px, 16vw, 260px)",
            }}
          >
            <div>What</div>
            <div className="mt-2 md:mt-3">they say.</div>
          </motion.div>

          {/* Desktop floating cards */}
          <div className="hidden md:block">
            <motion.div
              {...reveal(0.25)}
              className="absolute w-[360px]"
              style={{ top: "-2%", right: "2%", transform: "rotate(0.5deg)" }}
            >
              <QuoteCard q={quotes[0]} />
            </motion.div>
            <motion.div
              {...reveal(0.4)}
              className="absolute w-[360px]"
              style={{ bottom: "-6%", left: "2%", transform: "rotate(-1deg)" }}
            >
              <QuoteCard q={quotes[1]} />
            </motion.div>
          </div>

          {/* Mobile stack */}
          <div className="md:hidden mt-10 grid grid-cols-1 gap-6">
            {quotes.map((q) => (
              <QuoteCard key={q.name} q={q} />
            ))}
          </div>

          {/* Spacer for absolute cards */}
          <div className="hidden md:block" style={{ height: "120px" }} />
        </div>
      </div>
    </section>
  );
}
