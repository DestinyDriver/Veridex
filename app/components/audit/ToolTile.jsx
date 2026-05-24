"use client";

function Check() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5 12 10 17 19 7" />
    </svg>
  );
}

export default function ToolTile({ tool, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative rounded-2xl p-4 text-left transition-all duration-200 focus:outline-none"
      style={{
        background: selected ? "rgba(243,234,216,0.06)" : "rgba(243,234,216,0.015)",
        border: `1px solid ${selected ? "rgba(243,234,216,0.55)" : "rgba(243,234,216,0.1)"}`,
        boxShadow: selected ? "inset 0 1px 0 rgba(243,234,216,0.08)" : "none",
      }}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-[0.75rem] flex items-center justify-center shrink-0"
          style={{
            background: "rgba(243,234,216,0.04)",
            border: "1px solid rgba(243,234,216,0.12)",
          }}
        >
          <span
            className="font-heading italic text-[#f3ead8] text-lg leading-none"
            style={{ letterSpacing: "-0.5px" }}
          >
            {tool.mono}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-body font-medium text-[#f3ead8] text-sm truncate">{tool.name}</p>
          <p className="font-body text-xs text-[#f3ead8]/55 truncate">{tool.vendor}</p>
        </div>
        <span
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all"
          style={{
            background: selected ? "#f3ead8" : "transparent",
            color: "#0a0907",
            border: `1px solid ${selected ? "transparent" : "rgba(243,234,216,0.25)"}`,
          }}
        >
          {selected ? <Check /> : null}
        </span>
      </div>
    </button>
  );
}
