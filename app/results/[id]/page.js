import ResultsView from "../../components/results/ResultsView";
import { SITE_URL } from "../../../lib/site";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: "Your AI Spend Audit — Veridex",
    description: "See exactly where your team is overspending on AI tools and how much you could save.",
    openGraph: {
      title: "AI Spend Audit Results — Veridex",
      description: "See exactly where your team is overspending on AI tools.",
      url: `${SITE_URL}/results/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Spend Audit Results — Veridex",
      description: "See exactly where your team is overspending on AI tools.",
    },
  };
}

export default async function ResultsPage({ params }) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-[#0c0a06] text-[#f3ead8]">
      <ResultsView auditId={id} />
    </main>
  );
}
