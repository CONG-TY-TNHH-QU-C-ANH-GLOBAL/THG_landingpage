// SELECTION — turning a seller's situation into an Operational Plan.
//
// A pure function. No clock, no locale, no I/O, no randomness. That is a hard requirement rather than a
// preference: the same selection has to be reproducible on a server at build time, in a browser after a
// seller changes an answer, in a CRM replaying a historical decision, and inside a test. Anything
// ambient in here would make those four disagree.
//
// `producedAt` is therefore INJECTED, never read from the clock.
import { CATALOGUE_VERSION, findTemplate } from "./catalogue";
import {
  deriveConfidence,
  type DestinationId,
  type Evidence,
  type Known,
  type OperationalPlan,
  type SituationId,
  type Subject,
  type SupplyModel,
} from "./plan";

/** What a consumer has gathered. Only the first two are required to produce a plan. */
export interface SelectionInput {
  situation: SituationId;
  supplyModel: SupplyModel;
  destination?: DestinationId;
  /** Injected so selection stays pure. Null is legitimate — a plan rendered statically at build time
   *  has no meaningful production instant. */
  producedAt?: string | null;
  /** Resolves the evidence ids a plan cites. Supplied by the edge that owns the data; the domain never
   *  reaches for CMS or content itself. An id with no resolution becomes `absent` — never dropped, so a
   *  missing fact renders as a labelled gap instead of disappearing. */
  resolveEvidence?: (id: string) => Evidence | undefined;
}

const asked = <T,>(value: T): Known<T> => ({ value, provenance: "asked" });

/**
 * Context a plan deliberately does not gather, and where each one gets resolved instead.
 *
 * Exported because a surface that tells a seller what the consultation will cover must read the same
 * list the plan records, or the two drift and the page starts promising a conversation about
 * something the handoff never mentions.
 */
export const DEFERRED_FIELDS = ["capital", "monthlyVolume"] as const;

/** Unresolvable evidence is still cited. Silence would let a gap look like it was never claimed. */
function resolveGrounds(
  ids: readonly string[],
  resolve: SelectionInput["resolveEvidence"],
): readonly Evidence[] {
  return ids.map(
    (id) =>
      resolve?.(id) ?? {
        id,
        kind: "absent" as const,
        source: "not-yet-published",
      },
  );
}

/**
 * Produce the Operational Plan for a seller's situation.
 *
 * Returns `null` only when the catalogue has no entry for the combination — a coverage failure that the
 * test suite forbids, surfaced rather than papered over with a default. A fallback plan here would be a
 * recommendation nobody authored.
 */
export function selectPlan(input: SelectionInput): OperationalPlan | null {
  const template = findTemplate(input.situation, input.supplyModel);
  if (!template) return null;

  const subject: Subject = {
    situation: asked(input.situation),
    supplyModel: asked(input.supplyModel),
    // Entailed, not asked: print-on-demand is make-to-order, so a custom seller holds no finished stock.
    // Recording it as `inferred` lets an interface show the seller what was concluded on their behalf.
    holdsStock:
      input.supplyModel === "custom"
        ? { value: false, provenance: "inferred" }
        : { value: true, provenance: "asked" },
    ...(input.destination ? { destination: asked(input.destination) } : {}),
    // Recorded rather than silently skipped: a downstream consumer should be able to see what this plan
    // deliberately does not know, and where it gets resolved.
    deferred: DEFERRED_FIELDS.map((field) => ({ field, resolvedAt: "consultation" as const })),
  };

  const grounds = resolveGrounds(template.evidenceIds, input.resolveEvidence);

  return {
    identity: {
      planId: template.planId,
      catalogueVersion: CATALOGUE_VERSION,
      producedAt: input.producedAt ?? null,
    },
    subject,
    constraint: template.constraint,
    course: template.course,
    grounds,
    expectation: {
      outcomeId: template.outcomeId,
      confidence: deriveConfidence(subject, grounds),
    },
  };
}

/**
 * A compact human-readable summary for the sales handoff, serialized into the existing `/leads`
 * `message` field.
 *
 * It takes a `labels` resolver rather than formatting text itself, because the domain must stay
 * locale-free while the salesperson reading it works in Vietnamese. This is the correction to an earlier
 * draft that put a generated `summaryText` on the Plan and simultaneously required the producer of it to
 * be locale-independent — those two could not both be true.
 */
export function summarizeForHandoff(
  plan: OperationalPlan,
  labels: (id: string) => string,
): string {
  const situation = labels(`situation.${plan.subject.situation.value}`);
  const supply = labels(`supply.${plan.subject.supplyModel.value}`);
  const course = plan.course.capabilities.map((c) => labels(`capability.${c}`)).join(" + ");

  const lines = [
    `${labels("handoff.situation")}: ${situation} · ${supply}`,
    `${labels("handoff.constraint")}: ${labels(plan.constraint.id)}`,
    `${labels("handoff.course")}: ${course}`,
  ];
  if (plan.subject.destination) {
    lines.push(`${labels("handoff.destination")}: ${plan.subject.destination.value}`);
  }
  // The plan id and catalogue version make the recommendation reproducible and analysable later.
  lines.push(`[${plan.identity.planId} · ${plan.identity.catalogueVersion}]`);
  return lines.join("\n");
}
