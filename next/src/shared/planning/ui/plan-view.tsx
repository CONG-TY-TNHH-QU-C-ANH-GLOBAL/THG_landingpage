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

import type { OperationalPlan } from "../plan";
import styles from "./plan-view.module.css";

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
    <article className={styles.plan} id={`plan-${identity.planId}`} data-plan-id={identity.planId}>
      {/* SUBJECT — who this plan is for, and how each part of that was established. */}
      <header className={styles.head}>
        <p className={`${styles.subject} type-h3`}>
          {labels(`situation.${subject.situation.value}`)}
          <span aria-hidden="true"> · </span>
          {labels(`supply.${subject.supplyModel.value}`)}{" "}
          {subject.holdsStock.provenance === "inferred" ? (
            <span className={styles.inferred}>({labels("ui.inferred")})</span>
          ) : null}
        </p>
        <p className={styles.confidence}>
          {labels("ui.confidence")}
          <span className={styles.confidenceValue}>
            {labels(`confidence.${expectation.confidence}`)}
          </span>
        </p>
      </header>

      {/* CONSTRAINT — invariant. Why acting is necessary at all. */}
      <div className={styles.block}>
        <Heading className={`${styles.label} type-label`}>{labels("ui.constraint")}</Heading>
        <p className={`${styles.constraint} type-h3`}>{labels(plan.constraint.id)}</p>
      </div>

      {/* COURSE — what happens, who does it, and what it costs the seller. */}
      <div className={styles.block}>
        <p className={`${styles.label} type-label`}>{labels("ui.course")}</p>
        <ul className={styles.capabilities}>
          {plan.course.capabilities.map((capability) => (
            <li key={capability} className={styles.capability}>
              {labels(`capability.${capability}`)}
            </li>
          ))}
        </ul>

        <div className={styles.obligations}>
          <div>
            <p className={`${styles.label} type-label`}>{labels("ui.thg_does")}</p>
            <ul className={`${styles.list} type-small`}>
              {thg.map((o) => (
                <li key={o.id}>{labels(o.id)}</li>
              ))}
            </ul>
          </div>
          {/* A course with no seller obligations would be a sales pitch; the domain forbids it and
              this column is what makes the reciprocity impossible to miss. */}
          <div>
            <p className={`${styles.label} type-label`}>{labels("ui.you_do")}</p>
            <ul className={`${styles.list} type-small`}>
              {seller.map((o) => (
                <li key={o.id}>{labels(o.id)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.tradeoff}>
          <p className={`${styles.label} type-label`}>{labels("ui.tradeoff")}</p>
          <p className={`${styles.tradeoffText} type-small`}>
            {"none" in tradeoff ? labels(tradeoff.reasonId) : labels(tradeoff.id)}
          </p>
        </div>
      </div>

      {/* GROUNDS — kind-aware. `absent` is stated, which is the whole point of the kind existing. */}
      <div className={styles.block}>
        <p className={`${styles.label} type-label`}>{labels("ui.grounds")}</p>
        <dl className={styles.grounds}>
          {plan.grounds.map((evidence) => (
            <div key={evidence.id} className={styles.ground} data-kind={evidence.kind}>
              <dt className={styles.groundKind}>{labels(`kind.${evidence.kind}`)}</dt>
              <dd className={`${styles.groundValue} type-small`}>
                {evidence.kind === "absent" ? (
                  <span className={styles.absent}>
                    {labels(evidence.id)} — {labels("ui.no_data_yet")}
                  </span>
                ) : (
                  (evidence.value ?? labels(evidence.id))
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* EXPECTATION and IDENTITY. An outcome asserted without evidence would be an invented
          promise, so a null outcome renders nothing; what the plan deliberately does not know is
          listed rather than silently skipped. */}
      {expectation.outcomeId ? (
        <p className="type-body">{labels(expectation.outcomeId)}</p>
      ) : null}

      <div className={styles.block}>
        <p className={`${styles.label} type-label`}>{labels("ui.deferred")}</p>
        <ul className={styles.deferred}>
          {subject.deferred.map((d) => (
            <li key={d.field} className={styles.deferredItem}>
              {labels(`field.${d.field}`)}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.foot}>
        <p className={styles.identity}>
          {labels("ui.identity")} {identity.planId} · {identity.catalogueVersion}
        </p>
        {action}
      </div>
    </article>
  );
}
