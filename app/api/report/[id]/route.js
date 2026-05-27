import { NextResponse } from "next/server";
import { getAudit } from "../../../../lib/store";
import { SITE_DISPLAY } from "../../../../lib/site";

export async function GET(request, { params }) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    return new NextResponse("Audit not found", { status: 404 });
  }

  const html = generateReportHTML(audit);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

function generateReportHTML(audit) {
  const {
    recommendations = [],
    totalMonthlySavings = 0,
    totalAnnualSavings = 0,
    totalCurrentSpend = 0,
    totalRecommendedSpend = 0,
    percentReduction = 0,
    toolCount = 0,
    teamSize = 0,
    useCase = "",
    summary = "",
    nextSteps = [],
    createdAt,
  } = audit;

  const date = new Date(createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fmt = (n) => `$${(n || 0).toLocaleString()}`;

  const tableRows = recommendations
    .map(
      (r) => `
    <tr>
      <td style="padding:12px 16px;font-weight:600;color:#0a0907;border-bottom:1px solid #eee9e0;">${r.toolName}</td>
      <td style="padding:12px 16px;color:#5c574e;border-bottom:1px solid #eee9e0;">${r.plan}</td>
      <td style="padding:12px 16px;color:#5c574e;text-align:center;border-bottom:1px solid #eee9e0;">${r.seats}</td>
      <td style="padding:12px 16px;color:#5c574e;text-align:right;font-variant-numeric:tabular-nums;border-bottom:1px solid #eee9e0;">${fmt(r.currentMonthly)}</td>
      <td style="padding:12px 16px;font-weight:600;border-bottom:1px solid #eee9e0;${
        r.recommended === "Cancel"
          ? "color:#dc2626;"
          : r.isOptimized
            ? "color:#16a34a;"
            : "color:#d97706;"
      }">${r.isOptimized ? "✓ Optimized" : r.recommended}</td>
      <td style="padding:12px 16px;text-align:right;font-weight:600;color:${r.youSave > 0 ? "#16a34a" : "#b0aa9f"};font-variant-numeric:tabular-nums;border-bottom:1px solid #eee9e0;">${r.youSave > 0 ? "+" + fmt(r.youSave) : "—"}</td>
    </tr>
    <tr>
      <td colspan="6" style="padding:4px 16px 16px;font-size:12px;color:#8a8478;line-height:1.5;border-bottom:1px solid #eee9e0;">${r.why}</td>
    </tr>`
    )
    .join("");

  const stepsHTML = nextSteps
    .map(
      (s, i) => `
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
      <div style="width:22px;height:22px;border-radius:50%;background:#0a0907;color:#fff;font-size:11px;font-weight:600;text-align:center;line-height:22px;flex-shrink:0;">${i + 1}</div>
      <span style="font-size:13px;color:#3a3630;line-height:1.5;padding-top:2px;">${s}</span>
    </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>AI Spend Audit Report — Veridex</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Roboto, Helvetica, Arial, sans-serif;
      color: #0a0907;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @media print {
      body { background: #ffffff; }
      .page-break { page-break-before: always; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>

  <!-- Page 1: Cover + Summary -->
  <div style="min-height:100vh;display:flex;flex-direction:column;">

    <!-- Top bar -->
    <div style="background:#0a0907;padding:20px 48px;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:28px;height:28px;border-radius:8px;background:#f3ead8;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:14px;font-weight:700;color:#0a0907;">V</span>
        </div>
        <span style="font-size:14px;font-weight:600;color:#f3ead8;letter-spacing:0.02em;">VERIDEX</span>
      </div>
      <span style="font-size:11px;color:rgba(243,234,216,0.5);letter-spacing:0.1em;">CONFIDENTIAL</span>
    </div>

    <div style="flex:1;padding:48px;display:flex;flex-direction:column;">

      <!-- Title -->
      <div style="margin-bottom:40px;">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#8a8478;margin-bottom:8px;">AI Spend Audit Report</p>
        <h1 style="font-size:36px;font-weight:700;color:#0a0907;line-height:1.15;letter-spacing:-0.5px;">
          Optimization Analysis
        </h1>
        <p style="font-size:14px;color:#5c574e;margin-top:8px;">
          Generated ${date} · ${toolCount} tools · ${teamSize} team members · Primary use case: ${useCase}
        </p>
      </div>

      <!-- Executive Summary Stats -->
      <div style="display:flex;gap:16px;margin-bottom:32px;">
        <div style="flex:1;background:#faf8f4;border:1px solid #eee9e0;border-radius:12px;padding:24px 20px;">
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#8a8478;margin-bottom:6px;">Current Monthly Spend</p>
          <p style="font-size:28px;font-weight:700;color:#0a0907;letter-spacing:-0.5px;">${fmt(totalCurrentSpend)}</p>
        </div>
        <div style="flex:1;background:#f0faf4;border:1px solid #c6e9d4;border-radius:12px;padding:24px 20px;">
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#16a34a;margin-bottom:6px;">Recommended Spend</p>
          <p style="font-size:28px;font-weight:700;color:#16a34a;letter-spacing:-0.5px;">${fmt(totalRecommendedSpend)}</p>
        </div>
        <div style="flex:1;background:#0a0907;border-radius:12px;padding:24px 20px;">
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(243,234,216,0.6);margin-bottom:6px;">Monthly Savings</p>
          <p style="font-size:28px;font-weight:700;color:#f3ead8;letter-spacing:-0.5px;">${fmt(totalMonthlySavings)}</p>
        </div>
      </div>

      <div style="display:flex;gap:16px;margin-bottom:40px;">
        <div style="flex:1;border:1px solid #eee9e0;border-radius:12px;padding:20px;text-align:center;">
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#8a8478;margin-bottom:4px;">Annual Savings</p>
          <p style="font-size:22px;font-weight:700;color:#16a34a;">${fmt(totalAnnualSavings)}</p>
        </div>
        <div style="flex:1;border:1px solid #eee9e0;border-radius:12px;padding:20px;text-align:center;">
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#8a8478;margin-bottom:4px;">Cost Reduction</p>
          <p style="font-size:22px;font-weight:700;color:#0a0907;">${percentReduction}%</p>
        </div>
        <div style="flex:1;border:1px solid #eee9e0;border-radius:12px;padding:20px;text-align:center;">
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#8a8478;margin-bottom:4px;">Tools Analyzed</p>
          <p style="font-size:22px;font-weight:700;color:#0a0907;">${toolCount}</p>
        </div>
      </div>

      <!-- AI Assessment -->
      ${
        summary
          ? `
      <div style="border:1px solid #eee9e0;border-radius:12px;padding:24px;margin-bottom:32px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8478" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
          </svg>
          <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#8a8478;font-weight:600;">Executive Summary</span>
        </div>
        <p style="font-size:14px;color:#3a3630;line-height:1.65;">${summary}</p>
      </div>`
          : ""
      }

      <!-- Next Steps -->
      ${
        nextSteps.length > 0
          ? `
      <div style="background:#fffbf0;border:1px solid #f0e6c8;border-radius:12px;padding:24px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 4 12.7V17H8v-2.3A7 7 0 0 1 12 2z"/>
          </svg>
          <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#d97706;font-weight:600;">Recommended Next Steps</span>
        </div>
        ${stepsHTML}
      </div>`
          : ""
      }

      <!-- Spacer -->
      <div style="flex:1;"></div>

      <!-- Page footer -->
      <div style="border-top:1px solid #eee9e0;padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:10px;color:#b0aa9f;letter-spacing:0.1em;">VERIDEX© ${new Date().getFullYear()}</span>
        <span style="font-size:10px;color:#b0aa9f;">Page 1 of 2</span>
      </div>
    </div>
  </div>

  <!-- Page 2: Tool Breakdown Table -->
  <div class="page-break" style="min-height:100vh;display:flex;flex-direction:column;">

    <!-- Top bar -->
    <div style="background:#0a0907;padding:16px 48px;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:22px;height:22px;border-radius:6px;background:#f3ead8;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:11px;font-weight:700;color:#0a0907;">V</span>
        </div>
        <span style="font-size:12px;font-weight:600;color:#f3ead8;letter-spacing:0.02em;">VERIDEX</span>
      </div>
      <span style="font-size:10px;color:rgba(243,234,216,0.4);">AI Spend Audit — Per-Tool Breakdown</span>
    </div>

    <div style="flex:1;padding:40px 48px;">

      <h2 style="font-size:22px;font-weight:700;color:#0a0907;margin-bottom:4px;">Per-Tool Breakdown</h2>
      <p style="font-size:13px;color:#8a8478;margin-bottom:24px;">Detailed recommendations sorted by savings impact.</p>

      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="border-bottom:2px solid #0a0907;">
            <th style="padding:10px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#8a8478;font-weight:600;">Tool</th>
            <th style="padding:10px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#8a8478;font-weight:600;">Plan</th>
            <th style="padding:10px 16px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#8a8478;font-weight:600;">Seats</th>
            <th style="padding:10px 16px;text-align:right;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#8a8478;font-weight:600;">Current</th>
            <th style="padding:10px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#8a8478;font-weight:600;">Recommended</th>
            <th style="padding:10px 16px;text-align:right;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#8a8478;font-weight:600;">You Save</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
          <!-- Totals row -->
          <tr style="border-top:2px solid #0a0907;">
            <td colspan="3" style="padding:14px 16px;font-weight:700;font-size:13px;color:#0a0907;">TOTAL</td>
            <td style="padding:14px 16px;text-align:right;font-weight:700;color:#0a0907;font-variant-numeric:tabular-nums;">${fmt(totalCurrentSpend)}/mo</td>
            <td style="padding:14px 16px;font-weight:700;color:#16a34a;">${fmt(totalRecommendedSpend)}/mo</td>
            <td style="padding:14px 16px;text-align:right;font-weight:700;color:#16a34a;font-variant-numeric:tabular-nums;">+${fmt(totalMonthlySavings)}/mo</td>
          </tr>
        </tbody>
      </table>

      <!-- Spacer -->
      <div style="flex:1;"></div>

      <!-- Disclaimer -->
      <div style="margin-top:40px;padding:20px;background:#faf8f4;border-radius:12px;border:1px solid #eee9e0;">
        <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#8a8478;margin-bottom:8px;">Disclaimer</p>
        <p style="font-size:11px;color:#8a8478;line-height:1.6;">
          This report is generated automatically based on the tool subscriptions, plans, and seat counts provided during the audit. Actual savings may vary depending on contract terms, usage patterns, and vendor negotiations. Veridex does not guarantee specific savings outcomes. Recommendations are advisory and should be reviewed by your procurement or finance team before implementation. This document is confidential and intended for internal use only.
        </p>
      </div>
    </div>

    <!-- Page footer -->
    <div style="padding:0 48px 24px;">
      <div style="border-top:1px solid #eee9e0;padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:10px;color:#b0aa9f;letter-spacing:0.1em;">VERIDEX© ${new Date().getFullYear()} · ${SITE_DISPLAY}</span>
        <span style="font-size:10px;color:#b0aa9f;">Page 2 of 2</span>
      </div>
    </div>
  </div>

  <!-- Print button (hidden in print) -->
  <div class="no-print" style="position:fixed;bottom:24px;right:24px;z-index:100;">
    <button onclick="window.print()" style="background:#0a0907;color:#f3ead8;border:none;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.2);">
      Download PDF ↓
    </button>
  </div>

</body>
</html>`;
}
