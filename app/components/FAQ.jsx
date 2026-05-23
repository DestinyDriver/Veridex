"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Chevron } from "./Icons";

const fadeIn = (delay = 0) => ({
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  whileInView: { filter: "blur(0px)", opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: "easeOut", delay },
});

const items = [
  {
    q: "How is the audit priced?",
    a: "A flat monthly subscription based on team size and number of connected tools. No usage fees, no take-rate on savings. Cancel anytime.",
  },
  {
    q: "What data do you actually read?",
    a: "Billing metadata, seat assignments, and aggregate usage counts. We never read prompts, completions, code, or document contents — read-only access scoped to the minimum required.",
  },
  {
    q: "Which AI tools are supported?",
    a: "OpenAI, Anthropic, Cursor, GitHub Copilot, Gemini, Perplexity, Notion AI, Midjourney, Replit, plus 40+ others via SAML/SSO billing connectors. New tools added weekly.",
  },
  {
    q: "How accurate are the savings estimates?",
    a: "Recommendations are grounded in your last 90 days of invoices and seat activity. Each estimate links back to the line item and assumption — auditable, not pulled from thin air.",
  },
  {
    q: "Do you resell credits?",
    a: "Only inside our enterprise tier and only with the upstream vendor's blessing. Self-serve customers see neutral recommendations, never a markup-shaped suggestion.",
  },
  {
    q: "How fast is onboarding?",
    a: "Most teams connect their stack and see their first audit in under 30 minutes. Larger teams with custom SSO routes typically need a single working session with our success team.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section
      data-screen-label="faq"
      className="relative w-full bg-[#0c0a06] px-8 md:px-16 lg:px-20 py-28 md:py-36 border-t border-[#f3ead8]/5"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <motion.h2
            {...fadeIn(0)}
            className="font-heading italic text-[#f3ead8] text-6xl md:text-7xl leading-[0.95] tracking-[-2px]"
          >
            FAQs
          </motion.h2>
          <motion.p
            {...fadeIn(0.08)}
            className="mt-6 text-base md:text-lg font-body font-light text-[#f3ead8]/70 max-w-xl mx-auto leading-snug"
          >
            Quick answers on pricing, privacy, supported tools, and how we keep the numbers honest.
          </motion.p>
        </div>

        <motion.div {...fadeIn(0.16)} className="mt-16 border-t border-[#f3ead8]/15">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} className="border-b border-[#f3ead8]/15">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-6 text-left py-5"
                >
                  <span className="font-body font-semibold text-[#f3ead8] text-base md:text-lg">
                    {it.q}
                  </span>
                  <Chevron open={isOpen} />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-out"
                  style={{ maxHeight: isOpen ? 240 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <p className="pb-6 pr-10 text-sm md:text-base text-[#f3ead8]/70 font-body font-light leading-snug max-w-2xl">
                    {it.a}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="text-center mt-24">
          <motion.h3
            {...fadeIn(0)}
            className="font-heading italic text-[#f3ead8] text-3xl md:text-4xl leading-none tracking-[-1px]"
          >
            Still have a question?
          </motion.h3>
          <motion.p
            {...fadeIn(0.08)}
            className="mt-4 text-sm md:text-base text-[#f3ead8]/65 font-body font-light"
          >
            Reach the team directly — we usually reply within the day.
          </motion.p>
          <motion.div {...fadeIn(0.16)} className="mt-6 inline-block">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-[#f3ead8] border border-[#f3ead8]/25 hover:border-[#f3ead8]/60 transition-colors"
            >
              Contact
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
