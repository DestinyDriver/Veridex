"use client";
import { motion } from "framer-motion";

const reveal = (delay = 0) => ({
  initial: { filter: "blur(10px)", opacity: 0, y: 24 },
  whileInView: { filter: "blur(0px)", opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.9, ease: "easeOut", delay },
});

function Mono({ children, className = "" }) {
  return (
    <span
      className={`font-body tabular-nums ${className}`}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {children}
    </span>
  );
}

const tagStyle =
  "liquid-glass rounded-full px-3 py-1 text-[11px] text-[#f3ead8]/85 font-body whitespace-nowrap inline-flex items-center gap-1.5";

const TOOL_ICONS = {
  "ChatGPT Team": "/openai_dark.svg",
  "Claude Teams": "https://cdn.simpleicons.org/claude/f3ead8",
  "Cursor Pro": "https://cdn.simpleicons.org/cursor/f3ead8",
  "Copilot Business": "https://cdn.simpleicons.org/githubcopilot/f3ead8",
  Cursor: "https://cdn.simpleicons.org/cursor/f3ead8",
  Copilot: "https://cdn.simpleicons.org/githubcopilot/f3ead8",
  Codeium: "https://cdn.simpleicons.org/codeium/f3ead8",
};

export default function Problem() {
  return (
    <section
      data-screen-label="problem" id="problems"
      className="relative w-full bg-[#0c0a06] px-8 md:px-16 lg:px-20 py-28 md:py-36 border-t border-[#f3ead8]/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start text-left max-w-2xl">
          <motion.h2
            {...reveal(0.08)}
            className="font-heading italic text-[#f3ead8] text-5xl md:text-6xl lg:text-[5.5rem] leading-[0.92] tracking-[-3px]"
          >
            Your AI spend
            <br />
            is bleeding quietly.
          </motion.h2>
          <motion.p
            {...reveal(0.16)}
            className="mt-6 text-base md:text-lg font-body font-light text-[#f3ead8]/70 max-w-xl leading-snug"
          >
            Most teams don&apos;t notice until invoices stack up. Four patterns
            cause 80% of the waste.
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Idle seats */}
          <motion.div
            {...reveal(0.05)}
            className="liquid-glass rounded-[1.5rem] p-8 md:col-span-4 min-h-[280px] flex flex-col justify-between"
          >
            <div className="relative z-10 flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-body text-[#f3ead8]/55 uppercase tracking-[0.16em]">
                  01 — Idle seats
                </p>
                <h3 className="mt-4 font-heading italic text-[#f3ead8] text-4xl md:text-5xl leading-[0.95] tracking-[-1.5px]">
                  Half your seats
                  <br />
                  never log in.
                </h3>
                <p className="mt-4 text-sm md:text-base text-[#f3ead8]/70 font-body font-light max-w-md leading-snug">
                  ChatGPT Team, Claude Teams, Cursor Pro — every dormant seat
                  costs $20–40 a month. We surface them in one view.
                </p>
              </div>
              <div className="relative z-10 hidden md:flex flex-col items-end gap-2">
                <Mono className="font-heading italic text-[#f3ead8] text-6xl leading-none">
                  42%
                </Mono>
                <span className="text-[11px] text-[#f3ead8]/60 font-body">
                  avg idle rate
                </span>
              </div>
            </div>
            <div className="relative z-10 flex flex-wrap gap-1.5 mt-6">
              {[
                "ChatGPT Team",
                "Claude Teams",
                "Cursor Pro",
                "Copilot Business",
              ].map((t) => (
                <span key={t} className={tagStyle}>
                  {TOOL_ICONS[t] && <img src={TOOL_ICONS[t]} alt="" className="relative z-10 w-3 h-3 object-contain" />}
                  <span className="relative z-10">{t}</span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Wrong tier */}
          <motion.div
            {...reveal(0.12)}
            className="liquid-glass rounded-[1.5rem] p-8 md:col-span-2 min-h-[280px] flex flex-col justify-between"
          >
            <div className="relative z-10">
              <p className="text-xs font-body text-[#f3ead8]/55 uppercase tracking-[0.16em]">
                02 — Wrong tier
              </p>
              <h3 className="mt-4 font-heading italic text-[#f3ead8] text-3xl md:text-4xl leading-none tracking-[-1px]">
                Pro plan, free usage.
              </h3>
              <p className="mt-3 text-sm text-[#f3ead8]/70 font-body font-light leading-snug">
                Many users sit on Pro but use less than 12% of its quota.
              </p>
            </div>
            <div className="relative z-10 flex items-end justify-between mt-6">
              <Mono className="font-heading italic text-[#f3ead8] text-4xl leading-none">
                $214
              </Mono>
              <span className="text-[11px] text-[#f3ead8]/60 font-body">
                /seat/year wasted
              </span>
            </div>
          </motion.div>

          {/* Duplicate tools */}
          <motion.div
            {...reveal(0.18)}
            className="liquid-glass rounded-[1.5rem] p-8 md:col-span-2 min-h-[260px] flex flex-col justify-between"
          >
            <div className="relative z-10">
              <p className="text-xs font-body text-[#f3ead8]/55 uppercase tracking-[0.16em]">
                03 — Overlap
              </p>
              <h3 className="mt-4 font-heading italic text-[#f3ead8] text-3xl md:text-4xl leading-none tracking-[-1px]">
                Three tools, one job.
              </h3>
              <p className="mt-3 text-sm text-[#f3ead8]/70 font-body font-light leading-snug">
                Copilot, Cursor, and Codeium all charged for the same engineer.
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-2 mt-6">
              {["Cursor", "Copilot", "Codeium"].map((t) => (
                <span key={t} className={tagStyle}>
                  {TOOL_ICONS[t] && <img src={TOOL_ICONS[t]} alt="" className="relative z-10 w-3 h-3 object-contain" />}
                  <span className="relative z-10">{t}</span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Retail pricing */}
          <motion.div
            {...reveal(0.24)}
            className="liquid-glass rounded-[1.5rem] p-8 md:col-span-4 min-h-[260px] flex flex-col justify-between"
          >
            <div className="relative z-10 flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-body text-[#f3ead8]/55 uppercase tracking-[0.16em]">
                  04 — Retail pricing
                </p>
                <h3 className="mt-4 font-heading italic text-[#f3ead8] text-3xl md:text-4xl leading-none tracking-[-1px]">
                  Paying list price
                  <br />
                  on credits.
                </h3>
                <p className="mt-4 text-sm text-[#f3ead8]/70 font-body font-light max-w-md leading-snug">
                  OpenAI and Anthropic both offer volume tiers. Most startups
                  never qualify themselves into them. We do.
                </p>
              </div>
              <div className="relative z-10 hidden md:block">
                <div className="liquid-glass rounded-2xl p-4 w-[180px]">
                  <div className="relative z-10">
                    <p className="text-[10px] text-[#f3ead8]/55 font-body uppercase tracking-[0.14em]">
                      Anthropic
                    </p>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-[11px] text-[#f3ead8]/60 font-body line-through">
                        Retail
                      </span>
                      <Mono className="text-[#f3ead8]/70 text-sm">
                        $3.00/1M
                      </Mono>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-[11px] text-[#f3ead8] font-body">
                        After audit
                      </span>
                      <Mono className="font-heading italic text-[#f3ead8] text-xl">
                        $2.10
                      </Mono>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
