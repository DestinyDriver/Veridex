const tools = [
  { name: "OpenAI", mono: "OA", icon: "/openai_dark.svg" },
  { name: "Claude", mono: "Cl", icon: "https://cdn.simpleicons.org/claude/f3ead8" },
  { name: "Gemini", mono: "G", icon: "https://cdn.simpleicons.org/googlegemini/f3ead8" },
  { name: "Cursor", mono: "Cu", icon: "https://cdn.simpleicons.org/cursor/f3ead8" },
  { name: "GitHub Copilot", mono: "GC", icon: "https://cdn.simpleicons.org/githubcopilot/f3ead8" },
  { name: "Perplexity", mono: "P", icon: "https://cdn.simpleicons.org/perplexity/f3ead8" },
  { name: "Notion AI", mono: "N", icon: "https://cdn.simpleicons.org/notion/f3ead8" },
  { name: "Midjourney", mono: "Mj", icon: "/midjourney-dark.svg" },
  { name: "Windsurf", mono: "Ws", icon: "https://cdn.simpleicons.org/windsurf/f3ead8" },
  { name: "Replit", mono: "Rp", icon: "https://cdn.simpleicons.org/replit/f3ead8" },
  { name: "Anthropic", mono: "An", icon: "https://cdn.simpleicons.org/anthropic/f3ead8" },
];

function LogoCard({ name, mono, icon }) {
  return (
    <div className="flex items-center gap-3 shrink-0 px-6 opacity-30 hover:opacity-80 transition-opacity duration-300">
      <div className="w-7 h-7 rounded-[0.5rem] flex items-center justify-center shrink-0 border border-[#f3ead8]/10">
        {icon ? (
          <img src={icon} alt={name} className="w-4 h-4 object-contain" />
        ) : (
          <span className="font-heading italic text-[#f3ead8] text-xs leading-none tracking-[-0.5px]">
            {mono}
          </span>
        )}
      </div>
      <span className="font-heading italic text-[#f3ead8] text-base md:text-lg tracking-tight whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export default function SocialProof() {
  const loop = [...tools, ...tools];

  return (
    <section
      data-screen-label="social-proof"
      className="relative w-full bg-[#0c0a06] py-3 border-t border-[#f3ead8]/5 overflow-hidden"
    >
      <div className="relative">
        <div
          className="absolute inset-y-0 left-0 w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0c0a06, transparent)" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0c0a06, transparent)" }}
        />

        <div className="ai-marquee-track flex items-stretch gap-4 py-2">
          {loop.map((t, i) => (
            <LogoCard key={i} {...t} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ai-marquee-rtl {
          from { transform: translate3d(-50%, 0, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }
        .ai-marquee-track {
          width: max-content;
          animation: ai-marquee-rtl 55s linear infinite;
          will-change: transform;
        }
        .ai-marquee-track:hover { animation-play-state: paused; }
      `}</style>
    </section>
  );
}
