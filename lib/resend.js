import { Resend } from "resend";
import { SITE_URL, SITE_DISPLAY } from "./site";

const resendKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.RESEND_FROM_EMAIL || "Veridex <noreply@veridex.dev>";

if (!resendKey) {
  console.warn("RESEND_API_KEY missing — emails will be skipped.");
}

const resend = resendKey ? new Resend(resendKey) : null;

export async function sendAuditReportEmail({
  to,
  orgName,
  shareUrl,
  totalCurrentSpend,
  totalMonthlySavings,
  totalAnnualSavings,
  percentReduction,
  toolCount,
}) {
  if (!resend) {
    console.log(`[email:skip] Audit report → ${to}`);
    return null;
  }

  const savings = `$${totalMonthlySavings.toLocaleString()}`;
  const annual = `$${totalAnnualSavings.toLocaleString()}`;
  const current = `$${totalCurrentSpend.toLocaleString()}`;
  const company = orgName || "your organization";

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: `Your Veridex Audit: ${savings}/mo in savings identified`,
    html: auditReportHTML({
      company,
      shareUrl,
      current,
      savings,
      annual,
      percentReduction,
      toolCount,
    }),
  });

  if (error) {
    console.error("Resend audit email error:", error);
    return null;
  }
  return data;
}

export async function sendConsultationConfirmEmail({ to }) {
  if (!resend) {
    console.log(`[email:skip] Consultation confirm → ${to}`);
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: "Consultation booked — Veridex",
    html: consultationConfirmHTML(),
  });

  if (error) {
    console.error("Resend consultation email error:", error);
    return null;
  }
  return data;
}

// ─── HTML Templates ─────────────────────────────────────────

function auditReportHTML({
  company,
  shareUrl,
  current,
  savings,
  annual,
  percentReduction,
  toolCount,
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f3ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <img src="${SITE_URL}/logo.png" alt="Veridex" width="40" height="40" style="border-radius:10px;" />
      <p style="margin:8px 0 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#8a8478;">AI SPEND AUDIT</p>
    </div>

    <!-- Main card -->
    <div style="background:#ffffff;border-radius:16px;padding:40px 32px;border:1px solid #e8e4dc;">

      <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0a0907;line-height:1.2;">
        Your audit is ready.
      </h1>
      <p style="margin:0 0 28px;font-size:15px;color:#5c574e;line-height:1.6;">
        We've completed the AI spend audit for <strong style="color:#0a0907;">${company}</strong>. Here's the executive summary:
      </p>

      <!-- Stats grid -->
      <div style="display:flex;gap:12px;margin-bottom:28px;">
        <div style="flex:1;background:#faf8f4;border-radius:12px;padding:20px 16px;text-align:center;border:1px solid #eee9e0;">
          <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#8a8478;">Current Spend</p>
          <p style="margin:0;font-size:22px;font-weight:700;color:#0a0907;">${current}<span style="font-size:13px;color:#8a8478;font-weight:400">/mo</span></p>
        </div>
        <div style="flex:1;background:#f0faf4;border-radius:12px;padding:20px 16px;text-align:center;border:1px solid #d4edda;">
          <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#2d7a4f;">You Save</p>
          <p style="margin:0;font-size:22px;font-weight:700;color:#1a7a3a;">${savings}<span style="font-size:13px;color:#2d7a4f;font-weight:400">/mo</span></p>
        </div>
      </div>

      <!-- Secondary stats -->
      <div style="background:#faf8f4;border-radius:12px;padding:16px 20px;margin-bottom:28px;display:flex;justify-content:space-between;border:1px solid #eee9e0;">
        <div>
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#8a8478;">Annual Savings</p>
          <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#1a7a3a;">${annual}</p>
        </div>
        <div style="text-align:center;">
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#8a8478;">Reduction</p>
          <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#0a0907;">${percentReduction}%</p>
        </div>
        <div style="text-align:right;">
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#8a8478;">Tools Audited</p>
          <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#0a0907;">${toolCount}</p>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;">
        <a href="${shareUrl}" style="display:inline-block;background:#0a0907;color:#f3ead8;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:14px;font-weight:600;letter-spacing:0.01em;">
          View Full Report →
        </a>
      </div>

      <p style="margin:24px 0 0;font-size:13px;color:#8a8478;text-align:center;line-height:1.5;">
        This link gives you the full per-tool breakdown with<br/>specific recommendations and reasoning.
      </p>
    </div>

    <!-- Footer -->
    <div style="margin-top:32px;text-align:center;">
      <p style="margin:0 0 8px;font-size:13px;color:#8a8478;line-height:1.5;">
        Want to implement these savings with expert help?
      </p>
      <a href="https://credex.rocks" style="font-size:13px;color:#0a0907;font-weight:600;text-decoration:underline;">
        Book a free consultation with Credex
      </a>

      <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e8e4dc;">
        <p style="margin:0;font-size:11px;color:#b0aa9f;">
          © ${new Date().getFullYear()} Veridex · AI Spend Intelligence
        </p>
        <p style="margin:6px 0 0;font-size:11px;color:#b0aa9f;">
          You received this because you ran an audit on ${SITE_DISPLAY}.
          <br/>
          <a href="${SITE_URL}" style="color:#8a8478;text-decoration:underline;">${SITE_DISPLAY}</a>
        </p>
      </div>
    </div>

  </div>
</body>
</html>`;
}

function consultationConfirmHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f3ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <img src="${SITE_URL}/logo.png" alt="Veridex" width="40" height="40" style="border-radius:10px;" />
      <p style="margin:8px 0 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#8a8478;">CONSULTATION CONFIRMED</p>
    </div>

    <!-- Main card -->
    <div style="background:#ffffff;border-radius:16px;padding:40px 32px;border:1px solid #e8e4dc;">

      <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0a0907;line-height:1.2;">
        We've received your request.
      </h1>
      <p style="margin:0 0 24px;font-size:15px;color:#5c574e;line-height:1.6;">
        Thank you for your interest in optimizing your AI spend. A member of our team will reach out within <strong style="color:#0a0907;">24 hours</strong> to schedule your free consultation.
      </p>

      <!-- What to expect -->
      <div style="background:#faf8f4;border-radius:12px;padding:24px 20px;margin-bottom:24px;border:1px solid #eee9e0;">
        <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:#0a0907;text-transform:uppercase;letter-spacing:0.06em;">What to expect</p>

        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
          <div style="width:24px;height:24px;border-radius:50%;background:#0a0907;color:#f3ead8;font-size:12px;font-weight:600;text-align:center;line-height:24px;flex-shrink:0;">1</div>
          <div>
            <p style="margin:0;font-size:14px;font-weight:600;color:#0a0907;">Personalized Stack Review</p>
            <p style="margin:3px 0 0;font-size:13px;color:#5c574e;line-height:1.5;">We'll analyze your specific AI tool usage patterns and identify overlaps.</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
          <div style="width:24px;height:24px;border-radius:50%;background:#0a0907;color:#f3ead8;font-size:12px;font-weight:600;text-align:center;line-height:24px;flex-shrink:0;">2</div>
          <div>
            <p style="margin:0;font-size:14px;font-weight:600;color:#0a0907;">Savings Roadmap</p>
            <p style="margin:3px 0 0;font-size:13px;color:#5c574e;line-height:1.5;">A step-by-step plan to consolidate, downgrade, and optimize — with exact dollar impact.</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:12px;">
          <div style="width:24px;height:24px;border-radius:50%;background:#0a0907;color:#f3ead8;font-size:12px;font-weight:600;text-align:center;line-height:24px;flex-shrink:0;">3</div>
          <div>
            <p style="margin:0;font-size:14px;font-weight:600;color:#0a0907;">Implementation Support</p>
            <p style="margin:3px 0 0;font-size:13px;color:#5c574e;line-height:1.5;">Hands-on help migrating tools, negotiating contracts, and accessing discounted API credits via Credex.</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;">
        <a href="${SITE_URL}/audit" style="display:inline-block;background:#0a0907;color:#f3ead8;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:14px;font-weight:600;">
          Run Another Audit →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top:32px;text-align:center;">
      <p style="margin:0 0 12px;font-size:13px;color:#8a8478;">
        Questions? Reply directly to this email.
      </p>

      <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e8e4dc;">
        <p style="margin:0;font-size:11px;color:#b0aa9f;">
          © ${new Date().getFullYear()} Veridex · AI Spend Intelligence
        </p>
        <p style="margin:6px 0 0;font-size:11px;color:#b0aa9f;">
          You received this because you requested a consultation on ${SITE_DISPLAY}.
          <br/>
          <a href="${SITE_URL}" style="color:#8a8478;text-decoration:underline;">${SITE_DISPLAY}</a>
        </p>
      </div>
    </div>

  </div>
</body>
</html>`;
}
