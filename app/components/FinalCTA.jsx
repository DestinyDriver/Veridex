"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "./Icons";

const reveal = (delay = 0) => ({
  initial: { filter: "blur(10px)", opacity: 0, y: 24 },
  whileInView: { filter: "blur(0px)", opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.9, ease: "easeOut", delay },
});

const skyImage = "https://lh3.googleusercontent.com/d/17K0YiN4DT0x91sSy3_QFBoIeMBkRp7fJ=w2400";
const ink = "#0a0907";
const surface = "#ebe6db";

export default function FinalCTA() {
  return (
    <section
      data-screen-label="final-cta"
      className="relative w-full overflow-hidden"
      style={{ background: surface, color: ink }}
    >
      <div className="relative max-w-7xl mx-auto px-8 md:px-16 lg:px-20 pt-28 md:pt-36 pb-10 flex flex-col items-center text-center">
        <motion.div
          {...reveal(0)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(10,9,7,0.06)", border: "1px solid rgba(10,9,7,0.08)" }}
        >
          <span className="font-heading italic leading-none" style={{ color: ink, fontSize: 22, marginTop: -2 }}>
            v
          </span>
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

        <motion.form
          {...reveal(0.2)}
          onSubmit={(e) => e.preventDefault()}
          className="mt-10 flex items-center rounded-full pl-5 pr-1.5 py-1.5 w-full max-w-md"
          style={{ background: "rgba(10,9,7,0.06)", border: "1px solid rgba(10,9,7,0.08)" }}
        >
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 bg-transparent outline-none border-0 text-sm font-body py-2"
            style={{ color: ink }}
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap"
            style={{ background: ink, color: surface }}
          >
            Talk to founders
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </motion.form>

        <style>{`
          [data-screen-label="final-cta"] input::placeholder {
            color: rgba(10,9,7,0.45);
          }
        `}</style>
      </div>

      {/* Giant wordmark with sky image clipped inside letterforms */}
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
          <span className="text-xs font-body tracking-[0.12em]" style={{ color: "rgba(10,9,7,0.6)" }}>
            VERIDEX© 2026
          </span>
          <div className="flex items-center gap-8">
            <a href="#" className="text-xs font-body" style={{ color: "rgba(10,9,7,0.6)" }}>
              Terms of Service
            </a>
            <a href="#" className="text-xs font-body" style={{ color: "rgba(10,9,7,0.6)" }}>
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
