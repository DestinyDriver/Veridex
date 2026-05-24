import { AI_TOOLS, CREDEX_DISCOUNT_RATE } from "./pricing-data";

/**
 * Core audit engine. Takes user tool entries and returns recommendations.
 * Pure logic — no AI, no API calls. Deterministic and testable.
 */

// Tools that overlap in function — paying for multiple is wasteful
const CODING_TOOLS = ["cursor", "github_copilot", "windsurf"];
const GENERAL_AI = ["claude", "chatgpt", "gemini"];

// Plan downgrade thresholds: if team size <= threshold, the plan is overkill
const PLAN_THRESHOLDS = {
  cursor: {
    enterprise: { maxTeam: 50, suggest: "business", reason: "Enterprise features (SSO, audit logs) rarely needed under 50 seats" },
    business: { maxTeam: 1, suggest: "pro", reason: "Business plan admin features unnecessary for solo developers" },
  },
  github_copilot: {
    enterprise: { maxTeam: 30, suggest: "business", reason: "Enterprise features (IP indemnity, policy controls) are overkill for teams under 30" },
    business: { maxTeam: 1, suggest: "individual", reason: "Business plan management features unnecessary for individuals" },
  },
  claude: {
    enterprise: { maxTeam: 20, suggest: "team", reason: "Enterprise pricing matches Team for small orgs — negotiate or downgrade" },
    max: { maxTeam: 5, suggest: "pro", reason: "Max tier ($100/mo) 5x Pro cost — most teams don't need the higher rate limits" },
    team: { maxTeam: 1, suggest: "pro", reason: "Team plan admin features unnecessary for solo users" },
  },
  chatgpt: {
    enterprise: { maxTeam: 20, suggest: "team", reason: "Enterprise SSO/compliance rarely justified under 20 seats" },
    team: { maxTeam: 1, suggest: "plus", reason: "Team workspace features unnecessary for individuals" },
  },
  gemini: {
    ultra: { maxTeam: 10, suggest: "pro", reason: "Ultra ($250/mo) is 12.5x Pro — justified only for heavy research/enterprise use" },
  },
  windsurf: {
    team: { maxTeam: 1, suggest: "pro", reason: "Team plan admin features unnecessary for solo developers" },
  },
};

// Best-in-class tool recommendations by use case
const USE_CASE_RECOMMENDATIONS = {
  coding: {
    preferred: "cursor",
    preferredPlan: "pro",
    reason: "Cursor Pro at $20/mo is the most capable coding AI assistant",
  },
  writing: {
    preferred: "claude",
    preferredPlan: "pro",
    reason: "Claude Pro excels at long-form writing and nuanced content",
  },
  data: {
    preferred: "chatgpt",
    preferredPlan: "plus",
    reason: "ChatGPT Plus with Code Interpreter is strongest for data analysis",
  },
  research: {
    preferred: "claude",
    preferredPlan: "pro",
    reason: "Claude Pro handles long documents and research synthesis best",
  },
  mixed: {
    preferred: "claude",
    preferredPlan: "pro",
    reason: "Claude Pro offers the best general-purpose AI at a competitive price",
  },
};

export function runAudit(toolEntries, teamSize, useCase) {
  const recommendations = [];
  let totalMonthlySavings = 0;

  for (const entry of toolEntries) {
    const toolDef = AI_TOOLS[entry.toolId];
    if (!toolDef) continue;

    const planDef = toolDef.plans[entry.planId];
    if (!planDef) continue;

    const seats = entry.seats || 1;
    const currentMonthly = entry.monthlySpend || (planDef.price ? planDef.price * seats : 0);

    const rec = {
      toolId: entry.toolId,
      toolName: toolDef.name,
      planName: planDef.name,
      currentMonthly,
      seats,
      actions: [],
      totalSavings: 0,
    };

    // 1. Check if plan is overkill for team size
    const thresholds = PLAN_THRESHOLDS[entry.toolId];
    if (thresholds && thresholds[entry.planId]) {
      const t = thresholds[entry.planId];
      if (teamSize <= t.maxTeam) {
        const suggestedPlan = toolDef.plans[t.suggest];
        if (suggestedPlan && suggestedPlan.price !== null) {
          const newCost = suggestedPlan.price * seats;
          const savings = currentMonthly - newCost;
          if (savings > 0) {
            rec.actions.push({
              type: "downgrade",
              action: `Downgrade to ${suggestedPlan.name}`,
              reason: t.reason,
              savings,
              suggestedPlan: t.suggest,
              suggestedPlanName: suggestedPlan.name,
              newMonthly: newCost,
            });
          }
        }
      }
    }

    // 2. Check for idle seat waste (heuristic: if seats > teamSize, excess seats are idle)
    if (seats > teamSize && planDef.price) {
      const idleSeats = seats - teamSize;
      const idleSavings = planDef.price * idleSeats;
      rec.actions.push({
        type: "idle_seats",
        action: `Remove ${idleSeats} idle seat${idleSeats > 1 ? "s" : ""}`,
        reason: `You're paying for ${seats} seats but your team is ${teamSize} — ${idleSeats} seat${idleSeats > 1 ? "s" : ""} appear unused`,
        savings: idleSavings,
        idleSeats,
      });
    }

    // 3. Credex discount opportunity (retail → discounted credits)
    if (currentMonthly > 0 && planDef.price) {
      const credexSavings = Math.round(currentMonthly * CREDEX_DISCOUNT_RATE);
      rec.actions.push({
        type: "credex",
        action: "Purchase through Credex credits",
        reason: `Credex offers ~${Math.round(CREDEX_DISCOUNT_RATE * 100)}% savings on ${toolDef.name} through discounted infrastructure credits`,
        savings: credexSavings,
        newMonthly: currentMonthly - credexSavings,
      });
    }

    // Pick the highest-savings action as primary
    rec.actions.sort((a, b) => b.savings - a.savings);
    rec.totalSavings = rec.actions.length > 0 ? rec.actions[0].savings : 0;
    rec.primaryAction = rec.actions[0] || null;
    totalMonthlySavings += rec.totalSavings;

    recommendations.push(rec);
  }

  // 4. Check for duplicate tools in same category
  const duplicates = findDuplicateTools(toolEntries);

  // 5. Check for use-case mismatch
  const useCaseTip = USE_CASE_RECOMMENDATIONS[useCase];

  const isOptimal = totalMonthlySavings < 100;
  const highSavings = totalMonthlySavings >= 500;

  return {
    recommendations,
    duplicates,
    useCaseTip,
    totalMonthlySavings: Math.round(totalMonthlySavings),
    totalAnnualSavings: Math.round(totalMonthlySavings * 12),
    isOptimal,
    highSavings,
    teamSize,
    useCase,
    toolCount: toolEntries.length,
    auditedAt: new Date().toISOString(),
  };
}

function findDuplicateTools(entries) {
  const codingTools = entries.filter((e) => CODING_TOOLS.includes(e.toolId));
  const generalTools = entries.filter((e) => GENERAL_AI.includes(e.toolId));
  const duplicates = [];

  if (codingTools.length > 1) {
    const names = codingTools.map((e) => AI_TOOLS[e.toolId].name);
    const totalSpend = codingTools.reduce((sum, e) => {
      const plan = AI_TOOLS[e.toolId].plans[e.planId];
      return sum + (e.monthlySpend || (plan?.price || 0) * (e.seats || 1));
    }, 0);

    duplicates.push({
      category: "Coding AI Assistants",
      tools: names,
      recommendation: `You're paying for ${names.join(", ")} — these tools overlap significantly. Consider consolidating to one.`,
      potentialSavings: Math.round(totalSpend * 0.4),
    });
  }

  if (generalTools.length > 2) {
    const names = generalTools.map((e) => AI_TOOLS[e.toolId].name);
    duplicates.push({
      category: "General AI Assistants",
      tools: names,
      recommendation: `Running ${names.join(", ")} simultaneously. Most teams can consolidate to 1-2 general AI tools.`,
      potentialSavings: 0,
    });
  }

  return duplicates;
}

export function generateFallbackSummary(results) {
  const { totalMonthlySavings, totalAnnualSavings, recommendations, teamSize, isOptimal, highSavings, duplicates } = results;

  if (isOptimal) {
    return `Your AI tool stack is well-optimized. Across ${recommendations.length} tool${recommendations.length > 1 ? "s" : ""} for a team of ${teamSize}, we found minimal savings opportunities (${formatCurrency(totalMonthlySavings)}/mo). Your current plans are appropriately sized for your usage. We'll notify you when new optimization opportunities arise — pricing changes frequently in this market.`;
  }

  const topRec = recommendations.filter((r) => r.totalSavings > 0).sort((a, b) => b.totalSavings - a.totalSavings)[0];
  const dupWarning = duplicates.length > 0 ? ` We also noticed overlapping tools in ${duplicates[0].category.toLowerCase()} — consolidating could save more.` : "";

  if (highSavings) {
    return `Your team of ${teamSize} is spending significantly more than necessary on AI tools. We identified ${formatCurrency(totalMonthlySavings)}/mo in potential savings (${formatCurrency(totalAnnualSavings)}/year). The biggest opportunity: ${topRec.toolName} — ${topRec.primaryAction.action.toLowerCase()}, saving ${formatCurrency(topRec.totalSavings)}/mo.${dupWarning} With savings this substantial, Credex can help you capture even more through discounted infrastructure credits.`;
  }

  return `Across ${recommendations.length} AI tool${recommendations.length > 1 ? "s" : ""}, we found ${formatCurrency(totalMonthlySavings)}/mo in potential savings (${formatCurrency(totalAnnualSavings)}/year) for your ${teamSize}-person team. The top recommendation: ${topRec.toolName} — ${topRec.primaryAction.action.toLowerCase()}.${dupWarning} Small optimizations add up — these changes could save your team ${formatCurrency(totalAnnualSavings)} annually.`;
}

function formatCurrency(amount) {
  return "$" + amount.toLocaleString("en-US");
}
