// Canonical site URL. Set NEXT_PUBLIC_BASE_URL in production (e.g.
// https://veridex.example.com) so emails, share links, and OG tags point at
// the deployed origin instead of localhost.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");

// Display-friendly host (e.g. "veridex.example.com") for email footers and
// signature lines.
export const SITE_DISPLAY = SITE_URL.replace(/^https?:\/\//, "");

// Resolve the canonical origin server-side, with the request's own headers as
// a last-resort fallback (covers local dev without an env var set).
export function resolveOrigin(request) {
  if (process.env.NEXT_PUBLIC_BASE_URL) return SITE_URL;
  const fromHeaderOrigin = request.headers.get("origin");
  if (fromHeaderOrigin) return fromHeaderOrigin;
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host");
  return host ? `${proto}://${host}` : SITE_URL;
}
