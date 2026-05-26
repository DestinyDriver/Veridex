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
    q: "What is Veridex?",
    a: "Veridex is an AI spend intelligence platform that helps startups identify wasted AI SaaS spending across tools like ChatGPT, Claude, Cursor, Copilot, Gemini, and more.",
  },
  {
    q: "How does the Veridex audit work?",
    a: "Veridex analyzes your AI subscriptions, billing data, seat activity, and usage patterns to detect idle seats, overlapping tools, unnecessary premium plans, and pricing inefficiencies. The platform then generates an optimization report with projected savings.",
  },
  {
    q: "Which AI tools does Veridex support?",
    a: "Veridex supports OpenAI, Claude, Gemini, Cursor, GitHub Copilot, Perplexity, Notion AI, Midjourney, Windsurf, Replit, and other major AI SaaS platforms, with new integrations added regularly.",
  },
  {
    q: "Does Veridex read our prompts or internal data?",
    a: "No. Veridex only accesses billing metadata, subscription details, seat activity, and aggregate usage analytics required for cost optimization. Your prompts, code, chats, and documents are never accessed.",
  },
  {
    q: "How are savings recommendations generated?",
    a: "Veridex combines deterministic analysis with AI reasoning to identify duplicate tools, underused plans, inactive seats, and inefficient pricing structures based on real usage behavior.",
  },
  {
    q: "Can Veridex detect overlapping AI tools?",
    a: "Yes. Veridex identifies tools performing similar workflows across your stack — such as Cursor, Copilot, Claude, or Gemini — and recommends consolidation opportunities to reduce unnecessary spend.",
  },
  {
    q: "How accurate are the savings estimates?",
    a: "Savings projections are generated from actual billing history, plan utilization, and seat activity. Every recommendation includes contextual reasoning and estimated monthly and yearly impact.",
  },
  {
    q: "How long does onboarding take?",
    a: "Most teams connect their AI stack and receive their first audit within minutes. Larger organizations with custom SSO or procurement workflows may require additional setup.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section
      data-screen-label="faq"
      className="relative w-full bg-[#0c0a06] px-8 md:px-16 lg:px-20 py-28 md:py-36  border-[#f3ead8]/5"
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
            Quick answers on pricing, privacy, supported tools, and how we keep
            the numbers honest.
          </motion.p>
        </div>

        <motion.div
          {...fadeIn(0.16)}
          className="mt-16 border-t border-[#f3ead8]/15"
        >
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
                  style={{
                    maxHeight: isOpen ? 240 : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
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
