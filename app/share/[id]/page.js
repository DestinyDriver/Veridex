import ShareView from "../../components/share/ShareView";
import { SITE_URL } from "../../../lib/site";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const baseUrl = SITE_URL;

  return {
    title: "AI Spend Audit Report — Veridex",
    description: "See how much this team could save on AI tools. Run your own free audit.",
    openGraph: {
      title: "AI Spend Audit Report — Veridex",
      description: "See how much this team could save on AI tools. Run your own free audit.",
      url: `${baseUrl}/share/${id}`,
      type: "website",
      siteName: "Veridex",
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Spend Audit Report — Veridex",
      description: "See how much this team could save on AI tools. Run your own free audit.",
    },
  };
}

export default async function SharePage({ params }) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-[#0c0a06] text-[#f3ead8]">
      <ShareView auditId={id} />
    </main>
  );
}
