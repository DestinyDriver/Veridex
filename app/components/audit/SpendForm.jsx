"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getToolList, USE_CASES } from "../../../lib/pricing-data";
import ToolEntry from "./ToolEntry";

const STORAGE_KEY = "veridex_audit_form";
const tools = getToolList();

function createEmptyEntry() {
  return { id: crypto.randomUUID(), toolId: "", planId: "", seats: 1, monthlySpend: "" };
}

export default function SpendForm() {
  const [entries, setEntries] = useState([createEmptyEntry()]);
  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState("mixed");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Restore form state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.entries?.length) setEntries(data.entries);
        if (data.teamSize) setTeamSize(data.teamSize);
        if (data.useCase) setUseCase(data.useCase);
      }
    } catch {}
  }, []);

  // Persist form state
  const persist = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ entries, teamSize, useCase }));
    } catch {}
  }, [entries, teamSize, useCase]);

  useEffect(() => { persist(); }, [persist]);

  function updateEntry(id, field, value) {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const updated = { ...e, [field]: value };
        // Reset plan when tool changes
        if (field === "toolId") updated.planId = "";
        return updated;
      })
    );
  }

  function removeEntry(id) {
    if (entries.length <= 1) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function addEntry() {
    setEntries((prev) => [...prev, createEmptyEntry()]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const validEntries = entries.filter((ent) => ent.toolId && ent.planId);
    if (validEntries.length === 0) {
      setError("Add at least one tool with a plan selected.");
      return;
    }
    if (!teamSize || parseInt(teamSize) < 1) {
      setError("Enter your team size.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: validEntries.map(({ toolId, planId, seats, monthlySpend }) => ({
            toolId,
            planId,
            seats: parseInt(seats) || 1,
            monthlySpend: parseFloat(monthlySpend) || 0,
          })),
          teamSize: parseInt(teamSize),
          useCase,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AnimatePresence mode="popLayout">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ToolEntry
              entry={entry}
              index={i}
              tools={tools}
              onUpdate={updateEntry}
              onRemove={() => removeEntry(entry.id)}
              canRemove={entries.length > 1}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={addEntry}
        className="w-full py-3 border border-dashed border-[#f3ead8]/20 rounded-xl text-sm font-body text-[#f3ead8]/40 hover:text-[#f3ead8]/70 hover:border-[#f3ead8]/40 transition-colors"
      >
        + Add another tool
      </button>

      <div className="border-t border-[#f3ead8]/10 pt-8 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-body uppercase tracking-wider text-[#f3ead8]/40 mb-2">
            Team size
          </label>
          <input
            type="number"
            min="1"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            placeholder="e.g. 12"
            className="w-full bg-[#f3ead8]/5 border border-[#f3ead8]/10 rounded-lg px-4 py-3 text-[#f3ead8] font-body placeholder:text-[#f3ead8]/20 focus:outline-none focus:border-[#f3ead8]/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-body uppercase tracking-wider text-[#f3ead8]/40 mb-2">
            Primary use case
          </label>
          <select
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            className="w-full bg-[#f3ead8]/5 border border-[#f3ead8]/10 rounded-lg px-4 py-3 text-[#f3ead8] font-body focus:outline-none focus:border-[#f3ead8]/30 transition-colors appearance-none"
          >
            {USE_CASES.map((uc) => (
              <option key={uc.value} value={uc.value} className="bg-[#0c0a06]">
                {uc.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm font-body text-center">{error}</p>
      )}

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-4 bg-[#f3ead8] text-[#0c0a06] rounded-full font-body font-semibold text-base hover:bg-[#f3ead8]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {submitting ? "Running audit..." : "Run free audit →"}
      </motion.button>
    </form>
  );
}
