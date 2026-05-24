"use client";

function Check() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5 12 10 17 19 7" />
    </svg>
  );
}

export default function Stepper({ step, labels }) {
  return (
    <div className="flex items-start gap-2 mb-10 overflow-x-auto">
      {labels.map((label, i) => {
        const idx = i + 1;
        const active = step === idx;
        const done = step > idx;
        const reached = active || done;
        return (
          <div key={label} className="contents">
            <div className="flex flex-col items-center gap-2 shrink-0 min-w-[78px]">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-medium transition-all"
                style={{
                  background: done ? "#f3ead8" : "transparent",
                  color: done ? "#0a0907" : (reached ? "#f3ead8" : "rgba(243,234,216,0.45)"),
                  border: `1.5px solid ${reached ? "rgba(243,234,216,0.7)" : "rgba(243,234,216,0.2)"}`,
                }}
              >
                {done ? <Check /> : idx}
              </span>
              <span
                className="font-body text-[11px] leading-tight text-center max-w-[88px] transition-colors"
                style={{ color: reached ? "#f3ead8" : "rgba(243,234,216,0.45)" }}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                className="h-px mt-4 flex-1 min-w-[20px]"
                style={{ background: done ? "rgba(243,234,216,0.5)" : "rgba(243,234,216,0.15)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
