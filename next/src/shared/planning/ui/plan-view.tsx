// PLAN VIEW — the renderer for an Operational Plan.
//
// A Server Component with zero client JS. It walks the six invariants and nothing else:
//
//   SUBJECT → CONSTRAINT → COURSE (capabilities · obligations both sides · trade-off) → GROUNDS
//   → EXPECTATION → IDENTITY
//
// That contract is what makes plan content evolvable without touching this file. A new plan, a
// reworded constraint, a new capability, a new seller situation — all data. The only change that
// would reach this component is the addition of a seventh invariant.
//
// It takes a `labels` resolver rather than any content of its own, so it is locale-free and reusable
// by any service that can produce a plan.
//
// TEXT-FIRST. The markup is a definition list and ordered lists: the accessible rendering IS the
// structure, not a parallel version of it. Nothing is behind an interaction, absent evidence renders
// as a labelled gap, and every ground states which kind of claim it is.
import type { ReactNode } from "react";

import type { Evidence, OperationalPlan } from "../plan";

/**
 * What a ground shows in its value slot.
 *
 * A switch rather than a chain of conditionals, so the discriminated union narrows and each kind's
 * rendering is stated once: an absent ground shows a labelled gap, a commitment shows the
 * undertaking in words, and a hard ground shows the figure it carries.
 */
function groundValue(
  evidence: Evidence,
  labels: (id: string) => string,
): ReactNode {
  switch (evidence.kind) {
    case "absent":
      return <span className="text-muted-foreground">{labels("ui.no_data_yet")}</span>;
    case "committed":
      return labels(evidence.id);
    default:
      return evidence.value;
  }
}

interface Props {
  plan: OperationalPlan;
  labels: (id: string) => string;
  /** The next step — supplied by the consumer, because a consultation CTA on a landing page and a
   *  proposal action in a CRM are the same invariant with different surfaces. */
  action?: ReactNode;
  /** Heading level, so the plan can sit at different depths without breaking a document outline. */
  as?: "h3" | "h4";
}

export function PlanView({ plan, labels, action, as: Heading = "h3" }: Readonly<Props>) {
  const thg = plan.course.obligations.filter((o) => o.party === "thg");
  const seller = plan.course.obligations.filter((o) => o.party === "seller");
  const { tradeoff } = plan.course;
  const { subject, identity, expectation } = plan;

  return (
    <article 
      className="grid gap-6 p-6 border border-border rounded-lg bg-card text-foreground scroll-mt-24" 
      id={`plan-${identity.planId}`} 
      data-plan-id={identity.planId}
    >
      {/* SUBJECT — who this plan is for, and how each part of that was established. */}
      <header className="flex flex-wrap items-baseline justify-between gap-y-3 gap-x-6 pb-5 border-b border-border">
        <p className="m-0 type-h3 text-foreground">
          {labels(`situation.${subject.situation.value}`)}
          <span aria-hidden="true"> · </span>
          {labels(`supply.${subject.supplyModel.value}`)}{" "}
          {subject.holdsStock.provenance === "inferred" ? (
            <span className="text-muted-foreground type-small font-mono">({labels("ui.inferred")})</span>
          ) : null}
        </p>
        <p className="inline-flex items-baseline gap-2 m-0 text-muted-foreground type-small font-mono">
          {labels("ui.confidence")}
          <span className="text-foreground">
            {labels(`confidence.${expectation.confidence}`)}
          </span>
        </p>
      </header>

      {/* CONSTRAINT — invariant. Why acting is necessary at all. */}
      <div className="grid gap-3">
        <Heading className="m-0 type-label text-muted-foreground">{labels("ui.constraint")}</Heading>
        <p className="m-0 type-h3 text-foreground max-w-[46ch]">{labels(plan.constraint.id)}</p>
      </div>

      {/* COURSE — what happens, who does it, and what it costs the seller. */}
      <div className="grid gap-3">
        <p className="m-0 type-label text-muted-foreground">{labels("ui.course")}</p>
        <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
          {plan.course.capabilities.map((capability, idx) => (
            <li key={capability} className={`px-3 py-1.5 border rounded-sm type-small font-mono ${idx === 0 ? "border-current font-semibold" : "border-border"}`}>
              {labels(`capability.${capability}`)}
            </li>
          ))}
        </ul>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 mt-2">
          <div>
            <p className="m-0 type-label text-muted-foreground">{labels("ui.thg_does")}</p>
            <ul className="grid gap-2 mt-2 ml-4.5 pl-0 text-muted-foreground type-small leading-relaxed list-disc marker:text-primary">
              {thg.map((o) => (
                <li key={o.id}>{labels(o.id)}</li>
              ))}
            </ul>
          </div>
          {/* A course with no seller obligations would be a sales pitch; the domain forbids it and
              this column is what makes the reciprocity impossible to miss. */}
          <div>
            <p className="m-0 type-label text-muted-foreground">{labels("ui.you_do")}</p>
            <ul className="grid gap-2 mt-2 ml-4.5 pl-0 text-muted-foreground type-small leading-relaxed list-disc marker:text-primary">
              {seller.map((o) => (
                <li key={o.id}>{labels(o.id)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-1.5 px-5 py-4 border-l-2 border-primary rounded-r-md bg-border/20 mt-4">
          <p className="m-0 type-label text-muted-foreground">{labels("ui.tradeoff")}</p>
          <p className="m-0 type-small leading-relaxed text-foreground max-w-[60ch]">
            {"none" in tradeoff ? labels(tradeoff.reasonId) : labels(tradeoff.id)}
          </p>
        </div>
      </div>

      {/* GROUNDS — kind-aware. `absent` is stated, which is the whole point of the kind existing. */}
      <div className="grid gap-3">
        <p className="m-0 type-label text-muted-foreground">{labels("ui.grounds")}</p>
        <dl className="grid m-0 border-t border-border">
          {plan.grounds.map((evidence) => (
            <div key={evidence.id} className="grid sm:grid-cols-[9rem_1fr] items-baseline gap-x-6 gap-y-1 py-3 border-b border-border" data-kind={evidence.kind}>
              {/* The term names WHICH fact this is; the kind says what sort of claim it is. Showing
                  only the kind left a reader looking at "Published · $7.50" with no way to know
                  whether that was a base cost, a lead time or something else entirely. */}
              <dt className="m-0 type-small text-foreground">{labels(evidence.id)}</dt>
              <dd className="m-0 type-small text-foreground max-w-[62ch]">
                <span className={`block type-label ${(evidence.kind === "published" || evidence.kind === "measured") ? "text-primary" : "text-muted-foreground"}`}>{labels(`kind.${evidence.kind}`)}</span>
                {groundValue(evidence, labels)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* EXPECTATION and IDENTITY. An outcome asserted without evidence would be an invented
          promise, so a null outcome renders nothing; what the plan deliberately does not know is
          listed rather than silently skipped. */}
      {expectation.outcomeId ? (
        <p className="type-body text-foreground">{labels(expectation.outcomeId)}</p>
      ) : null}

      <div className="grid gap-3">
        <p className="m-0 type-label text-muted-foreground">{labels("ui.deferred")}</p>
        <ul className="flex flex-wrap items-baseline gap-2 m-0 p-0 list-none">
          {subject.deferred.map((d) => (
            <li key={d.field} className="px-2 py-0.5 border border-dashed border-border rounded-sm type-small font-mono text-muted-foreground">
              {labels(`field.${d.field}`)}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-6 pt-8 border-t border-border mt-0">
        <p className="m-0 type-small font-mono text-muted-foreground">
          {labels("ui.identity")} {identity.planId} · {identity.catalogueVersion}
          {/* A drafted plan says so. Operations has not confirmed these assertions, and presenting
              them identically to a signed-off plan would be the fabrication the whole evidence
              model exists to prevent. */}
          {identity.verified ? null : (
            <span className="inline-block ml-2 px-2 py-0.5 border border-dashed border-border rounded-sm text-muted-foreground">{labels("ui.unverified")}</span>
          )}
        </p>
        {action}
      </div>
    </article>
  );
}
