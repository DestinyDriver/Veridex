import { NextResponse } from "next/server";
import { saveLead } from "../../../lib/store";
import { sendConsultationConfirmEmail } from "../../../lib/resend";

const recentSubmissions = new Map();
const RATE_LIMIT_WINDOW = 60_000;
const MAX_SUBMISSIONS = 3;

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const submissions = recentSubmissions.get(ip) || [];
    const recent = submissions.filter((t) => now - t < RATE_LIMIT_WINDOW);

    if (recent.length >= MAX_SUBMISSIONS) {
      return NextResponse.json(
        { error: "Too many submissions. Try again shortly." },
        { status: 429 }
      );
    }

    recentSubmissions.set(ip, [...recent, now]);

    const body = await request.json();
    const { auditId, email, companyName, role, teamSize, source, honeypot } =
      body;

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await saveLead({
      auditId: auditId || null,
      email,
      companyName: companyName || null,
      role: role || null,
      teamSize: teamSize || null,
      source: source || "consultation",
    });

    // Send confirmation email for consultation requests (fire-and-forget)
    if (source === "consultation" || !source) {
      sendConsultationConfirmEmail({ to: email }).catch((err) =>
        console.error("Consultation email error:", err)
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
