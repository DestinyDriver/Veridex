# Reflection

## 1. The hardest bug I hit this week, and how I debugged it

The audit engine was silently producing the wrong recommendation when team size crossed plan thresholds. I noticed it on Day 5 (`fix: revise Logic for the Audit Engine`) and it took the better part of a morning to actually understand.

The symptom: a team of 12 seats on Cursor Ultra. The engine said "downgrade all 12 to Pro." The intuition felt off — surely some power users still benefit from Ultra. I poked at the numbers and noticed something subtler: when I changed the team size to 50, the engine confidently said "downgrade all 50 to Pro" too. The recommendation was always _all-or-nothing_, never _per-seat_.

**Hypotheses, in order:**

1. _The pricing data is wrong._ Checked — pricing matched the vendor pages.
2. _The threshold comparison is using `<` where it should be `<=`._ Off-by-one. Read the code carefully — wasn't this.
3. _The downgrade rule is correct but `seats` is being clobbered somewhere._ Added a `console.log(toolId, seats, recommendedSeats)` at every step. The log showed `recommendedSeats` was always equal to `seats`. That was the smoking gun.

**The actual bug:** my downgrade rule returned a single recommended _plan_, then the savings calc multiplied `(actualCost − recommendedCost) × seats`. I'd never modelled "some seats on Plan A, others on Plan B." The data shape only had room for one plan per tool entry.

**The fix:** I refactored the recommendation output from `{ recommended: "Pro" }` to `{ recommendedSplit: [{ plan: "Ultra", seats: 2 }, { plan: "Pro", seats: 10 }] }`. The savings calc became a sum over the split. The downgrade rules got rewritten to express "keep N seats on the higher plan if use_case is X, downgrade the rest."

**What actually made me catch it:** picking edge-case inputs deliberately. I'd been testing with team sizes of 5–10 the whole week because that's what my paper journey-map used. The moment I tried 50, the math broke visibly. Lesson I wrote down: _test the corners of the input space, not the middle._

---

## 2. A decision I reversed mid-week, and what made me reverse it

I reversed the LLM summary's output format.

Going in, I'd designed `/api/summary` to return structured JSON — `{ headline, body, nextSteps[] }` — so the frontend could render each piece with its own typography. I prompted Claude Sonnet 4 to "respond with valid JSON only, no prose outside the object." For about three days this looked like it worked. Then I noticed the route crashed in production logs.

The crash was Claude wrapping the JSON in a Markdown code fence (` ```json ... ``` `) maybe 5% of the time. My `JSON.parse` choked. I tried two fixes: stripping fences before parsing, and a stricter prompt with "no markdown, no code blocks, raw JSON only." The stripping worked but felt fragile; the stricter prompt reduced fence frequency but didn't eliminate it. At 10k audits/day that's still 500 daily errors I'd be fighting.

**The reversal:** I dropped structured JSON entirely. The summary is now a single plain-text paragraph (~120 words). The frontend renders it as one `<p>`. I lost the per-section typography. I gained 100% reliability.

What made me reverse it: I'd accidentally inverted my own priorities. The thing I cared about — _user always sees a thoughtful summary_ — was being sacrificed for a thing I didn't really care about — _headline rendered in a slightly bigger font_. The 95% case wasn't the right number to optimize for; the 5% case was the user staring at a blank box.

There's a wider lesson here that I'm still digesting: **don't ask LLMs for structure unless the structure is the product.** For data extraction, sure — schema-constrained output exists for a reason. For a marketing-summary paragraph, asking for JSON is solving a problem that doesn't need to exist. I'd rather concatenate sentences I trust than parse JSON I don't.

This decision is documented in `PROMPTS.md` under "What I tried that didn't work."

---

## 3. What I'd build in week 2

In priority order, with reasoning:

**1. Actual benchmark mode.** "Teams your size (50 eng, mixed use case) spend an average of \$5,400/mo on AI tools — you're at \$8,200." This is the single biggest credibility unlock. Right now the audit feels like opinion ("you should downgrade"); benchmarks make it feel like data. Implementation: aggregate the `audits` table by team-size bucket + use case, expose a percentile API. Even with 50 real audits, the median + IQR is informative.

**2. PDF export.** The audit is a document people forward to their CFO. Currently it lives at a URL — fine for sharing, terrible for the workflow where a CFO wants to staple it into a renewal review deck. Server-rendered PDF (Puppeteer on a serverless function, or Vercel's built-in PDF route) is a half-day of work that triples the artifact's downstream usefulness.

**3. The "AI Tooling Price Index" page.** From GTM.md. Public, monthly-updated, opinionated. Single biggest organic-distribution unlock. I have the pricing data already; this is mostly a styled rendering of `lib/pricing-data.js` plus a "what changed this month" diff.

**4. Vendor-direct discount partnerships (the unfair channel from GTM).** Not strictly engineering work, but the prerequisite is a Credex-facing API: "user X just completed an audit, here's their stack, generate a personalized discount code." If I'm at Credex, this is the integration I'd ship first because it's the one no competitor can replicate.

**5. Persisted form state via Supabase, not just localStorage.** Right now the form persists across reloads via localStorage (per the brief). For users who switch devices mid-audit (laptop → phone to grab a screenshot of the bill), they re-enter everything. Behind email magic-link, the form should roam.

**What I deliberately wouldn't build:** seat-level usage analytics (requires OAuth into every vendor, scope creep), an auto-suggest tool finder (low value vs. a hand-picked tile grid), a paid tier (premature — gross margin lives in Credex consultations, not Veridex SaaS).

---

## 4. How I used AI tools

I used **Cave with Claude** as my primary coding assistant, **Claude.ai** in the browser for short-form thinking out loud (debate-with-myself stuff), and **the Anthropic API directly** in production for the audit summary feature. No Cursor, no Copilot — I wanted a clear separation between code I wrote, code I directed an agent to write, and code shipped by an LLM-at-runtime.

**What I delegated freely:** boilerplate React components (form fields, modals, the FAQ accordion), Tailwind class scaffolding, Supabase client wrapper boilerplate, the HTML email templates in `lib/resend.js`, and most of the writing in this repo's docs (drafted by me, refined with Claude).

**What I didn't trust them with:**

- **The audit math.** Every line in `lib/audit-engine.js` is something I wrote and re-read by hand. I asked Claude to _critique_ the logic; I never asked it to write it.
- **Pricing data entry.** I typed each vendor's pricing manually from the official page. I caught Claude hallucinating Copilot Business at \$20 (it's \$19) when I asked it to draft the initial table — that's what locked in my "I'll do this by hand" rule.
- **Decisions about architecture.** When I asked "should I use Supabase or Firebase?", the answer was a balanced list of tradeoffs. Useful for thinking, useless for deciding. I decided; the agent executed.

**One specific time the AI was wrong and I caught it:** when I asked Claude to write the per-seat split refactor of the engine (the bug from Q1), it confidently produced a version where `recommendedSplit` summed correctly but the _savings_ calculation still multiplied by the original `seats` instead of the per-plan `seats`. I caught it because I'd already mentally modeled what the result should look like for a 12-seat Cursor team. The numbers came back too high. I made the agent walk through its math one entry at a time, and it admitted the error and fixed it. Lesson: I have to know the answer before I ask the AI for it, or I can't tell when it's wrong.

---

## 5. Self-rating (1–10)

| Dimension                    | Score | One-sentence reason                                                                                                                                                                         |
| ---------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Discipline**               | **7** | I worked 7 distinct days with commits on each, but Day 4 (3 hours) was thin and I felt the pinch of that on Day 6.                                                                          |
| **Code quality**             | **6** | The engine is clean and the structure is reasonable, but I shipped without automated tests on the engine and an in-memory rate limiter — both are knowingly fragile.                        |
| **Design sense**             | **7** | The landing page and audit report look like real product, not a hackathon submission; I lose points for fake testimonials still sitting in the social-proof block.                          |
| **Problem-solving**          | **8** | I picked the right problem (a real Credex distribution wedge), built it end-to-end alone in 7 days, and the per-seat split bug fix in Q1 is genuine engineering rather than "asked the AI." |
| **Entrepreneurial thinking** | **8** | GTM, economics, metrics, and landing copy all started from the persona and worked outward; I'm proud of the unfair-channel argument and the honest-failure framing in USER_INTERVIEWS.      |

**Net:** I'd hire me for an intern role specifically because I'm conscious of my own gaps (no tests, fake testimonials, no real user interviews) and I'm writing them down instead of hiding them. The brief said honesty scores higher than fake entries. I took that at face value across every doc.

— Divyansh Sahu
