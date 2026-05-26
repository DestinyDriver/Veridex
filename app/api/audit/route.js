import { NextResponse } from "next/server";
import { runAudit, generateFallbackSummary } from "../../../lib/audit-engine";
import { saveAudit, saveLead } from "../../../lib/store";

export async function POST(request) {
  try {
    const body = await request.json();
    const { entries, teamSize, useCase, orgName, orgSize, email } = body;

    if (!entries?.length || !teamSize) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const results = runAudit(entries, teamSize, useCase);
    const summary = generateFallbackSummary(results);

    const id = crypto.randomUUID();
    await saveAudit(id, {
      ...results,
      summary,
      input: { entries, teamSize, useCase },
      orgName: orgName || null,
      orgEmail: email || null,
      orgSize: orgSize || null,
      useCase,
    });

    // Save org email as a lead if provided
    if (email) {
      await saveLead({
        auditId: id,
        email,
        companyName: orgName || null,
        teamSize: orgSize || null,
        source: "audit",
      });
    }

    return NextResponse.json({ id, ...results, summary });
  } catch (err) {
    console.error("Audit error:", err);
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}
