// Simple in-memory store for audit results
// Replace with Supabase/Postgres for production

const audits = new Map();

export function saveAudit(id, data) {
  audits.set(id, {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  });
  return id;
}

export function getAudit(id) {
  return audits.get(id) || null;
}

export function saveLead(auditId, leadData) {
  const audit = audits.get(auditId);
  if (audit) {
    audit.lead = {
      ...leadData,
      capturedAt: new Date().toISOString(),
    };
    audits.set(auditId, audit);
  }
  return audit;
}
