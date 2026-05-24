import { NextResponse } from "next/server";
import { generateFallbackSummary } from "../../../lib/audit-engine";

export async function POST(request) {
  try {
    const { results } = await request.json();

    // Try Anthropic API if key is available
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      try {
        const summary = await generateAISummary(results, apiKey);
        return NextResponse.json({ summary, source: "ai" });
      } catch (err) {
        console.error("AI summary failed, using fallback:", err.message);
      }
    }

    // Fallback to templated summary
    const summary = generateFallbackSummary(results);
    return NextResponse.json({ summary, source: "template" });
  } catch {
    return NextResponse.json({ error: "Summary generation failed" }, { status: 500 });
  }
}

async function generateAISummary(results, apiKey) {
  const prompt = `You are a concise AI spend analyst. Based on this audit data, write a ~100-word personalized summary paragraph for the user. Be specific about their tools and numbers. Tone: professional, direct, helpful — not salesy.

Audit data:
- Team size: ${results.teamSize}
- Use case: ${results.useCase}
- Tools audited: ${results.recommendations.map((r) => `${r.toolName} (${r.planName}, ${r.seats} seats, $${r.currentMonthly}/mo)`).join("; ")}
- Total monthly savings found: $${results.totalMonthlySavings}
- Total annual savings: $${results.totalAnnualSavings}
- Key recommendations: ${results.recommendations.filter((r) => r.primaryAction).map((r) => `${r.toolName}: ${r.primaryAction.action} (saves $${r.primaryAction.savings}/mo)`).join("; ")}
- Duplicate tool categories: ${results.duplicates.length > 0 ? results.duplicates.map((d) => `${d.category}: ${d.tools.join(", ")}`).join("; ") : "None"}

Write the summary now. No greeting, no sign-off. Just the paragraph.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
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
