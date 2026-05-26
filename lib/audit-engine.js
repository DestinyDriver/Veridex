import { AI_TOOLS, CREDEX_DISCOUNT_RATE } from "./pricing-data";

const CODING_TOOLS = ["cursor", "github_copilot", "windsurf", "replit"];
const GENERAL_AI = ["claude", "chatgpt", "gemini", "perplexity"];

// Plan downgrade rules: if team size <= maxTeam, the plan is overkill
const PLAN_THRESHOLDS = {
  cursor: {
    ultra: {
      maxTeam: 50,
      suggest: "pro",
      why: (seats, currentCost, newCost, savings) =>
        `Cursor Ultra ($200/seat) is designed for solo power users who need maximum AI request capacity. For a ${seats}-person team, Cursor Pro ($20/seat) provides the same core AI coding features at a team level. Saves $${savings.toLocaleString()}/mo.`,
    },
    proPlus: {
      maxTeam: 20,
      suggest: "pro",
      why: (seats, currentCost, newCost, savings) =>
        `Cursor Pro+ ($60/seat) offers higher rate limits, but most teams rarely hit Pro-tier limits. For a ${seats}-person team, Pro ($20/seat) delivers the same core coding features. Saves $${savings.toLocaleString()}/mo.`,
    },
    enterprise: {
      maxTeam: 50,
      suggest: "business",
      why: (seats, currentCost, newCost, savings) =>
        `Enterprise features (SSO, audit logs, dedicated support) are rarely needed under 50 seats. The Business plan provides identical coding capabilities with standard admin controls. Saves $${savings.toLocaleString()}/mo.`,
    },
    business: {
      maxTeam: 1,
      suggest: "pro",
      why: (seats, currentCost, newCost, savings) =>
        `Business plan admin and team management features are unnecessary for solo developers. Pro provides the same AI coding experience at a lower price. Saves $${savings.toLocaleString()}/mo.`,
    },
  },
  github_copilot: {
    enterprise: {
      maxTeam: 30,
      suggest: "business",
      why: (seats, currentCost, newCost, savings) =>
        `Enterprise features (IP indemnity, policy controls, SAML SSO) are overkill for teams under 30. The Business plan covers core autocomplete and chat needs. Saves $${savings.toLocaleString()}/mo.`,
    },
    proPlus: {
      maxTeam: 10,
      suggest: "pro",
      why: (seats, currentCost, newCost, savings) =>
        `Copilot Pro+ ($39/seat) provides access to additional models, but Pro ($10/seat) covers core autocomplete and chat for most development workflows. Saves $${savings.toLocaleString()}/mo.`,
    },
    business: {
      maxTeam: 1,
      suggest: "pro",
      why: (seats, currentCost, newCost, savings) =>
        `Business plan management features are unnecessary for individual developers. The Pro plan provides full Copilot capabilities. Saves $${savings.toLocaleString()}/mo.`,
    },
  },
  claude: {
    enterprise: {
      maxTeam: 20,
      suggest: "team",
      why: (seats, currentCost, newCost, savings) =>
        `Enterprise pricing matches Team-tier features for organisations under 20 seats. Negotiate a volume discount or downgrade to Team to save $${savings.toLocaleString()}/mo without losing functionality.`,
    },
    max20x: {
      maxTeam: 5,
      suggest: "pro",
      why: (seats, currentCost, newCost, savings) =>
        `Max 20x ($200/mo per seat) provides 20x the usage limits of Pro. For a ${seats}-person team, this level of throughput is rarely needed. Downgrading to Pro ($20/seat) saves $${savings.toLocaleString()}/mo.`,
    },
    max5x: {
      maxTeam: 10,
      suggest: "pro",
      why: (seats, currentCost, newCost, savings) =>
        `Max 5x ($100/mo per seat) is 5x the cost of Pro. Most teams don't sustain usage that justifies the higher rate limits. Downgrading to Pro saves $${savings.toLocaleString()}/mo.`,
    },
    team: {
      maxTeam: 1,
      suggest: "pro",
      why: (seats, currentCost, newCost, savings) =>
        `Team plan workspace and admin features are unnecessary for solo users. Pro provides the same Claude models and capabilities. Saves $${savings.toLocaleString()}/mo.`,
    },
  },
  chatgpt: {
    enterprise: {
      maxTeam: 20,
      suggest: "team",
      why: (seats, currentCost, newCost, savings) =>
        `Enterprise SSO, compliance, and admin features are rarely justified under 20 seats. The Team plan provides the same GPT-4 access and workspace tools. Saves $${savings.toLocaleString()}/mo.`,
    },
    team: {
      maxTeam: 1,
      suggest: "plus",
      why: (seats, currentCost, newCost, savings) =>
        `Team workspace and collaboration features are unnecessary for individuals. The Plus plan provides the same model access. Saves $${savings.toLocaleString()}/mo.`,
    },
  },
  gemini: {
    ultra: {
      maxTeam: 10,
      suggest: "pro",
      why: (seats, currentCost, newCost, savings) =>
        `Gemini Ultra ($250/mo) is 12.5x the cost of Pro and is justified only for heavy enterprise research. Pro covers most team needs. Saves $${savings.toLocaleString()}/mo.`,
    },
  },
  windsurf: {
    team: {
      maxTeam: 1,
      suggest: "pro",
      why: (seats, currentCost, newCost, savings) =>
        `Team plan admin features are unnecessary for solo developers. Pro provides the same AI coding features. Saves $${savings.toLocaleString()}/mo.`,
    },
  },
  perplexity: {
    enterprise: {
      maxTeam: 10,
      suggest: "pro",
      why: (seats, currentCost, newCost, savings) =>
        `Enterprise features are overkill for teams under 10. Pro covers all research and search capabilities. Saves $${savings.toLocaleString()}/mo.`,
    },
  },
  midjourney: {
    pro: {
      maxTeam: 3,
      suggest: "standard",
      why: (seats, currentCost, newCost, savings) =>
        `Pro ($60/mo) relax mode and stealth features are rarely needed for small teams. Standard provides ample generation capacity. Saves $${savings.toLocaleString()}/mo.`,
    },
    standard: {
      maxTeam: 1,
      suggest: "basic",
      why: (seats, currentCost, newCost, savings) =>
        `Standard ($30/mo) is excessive for individual or light use. Basic covers most generation needs. Saves $${savings.toLocaleString()}/mo.`,
    },
  },
  replit: {
    teams: {
      maxTeam: 3,
      suggest: "core",
      why: (seats, currentCost, newCost, savings) =>
        `Teams plan ($40/seat) management features are unnecessary for small groups. Core provides the same coding environment. Saves $${savings.toLocaleString()}/mo.`,
    },
  },
};

// Use-case-aware cancellation reasoning: which tool to keep, why to cancel others
const CONSOLIDATION_RULES = {
  coding: {
    preferredCoding: "cursor",
    preferredGeneral: "claude",
    cancelReasons: {
      chatgpt: (toolName, currentCost) =>
        `Claude and ChatGPT cover identical use cases for Coding workflows. Maintaining premium subscriptions to both is redundant. Claude benchmarks higher on coding and reasoning tasks — standardise on Claude and cancel ChatGPT. Saves $${currentCost.toLocaleString()}/mo.`,
      windsurf: (toolName, currentCost) =>
        `Cursor and Windsurf are both full-featured AI code editors with native autocomplete, agentic coding, and in-editor chat. A developer uses one editor at a time. Standardise on Cursor and cancel Windsurf. Saves $${currentCost.toLocaleString()}/mo.`,
      github_copilot: (toolName, currentCost) =>
        `Cursor already bundles advanced AI autocomplete and chat natively — capabilities that overlap entirely with GitHub Copilot. Running Copilot alongside Cursor is duplicate spend. Saves $${currentCost.toLocaleString()}/mo.`,
      replit: (toolName, currentCost) =>
        `Cursor provides a superior AI-native coding experience. Replit's coding features overlap significantly, making it redundant when Cursor is the primary editor. Saves $${currentCost.toLocaleString()}/mo.`,
      perplexity: (toolName, currentCost) =>
        `For coding-focused teams, Perplexity's research features are redundant when Claude and Cursor are available. Cancel to reduce spend. Saves $${currentCost.toLocaleString()}/mo.`,
    },
  },
  writing: {
    preferredCoding: "cursor",
    preferredGeneral: "claude",
    cancelReasons: {
      chatgpt: (toolName, currentCost) =>
        `Claude outperforms ChatGPT on long-form writing, nuanced editorial, and content tasks. Maintaining both is redundant — standardise on Claude. Saves $${currentCost.toLocaleString()}/mo.`,
      windsurf: (toolName, currentCost) =>
        `Windsurf is a coding-focused editor. For writing workflows, it provides no unique value. Cancel to reduce spend. Saves $${currentCost.toLocaleString()}/mo.`,
      github_copilot: (toolName, currentCost) =>
        `GitHub Copilot is a code-only tool. For writing-focused teams, it provides no value. Saves $${currentCost.toLocaleString()}/mo.`,
    },
  },
  data: {
    preferredCoding: "cursor",
    preferredGeneral: "chatgpt",
    cancelReasons: {
      claude: (toolName, currentCost) =>
        `For data analysis workflows, ChatGPT Plus with Code Interpreter provides stronger data visualisation and analysis. Claude's strengths don't justify the overlap. Saves $${currentCost.toLocaleString()}/mo.`,
      windsurf: (toolName, currentCost) =>
        `Windsurf overlaps with Cursor for code editing. Consolidate to one editor. Saves $${currentCost.toLocaleString()}/mo.`,
      github_copilot: (toolName, currentCost) =>
        `Cursor already bundles autocomplete and chat natively. Running Copilot alongside is duplicate spend. Saves $${currentCost.toLocaleString()}/mo.`,
    },
  },
  research: {
    preferredCoding: "cursor",
    preferredGeneral: "claude",
    cancelReasons: {
      chatgpt: (toolName, currentCost) =>
        `Claude handles longer documents and produces more thorough research synthesis than ChatGPT. Consolidate research workflows to Claude. Saves $${currentCost.toLocaleString()}/mo.`,
      windsurf: (toolName, currentCost) =>
        `Windsurf is a code editor, not a research tool. Cancel to reduce spend. Saves $${currentCost.toLocaleString()}/mo.`,
      github_copilot: (toolName, currentCost) =>
        `GitHub Copilot provides no research value. Cancel to reduce spend. Saves $${currentCost.toLocaleString()}/mo.`,
    },
  },
  mixed: {
    preferredCoding: "cursor",
    preferredGeneral: "claude",
    cancelReasons: {
      chatgpt: (toolName, currentCost) =>
        `Claude and ChatGPT serve overlapping general-purpose use cases. Claude benchmarks higher on reasoning and coding — standardise on Claude and cancel ChatGPT to reduce redundant spend. Saves $${currentCost.toLocaleString()}/mo.`,
      windsurf: (toolName, currentCost) =>
        `Cursor and Windsurf are both full-featured AI code editors. A developer uses one editor at a time. Standardise on Cursor and cancel Windsurf. Saves $${currentCost.toLocaleString()}/mo.`,
      github_copilot: (toolName, currentCost) =>
        `Cursor already bundles advanced AI autocomplete and chat natively — capabilities that overlap entirely with GitHub Copilot. Cancel to eliminate duplicate spend. Saves $${currentCost.toLocaleString()}/mo.`,
      replit: (toolName, currentCost) =>
        `Cursor provides a superior coding experience. Replit's features overlap significantly. Saves $${currentCost.toLocaleString()}/mo.`,
    },
  },
  creative: {
    preferredCoding: "cursor",
    preferredGeneral: "claude",
    cancelReasons: {
      chatgpt: (toolName, currentCost) =>
        `Claude is stronger for creative ideation and writing. ChatGPT provides overlapping capabilities — consolidate to Claude. Saves $${currentCost.toLocaleString()}/mo.`,
    },
  },
  support: {
    preferredCoding: "cursor",
    preferredGeneral: "claude",
    cancelReasons: {
      chatgpt: (toolName, currentCost) =>
        `Claude produces more nuanced and brand-safe responses for customer support workflows. Maintaining both is redundant. Saves $${currentCost.toLocaleString()}/mo.`,
    },
  },
  ops: {
    preferredCoding: "cursor",
    preferredGeneral: "chatgpt",
    cancelReasons: {
      claude: (toolName, currentCost) =>
        `For operations workflows, ChatGPT's broad tool integrations cover most needs. Claude provides overlapping capabilities. Saves $${currentCost.toLocaleString()}/mo.`,
    },
  },
};

// Advisory "why" text for optimized tools (no savings, but still contextual)
function getOptimizedWhy(toolId, toolName, planName, seats, currentCost, useCase, allEntries) {
  const hasCursor = allEntries.some((e) => e.toolId === "cursor");
  const hasClaude = allEntries.some((e) => e.toolId === "claude");

  if (toolId === "claude" && hasCursor && (useCase === "coding" || useCase === "mixed")) {
    return `Claude is useful for general queries, but note that Cursor already embeds Claude natively for in-editor coding assistance. If your team uses Claude exclusively for coding, consider whether the standalone subscription adds value beyond what Cursor already provides.`;
  }
  if (toolId === "chatgpt" && hasClaude) {
    return `ChatGPT and Claude serve overlapping use cases. Monitor usage to ensure both are actively used. If utilisation drops, consider consolidating.`;
  }
  if (toolId === "gemini" && seats > 20) {
    return `${toolName} spend is fully optimised for your current setup.`;
  }
  if (toolId === "perplexity") {
    return `Perplexity provides unique web-search-grounded answers. Spend is appropriate if your team relies on it for research.`;
  }
  return `${toolName} spend is fully optimised for your current setup.`;
}

export function runAudit(toolEntries, teamSize, useCase) {
  const recommendations = [];
  let totalCurrentSpend = 0;

  // Step 1: determine which tools to cancel (overlap / duplicate)
  const cancelTargets = determineCancellations(toolEntries, teamSize, useCase);

  // Step 2: process each tool entry
  for (const entry of toolEntries) {
    const toolDef = AI_TOOLS[entry.toolId];
    if (!toolDef) continue;
    const planDef = toolDef.plans[entry.planId];
    if (!planDef) continue;

    const seats = entry.seats || 1;
    const currentMonthly =
      entry.monthlySpend || (planDef.price ? planDef.price * seats : 0);
    totalCurrentSpend += currentMonthly;

    const rec = {
      toolId: entry.toolId,
      toolName: toolDef.name,
      plan: planDef.name,
      seats,
      currentMonthly,
      recommended: planDef.name, // default: keep same plan
      youSave: 0,
      isOptimized: false,
      why: "",
    };

    // ── CANCEL (overlap) ────────────────────────────────────
    const cancelInfo = cancelTargets.get(entry.toolId);
    if (cancelInfo) {
      rec.recommended = "Cancel";
      rec.youSave = currentMonthly;
      rec.why = cancelInfo.reason;
      recommendations.push(rec);
      continue;
    }

    // ── DOWNGRADE (plan overkill) ───────────────────────────
    const thresholds = PLAN_THRESHOLDS[entry.toolId];
    let wasDowngraded = false;
    if (thresholds && thresholds[entry.planId]) {
      const t = thresholds[entry.planId];
      if (teamSize <= t.maxTeam) {
        const suggestedPlan = toolDef.plans[t.suggest];
        if (suggestedPlan && suggestedPlan.price !== null) {
          const newCost = suggestedPlan.price * seats;
          const savings = currentMonthly - newCost;
          if (savings > 0) {
            rec.recommended = suggestedPlan.name;
            rec.youSave = savings;
            rec.why = t.why(seats, currentMonthly, newCost, savings);
            wasDowngraded = true;
          }
        }
      }
    }

    // ── IDLE SEATS ──────────────────────────────────────────
    // Only flag idle seats when seats moderately exceed team size.
    // If seats > 3x teamSize, it's likely an org-wide deployment
    // (e.g. Google Workspace for 98 people on a 10-person team audit)
    // and should not be flagged.
    if (!wasDowngraded && seats > teamSize && seats <= teamSize * 3 && planDef.price) {
      const idleSeats = seats - teamSize;
      const savings = planDef.price * idleSeats;
      rec.recommended = `${planDef.name} (reduce to ${teamSize} seats)`;
      rec.youSave = savings;
      rec.why = `You're paying for ${seats} seats but your team is ${teamSize}. ${idleSeats} seat${idleSeats > 1 ? "s are" : " is"} idle. Remove unused seats to save $${savings.toLocaleString()}/mo.`;
    }

    // ── OPTIMIZED ───────────────────────────────────────────
    if (rec.youSave === 0) {
      rec.isOptimized = true;
      rec.why = getOptimizedWhy(
        entry.toolId,
        toolDef.name,
        planDef.name,
        seats,
        currentMonthly,
        useCase,
        toolEntries
      );
    }

    recommendations.push(rec);
  }

  // Sort: biggest savings first, optimized last
  recommendations.sort((a, b) => {
    if (a.isOptimized && !b.isOptimized) return 1;
    if (!a.isOptimized && b.isOptimized) return -1;
    return b.youSave - a.youSave;
  });

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.youSave,
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;
  const totalRecommendedSpend = totalCurrentSpend - totalMonthlySavings;
  const percentReduction =
    totalCurrentSpend > 0
      ? Math.round((totalMonthlySavings / totalCurrentSpend) * 100)
      : 0;

  const isOptimal = totalMonthlySavings < 100;
  const highSavings = totalMonthlySavings >= 500;

  const nextSteps = generateNextSteps(recommendations);

  return {
    recommendations,
    totalMonthlySavings: Math.round(totalMonthlySavings),
    totalAnnualSavings: Math.round(totalAnnualSavings),
    totalCurrentSpend: Math.round(totalCurrentSpend),
    totalRecommendedSpend: Math.round(totalRecommendedSpend),
    percentReduction,
    isOptimal,
    highSavings,
    teamSize,
    useCase,
    toolCount: toolEntries.length,
    nextSteps,
    auditedAt: new Date().toISOString(),
  };
}

// ─── Cancellation logic ─────────────────────────────────────

function determineCancellations(entries, teamSize, useCase) {
  const cancelTargets = new Map();
  const rules = CONSOLIDATION_RULES[useCase] || CONSOLIDATION_RULES.mixed;

  const codingEntries = entries.filter((e) => CODING_TOOLS.includes(e.toolId));
  const generalEntries = entries.filter((e) => GENERAL_AI.includes(e.toolId));

  // ── Coding tools: keep preferred, cancel the rest ─────────
  if (codingEntries.length > 1) {
    const preferred = rules.preferredCoding || "cursor";
    const hasPreferred = codingEntries.some((e) => e.toolId === preferred);
    const keepTool = hasPreferred ? preferred : codingEntries[0].toolId;

    for (const entry of codingEntries) {
      if (entry.toolId === keepTool) continue;
      const cost = getEntryCost(entry);
      const reasonFn = rules.cancelReasons?.[entry.toolId];
      const reason = reasonFn
        ? reasonFn(AI_TOOLS[entry.toolId].name, cost)
        : `${AI_TOOLS[entry.toolId].name} overlaps significantly with ${AI_TOOLS[keepTool].name}. Consolidate to one coding tool. Saves $${cost.toLocaleString()}/mo.`;
      cancelTargets.set(entry.toolId, { reason, consolidateTo: keepTool });
    }
  }

  // ── General AI: only cancel tools we have specific reasons for ─
  // Don't blindly cancel — only cancel if:
  //   1. There are >1 general AI tools AND
  //   2. We have a specific cancelReason for that tool AND
  //   3. The tool isn't an org-wide deployment (seats >> teamSize)
  if (generalEntries.length > 1) {
    const preferred = rules.preferredGeneral || "claude";

    for (const entry of generalEntries) {
      if (entry.toolId === preferred) continue;

      // Skip org-wide deployments — seats far exceeding team size
      // indicates this tool serves the broader org, not just this team
      const seats = entry.seats || 1;
      if (seats > teamSize * 3) continue;

      const reasonFn = rules.cancelReasons?.[entry.toolId];
      if (!reasonFn) continue; // No specific reason → don't cancel

      const cost = getEntryCost(entry);
      cancelTargets.set(entry.toolId, {
        reason: reasonFn(AI_TOOLS[entry.toolId].name, cost),
        consolidateTo: preferred,
      });
    }
  }

  return cancelTargets;
}

function getEntryCost(entry) {
  const toolDef = AI_TOOLS[entry.toolId];
  if (!toolDef) return 0;
  const planDef = toolDef.plans[entry.planId];
  if (!planDef) return 0;
  return entry.monthlySpend || (planDef.price ? planDef.price * (entry.seats || 1) : 0);
}

// ─── Next steps ─────────────────────────────────────────────

function generateNextSteps(recommendations) {
  const steps = [];
  const hasCancels = recommendations.some((r) => r.recommended === "Cancel");
  const hasDowngrades = recommendations.some(
    (r) => !r.isOptimized && r.recommended !== "Cancel" && r.youSave > 0
  );

  if (hasCancels || hasDowngrades) {
    steps.push("Cancel or downgrade flagged tools immediately");
  }
  if (hasCancels) {
    steps.push("Consolidate overlapping subscriptions to one primary tool");
  }
  steps.push("Re-run this audit in 30 days after changes");
  steps.push("Book a Credex consultation to unlock discounted AI credits");

  return steps;
}

// ─── Fallback summary ───────────────────────────────────────

export function generateFallbackSummary(results) {
  const {
    totalMonthlySavings,
    totalAnnualSavings,
    totalCurrentSpend,
    recommendations,
    teamSize,
    isOptimal,
  } = results;

  if (isOptimal) {
    return `Your AI tool stack is well-optimized. Across ${recommendations.length} tool${recommendations.length > 1 ? "s" : ""} for a team of ${teamSize}, we found minimal savings opportunities ($${totalMonthlySavings}/mo). Your current plans are appropriately sized for your usage. We'll notify you when new optimization opportunities arise — pricing changes frequently in this market.`;
  }

  const topRec = [...recommendations]
    .filter((r) => r.youSave > 0)
    .sort((a, b) => b.youSave - a.youSave)[0];

  const cancelled = recommendations.filter((r) => r.recommended === "Cancel");
  const downgraded = recommendations.filter(
    (r) => !r.isOptimized && r.recommended !== "Cancel" && r.youSave > 0
  );

  const dupMention =
    cancelled.length > 0
      ? ` We identified duplicate subscriptions for ${cancelled.map((r) => r.toolName).join(" and ")} that can be consolidated.`
      : "";

  const downgradeMention =
    downgraded.length > 0
      ? ` Additionally, you are over-provisioned on premium tiers for ${downgraded.map((r) => r.toolName).join(", ")}; downgrading these to standard tiers is optimal.`
      : "";

  return `Based on our audit of your AI tech stack, we detected a current spend of $${totalCurrentSpend.toLocaleString()}/mo. By implementing our suggestions, you can instantly secure $${totalMonthlySavings.toLocaleString()}/mo ($${totalAnnualSavings.toLocaleString()}/yr) in recurring savings. Your single largest savings opportunity lies in optimizing ${topRec.toolName}, which will save you $${topRec.youSave.toLocaleString()}/mo.${dupMention}${downgradeMention} As an immediate next step, we recommend canceling redundant accounts and downgrading over-provisioned plans to capture these savings.`;
}
