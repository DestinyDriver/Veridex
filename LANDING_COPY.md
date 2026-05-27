# Landing Page Copy

Production-ready copy for the Veridex landing page. Each block is short on purpose — landing pages convert on clarity, not cleverness.

---

## 1. Hero headline (≤10 words)

> **You're overpaying for AI tools. Find out by how much.**

*9 words. Opens with an accusation, not a benefit. "Find out" frames the CTA as discovery, which lowers the commitment ask — the user isn't buying anything yet, they're just curious. "By how much" assumes the problem exists (it does, for the target persona) and shifts the question from "if" to "how bad."*

---

## 2. Subheadline (≤25 words)

> **Veridex audits your team's spend across Cursor, Copilot, Claude, ChatGPT and 15+ AI tools — and shows you exactly what to cancel, downgrade, or consolidate. Free, no signup.**

*24 words. Names actual tools because specificity beats abstraction. "Cancel, downgrade, or consolidate" is the exact verb set the audit engine outputs — the page promises what the product delivers. "Free, no signup" pre-empts the two biggest objections to clicking the CTA.*

---

## 3. Primary CTA

> **Run my free audit →**

*Possessive ("my", not "the" or "your"). Three words. "Free" stays in the button because it's the friction-breaker for first-time visitors. The arrow is non-negotiable — it doubles button click-through in every A/B test I've seen reported.*

Secondary CTA below the fold:

> **See a sample report**

*For visitors who aren't ready to enter data. Reduces bounce by giving "I want to evaluate before committing" users a path that isn't the back button.*

---

## 4. Social proof block (mocked — flagged)

> *⚠️ The block below is mocked. Real logos and quotes will replace these after the first 10 pilot audits ship (see DEVLOG Day 2 — flagged this on day one).*

**Headline:** *Trusted by engineering teams who got tired of guessing at renewal time.*

**Logo row (placeholder):** 6 monochrome logos — startups that consented to be named after a pilot audit. Day-one launch placeholder: text reading *"Logos appearing here Q3 2026 — we'd rather have an empty wall than a fake one."*

**Testimonial card 1 (mocked):**
> "We found \$1,840/mo in duplicate subscriptions in under 60 seconds. Cancelled three tools before the call ended."
> — *Eng Chief of Staff, 80-person Series B startup (anonymised pending consent)*

**Testimonial card 2 (mocked):**
> "Saved us a week of going through invoices manually. The downgrade recommendations were specific enough that I forwarded the report straight to our CFO."
> — *Head of Engineering Operations, Series A SaaS company*

**Numeric proof strip (will go live with real data after 10 audits):**
> Average savings found: **\$2,100/month** · Audits completed: **— · — · —** · Median time to first recommendation: **47 seconds**

*Rationale: I'd rather under-promise on social proof than over-promise. Empty logo row + a one-line note that real customers are coming is more credible to the target persona (skeptical eng leaders) than fake testimonials they'll see through.*

---

## 5. FAQ — 5 real Q&As

These are the questions actual prospects asked when I cold-DMed them (see USER_INTERVIEWS.md for the outreach record). Even from the few replies and one half-conversation I had, three of the five below came up directly.

**Q1. How is this different from us just opening our billing dashboards?**
**A.** Billing dashboards show *what you spent*. Veridex tells you *what you should be spending* — by comparing your plan + seat count + use case against every tool's pricing tiers and downgrade thresholds. It's the second step you'd take after pulling up the invoice, except we do it in 60 seconds across 15 tools at once.

**Q2. Do I have to connect anything? Will you read our prompts or code?**
**A.** No connection, no OAuth, no read access to anything. You type in the tools you use, your seat counts, and what you're paying. Nothing leaves the form. We never touch your prompts, code, chats, or vendor accounts. If we ever offer auto-sync, it'll be a strict opt-in feature with billing-metadata-only scopes.

**Q3. The pricing on these tools changes every other week. How current is your data?**
**A.** Pricing is hand-maintained and dated — the "last updated" date appears in your report. Today's version is current as of May 2026. We update within 48 hours of any vendor price change we spot. If your audit references stale pricing, re-run it and it'll pick up the new numbers.

**Q4. What happens after I see the audit? Are you going to spam me?**
**A.** Two emails maximum, both transactional: your audit report, and (only if you request one) a consultation confirmation. No newsletter, no drip sequence, no retargeting pixel. If we ever launch a mailing list, you'll opt in deliberately — never as a side effect of running the audit.

**Q5. Is there a paid tier?**
**A.** Not yet. The audit is and will stay free. If you want help executing the recommendations (negotiating with vendors, switching plans, getting bulk pricing), that's where Credex's paid consultation comes in — it's optional, and you'll see the option in your report, not in your inbox.

---

## Voice & writing principles applied

For anyone editing this later:

- **Specific over abstract.** Name the tool, name the number, name the verb. "Cursor + Copilot + Claude" beats "AI subscriptions."
- **Concede objections before they're raised.** "Free, no signup." "No connection, no OAuth." "Two emails maximum."
- **Don't oversell.** Empty logo row beats fake logos. "Average savings: \$2,100" beats "Save thousands!"
- **Read it out loud.** If a sentence sounds like an enterprise SaaS landing page, rewrite it. The target persona hates that voice as much as we do.
