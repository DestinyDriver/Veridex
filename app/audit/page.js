import SpendForm from "../components/audit/SpendForm";

export const metadata = {
  title: "AI Spend Audit — Veridex",
  description: "Find out how much your team is overspending on AI tools. Free audit in 2 minutes.",
};

export default function AuditPage() {
  return (
    <main className="min-h-screen w-full bg-[#0c0a06] text-[#f3ead8]">
      {/* Top bar */}
      <header className="px-8 md:px-16 lg:px-20 py-6 flex items-center justify-between">
        <a
          href="/"
          className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
          style={{ border: "1px solid rgba(243,234,216,0.18)" }}
          aria-label="Veridex home"
        >
          <img src="/logo.png" alt="Veridex" className="w-10 h-10 object-cover" />
        </a>
        <a
          href="/"
          className="text-sm font-body text-[#f3ead8]/65 hover:text-[#f3ead8] transition-colors"
        >
          ← Back to home
        </a>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* LEFT — form column */}
          <div className="lg:col-span-7">
            <SpendForm />
          </div>

          {/* RIGHT — illustration */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start hidden lg:block">
            <div className="flex flex-col items-center text-center">
              <img
                src="/audit.png"
                alt="Illustration of an analyst reviewing AI spend"
                className="w-full h-auto max-w-[560px] select-none"
                draggable="false"
              />
              <p
                className="mt-8 font-heading italic text-[#f3ead8] text-2xl md:text-3xl leading-[1.1]"
                style={{ letterSpacing: "-0.5px" }}
              >
                No hidden fees.
                <br />
                Just clarity on your AI spend.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
