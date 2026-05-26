import { NextResponse } from "next/server";
import { generateFallbackSummary } from "../../../lib/audit-engine";

export async function POST(request) {
  try {
    const { results } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      try {
        const summary = await generateAISummary(results, apiKey);
        return NextResponse.json({ summary, source: "ai" });
      } catch (err) {
        console.error("AI summary failed, using fallback:", err.message);
      }
    }

    const summary = generateFallbackSummary(results);
    return NextResponse.json({ summary, source: "template" });
  } catch {
    return NextResponse.json({ error: "Summary generation failed" }, { status: 500 });
  }
}

async function generateAISummary(results, apiKey) {
  const cancelled = results.recommendations
    .filter((r) => r.recommended === "Cancel")
    .map((r) => `${r.toolName} (saves $${r.youSave}/mo)`);

  const downgraded = results.recommendations
    .filter((r) => !r.isOptimized && r.recommended !== "Cancel" && r.youSave > 0)
    .map((r) => `${r.toolName}: ${r.plan} → ${r.recommended} (saves $${r.youSave}/mo)`);

  const optimized = results.recommendations
    .filter((r) => r.isOptimized)
    .map((r) => r.toolName);

  const prompt = `You are a concise AI spend analyst writing a personalized audit summary. Be specific with numbers and tool names. Tone: professional, direct, analytical — not salesy.

Audit data:
- Team size: ${results.teamSize}
- Primary use case: ${results.useCase}
- Current total spend: $${results.totalCurrentSpend}/mo
- Recommended spend: $${results.totalRecommendedSpend}/mo
- Monthly savings: $${results.totalMonthlySavings}/mo ($${results.totalAnnualSavings}/yr)
- Reduction: ${results.percentReduction}%
- Tools: ${results.recommendations.map((r) => `${r.toolName} (${r.plan}, ${r.seats} seats, $${r.currentMonthly}/mo)`).join("; ")}
${cancelled.length > 0 ? `- Cancel (duplicates): ${cancelled.join("; ")}` : ""}
${downgraded.length > 0 ? `- Downgrade: ${downgraded.join("; ")}` : ""}
${optimized.length > 0 ? `- Already optimized: ${optimized.join(", ")}` : ""}

Write a ~120-word summary paragraph. Mention current spend, savings amount, biggest opportunity, any duplicate tools, and over-provisioned tiers. End with a clear next-step recommendation. No greeting, no sign-off.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.content[0].text;
}
