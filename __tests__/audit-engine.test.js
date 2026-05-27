import { describe, it, expect } from "vitest";
import { runAudit, generateFallbackSummary } from "../lib/audit-engine.js";

// ─────────────────────────────────────────────────────────────
// Test 1 — Plan downgrade: Cursor Ultra → Pro for small teams
// ─────────────────────────────────────────────────────────────
describe("audit engine — downgrade rules", () => {
  it("recommends downgrading Cursor Ultra to Pro for a small team", () => {
    const entries = [{ toolId: "cursor", planId: "ultra", seats: 10 }];
    const result = runAudit(entries, 10, "coding");

    const rec = result.recommendations[0];
    expect(rec.toolName).toBe("Cursor");
    expect(rec.plan).toBe("Ultra");
    expect(rec.recommended).toBe("Pro");
    // Ultra $200/seat * 10 = $2000, Pro $20/seat * 10 = $200 → save $1800
    expect(rec.youSave).toBe(1800);
    expect(result.totalMonthlySavings).toBe(1800);
    expect(result.totalAnnualSavings).toBe(21600);
  });
});

// ─────────────────────────────────────────────────────────────
// Test 2 — Already-optimised stack reports no savings
// ─────────────────────────────────────────────────────────────
describe("audit engine — optimal stacks", () => {
  it("marks a sensible Pro-tier stack as already optimised", () => {
    const entries = [
      { toolId: "cursor", planId: "pro", seats: 5 },
    ];
    const result = runAudit(entries, 5, "coding");

    expect(result.totalMonthlySavings).toBe(0);
    expect(result.recommendations[0].isOptimized).toBe(true);
    expect(result.isOptimal).toBe(true);
    expect(result.highSavings).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// Test 3 — Coding-tool overlap triggers a cancellation
// ─────────────────────────────────────────────────────────────
describe("audit engine — overlap / consolidation", () => {
  it("recommends cancelling Copilot when Cursor is already on the stack (coding use case)", () => {
    const entries = [
      { toolId: "cursor", planId: "pro", seats: 8 },
      { toolId: "github_copilot", planId: "business", seats: 8 },
    ];
    const result = runAudit(entries, 8, "coding");

    const copilot = result.recommendations.find(
      (r) => r.toolId === "github_copilot"
    );
    expect(copilot).toBeDefined();
    expect(copilot.recommended).toBe("Cancel");
    // Copilot Business $19 * 8 = $152
    expect(copilot.youSave).toBe(152);
    expect(copilot.why).toMatch(/Cursor|overlap|consolidate/i);
  });
});

// ─────────────────────────────────────────────────────────────
// Test 4 — Idle-seat detection
// ─────────────────────────────────────────────────────────────
describe("audit engine — idle seat detection", () => {
  it("flags idle seats when seat count moderately exceeds team size", () => {
    // 10 seats provisioned, team of 6 → 4 idle seats
    const entries = [{ toolId: "cursor", planId: "pro", seats: 10 }];
    const result = runAudit(entries, 6, "coding");

    const rec = result.recommendations[0];
    expect(rec.recommended).toContain("reduce to 6 seats");
    // 4 idle * $20/seat = $80/mo
    expect(rec.youSave).toBe(80);
    expect(rec.why).toMatch(/idle/i);
  });

  it("does NOT flag idle seats when seat count vastly exceeds team size (org-wide deployment)", () => {
    // 100 seats provisioned, team of 10 → likely org-wide, do not flag
    const entries = [{ toolId: "chatgpt", planId: "team", seats: 100 }];
    const result = runAudit(entries, 10, "writing");

    const rec = result.recommendations[0];
    expect(rec.youSave).toBe(0);
    expect(rec.isOptimized).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
// Test 5 — Aggregate math + reporting flags
// ─────────────────────────────────────────────────────────────
describe("audit engine — aggregates", () => {
  it("computes totals, percent reduction, and highSavings flag correctly", () => {
    const entries = [
      { toolId: "cursor", planId: "ultra", seats: 5 },   // $1000, downgrade to Pro $100
      { toolId: "claude", planId: "max20x", seats: 3 },  // $600, downgrade to Pro $60
    ];
    const result = runAudit(entries, 5, "coding");

    // Current: 1000 + 600 = 1600
    expect(result.totalCurrentSpend).toBe(1600);
    // Savings: (1000 - 100) + (600 - 60) = 900 + 540 = 1440
    expect(result.totalMonthlySavings).toBe(1440);
    expect(result.totalAnnualSavings).toBe(17280);
    expect(result.totalRecommendedSpend).toBe(160);
    expect(result.percentReduction).toBe(90);
    expect(result.highSavings).toBe(true);
    expect(result.isOptimal).toBe(false);
    expect(result.toolCount).toBe(2);
  });

  it("never returns negative savings even on a contrived under-spend", () => {
    // Pro plan, only 1 seat, on a 5-person team → no downgrade applies,
    // no idle seats. Should land as optimised with zero savings, not negative.
    const entries = [{ toolId: "cursor", planId: "pro", seats: 1 }];
    const result = runAudit(entries, 5, "coding");

    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(0);
    expect(result.recommendations.every((r) => r.youSave >= 0)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
// Test 6 — Fallback summary is deterministic and mentions key numbers
// ─────────────────────────────────────────────────────────────
describe("audit engine — fallback summary", () => {
  it("produces a non-empty summary that includes the savings figure for non-optimal stacks", () => {
    const entries = [{ toolId: "cursor", planId: "ultra", seats: 10 }];
    const results = runAudit(entries, 10, "coding");
    const summary = generateFallbackSummary(results);

    expect(typeof summary).toBe("string");
    expect(summary.length).toBeGreaterThan(40);
    // Engine formats numbers with toLocaleString (e.g. 1800 -> "1,800")
    expect(summary).toContain(results.totalMonthlySavings.toLocaleString("en-US"));
  });

  it("produces an 'already optimised' summary when there are no savings", () => {
    const entries = [{ toolId: "cursor", planId: "pro", seats: 3 }];
    const results = runAudit(entries, 3, "coding");
    const summary = generateFallbackSummary(results);

    expect(summary).toMatch(/optim/i);
  });
});
