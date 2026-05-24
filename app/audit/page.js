import SpendForm from "../components/audit/SpendForm";

export const metadata = {
  title: "AI Spend Audit — Veridex",
  description: "Find out how much your team is overspending on AI tools. Free audit in 2 minutes.",
};

export default function AuditPage() {
  return (
    <main className="min-h-screen bg-[#0c0a06] text-[#f3ead8]">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <header className="mb-16 text-center">
          <a href="/" className="inline-block font-heading italic text-2xl mb-12 opacity-60 hover:opacity-100 transition-opacity">
            a
          </a>
          <h1 className="font-heading italic text-5xl md:text-6xl mb-4">
            Audit your AI spend
          </h1>
          <p className="font-body text-lg text-[#f3ead8]/60 max-w-xl mx-auto">
            Add every AI tool your team pays for. We&apos;ll show you exactly where you&apos;re overspending and how to fix it.
          </p>
        </header>
        <SpendForm />
      </div>
    </main>
  );
}
