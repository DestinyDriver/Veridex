"use client";

export default function ToolEntry({ entry, index, tools, onUpdate, onRemove, canRemove }) {
  const selectedTool = tools.find((t) => t.id === entry.toolId);
  const plans = selectedTool?.plans || [];

  return (
    <div className="relative bg-[#f3ead8]/[0.02] border border-[#f3ead8]/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-body uppercase tracking-wider text-[#f3ead8]/30">
          Tool {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-[#f3ead8]/20 hover:text-red-400 transition-colors text-sm font-body"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-body uppercase tracking-wider text-[#f3ead8]/40 mb-2">
            Tool
          </label>
          <select
            value={entry.toolId}
            onChange={(e) => onUpdate(entry.id, "toolId", e.target.value)}
            className="w-full bg-[#f3ead8]/5 border border-[#f3ead8]/10 rounded-lg px-4 py-3 text-[#f3ead8] font-body focus:outline-none focus:border-[#f3ead8]/30 transition-colors appearance-none"
          >
            <option value="" className="bg-[#0c0a06]">Select a tool...</option>
            {tools.map((tool) => (
              <option key={tool.id} value={tool.id} className="bg-[#0c0a06]">
                {tool.name}
              </option>
            ))}
          </select>
        </div>

        {entry.toolId && (
          <>
            <div>
              <label className="block text-xs font-body uppercase tracking-wider text-[#f3ead8]/40 mb-2">
                Plan
              </label>
              <select
                value={entry.planId}
                onChange={(e) => onUpdate(entry.id, "planId", e.target.value)}
                className="w-full bg-[#f3ead8]/5 border border-[#f3ead8]/10 rounded-lg px-4 py-3 text-[#f3ead8] font-body focus:outline-none focus:border-[#f3ead8]/30 transition-colors appearance-none"
              >
                <option value="" className="bg-[#0c0a06]">Select plan...</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id} className="bg-[#0c0a06]">
                    {plan.name} — {plan.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-body uppercase tracking-wider text-[#f3ead8]/40 mb-2">
                Seats
              </label>
              <input
                type="number"
                min="1"
                value={entry.seats}
                onChange={(e) => onUpdate(entry.id, "seats", e.target.value)}
                className="w-full bg-[#f3ead8]/5 border border-[#f3ead8]/10 rounded-lg px-4 py-3 text-[#f3ead8] font-body placeholder:text-[#f3ead8]/20 focus:outline-none focus:border-[#f3ead8]/30 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-body uppercase tracking-wider text-[#f3ead8]/40 mb-2">
                Monthly spend ($)
                <span className="normal-case tracking-normal ml-1 opacity-60">— leave blank to auto-calculate</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={entry.monthlySpend}
                onChange={(e) => onUpdate(entry.id, "monthlySpend", e.target.value)}
                placeholder={
                  selectedTool && entry.planId
                    ? `Auto: $${(plans.find((p) => p.id === entry.planId)?.price || 0) * (parseInt(entry.seats) || 1)}/mo`
                    : "0.00"
                }
                className="w-full bg-[#f3ead8]/5 border border-[#f3ead8]/10 rounded-lg px-4 py-3 text-[#f3ead8] font-body placeholder:text-[#f3ead8]/20 focus:outline-none focus:border-[#f3ead8]/30 transition-colors"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
