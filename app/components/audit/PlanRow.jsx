"use client";

export default function PlanRow({ tool, row, onChange }) {
  const plans = tool.plans || [];
  const plan = plans.find((p) => p.id === row.planId);
  const auto = plan ? (plan.price || 0) * (Number(row.seats) || 0) : 0;
  const monthly = row.spend !== "" && row.spend != null ? Number(row.spend) || 0 : auto;

  return (
    <div
      className="rounded-2xl p-5"
      style={{ border: "1px solid rgba(243,234,216,0.1)", background: "rgba(243,234,216,0.015)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[0.6rem] flex items-center justify-center"
            style={{ background: "rgba(243,234,216,0.04)", border: "1px solid rgba(243,234,216,0.12)" }}
          >
            <span className="font-heading italic text-[#f3ead8] text-sm leading-none">{tool.mono}</span>
          </div>
          <div>
            <p className="font-body font-medium text-[#f3ead8] text-sm">{tool.name}</p>
            <p className="font-body text-[11px] text-[#f3ead8]/55">{tool.vendor}</p>
          </div>
        </div>
        <span className="text-[11px] font-body text-[#f3ead8]/60">
          est. <span className="text-[#f3ead8]/90">${monthly.toLocaleString()}</span>/mo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5">
          <label className="v-label">Plan</label>
          <select
            className="v-field"
            value={row.planId}
            onChange={(e) => onChange({ ...row, planId: e.target.value })}
          >
            <option value="" disabled>Select plan…</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#100d08]">
                {p.name}{p.price ? ` — $${p.price}/seat` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="v-label">Seats</label>
          <input
            type="number"
            min="1"
            className="v-field"
            value={row.seats}
            onChange={(e) => onChange({ ...row, seats: e.target.value })}
          />
        </div>
        <div className="md:col-span-4">
          <label className="v-label">Monthly $ (optional)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder={plan ? `auto: ${auto.toFixed(2)}` : "0.00"}
            className="v-field"
            value={row.spend}
            onChange={(e) => onChange({ ...row, spend: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
