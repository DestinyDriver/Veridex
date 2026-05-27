# Tests

Automated tests for the audit engine, the only piece of the codebase where correctness has a defensible source of truth (the pricing data + the downgrade rules). The marketing pages, form UI, and email templates are not unit-tested by design — visual review during the dev loop catches regressions there faster than tests would.

All tests live in [`__tests__/audit-engine.test.js`](./__tests__/audit-engine.test.js) and run against the **real** `lib/audit-engine.js` and `lib/pricing-data.js` — no mocks, no stubs. If the pricing data shifts and breaks an expected number, the test fails loudly, which is exactly what I want.

---

## How to run

```bash
# install once
npm install

# one-off run (what CI does)
npm test

# watch mode while developing
npm run test:watch
```

Test runner: **Vitest 4** (chosen over Jest because it understands Next.js's extensionless imports — `from "./pricing-data"` — out of the box, no transformer setup).

---

## What's covered

**File:** `__tests__/audit-engine.test.js` · **9 tests across 6 describe blocks**

| # | Describe block | Test name | What it locks down |
|---|---|---|---|
| 1 | `downgrade rules` | recommends downgrading Cursor Ultra to Pro for a small team | Plan-tier downgrade fires when team size falls under the `maxTeam` threshold; savings math is exact ($1,800/mo for 10 seats Ultra → Pro) |
| 2 | `optimal stacks` | marks a sensible Pro-tier stack as already optimised | A correctly-sized Pro plan returns `isOptimized: true`, `isOptimal: true`, zero savings — no manufactured recommendations |
| 3 | `overlap / consolidation` | recommends cancelling Copilot when Cursor is already on the stack (coding use case) | Overlap detection: two coding tools → engine picks one to keep, flags the other as `recommended: "Cancel"` with the correct savings figure |
| 4 | `idle seat detection` | flags idle seats when seat count moderately exceeds team size | 10 seats / team of 6 → flags 4 idle seats, $80/mo savings, message includes "idle" |
| 5 | `idle seat detection` | does NOT flag idle seats when seat count vastly exceeds team size (org-wide deployment) | 100 seats / team of 10 → engine treats this as an org-wide deployment and does **not** flag (prevents false positives for Google Workspace–style sprawl) |
| 6 | `aggregates` | computes totals, percent reduction, and highSavings flag correctly | End-to-end totals: `totalCurrentSpend`, `totalMonthlySavings`, `totalAnnualSavings`, `percentReduction`, `highSavings`, `toolCount`. Two-tool stack, all derived numbers exact. |
| 7 | `aggregates` | never returns negative savings even on a contrived under-spend | Engine clamps `youSave >= 0` per-recommendation — a property test, catches regressions from arithmetic refactors (this is the property the Day 5 bug violated) |
| 8 | `fallback summary` | produces a non-empty summary that includes the savings figure for non-optimal stacks | The template-mode fallback (used when `ANTHROPIC_API_KEY` is absent or the LLM call fails) renders a real paragraph containing the actual savings number formatted with `toLocaleString` |
| 9 | `fallback summary` | produces an 'already optimised' summary when there are no savings | Fallback branches correctly on `isOptimal` — different copy, no manufactured savings figure |

---

## Why these tests in particular

I picked tests against the **invariants** of the engine, not the surface API. The five things that have to be true no matter how the engine evolves:

1. **Downgrade triggers fire at the right thresholds** (Test 1) — the core business logic.
2. **Optimal stacks don't get fake recommendations** (Test 2) — the most embarrassing failure mode of a savings tool is telling users to "cancel" things they're already optimally using.
3. **Overlapping tools get consolidated, but only when there's a defensible reason** (Test 3) — protects the "logic must be defensible" criterion from the brief.
4. **Idle seats are detected without misfiring on org-wide deployments** (Tests 4 + 5) — the second-most-embarrassing failure mode.
5. **The aggregate math is exact, never negative** (Tests 6 + 7) — Test 7 in particular guards against the Day 5 per-seat split bug I describe in `REFLECTION.md`. It's a regression test for a specific failure I lived through.
6. **The fallback summary works when the LLM doesn't** (Tests 8 + 9) — the brief mandates graceful API-failure handling; this proves the fallback path is alive.

---

## What I deliberately didn't test

- **The Anthropic API call itself.** It's hit via `fetch` to an external service; the right place to test it is a mocked integration test, which I don't have. The fallback summary is tested instead, which is the only path the user actually sees if the API fails.
- **Email sending (`lib/resend.js`).** Same reasoning — external service, no mocks.
- **Supabase persistence (`lib/store.js`).** The in-memory fallback would test trivially; the real Supabase path needs a test fixture I haven't built.
- **React components.** No component tests. At this stage the visual loop catches issues faster than RTL would.

These gaps are documented in `REFLECTION.md` and `DEVLOG.md` rather than hidden.

---

## CI

GitHub Actions runs `npm ci` → `npm run lint` → `npm test` on every push to `main`/`master` and every PR. Workflow file: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml). Latest run on `master` shows the green check next to the most recent commit on GitHub.
