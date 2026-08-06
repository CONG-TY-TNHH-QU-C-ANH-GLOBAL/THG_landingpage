import type { FulfillFaq } from "../models/faq";

// POINT-OF-DOUBT PLACEMENT for the seven canonical answers.
//
// Each answer appears TWICE: once at the movement where the question actually arises, and once in
// the canonical index at the end. The duplication is deliberate — an answer about liability is
// worthless three screens after the reader wondered about liability — and it must not be optimised
// away.
//
// The map lives here, in one file, rather than as an index literal inside each section, so the
// coupling between "the fourth answer" and "the commitment movement" is reviewable in one place and
// testable. Position is the key because it is what both content sources agree on: the CMS list and
// the localized fallback carry the same seven answers in the same canonical order, while their ids
// are owned by different systems.
export const FAQ_SLOT = {
  /** What services, from which origins, to which destinations. The scope statement itself. */
  serviceScope: 0,
  /** Where orders are placed. */
  orderPlacement: 1,
  /** How THG learns about a new order. */
  orderNotification: 2,
  /** Payment rails. */
  payment: 3,
  /** Where product templates are found. */
  templates: 4,
  /** Compensation for lost or damaged orders. */
  compensation: 5,
  /** The sourcing limit — what THG will not buy from. */
  sourcingLimit: 6,
} as const;

/**
 * The answer for a slot, or `undefined` when the source is shorter than the canonical set.
 *
 * Returning undefined rather than a placeholder is the point: a section renders the answer it has
 * and renders nothing where it has none. A fabricated answer at a point of doubt is worse than an
 * unanswered one.
 */
export function pickFaq(
  faqs: readonly FulfillFaq[],
  slot: (typeof FAQ_SLOT)[keyof typeof FAQ_SLOT],
): FulfillFaq | undefined {
  // Matched on the canonical id, never on position. The CMS DTO guarantees only that an id is
  // numeric, so an editor reordering the list would otherwise move the liability answer into the
  // scope movement — silently, and in production. A set without the canonical id renders nothing
  // at that point of doubt; the canonical index still carries every answer it does have.
  return faqs.find((faq) => faq.id === slot + 1);
}
