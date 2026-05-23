"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const reveal = (delay = 0) => ({
  initial: { filter: "blur(10px)", opacity: 0, y: 24 },
  whileInView: { filter: "blur(0px)", opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.9, ease: "easeOut", delay },
});

const cardStyle = {
  background: "#100d08",
  border: "1px solid rgba(243,234,216,0.1)",
  boxShadow:
    "0 30px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(243,234,216,0.04)",
};

const previewBorderStyle = { border: "1px solid rgba(243,234,216,0.08)" };

function ConnectPreview() {
  const platforms = [
    "OpenAI",
    "Anthropic",
    "Cursor",
    "GitHub Copilot",
    "Gemini",
  ];
  return (
    <div className="space-y-2.5">
      {platforms.map((p, i) => (
        <div
          key={p}
          className="flex items-center justify-between text-xs font-body"
        >
          <span className="text-[#f3ead8]/85">{p}</span>
          <span
            className={`text-[10px] uppercase tracking-[0.14em] ${i < 4 ? "text-[#f3ead8]" : "text-[#f3ead8]/40"}`}
          >
            {i < 4 ? "Connected" : "Pending"}
          </span>
        </div>
      ))}
    </div>
  );
}

function AuditPreview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 bg-[#f3ead8]/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#f3ead8]" style={{ width: "78%" }} />
        </div>
        <span className="text-[10px] font-body text-[#f3ead8]/60">78%</span>
      </div>
      <p className="text-xs text-[#f3ead8]/70 font-body font-light">
        12 issues found across 47 seats
      </p>
    </div>
  );
}

function OptimizePreview() {
  const rows = [
    { label: "Cancel 14 idle seats", value: "\u2212$280/mo" },
    { label: "Move to API tier", value: "\u2212$610/mo" },
    { label: "Drop duplicate tool", value: "\u2212$190/mo" },
  ];
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center justify-between text-xs font-body"
        >
          <span className="text-[#f3ead8]/85">{r.label}</span>
          <span className="text-[#f3ead8] font-medium">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

const steps = [
  {
    n: "01",
    title: "Connect",
    blurb:
      "Link the billing accounts your team uses. OpenAI, Anthropic, Cursor, GitHub, and others. Read-only, takes under a minute.",
    Preview: ConnectPreview,
  },
  {
    n: "02",
    title: "Audit",
    blurb:
      "We map every seat, key, and invoice. Flag the dormant accounts, the wrong tiers, the duplicate tools, the over-list prices.",
    Preview: AuditPreview,
  },
  {
    n: "03",
    title: "Optimize",
    blurb:
      "Get a prioritized action list, one-click cancellations, and alternative tools with cheaper or volume-priced equivalents.",
    Preview: OptimizePreview,
  },
];

function MobileCard({ step, delay }) {
  const { n, title, blurb, Preview } = step;
  return (
    <motion.div
      {...reveal(delay)}
      className="rounded-[1.5rem] p-7 min-h-[360px] flex flex-col"
      style={cardStyle}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-heading italic text-[#f3ead8]/40 text-5xl leading-none">
          {n}
        </span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#f3ead8]/55 font-body">
          Step
        </span>
      </div>
      <h3 className="mt-8 font-heading italic text-[#f3ead8] text-4xl leading-none tracking-[-1px]">
        {title}
      </h3>
      <p className="mt-3 text-sm text-[#f3ead8]/70 font-body font-light leading-snug max-w-[34ch]">
        {blurb}
      </p>
      <div className="mt-auto pt-8">
        <div className="rounded-2xl p-4" style={previewBorderStyle}>
          <Preview />
        </div>
      </div>
    </motion.div>
  );
}

function DesktopCard({ step, cardRef }) {
  const { n, title, blurb, Preview } = step;
  return (
    <div
      ref={cardRef}
      className="absolute top-1/2 left-1/2 w-[340px] lg:w-[380px] will-change-transform"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <div
        className="rounded-[1.5rem] p-7 min-h-[420px] flex flex-col"
        style={cardStyle}
      >
        <div className="step-reveal flex items-baseline justify-between">
          <span className="font-heading italic text-[#f3ead8]/40 text-5xl leading-none">
            {n}
          </span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-[#f3ead8]/55 font-body">
            Step
          </span>
        </div>
        <h3 className="step-reveal mt-8 font-heading italic text-[#f3ead8] text-4xl leading-none tracking-[-1px]">
          {title}
        </h3>
        <p className="step-reveal mt-3 text-sm text-[#f3ead8]/70 font-body font-light leading-snug max-w-[34ch]">
          {blurb}
        </p>
        <div className="step-reveal mt-auto pt-8">
          <div className="rounded-2xl p-4" style={previewBorderStyle}>
            <Preview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const cardRef0 = useRef(null);
  const cardRef1 = useRef(null);
  const cardRef2 = useRef(null);

  useEffect(() => {
    const cardRefs = [cardRef0, cardRef1, cardRef2];
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (!cardRefs.every((r) => r.current) || !sectionRef.current) return;

    let cleanup;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        const [c1, c2, c3] = cardRefs.map((r) => r.current);
        const contents = sectionRef.current.querySelectorAll(".step-reveal");

        gsap.set(c1, {
          xPercent: -50,
          yPercent: -50,
          x: -28,
          rotation: -5,
          scale: 0.94,
          zIndex: 1,
        });
        gsap.set(c2, {
          xPercent: -50,
          yPercent: -50,
          x: 0,
          rotation: 0,
          scale: 1.0,
          zIndex: 3,
        });
        gsap.set(c3, {
          xPercent: -50,
          yPercent: -50,
          x: 28,
          rotation: 5,
          scale: 0.94,
          zIndex: 2,
        });
        gsap.set(contents, { opacity: 0.18, y: 16 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        tl.to(
          c1,
          { x: -360, rotation: -3, scale: 1, zIndex: 2, ease: "power2.inOut" },
          0,
        )
          .to(
            c3,
            { x: 360, rotation: 3, scale: 1, zIndex: 2, ease: "power2.inOut" },
            0,
          )
          .to(c2, { scale: 1.02, ease: "power1.out" }, 0)
          .to(
            contents,
            { opacity: 1, y: 0, ease: "power2.out", stagger: 0.02 },
            0.25,
          )
          .to(
            [c1, c2, c3],
            {
              boxShadow:
                "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(243,234,216,0.18), inset 0 1px 0 rgba(243,234,216,0.08)",
              ease: "power1.out",
            },
            0.3,
          );

        cleanup = () => {
          if (tl.scrollTrigger) tl.scrollTrigger.kill();
          tl.kill();
        };
      },
    );

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-screen-label="how-it-works"
      className="relative w-full bg-[#0c0a06] overflow-hidden border-t border-[#f3ead8]/5"
    >
      {/* Desktop pinned scene */}
      <div className="hidden md:flex h-screen flex-col px-8 md:px-16 lg:px-20 pt-24 pb-16">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center">
          <div className="flex flex-col items-center max-w-2xl">
            <motion.h2
              {...reveal(0.08)}
              className="font-heading italic text-[#f3ead8] text-5xl md:text-6xl lg:text-[5.5rem] leading-[0.92] tracking-[-3px]"
            >
              From connect to savings.
            </motion.h2>
            <motion.p
              {...reveal(0.16)}
              className="mt-6 text-base md:text-lg font-body font-light text-[#f3ead8]/70 max-w-xl leading-snug"
            >
              Scroll. Watch the three steps separate.
            </motion.p>
          </div>
        </div>

        <div className="relative flex-1 max-w-7xl mx-auto w-full">
          <DesktopCard step={steps[0]} cardRef={cardRef0} />
          <DesktopCard step={steps[1]} cardRef={cardRef1} />
          <DesktopCard step={steps[2]} cardRef={cardRef2} />
        </div>
      </div>

      {/* Mobile fallback */}
      <div className="md:hidden px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-start max-w-2xl">
            <motion.p
              {...reveal(0)}
              className="text-sm font-body text-[#f3ead8]/60 mb-6"
            >
              // How it works
            </motion.p>
            <motion.h2
              {...reveal(0.08)}
              className="font-heading italic text-[#f3ead8] text-5xl leading-[0.92] tracking-[-3px]"
            >
              From connect
              <br />
              to savings.
            </motion.h2>
            <motion.p
              {...reveal(0.16)}
              className="mt-6 text-base font-body font-light text-[#f3ead8]/70 max-w-xl leading-snug"
            >
              Three steps. No engineering work.
            </motion.p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6">
            {steps.map((s, idx) => (
              <MobileCard key={s.n} step={s} delay={0.05 + idx * 0.08} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
