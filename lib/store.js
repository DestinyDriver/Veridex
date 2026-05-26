import { supabase } from "./supabase";

// ── In-memory fallback (dev / missing env vars) ─────────────
const memAudits = new Map();
const memLeads = [];
const memShareLinks = new Map();

// ── Audits ──────────────────────────────────────────────────

export async function saveAudit(id, data) {
  if (supabase) {
    const { error } = await supabase.from("audits").insert({
      id,
      input: data.input || {},
      results: data,
      summary: data.summary || null,
      org_name: data.orgName || null,
      org_email: data.orgEmail || null,
      org_size: data.orgSize || null,
      use_case: data.useCase || null,
    });
    if (error) {
      console.error("Supabase saveAudit error:", error);
      throw error;
    }
    return id;
  }

  // Fallback
  memAudits.set(id, { ...data, id, createdAt: new Date().toISOString() });
  return id;
}

export async function getAudit(id) {
  if (supabase) {
    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return { ...data.results, id: data.id, createdAt: data.created_at };
  }

  return memAudits.get(id) || null;
}

// ── Leads ───────────────────────────────────────────────────

export async function saveLead(leadData) {
  if (supabase) {
    const { error } = await supabase.from("leads").insert({
      audit_id: leadData.auditId || null,
      email: leadData.email,
      company_name: leadData.companyName || null,
      role: leadData.role || null,
      team_size: leadData.teamSize || null,
      source: leadData.source || "audit",
    });
    if (error) {
      console.error("Supabase saveLead error:", error);
      throw error;
    }
    return true;
  }

  // Fallback
  memLeads.push({ ...leadData, capturedAt: new Date().toISOString() });
  return true;
}

// ── Share Links ─────────────────────────────────────────────

function generateShortCode() {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < 7; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createShareLink(auditId) {
  const shortCode = generateShortCode();

  if (supabase) {
    // Check if one already exists for this audit
    const { data: existing } = await supabase
      .from("share_links")
      .select("short_code")
      .eq("audit_id", auditId)
      .single();

    if (existing) return existing.short_code;

    const { error } = await supabase.from("share_links").insert({
      audit_id: auditId,
      short_code: shortCode,
    });
    if (error) {
      console.error("Supabase createShareLink error:", error);
      throw error;
    }
    return shortCode;
  }

  // Fallback
  const existingCode = memShareLinks.get(auditId);
  if (existingCode) return existingCode;
  memShareLinks.set(auditId, shortCode);
  return shortCode;
}

export async function getShareLink(shortCode) {
  if (supabase) {
    const { data, error } = await supabase
      .from("share_links")
      .select("audit_id, view_count")
      .eq("short_code", shortCode)
      .single();
    if (error || !data) return null;

    // Increment view count
    await supabase
      .from("share_links")
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq("short_code", shortCode);

    return data.audit_id;
  }

  // Fallback — scan memory
  for (const [auditId, code] of memShareLinks) {
    if (code === shortCode) return auditId;
  }
  return null;
}
