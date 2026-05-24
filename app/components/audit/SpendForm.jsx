"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getToolList, USE_CASES, ORG_SIZES } from "../../../lib/pricing-data";
import ToolTile from "./ToolTile";
import PlanRow from "./PlanRow";
import Stepper from "./Stepper";

const STORAGE_KEY = "veridex_audit_form";
const tools = getToolList();
const STEP_LABELS = ["Tools", "Plans & seats", "Organization"];

function ArrowRight() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}
function ArrowLeft() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="M11 5l-7 7 7 7" />
    </svg>
  );
}

export default function SpendForm() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState({});
  const [org, setOrg] = useState({
    name: "",
    size: "",
    useCase: "mixed",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.step) setStep(data.step);
        if (data.selected?.length) setSelected(data.selected);
        if (data.rows) setRows(data.rows);
        if (data.org) setOrg(data.org);
      }
    } catch {}
  }, []);

  // Persist to localStorage
  const persist = useCallback(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step, selected, rows, org }),
      );
    } catch {}
  }, [step, selected, rows, org]);
  useEffect(() => {
    persist();
  }, [persist]);

  const total = useMemo(() => {
    return selected.reduce((sum, id) => {
      const r = rows[id] || {};
      if (r.spend !== "" && r.spend != null)
        return sum + (Number(r.spend) || 0);
      const tool = tools.find((t) => t.id === id);
      const plan = tool?.plans.find((p) => p.id === r.planId);
      if (!plan) return sum;
      return sum + (plan.price || 0) * (Number(r.seats) || 0);
    }, 0);
  }, [selected, rows]);

  function toggleTool(id) {
    setSelected((s) => {
      if (s.includes(id)) {
        setRows((r) => {
          const n = { ...r };
          delete n[id];
          return n;
        });
        return s.filter((x) => x !== id);
      }
      setRows((r) => ({ ...r, [id]: { planId: "", seats: 1, spend: "" } }));
      return [...s, id];
    });
  }

  const canNext =
    (step === 1 && selected.length > 0) ||
    (step === 2 &&
      selected.every(
        (id) => rows[id]?.planId && Number(rows[id]?.seats) >= 1,
      )) ||
    (step === 3 && org.name && org.size && org.email);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canNext) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: selected.map((id) => {
            const r = rows[id] || {};
            const tool = tools.find((t) => t.id === id);
            const plan = tool?.plans.find((p) => p.id === r.planId);
            const autoSpend = (plan?.price || 0) * (Number(r.seats) || 0);
            return {
              toolId: id,
              planId: r.planId,
              seats: parseInt(r.seats) || 1,
              monthlySpend:
                r.spend !== "" && r.spend != null
                  ? parseFloat(r.spend) || 0
                  : autoSpend,
            };
          }),
          teamSize: parseInt(org.size) || 0,
          orgName: org.name,
          orgSize: org.size,
          useCase: org.useCase,
          email: org.email,
        }),
      });

      if (!res.ok) throw new Error("Audit failed");
      const data = await res.json();
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = `/results/${data.id}`;
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const variants = {
    initial: { opacity: 0, y: 24, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -24, filter: "blur(8px)" },
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1
        className="mt-3 font-heading italic text-[#f3ead8] text-4xl md:text-5xl lg:text-6xl leading-[1]"
        style={{ letterSpacing: "-2px" }}
      >
        {step === 1 && (
          <>
            Which AI tools
            <br />
            does your team use?
          </>
        )}
        {step === 2 && (
          <>
            Tell us about
            <br />
            your plans &amp; seats.
          </>
        )}
        {step === 3 && (
          <>
            A few details
            <br />
            about your team.
          </>
        )}
      </h1>

      {/* Stepper */}
      <div className="mt-10">
        <Stepper step={step} labels={STEP_LABELS} />
      </div>

      {/* Live tally chip */}
      {selected.length > 0 && (
        <div
          className="inline-flex items-center gap-2 rounded-full pl-1 pr-3 py-1 mb-8"
          style={{
            border: "1px solid rgba(243,234,216,0.18)",
            background: "rgba(243,234,216,0.03)",
          }}
        >
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-body font-medium"
            style={{ background: "#f3ead8", color: "#0a0907" }}
          >
            Live
          </span>
          <span className="text-xs font-body text-[#f3ead8]/85">
            Tracking <span className="text-[#f3ead8]">{selected.length}</span>{" "}
            tools · est. spend
          </span>
          <span className="font-heading italic text-[#f3ead8] text-base leading-none">
            ${total.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#f3ead8]/55">/mo</span>
        </div>
      )}

      {/* Step body */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="s1"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-sm md:text-base font-body font-light text-[#f3ead8]/65 leading-snug mb-6">
              Pick all that apply. You can add more later.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tools.map((t) => (
                <ToolTile
                  key={t.id}
                  tool={t}
                  selected={selected.includes(t.id)}
                  onToggle={() => toggleTool(t.id)}
                />
              ))}
            </div>
            <p className="mt-5 text-xs font-body text-[#f3ead8]/55">
              Don&apos;t see it? Pick the closest match and note it in step 3.
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="s2"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-sm md:text-base font-body font-light text-[#f3ead8]/65 leading-snug mb-6">
              We auto-calculate spend from your plan and seats. Override any
              line with the optional dollar field.
            </p>
            <div className="flex flex-col gap-3">
              {selected.length === 0 && (
                <p className="text-sm text-[#f3ead8]/55 font-body">
                  No tools selected. Go back to step 1.
                </p>
              )}
              {selected.map((id) => {
                const tool = tools.find((t) => t.id === id);
                if (!tool) return null;
                const row = rows[id] || { planId: "", seats: 1, spend: "" };
                return (
                  <PlanRow
                    key={id}
                    tool={tool}
                    row={row}
                    onChange={(next) => setRows((r) => ({ ...r, [id]: next }))}
                  />
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="s3"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-sm md:text-base font-body font-light text-[#f3ead8]/65 leading-snug mb-6">
              So we can tailor your report and send it to the right inbox.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="v-label">Organization name</label>
                <input
                  type="text"
                  placeholder="Acme Inc."
                  className="v-field"
                  value={org.name}
                  onChange={(e) => setOrg({ ...org, name: e.target.value })}
                />
              </div>
              <div>
                <label className="v-label">Organization size</label>
                <select
                  className="v-field"
                  value={org.size}
                  onChange={(e) => setOrg({ ...org, size: e.target.value })}
                >
                  <option value="" disabled>
                    Select size…
                  </option>
                  {ORG_SIZES.map((s) => (
                    <option key={s} value={s} className="bg-[#100d08]">
                      {s} people
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="v-label">Primary use case</label>
                <select
                  className="v-field"
                  value={org.useCase}
                  onChange={(e) => setOrg({ ...org, useCase: e.target.value })}
                >
                  {USE_CASES.map((uc) => (
                    <option
                      key={uc.value}
                      value={uc.value}
                      className="bg-[#100d08]"
                    >
                      {uc.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="v-label">Work email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="v-field"
                  value={org.email}
                  onChange={(e) => setOrg({ ...org, email: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer nav */}
      <div className="flex items-center gap-3 mt-10">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-body text-[#f3ead8] disabled:opacity-30 disabled:pointer-events-none transition-colors hover:bg-[#f3ead8]/5"
          style={{ border: "1px solid rgba(243,234,216,0.25)" }}
        >
          <ArrowLeft />
          Back
        </button>

        {step < STEP_LABELS.length ? (
          <button
            type="button"
            onClick={() => canNext && setStep((s) => s + 1)}
            disabled={!canNext}
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium disabled:opacity-40 disabled:pointer-events-none transition-colors"
            style={{ background: "#f3ead8", color: "#0a0907" }}
          >
            Next
            <ArrowRight />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canNext || submitting}
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium disabled:opacity-40 disabled:pointer-events-none transition-colors"
            style={{ background: "#f3ead8", color: "#0a0907" }}
          >
            {submitting ? "Running audit..." : "Run free audit"}
            <ArrowRight />
          </button>
        )}

        <span className="ml-auto text-xs font-body text-[#f3ead8]/45">
          Step {step} of {STEP_LABELS.length}
        </span>
      </div>

      {error && (
        <p className="mt-4 text-red-400 text-sm font-body text-center">
          {error}
        </p>
      )}

      <p className="mt-8 text-xs font-body text-[#f3ead8]/45 max-w-md">
        No credit card. Read-only. We never read your prompts, code, or document
        contents.
      </p>
    </form>
  );
}
