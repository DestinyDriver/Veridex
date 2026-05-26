import { NextResponse } from "next/server";
import { runAudit, generateFallbackSummary } from "../../../lib/audit-engine";
import { saveAudit, saveLead, createShareLink } from "../../../lib/store";
import { sendAuditReportEmail } from "../../../lib/resend";

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

      // Generate share link and send report email (fire-and-forget)
      const origin =
        request.headers.get("origin") ||
        `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("host")}`;

      createShareLink(id)
        .then((shortCode) => {
          const shareUrl = `${origin}/s/${shortCode}`;
          return sendAuditReportEmail({
            to: email,
            orgName: orgName || null,
            shareUrl,
            totalCurrentSpend: results.totalCurrentSpend,
            totalMonthlySavings: results.totalMonthlySavings,
            totalAnnualSavings: results.totalAnnualSavings,
            percentReduction: results.percentReduction,
            toolCount: results.toolCount,
          });
        })
        .catch((err) => console.error("Email send error:", err));
    }

    return NextResponse.json({ id, ...results, summary });
  } catch (err) {
    console.error("Audit error:", err);
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}
