# PROMPTS

This file documents every LLM prompt that runs **inside Veridex** in production, why it's written the way it is, and the versions I tried first that didn't work. There's also a short section at the end about how I used LLM assistants *to build* the tool — not in production, but during development.

The tool only makes **one** in-product LLM call: a personalized audit-summary narrative generated after the deterministic engine has done its math. Everything else — the downgrade rules, the savings calculation, the recommendations — is plain JavaScript with no model in the loop. That was a deliberate decision (more on this below).

---

## Prompt 1 — Audit summary narrative

**Where it runs:** `app/api/summary/route.js` → `generateAISummary()`
**Model:** `claude-sonnet-4-20250514`
**When it fires:** After `runAudit()` finishes. The deterministic engine has already produced numbers and recommendations; this prompt turns those into a short, human-readable paragraph the user sees at the top of their report.
**Fallback:** If the call fails or `ANTHROPIC_API_KEY` is missing, `generateFallbackSummary()` runs a template string and the response is tagged `source: "template"` instead of `"ai"`. The user never sees an error.

### The actual prompt

```
You are a concise AI spend analyst writing a personalized audit summary. Be
specific with numbers and tool names. Tone: professional, direct, analytical
— not salesy.

Audit data:
- Team size: {teamSize}
- Primary use case: {useCase}
- Current total spend: ${totalCurrentSpend}/mo
- Recommended spend: ${totalRecommendedSpend}/mo
- Monthly savings: ${totalMonthlySavings}/mo (${totalAnnualSavings}/yr)
- Reduction: {percentReduction}%
- Tools: {toolName} ({plan}, {seats} seats, ${currentMonthly}/mo); ...
- Cancel (duplicates): {toolName} (saves ${youSave}/mo); ...
- Downgrade: {toolName}: {plan} → {recommended} (saves ${youSave}/mo); ...
- Already optimized: {toolName}, ...

Write a ~120-word summary paragraph. Mention current spend, savings amount,
biggest opportunity, any duplicate tools, and over-provisioned tiers. End
with a clear next-step recommendation. No greeting, no sign-off.
```

### Why it's written this way

1. **Role line first, constraint line second.** "You are a concise AI spend analyst" sets the *persona*; "Be specific with numbers and tool names" sets the *behaviour*. Splitting them gave me more reliable adherence than combining them into one sentence ("You are a concise analyst who is specific…"). The model treats them as two checkable rules, not one fuzzy one.

2. **Tone is described negatively as well as positively.** "Professional, direct, analytical — not salesy." The `not salesy` part is the most important word in the entire prompt. Without it, every output started with "Exciting news!" or "Great work optimizing your stack!". Telling the model what *not* to be did more than any positive instruction.

3. **Data is pre-aggregated, not raw.** The route handler classifies recommendations into three buckets — `cancelled`, `downgraded`, `optimized` — before they hit the prompt. I tried sending the raw `recommendations` array and asking the model to sort it. It worked, but it hallucinated savings totals about 1 in 10 times because it would re-do the arithmetic and get it wrong. Pre-aggregating means the model only has to write English — the math is already done.

4. **The structure is bulleted, not paragraph.** Earlier versions described the audit in a paragraph ("The team has 12 seats and spends $X across Cursor, Copilot…"). The model would sometimes ignore the use case or skip the per-tool list. Switching to bullets made every field a discrete signal it would address.

5. **The output instruction has a word target, a content checklist, and an explicit ban.** "~120-word summary" / "Mention current spend, savings amount, biggest opportunity, duplicate tools, over-provisioned tiers" / "No greeting, no sign-off". I tried a higher word count (200) and it padded. I tried no word count and outputs ranged from 60 to 400 words. 120 is the goldilocks number for this report layout.

6. **`max_tokens: 300`.** Hard cap. Even if the model wants to write more, it gets cut off. 300 tokens ≈ 220 English words, which gives ~80 words of headroom past the 120 target. I'd rather have a clean cut than a runaway paragraph.

### What I tried that didn't work

- **First attempt — full JSON in, free-form out.** I sent the entire `results` object as JSON and asked for "a friendly summary". Outputs were 250+ words, started with "Hey there!", and hallucinated tools the user hadn't entered. Throwaway.

- **Second attempt — chain-of-thought.** I added "First, identify the biggest savings opportunity. Then, write the summary." This made the model *output* its reasoning before the summary, which I then had to parse out. More tokens, more latency, no quality gain. Removed.

- **Third attempt — few-shot with two examples.** I gave it two example input/output pairs. This worked great until users entered tools my examples didn't cover, and the model would over-index on the examples' tone (one of mine ended with "Consider booking a consultation" → every output started recommending consultations even when the team was already optimized). Removed the examples; kept the structural guidance.

- **Fourth attempt — strict JSON output.** I asked for `{ headline, body, nextSteps[] }`. The model complied ~95% of the time. The other 5% it wrapped the JSON in a markdown code fence, broke my `JSON.parse`, and crashed the route. I switched to plain text and let the frontend render it as a paragraph. Trading a feature (structured fields) for reliability was the right call.

- **Tone calibration loop.** Spent maybe 90 minutes adjusting tone words: "friendly", "warm", "professional", "consultative", "no-nonsense", "executive-brief". "Direct, analytical — not salesy" was the combination that produced something I'd actually want to read.

### Why an LLM and not just a template?

Honest answer: the template (in `generateFallbackSummary()`) is *fine*. It strings together the same facts in a fixed grammar. The LLM version does three things the template can't:

1. **Picks the most important sentence first.** A team overspending on Cursor for a 5-person team gets a different lead sentence than a team that's already optimized everything except Perplexity. The template runs the same sentence order every time.
2. **Combines related facts smoothly.** "You're paying for both Claude Teams and ChatGPT Enterprise — these overlap heavily for your use case" is hard to template because it requires reasoning about which tools overlap given a specific use case.
3. **Adjusts register to the result.** A team that saves $50/mo deserves a different tone from a team that saves $4,000/mo. The template can't read the room.

For everything *else* — the actual savings number, the recommendation, the downgrade rule — the template (i.e. deterministic JS) is the source of truth. The LLM only writes the prose.

---

## Prompt 2 — Email subject line *(considered, not shipped)*

I prototyped a second LLM call to generate a personalized email subject line for the audit report ("You're overspending on Cursor by $640/month" instead of "Your Veridex audit report"). Killed it before shipping.

**Why I dropped it:** The variance in subject lines was a deliverability risk. Email providers' spam filters look for consistent sender patterns; a different subject every time, especially one that mentions money, would have tanked my open rates on day one. The static subject "Your Veridex audit report" is boring but reliable. If I ship this for real, I'd A/B test 3–5 hand-written variants before letting a model generate them per-user.

---

## Development-time prompting (how I used Claude/Cave to build this)

I used Cave (a Claude-based coding agent) heavily during development. A few patterns that worked, and a few that didn't.

### What worked

- **"Read before you edit" framing.** When asking the agent to change something, I'd prefix with "Read `lib/audit-engine.js` first, then propose the change." Without this, the agent would sometimes generate code based on what the filename *suggested* the file contained, not what was actually in it.
- **Constraint-first prompts.** Instead of "build a form component", I'd write "build a form component that — uses only Tailwind, has no external validation library, posts to `/api/audit`, and shows inline errors". The fewer ambiguous decisions left to the model, the closer the output was to what I wanted.
- **Asking for *the smallest* change.** "Change only the function that computes monthly savings. Don't touch the recommendation logic." This stopped the well-meaning refactors that would otherwise show up in the diff.

### What didn't work

- **Vague critique loops.** Asking "is this code good?" produced opinion soup. Asking "find three concrete bugs in this function or say there are none" produced actionable output.
- **Generating tests after the fact.** I asked the agent to write tests for `runAudit()` mid-week. The tests it wrote passed because they re-implemented the same logic, then asserted the function matched its own output. Tautological. I scrapped them. (No automated tests in the final repo for this reason. Not proud of that — listed as a known gap in DEVLOG.)
- **Letting the agent pick the stack.** Early on I asked "what's the best way to add a database to this Next.js project?" The answer was correct but generic (it listed 5 options). I should have decided first and then asked for execution. Cave/Claude are much better at executing decisions than making them.

### One prompt I reused a lot, almost verbatim

When stuck on a bug:

> Here's the file. Here's the input I'm passing. Here's what I expect. Here's what I'm actually getting. **Don't fix it yet** — first tell me where you think the bug is, in one sentence. Then I'll decide whether to have you fix it.

The "don't fix it yet" part is what made it useful. Otherwise the agent would silently patch the wrong thing and I'd be debugging the fix instead of the original bug.

---

## Summary

- **One** LLM call in production: the audit summary narrative.
- **Deterministic code** owns every number, rule, and recommendation. The model only writes prose.
- **Templates** are the fallback, not a degraded experience — they cover the same facts in fixed grammar.
- **The hard part of the prompt** wasn't getting good output; it was getting *consistent* output across the long tail of weird inputs.
- I trust the model with words. I don't trust it with arithmetic. That split shows up in every choice I made.
