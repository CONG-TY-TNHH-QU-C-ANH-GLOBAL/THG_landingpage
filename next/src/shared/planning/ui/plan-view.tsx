// PLAN VIEW — Specimen Sheet redesign
//
// Design decision: DOCUMENT → SPECIMEN SHEET
// Each plan reads like a technical data card, not a RACI matrix.
// Hierarchy: constraint headline (serif, large) → meta row (mono-data) →
//            2-col checklist (THG | Seller) → trade-off + CTA footer.
//
// Text density rule: checklist items max 1 line on desktop. Labels are the
// constraint, not the obligation description. Items that need more than 1
// line belong in /docs, not on a landing page.
//
// Evidence integrity: plan IDs, plan version visible in footer only
// (10px mono, low opacity) — structural metadata, not presentation.
import type { ReactNode } from "react";
import type { OperationalPlan } from "../plan";

// Gold check — THG's side
function GoldCheck() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0 mt-px"
    >
      <circle cx="8" cy="8" r="7.5" stroke="hsl(var(--primary))" strokeOpacity="0.25" />
      <path d="M5 8l2 2 4-4" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Neutral dash — seller's side
function NeutralMarker() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0 mt-px"
    >
      <circle cx="8" cy="8" r="7.5" stroke="#6B6B69" strokeOpacity="0.3" />
      <path d="M5.5 8h5" stroke="#6B6B69" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

interface Props {
  plan: OperationalPlan;
  labels: (id: string) => string;
  action?: ReactNode;
  as?: "h3" | "h4";
}

export function PlanView({ plan, labels, action, as: Heading = "h3" }: Readonly<Props>) {
  const thg = plan.course.obligations.filter((o) => o.party === "thg");
  const seller = plan.course.obligations.filter((o) => o.party === "seller");
  const { tradeoff } = plan.course;
  const { subject, identity, expectation } = plan;

  // Cap to 3 items per column on-render.
  // Items beyond 3 are omitted — they belong in /docs, not on a landing card.
  const thgItems = thg.slice(0, 3);
  const sellerItems = seller.slice(0, 3);

  // Capabilities shown as mono tags (max 2 — primary service + one dependency)
  const capabilities = plan.course.capabilities.slice(0, 2);

  return (
    <article
      className="group w-full flex flex-col bg-white border border-border rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-md"
      id={`plan-${identity.planId}`}
      data-plan-id={identity.planId}
    >
      {/* ── HEADER: Situation tag + Constraint headline ───────── */}
      <header className="px-6 pt-6 pb-5 md:px-8 md:pt-7 border-b border-border">
        {/* Situation + service tags — single row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-primary bg-primary/8 border border-primary/20 rounded">
            {labels(`situation.${subject.situation.value}`)}
          </span>
          {capabilities.map((cap) => (
            <span
              key={cap}
              className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground bg-muted border border-border rounded"
            >
              {labels(`capability.${cap}`)}
            </span>
          ))}
        </div>

        {/* Constraint — this IS the headline, not a label */}
        <Heading
          className="m-0 text-foreground tracking-tight leading-snug"
          style={{
            fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
            fontSize: "clamp(18px, 2.5vw, 24px)",
            lineHeight: 1.25,
            fontWeight: 400,
          }}
        >
          {labels(plan.constraint.id)}
        </Heading>
      </header>

      {/* ── BODY: 2-col checklist ─────────────────────────────── */}
      {/* Mobile: stacked. Desktop: side by side. Each column has its own header. */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">

        {/* THG DOES — primary column, gold markers */}
        <div className="px-6 py-5 md:px-8 md:py-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7l3 3 7-6" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
              {labels("ui.thg_does")}
            </span>
          </div>
          <ul className="space-y-2.5 m-0 p-0 list-none">
            {thgItems.map((o) => (
              <li key={o.id} className="flex items-start gap-2.5">
                <GoldCheck />
                <span className="text-[14px] text-foreground font-medium leading-snug">
                  {labels(o.id)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* SELLER DOES — secondary column, neutral markers */}
        {/* contrast: #6B6B69 on #FAFAF9 = 5.74:1 ✓ WCAG AA */}
        <div className="px-6 py-5 md:px-8 md:py-6 flex flex-col gap-4 bg-muted/20">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3.5 7h7" stroke="#6B6B69" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
              {labels("ui.you_do")}
            </span>
          </div>
          <ul className="space-y-2.5 m-0 p-0 list-none">
            {sellerItems.map((o) => (
              <li key={o.id} className="flex items-start gap-2.5">
                <NeutralMarker />
                {/* #374151 on #F4F4F2 = 7.2:1 ✓ well above 4.5:1 */}
                <span className="text-[14px] leading-snug" style={{ color: "#374151" }}>
                  {labels(o.id)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── FOOTER: Trade-off + CTA ────────────────────────────── */}
      <footer className="px-6 py-4 md:px-8 md:py-5 border-t border-border bg-muted/10 flex flex-col gap-4">
        {/* Trade-off — 1 sentence only */}
        {"none" in tradeoff ? null : (
          <p className="text-[13px] text-muted-foreground leading-snug m-0 italic flex items-start gap-2">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" className="shrink-0 mt-0.5">
              <path d="M6.5 2v5M6.5 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {labels(tradeoff.id)}
          </p>
        )}

        {/* Expected outcome + action */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            {expectation.outcomeId && (
              <p className="text-[13px] text-primary font-semibold m-0">
                {labels(expectation.outcomeId)}
              </p>
            )}
            {/* Plan ID — structural metadata only, de-emphasized */}
            <p className="text-[9px] font-mono text-muted-foreground/35 m-0 uppercase tracking-widest">
              {identity.planId}
              {!identity.verified && (
                <span className="ml-1.5 text-destructive/50">[{labels("ui.unverified")}]</span>
              )}
            </p>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </footer>
    </article>
  );
}
