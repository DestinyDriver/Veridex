import { NextResponse } from "next/server";
import { saveLead } from "../../../lib/store";

const recentSubmissions = new Map();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const MAX_SUBMISSIONS = 3;

export async function POST(request) {
  try {
    // Simple rate limiting by IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const submissions = recentSubmissions.get(ip) || [];
    const recent = submissions.filter((t) => now - t < RATE_LIMIT_WINDOW);

    if (recent.length >= MAX_SUBMISSIONS) {
      return NextResponse.json({ error: "Too many submissions. Try again shortly." }, { status: 429 });
    }

    recentSubmissions.set(ip, [...recent, now]);

    const body = await request.json();
    const { auditId, email, companyName, role, teamSize, honeypot } = body;

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: true }); // Silent reject
    }

    if (!email || !auditId) {
      return NextResponse.json({ error: "Email and audit ID required" }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    saveLead(auditId, { email, companyName, role, teamSize });

    // In production: send transactional email via Resend/Postmark
    // const emailResult = await sendConfirmationEmail(email, auditId);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
