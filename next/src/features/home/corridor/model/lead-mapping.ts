// Corridor answers → the real /leads multi-intent contract.
//
// The corridor asks in its own vocabulary (POD / Dropship / Express / Kho Mỹ) because that is the
// seller's vocabulary. This module is the ONLY place that translates it into the cross-repository
// lead keys, so the corridor can be re-worded without touching the contract, and the contract can
// gain a service without the corridor guessing at it.
//
// Two dimensions are typed by the contract (primary_service + service_interests); volume, channels
// and pain have no typed home on /leads, so they are appended to `message` as plain text rather
// than smuggled into `service_details` (which the backend validates strictly per service).
import { localize, type Locale } from "@/shared/i18n";
import type { LeadServiceKey } from "@/shared/ui/lead-services";

import {
  LANE_EXPRESS,
  LANE_WAREHOUSE,
  SOURCE_DROP,
  SOURCE_POD,
} from "./questions";
import {
  WAYBILL_ROWS,
  askOptionLabel,
  waybillValue,
  type CorridorAnswers,
  type Recommendation,
} from "./corridor-state";

const SOURCE_SERVICE: Readonly<Record<string, LeadServiceKey>> = {
  [SOURCE_POD]: "fulfill",
  [SOURCE_DROP]: "dropship",
};

const LANE_SERVICE: Readonly<Record<string, LeadServiceKey>> = {
  [LANE_EXPRESS]: "express",
  [LANE_WAREHOUSE]: "warehouse",
};

export interface CorridorLeadIntent {
  /** How the goods are created — the seller's principal relationship with THG. Null when they
   *  walked past gate 03 without answering, which the contract accepts as an unclassified lead. */
  readonly primaryService: LeadServiceKey | null;
  /** Primary first, then the lane. Never contains duplicates; always contains the primary. */
  readonly serviceInterests: LeadServiceKey[];
}

/**
 * The seller's sourcing choice is the primary service; the delivery lane is an adjacent interest.
 * A lane chosen without a source still produces a valid interest-only lead (primary is optional on
 * the contract) rather than defaulting them into a service they never picked.
 */
export function corridorLeadIntent(recommendation: Recommendation | null): CorridorLeadIntent {
  const primaryService = recommendation?.source ? (SOURCE_SERVICE[recommendation.source] ?? null) : null;
  const lane = recommendation?.lane ? (LANE_SERVICE[recommendation.lane] ?? null) : null;

  const serviceInterests: LeadServiceKey[] = [];
  if (primaryService) serviceInterests.push(primaryService);
  if (lane && lane !== primaryService) serviceInterests.push(lane);

  return { primaryService, serviceInterests };
}

/**
 * The untyped half of the waybill, rendered as the plain-text block Sales reads under the seller's
 * own note. Returns "" when nothing was answered, so an untouched corridor adds no noise.
 */
export function corridorLeadContext(
  lang: Locale,
  answers: CorridorAnswers,
  recommendation: Recommendation | null,
  heading: string,
): string {
  const lines = WAYBILL_ROWS.map((row) => {
    const value = waybillValue(lang, row.key, answers, recommendation);
    return value ? `${localize(lang, row.label)}: ${value}` : "";
  }).filter(Boolean);
  return lines.length > 0 ? `${heading}\n${lines.join("\n")}` : "";
}

/** The combination as one line ("POD + Kho Mỹ") — used by the dossier CTA and the payload header. */
export function comboLabel(lang: Locale, recommendation: Recommendation | null): string {
  if (!recommendation?.source || !recommendation?.lane) return "";
  return `${askOptionLabel(lang, "source", recommendation.source)} + ${askOptionLabel(lang, "lane", recommendation.lane)}`;
}
