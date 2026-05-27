# Unit Economics

Assumes Credex monetizes converted leads via **discounted AI credit resale + consulting/negotiation fees**, with ~15% blended gross margin on redirected spend.

## 1. What a converted lead is worth

**LTV estimate: ~$5,400 gross profit per converted customer.**

Math:

- Veridex's target persona (30–150 eng team) spends **~$5,000/mo** on AI tools (Cursor + Copilot + Claude + ChatGPT Teams + assorted APIs). Mid-point of observed range $2k–$15k.
- After audit, 60% of that spend (~$3,000/mo) gets **redirected through Credex** (negotiated contracts, resold credits, recommended replacements).
- Credex margin on redirected spend: **~15%** = **$450/mo gross profit per customer**.
- Expected customer lifetime: **12 months** (eng tooling churn is real; SOC2 + procurement friction makes 18mo optimistic for year 1).
- **LTV = $450 × 12 = $5,400.**

Sanity check: if a customer is overspending by $1,500/mo and Credex captures 30% of that savings as fee, that's $450/mo — same number from a different angle. ✓

## 2. CAC by channel (from GTM.md)

| Channel                             | Time cost                 | $ cost | Expected converts / month | CAC       |
| ----------------------------------- | ------------------------- | ------ | ------------------------- | --------- |
| YC W24 teardown (X + HN + Substack) | 12 hrs ($1,800 @ $150/hr) | $0     | 8                         | **$225**  |
| Free audits for 10 named startups   | 20 hrs ($3,000)           | $0     | 4                         | **$750**  |
| Rands Slack "what I learned" post   | 3 hrs ($450)              | $0     | 5                         | **$90**   |
| Show HN with savings-number title   | 6 hrs ($900)              | $0     | 6                         | **$150**  |
| Cold LinkedIn to 50 Eng Ops titles  | 10 hrs ($1,500)           | $0     | 3                         | **$500**  |
| Lenny's Tools roundup feature       | 1 hr ($150)               | $0     | 4                         | **$38**   |
| Podcast guest spot                  | 5 hrs ($750)              | $0     | 2                         | **$375**  |
| **Blended**                         | **57 hrs ($8,550)**       | **$0** | **32**                    | **~$270** |

Time-cost-only because the brief is $0 paid. A real CFO would call this $0 CAC; a realistic founder counts the hours.

## 3. Conversion rates that make this profitable

Funnel needed for LTV:CAC ≥ 3:1 (i.e. CAC ceiling ~$1,800):

| Stage                            | Rate     | Reasoning                                                       |
| -------------------------------- | -------- | --------------------------------------------------------------- |
| Audit completed → email captured | **40%**  | Strong magnet (the savings number), low friction                |
| Email → consultation booked      | **12%**  | In-product CTA is the unlock; benchmark for B2B SaaS demo flows |
| Consultation → credit purchase   | **25%**  | High because the audit already proved ROI numerically           |
| **End-to-end (audit → paid)**    | **1.2%** | 40% × 12% × 25%                                                 |

At 1.2% conversion and $5,400 LTV per paid customer, the **revenue per audit = $65**. With blended CAC of $270 per converted customer (~$3.25 per audit), **CAC payback ≈ 0.6 months** ($270 ÷ $450 MRR) and **LTV:CAC ≈ 20:1**. The ratio is unrealistically high because no paid spend — once paid acquisition starts, the bar resets. Calendar-time-to-first-revenue is more like ~3 months (audit → consultation → contract → first credit purchase).

**Break-even floor:** at fixed effort cost of $8,550/mo, 3:1 LTV:CAC needs ≥4.75 paid customers/mo (= $8,550 × 3 ÷ $5,400). From the same 2,667 audits/mo that produce the base 32 converts, that's an audit→paid floor of **~0.18%** before unit economics break.

## 4. What has to be true for $1M ARR in 18 months

$1M ARR ÷ ($450 MRR × 12) = **~185 active paying customers** at month 18.

With 12-month churn baked in, need to _acquire_ 280 customers total over 18 months → **~16/month sustained**.

At 1.2% audit→paid conversion, that's **~1,300 audits/month** by month 18.

Working backward to traffic:

- Audit completion rate (visit → submit): assume **15%**
- Required monthly visits at month 18: **~8,700**
- Compounding from week-1 baseline (500 visits) at **20% MoM growth** for 18 months = **~10,800 visits**. ✓ tight but achievable

**The three things that must be true:**

1. **Persona is right** — Eng Ops at Series A/B genuinely owns this budget (the single biggest risk).
2. **The "AI Tooling Price Index" becomes a citation magnet** — drives organic compounding, otherwise growth caps out at ~3% MoM.
3. **Credex's vendor partnerships actually unlock audit-only discounts** — without them, the 25% consultation→purchase rate halves and the model breaks.

## 5. Sensitivity (rough)

| Scenario    | Audit→paid | Monthly audits @ m18 | $ARR @ m18 |
| ----------- | ---------- | -------------------- | ---------- |
| Pessimistic | 0.5%       | 1,300                | ~$420k     |
| Base        | 1.2%       | 1,300                | **~$1.0M** |
| Optimistic  | 2.0%       | 1,300                | ~$1.7M     |

If the base case misses by 2×, the business is still real — just an 18-month delay, not a dead idea.
