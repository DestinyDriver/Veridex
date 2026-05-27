# Metrics

## 1. North Star: Qualified Consultation Requests per Week (QCR/wk)

A **qualified consultation request** = audit completed + email captured + consultation form submitted + team size ≥ 20 seats.

Veridex is a B2B lead-generation product. Visits, signups, and DAU are vanity at this stage — the only number that matters is "how many real buying-intent conversations did we hand to Credex this week." It's a top-funnel metric *for Credex*, not a usage metric *for Veridex*. The product is doing its job only when this number grows.

Explicitly **not DAU/MAU.** The audit is a quarterly-to-annual use case for any given customer. Optimising for daily active users would push us toward gimmicky re-engagement loops that hurt the lead quality Credex actually buys.

## 2. Three input metrics that drive it

1. **Audit completion rate** (visit → submitted audit). Target ≥ 15%. Below 10% means the form is too long or the value prop isn't clear.
2. **Audit → consultation conversion** (completed audit → consultation form submitted). Target ≥ 12%. This is where the in-product CTA does its work.
3. **Lead qualification rate** (consultations from teams ≥ 20 seats / all consultations). Target ≥ 60%. Tracks whether traffic matches the target persona from GTM.md.

QCR/wk = Visits × 15% × 12% × 60% = **1.08% of weekly visits** at target rates.

## 3. What I'd instrument first

In order of priority on day one:

- **Funnel events** (PostHog or Plausible custom events): `page_view`, `audit_started`, `audit_completed`, `email_captured`, `consultation_submitted`, `share_link_clicked`. Tagged with `team_size` bucket so qualification rate is a free query.
- **Share-link analytics.** Every `/s/{code}` click — referrer, time-to-click. The `share_links` table already exists; just need a click counter column.
- **Email delivery + open rate** via Resend webhooks → Supabase. A sent-but-never-opened audit report is a silent failure I can't see otherwise.
- **Error rate on `/api/audit`** (Sentry). Audit submissions are the highest-stakes request in the app; a single 500 there kills a lead.

## 4. Pivot triggers

- **QCR/wk < 3 by end of week 4** → persona is wrong. Not the product, not the copy — the audience. Re-segment.
- **Audit completion rate < 8% sustained** → form friction or wrong value prop. Rewrite the hero + shorten the form before doing anything else.
- **Lead qualification rate < 30%** → traffic source mismatch. Cut whichever channel is bringing sub-5-seat hobbyists and double down on the Eng-Ops channels in GTM.md.
- **Consultation → credit purchase < 10%** (measured by Credex, not Veridex) → the audit isn't proving ROI clearly enough. Rewrite the recommendations section, not the marketing.
