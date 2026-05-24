import { NextResponse } from "next/server";
import { runAudit, generateFallbackSummary } from "../../../lib/audit-engine";
import { saveAudit } from "../../../lib/store";

export async function POST(request) {
  try {
    const body = await request.json();
    const { entries, teamSize, useCase } = body;

    if (!entries?.length || !teamSize) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const results = runAudit(entries, teamSize, useCase);
    const summary = generateFallbackSummary(results);

    const id = crypto.randomUUID();
    saveAudit(id, { ...results, summary, input: { entries, teamSize, useCase } });

    return NextResponse.json({ id, ...results, summary });
  } catch (err) {
    console.error("Audit error:", err);
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}
