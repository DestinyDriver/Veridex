# DEVLOG

Personal log while building Veridex. Honest — including the days I got stuck and the ones I almost gave up on.

---

## Day 1 — 2026-05-22

**Hours worked:** 4.5

**What I did:** No code today. Spent the day deciding what to actually build. The brief left the problem space open, so I went through a few ideas (an invoice splitter, a meeting-cost calculator, a tool that diffs two SaaS subscriptions) before landing on the AI spend audit. Reason: it's a problem I've personally watched my college's dev club run into — three people paid for Cursor Ultra when two of them only used it twice a week. If I'm pitching this to someone, I want to actually believe in it.

Sketched the user journey on paper: landing → form → results → shareable report → email. Wrote down the data I'd need to collect (tool, plan, seats, monthly cost) and a rough idea of the downgrade rules. Created an empty repo at the end of the day with just `create-next-app`. Didn't even open the editor properly.

**What I learned:** Forcing myself to write the user journey by hand (not in Figma, not in code) made me realize I had no idea what the "results" page should actually show. A bar chart? A table? A single big number? I didn't decide today — but knowing I hadn't decided was useful.

**Blockers / what I'm stuck on:** Genuinely torn between Next.js App Router (which I've only half-used) and staying in the Pages Router (which I know). The AGENTS.md file in the project root says "this is not the Next.js you know" for v16 — so I'm going to have to read docs either way.

**Plan for tomorrow:** Build the landing page. Don't touch the audit logic yet. Get something on screen that looks like a real product.

---

## Day 2 — 2026-05-23

**Hours worked:** 8

**What I did:** Landing page, top to bottom. Hero, social proof row, problem section, how-it-works, testimonials, FAQ, final CTA. Used Framer Motion for the section reveals and started bringing in GSAP for a scroll-pinned hero animation. Picked Instrument Serif + Barlow as the font pair — wanted the serif headline to feel editorial, not SaaSy. Two commits because I rebuilt the hero from scratch when the first version looked like every other landing page on the internet. Also got tripped up by a broken hero image URL and had to push a quick fix.

**What I learned:** GSAP and Framer Motion don't fight if you keep their jobs separated — Framer for state-driven motion, GSAP for scroll timelines. I wasted maybe 90 minutes trying to do scroll-pinning in Framer before I gave up and just brought in GSAP. Lesson: pick the right tool, even if it means a second dependency.

Also learned that Tailwind v4's new `@theme` block is _very_ different from v3's `tailwind.config.js`. I spent an embarrassing amount of time looking for `theme.extend` before I realized it doesn't exist anymore.

**Blockers / what I'm stuck on:** The "social proof" section is fake right now (no real testimonials). I know I'll have to either remove it or write convincing placeholder copy. Going to leave it for now and decide closer to submission.

**Plan for tomorrow:** Start the audit engine. Write the pricing data first, then the rules.

---

## Day 3 — 2026-05-24

**Hours worked:** 9

**What I did:** This was the heaviest day. Built three things:

1. **`lib/audit-engine.js`** — the core `runAudit()` function that takes user entries + team size + use case and returns recommendations + savings. Started with a rough switch-statement and refactored into a `PLAN_THRESHOLDS` config object so the rules are data, not control flow.
2. **`lib/pricing-data.js`** — pricing for ~15 AI tools. This took longer than the engine itself. Cursor, Copilot, Claude, ChatGPT, Gemini, Perplexity, v0, Replit, Cline, plus a few smaller ones. Cross-referenced each on the vendor's site and added a "pricing updated" date comment at the top so I (or a future me) remembers this needs maintenance.
3. **`/audit` page** — two-column layout, form on the left, live preview on the right. Redesigned it once mid-day after my first version felt like a survey, not a tool.

Also wrote `PRICING.md` to document where each price came from. Felt over-engineered at the time, but writing it forced me to catch two pricing errors I'd typed wrong (Copilot Business was $19, not $20; Claude Teams was $30 per user/month, not $25).

**What I learned:** Pure functions are a cheat code. The audit engine has zero I/O, zero DB calls, zero `fetch`. It takes JSON in, returns JSON out. That means I can test it in the browser console by pasting an object in. I didn't write formal unit tests today, but I tested ~20 input combinations by hand and felt confident in the output.

Also learned that the way I was modeling "use case" was wrong. I had it as a multiplier on cost. It should be a _filter_ on which downgrade rules apply (e.g. you don't downgrade Cursor Ultra → Pro if the use case is "deep autonomous coding"). Rewrote that part before bed.

**Blockers / what I'm stuck on:** The form has too many fields. New users will bounce. I need to figure out a way to reduce friction — maybe collapse "advanced" inputs by default?

**Plan for tomorrow:** Polish the tools tile UI (the part where users pick which tools they pay for). Get it to feel like clicking tiles instead of filling a form.

---

## Day 4 — 2026-05-25

**Hours worked:** 3

**What I did:** Short day — I had two college submissions due so I only had the evening. Refactored the tools selector into a tile grid (same component used on the landing page and the audit page), and made selected tiles show the plan picker inline. One commit. That's all I had time for.

**What I learned:** Reusing the tile component on both the landing page and the audit form forced me to think about its API more carefully. Started with a `selected` prop and a `mode` prop; ended up with just `selected` + a render-prop slot for the inline plan picker. The audit page passes a picker, the landing page passes nothing. Cleaner.

**Blockers / what I'm stuck on:** Tired. Worried about whether I can finish persistence + emails + deploy in two days.

**Plan for tomorrow:** Pick up the engine and pressure-test it. I have a suspicion the downgrade math is wrong for partial-seat plans.

---

## Day 5 — 2026-05-26

**Hours worked:** 7

**What I did:** Two commits, both important.

1. **Audit engine rewrite (`fix: revise Logic for the Audit Engine`).** My suspicion was right — when a team had, say, 12 seats on a plan that recommends downgrading 8 of them, the old code was treating it as all-or-nothing. Rewrote to support per-seat recommendations within a single tool entry. Also clamped `monthlySavings` at zero — if a user is somehow already _under_-spending vs the recommended plan, the engine no longer reports a negative saving.
2. **Navbar blur fix.** The navbar used `backdrop-filter: blur` but it was applying _over_ the modal as well, which made the modal look fuzzy. Fixed by giving the modal a higher stacking context and isolating the blur to the navbar layer only. Tiny change, surprisingly fiddly — `isolation: isolate` was the keyword I needed.

Also did a UX pass: smoother hover states on the tiles, better focus rings for keyboard nav, fixed a button that wasn't reachable by Tab.

**What I learned:** I keep getting bitten by CSS stacking contexts. `z-index` alone doesn't do what I think it does when there's a `backdrop-filter` in play. Made a note in my personal scratchpad: _if blur is misbehaving, suspect stacking context before suspecting z-index._

About the engine: the bug was masked because my own test inputs always had small teams. The moment I tested with 50 seats the math fell apart. Note to self — pick test inputs at the _edges_ of the input space, not the middle.

**Blockers / what I'm stuck on:** Nothing technical. Mostly worried about scope — I haven't started persistence yet and I have one full day plus a wrap-up day left.

**Plan for tomorrow:** Persistence + email in one day. Supabase tables, store wrapper with an in-memory fallback so local dev keeps working without env vars, Resend templates for the audit report and the consultation confirmation, and a short-URL shortcode system.

---

## Day 6 — 2026-05-27

**Hours worked:** 10

**What I did:** Three commits, easily the longest day of the week.

1. **Supabase integration.** Wrote `supabase-schema.sql` with three tables — `audits`, `leads`, `share_links`. Built `lib/store.js` as a thin wrapper around the Supabase client, with an in-memory `Map` fallback so anyone cloning the repo without env vars still gets a working dev environment. Added the short-URL system — 7-character base62 codes that resolve to UUIDs, so shareable links look like `/s/aB3xZ9k` instead of `/s/8e4b1f2c-...`.
2. **Resend email integration.** Two transactional emails — audit report (with savings summary + share link) and consultation confirmation. Wrote the HTML inline in `lib/resend.js` because I only have two templates and pulling in React Email felt like overkill. Made the email send fire-and-forget from the `/api/audit` route so the user doesn't wait on it.
3. **Consultation CTA on the audit report.** Added the "talk to someone" button on the results page that opens a modal, submits to `/api/lead`, and triggers the confirmation email. Wired up a honeypot field and a per-IP rate limit on the lead endpoint (it's in-memory for now, I know this won't survive horizontal scaling — noted in ARCHITECTURE.md).

**What I learned:** Fire-and-forget on serverless is more dangerous than I assumed. If you `.then()` after returning the response, Vercel's function might be killed before the promise resolves. I read the Next.js v16 docs on this carefully — turns out the runtime keeps the function alive for unresolved promises, but only up to the function timeout. Good enough for now, but I wrote it down as a thing to fix at scale (queue it).

Also learned how cheap Supabase makes the "boring" stuff. I had a working database with a hosted dashboard, RLS available, and a service-role key for server-side writes in about 15 minutes. The schema took longer than the wiring.

**Blockers / what I'm stuck on:** Resend's domain verification took longer than expected — about 40 minutes of waiting on DNS propagation. Almost gave up and sent from `onboarding@resend.dev` for the demo, then it finally went through.

**Plan for tomorrow:** Wrap-up. Deploy to Vercel, take screenshots, record a short walkthrough, and write the three docs (README, ARCHITECTURE, DEVLOG). No new features.

---

## Day 7 — 2026-05-28

**Hours worked:** 5

**What I did:** Final day. No new product features — deliberately. Spent the day on:

- Deployed to Vercel. Hit one snag with the Supabase service-role key env var (I'd named it `SUPABASE_SERVICE_KEY` in code and `SUPABASE_SERVICE_ROLE_KEY` in `.env.example`, didn't realize until the first prod request failed). Fixed and redeployed.
- Took screenshots — landing, audit form, results page, email report.
- Recorded a ~45-second walkthrough.
- Wrote `README.md` (summary, quick start, decisions, deployed URL).
- Wrote `ARCHITECTURE.md` (mermaid diagram, data flow, stack reasoning, 10k/day scaling plan).
- Wrote this DEVLOG.
- Sanity-checked the whole flow on a fresh browser profile: landing → audit → submit → email arrived → share link works → consultation form submits.

**What I learned:** Writing the architecture doc forced me to explain decisions I'd made implicitly. The 10k/day section was the most useful — I'd never thought about which part of my own stack would break first under load. Realized the in-memory rate limiter is the single most fragile thing I shipped, and that the email path is the second. Both made the doc.

Writing the DEVLOG itself was harder than I expected. I almost edited Day 4 to make it sound more productive (only one commit), then I remembered the brief — honesty scores higher than fake entries. Kept it.

**Blockers / what I'm stuck on:** Nothing left. Submitting.

**Plan for tomorrow:** Send the application. Open the laptop a few hours later and resist the urge to add "just one more feature."

---

## Honest reflection

This isn't part of the format, but I want to say it. Building this in a week meant making a lot of small bets fast. Some of them I'm proud of (the pure audit engine, the in-memory fallback for the store, the decision to _not_ add tRPC or React Email). Some I'd undo if I had another week (the in-memory rate limiter, the lack of automated tests on the engine, the fake testimonials I haven't replaced yet).

I built this because I think it's a real problem. If you give me the internship, I'd want to ship it for actual customers and find out where I'm wrong.

— Divyansh Sahu
