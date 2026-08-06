// THE PLAN CATALOGUE — six drafted Operational Plans, keyed by situation × supply model.
//
// ⚠ EVERY ENTRY IS UNVERIFIED. The business assertions below — which constraint a seller in each
// situation actually has, which obligations fall on them, what trade-off they accept — are drafted
// from THG's own published content and are UNCONFIRMED. They exist so THG operations can correct
// something concrete rather than start from a blank page. `verified` travels onto every plan, and
// the renderer says so.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// THE CATALOGUE IS A TABLE, SO IT IS WRITTEN AS ONE.
//
// Each entry states only what distinguishes it: the constraint, the capabilities that activate,
// who owes what, the cost, and the grounds. Everything else is derived by `entry` because it is not
// per-plan information:
//
//   · `planId`        — the situation's verb and the supply model. Writing it out invited a third
//                       spelling of a coordinate already given by the two arguments.
//   · `party`         — which list an obligation is in.
//   · constraint kind — a property of the constraint (see `ids.ts`), not of each plan citing it.
//   · `nextStep`      — every drafted plan ends at a conversation.
//   · `outcomeId`     — null throughout: no lead-time data exists, and an outcome asserted without
//                       evidence would be an invented promise.
//   · `verified`      — false throughout, until operations signs each entry off individually.
//
// Ids are registry members rather than strings (`ids.ts`), so a mistyped obligation is a build
// failure instead of a placeholder in production, and the rendering edge can prove it labels all
// of them.
//
// WHY A LOOKUP AND NOT A RULE ENGINE. Two enums, six combinations, no ranges, no overlapping
// conditions, no priority to resolve. A composite key is the whole mechanism. The engine becomes
// correct when conditions stop being enum-shaped — volume BANDS, overlapping predicates — and this
// shape is deliberately engine-compatible, so that upgrade is additive rather than a rewrite.
import {
  constraint,
  evidenceId,
  sellerObligation,
  thgObligation,
  tradeoffId,
  type ConstraintName,
  type EvidenceName,
  type SellerObligationName,
  type ThgObligationName,
  type TradeoffName,
} from "./ids";
import type { CapabilityId, NextStep, PlanTemplate, SituationId, SupplyModel } from "./plan";

/** Bump when any entry's business content changes. Stamped into every plan's identity so a
 *  recommendation made months ago remains explainable. */
export const CATALOGUE_VERSION = "0.1.0-draft";

const key = (situation: SituationId, supplyModel: SupplyModel) => `${situation}:${supplyModel}`;

/**
 * The published name of a situation, used to build the plan id.
 *
 * A separate mapping because the two vocabularies serve different readers: `starting` describes the
 * seller, `launch` names the plan in a lead record. Changing a plan id breaks the traceability of
 * every consultation already attributed to it, so the mapping is explicit rather than incidental.
 */
const PLAN_ID_VERB = {
  starting: "launch",
  expanding: "expand",
  operating: "operate",
} as const satisfies Record<SituationId, string>;

/** Every drafted plan ends at the same place: a conversation. */
const CONSULTATION: NextStep = { kind: "consultation" };

/** What genuinely differs between one plan and the next. */
interface PlanSpec {
  constraint: ConstraintName;
  capabilities: readonly CapabilityId[];
  /** What THG undertakes. */
  thg: readonly ThgObligationName[];
  /** What the seller must supply. */
  seller: readonly SellerObligationName[];
  tradeoff: TradeoffName;
  /** The grounds the plan rests on, in the order they are read. */
  grounds: readonly EvidenceName[];
}

function entry(
  situation: SituationId,
  supplyModel: SupplyModel,
  spec: PlanSpec,
): PlanTemplate {
  return {
    planId: `${PLAN_ID_VERB[situation]}-${supplyModel}`,
    situation,
    supplyModel,
    constraint: constraint(spec.constraint),
    course: {
      capabilities: spec.capabilities,
      // THG's side first, then the seller's. A course that lists only one party is a sales pitch,
      // and the domain has no way to express one: both lists are required by the spec type.
      obligations: [...spec.thg.map(thgObligation), ...spec.seller.map(sellerObligation)],
      tradeoff: { id: tradeoffId(spec.tradeoff) },
      nextStep: CONSULTATION,
    },
    evidenceIds: spec.grounds.map(evidenceId),
    outcomeId: null,
    verified: false,
  };
}

/**
 * ── CUSTOM (the seller prints their own design) ───────────────────────────────────────────────────
 * Three plans, and the first and third share ONE capability. This is the distinction that drives
 * the whole domain: same capability, different constraint, different obligations, different
 * grounds, different consultation preparation.
 */
const CUSTOM_PLANS = [
  // No failing status quo — there is no operation yet to fail.
  entry("starting", "custom", {
    constraint: "no_operation_yet",
    capabilities: ["fulfill"],
    thg: ["print_on_demand", "item_level_qc", "us_standard_pack"],
    seller: ["print_ready_artwork"],
    tradeoff: "per_unit_vs_bulk",
    grounds: [
      "production_geography",
      "item_level_qc",
      "us_standard_pack",
      "payment_rails",
      "basecost",
    ],
  }),
  // THG's own pain copy: VN/CN → US transit of 10–20 days causes cancellations.
  entry("expanding", "custom", {
    constraint: "transit_cancellations",
    capabilities: ["fulfill", "express"],
    thg: ["route_by_destination", "us_domestic_fulfillment", "item_level_qc"],
    seller: ["print_ready_artwork", "sku_mapping"],
    tradeoff: "us_production_cost_vs_transit",
    grounds: [
      "production_geography",
      "destination_coverage",
      "item_level_qc",
      "tracking",
      "lead_time",
    ],
  }),
  // Pains 3 and 4: messy order/SKU management, slow support and hidden fees.
  entry("operating", "custom", {
    constraint: "order_management_errors",
    capabilities: ["fulfill"],
    thg: ["hub_visibility", "bulk_intake", "support_channels"],
    seller: ["sku_sync", "prepaid_wallet"],
    tradeoff: "prepaid_model",
    grounds: [
      "hub_modules",
      "bulk_csv_intake",
      "tracking",
      "compensation_policy",
      "prepaid_transparency",
    ],
  }),
] as const satisfies readonly PlanTemplate[];

/** ── SOURCED (the seller resells goods THG sources) ─────────────────────────────────────────── */
const SOURCED_PLANS = [
  entry("starting", "sourced", {
    constraint: "no_supply_chain",
    capabilities: ["dropship"],
    thg: ["source_per_order", "ship_per_order"],
    seller: ["product_specs"],
    // A published limit, not a hedge: THG does not source from AliExpress or SHEIN.
    tradeoff: "sourcing_scope_limits",
    grounds: ["sourcing_scope", "compensation_policy", "payment_rails", "basecost"],
  }),
  entry("expanding", "sourced", {
    constraint: "transit_cancellations",
    capabilities: ["dropship", "express"],
    thg: ["source_per_order", "route_by_destination"],
    seller: ["product_specs", "sku_mapping"],
    tradeoff: "sourcing_scope_limits",
    grounds: ["sourcing_scope", "destination_coverage", "tracking", "lead_time"],
  }),
  // At volume with held stock the blocker is control and cost visibility, not transit.
  entry("operating", "sourced", {
    constraint: "inventory_control",
    capabilities: ["warehouse", "express"],
    thg: ["store_and_id", "route_by_destination", "hub_visibility"],
    seller: ["stock_forecast", "prepaid_wallet"],
    tradeoff: "storage_vs_per_order",
    grounds: [
      "intake_operational_id",
      "hub_modules",
      "prepaid_transparency",
      "destination_coverage",
      "storage_cost",
    ],
  }),
] as const satisfies readonly PlanTemplate[];

export const PLAN_CATALOGUE: readonly PlanTemplate[] = [...CUSTOM_PLANS, ...SOURCED_PLANS];

const BY_KEY: ReadonlyMap<string, PlanTemplate> = new Map(
  PLAN_CATALOGUE.map((template) => [key(template.situation, template.supplyModel), template]),
);

/** The whole selection mechanism. A composite key over two enums — no predicates, no priority. */
export function findTemplate(
  situation: SituationId,
  supplyModel: SupplyModel,
): PlanTemplate | undefined {
  return BY_KEY.get(key(situation, supplyModel));
}
