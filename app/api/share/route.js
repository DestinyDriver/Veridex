import { NextResponse } from "next/server";
import { createShareLink } from "../../../lib/store";
import { resolveOrigin } from "../../../lib/site";

export async function POST(request) {
  try {
    const { auditId } = await request.json();

    if (!auditId) {
      return NextResponse.json(
        { error: "Audit ID required" },
        { status: 400 }
      );
    }

    const shortCode = await createShareLink(auditId);
    const origin = resolveOrigin(request);

    return NextResponse.json({
      shortCode,
      shareUrl: `${origin}/s/${shortCode}`,
    });
  } catch (err) {
    console.error("Share link error:", err);
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    );
  }
}
