// THE PLAN CATALOGUE — six drafted Operational Plans, keyed by situation × supply model.
//
// ⚠ EVERY ENTRY IS `verified: false`. The business assertions below — which constraint a seller in each
// situation actually has, which obligations fall on them, what trade-off they accept — are drafted from
// THG's own published content and are UNCONFIRMED. They exist so THG operations can correct something
// concrete rather than start from a blank page. Nothing here should reach production unreviewed.
//
// Every constraint, obligation, trade-off, evidence and outcome is referenced BY ID. Ids resolve to
// localized strings at the rendering edge, never here. That is what lets one catalogue serve three
// locales: business logic is not duplicated per language, and a translation change touches no logic.
//
// WHY A LOOKUP AND NOT A RULE ENGINE. Two enums, six combinations, no ranges, no overlapping conditions,
// no priority to resolve. A composite key is the whole mechanism. The engine becomes correct when
// conditions stop being enum-shaped — volume BANDS, overlapping predicates — and the entry shape here is
// deliberately engine-compatible so that upgrade is additive rather than a rewrite.
import type { NextStep, Obligation, PlanTemplate, SituationId, SupplyModel } from "./plan";

/** Bump when any entry's business content changes. Stamped into every plan's identity so a
 *  recommendation made months ago remains explainable. */
export const CATALOGUE_VERSION = "0.1.0-draft";

const key = (situation: SituationId, supplyModel: SupplyModel) => `${situation}:${supplyModel}`;

// Constructors for the two shapes every entry repeats. They exist so an entry reads as the argument
// it is — who owes what — instead of as thirty copies of the same object literal, and so the party
// can never be typed onto the wrong side of a course.
const thg = (id: string): Obligation => ({ id, party: "thg" });
const seller = (id: string): Obligation => ({ id, party: "seller" });

/** Every drafted plan ends at the same place: a conversation. A self-serve or proposal next step
 *  becomes a per-entry value the day one of them does something else. */
const CONSULTATION: NextStep = { kind: "consultation" };

/**
 * ── CUSTOM (the seller prints their own design) → fulfill ─────────────────────────────────────────────
 * Three plans, ONE capability. This is the distinction that drives the whole domain: same capability,
 * different constraint, different obligations, different grounds, different consultation preparation.
 */
const CUSTOM_PLANS: readonly PlanTemplate[] = [
  {
    planId: "launch-custom",
    situation: "starting",
    supplyModel: "custom",
    // Not a failing status quo — there is no operation yet to fail.
    constraint: { id: "constraint.no_operation_yet", kind: "absent-operation" },
    course: {
      capabilities: ["fulfill"],
      obligations: [
        thg("obligation.thg.print_on_demand"),
        thg("obligation.thg.item_level_qc"),
        thg("obligation.thg.us_standard_pack"),
        seller("obligation.seller.print_ready_artwork"),
      ],
      tradeoff: { id: "tradeoff.per_unit_vs_bulk" },
      nextStep: CONSULTATION,
    },
    evidenceIds: [
      "evidence.production_geography",
      "evidence.item_level_qc",
      "evidence.us_standard_pack",
      "evidence.payment_rails",
      "evidence.basecost", // absent today — renders as a labelled gap, gains proof when the CMS lands
    ],
    outcomeId: null, // no lead-time data exists; an outcome here would be invented
    verified: false,
  },
  {
    planId: "expand-custom",
    situation: "expanding",
    supplyModel: "custom",
    // THG's own pain copy: VN/CN → US transit of 10–20 days causes cancellations.
    constraint: { id: "constraint.transit_cancellations", kind: "failing-status-quo" },
    course: {
      capabilities: ["fulfill", "express"],
      obligations: [
        thg("obligation.thg.route_by_destination"),
        thg("obligation.thg.us_domestic_fulfillment"),
        thg("obligation.thg.item_level_qc"),
        seller("obligation.seller.print_ready_artwork"),
        seller("obligation.seller.sku_mapping"),
      ],
      tradeoff: { id: "tradeoff.us_production_cost_vs_transit" },
      nextStep: CONSULTATION,
    },
    evidenceIds: [
      "evidence.production_geography",
      "evidence.destination_coverage",
      "evidence.item_level_qc",
      "evidence.tracking",
      "evidence.lead_time", // absent today
    ],
    outcomeId: null,
    verified: false,
  },
  {
    planId: "operate-custom",
    situation: "operating",
    supplyModel: "custom",
    // Pains 3 and 4: messy order/SKU management, slow support and hidden fees.
    constraint: { id: "constraint.order_management_errors", kind: "scaling-limit" },
    course: {
      capabilities: ["fulfill"],
      obligations: [
        thg("obligation.thg.hub_visibility"),
        thg("obligation.thg.bulk_intake"),
        thg("obligation.thg.support_channels"),
        seller("obligation.seller.sku_sync"),
        seller("obligation.seller.prepaid_wallet"),
      ],
      tradeoff: { id: "tradeoff.prepaid_model" },
      nextStep: CONSULTATION,
    },
    evidenceIds: [
      "evidence.hub_modules",
      "evidence.bulk_csv_intake",
      "evidence.tracking",
      "evidence.compensation_policy",
      "evidence.prepaid_transparency",
    ],
    outcomeId: null,
    verified: false,
  },
];

/** ── SOURCED (the seller resells goods THG sources) → dropship / warehouse ─────────────────────────── */
const SOURCED_PLANS: readonly PlanTemplate[] = [
  {
    planId: "launch-sourced",
    situation: "starting",
    supplyModel: "sourced",
    constraint: { id: "constraint.no_supply_chain", kind: "absent-operation" },
    course: {
      capabilities: ["dropship"],
      obligations: [
        thg("obligation.thg.source_per_order"),
        thg("obligation.thg.ship_per_order"),
        seller("obligation.seller.product_specs"),
      ],
      // A published limit, not a hedge: THG does not source from AliExpress or SHEIN.
      tradeoff: { id: "tradeoff.sourcing_scope_limits" },
      nextStep: CONSULTATION,
    },
    evidenceIds: [
      "evidence.sourcing_scope",
      "evidence.compensation_policy",
      "evidence.payment_rails",
      "evidence.basecost",
    ],
    outcomeId: null,
    verified: false,
  },
  {
    planId: "expand-sourced",
    situation: "expanding",
    supplyModel: "sourced",
    constraint: { id: "constraint.transit_cancellations", kind: "failing-status-quo" },
    course: {
      capabilities: ["dropship", "express"],
      obligations: [
        thg("obligation.thg.source_per_order"),
        thg("obligation.thg.route_by_destination"),
        seller("obligation.seller.product_specs"),
        seller("obligation.seller.sku_mapping"),
      ],
      tradeoff: { id: "tradeoff.sourcing_scope_limits" },
      nextStep: CONSULTATION,
    },
    evidenceIds: [
      "evidence.sourcing_scope",
      "evidence.destination_coverage",
      "evidence.tracking",
      "evidence.lead_time",
    ],
    outcomeId: null,
    verified: false,
  },
  {
    planId: "operate-sourced",
    situation: "operating",
    supplyModel: "sourced",
    // At volume with held stock the blocker is control and cost visibility, not transit.
    constraint: { id: "constraint.inventory_control", kind: "scaling-limit" },
    course: {
      capabilities: ["warehouse", "express"],
      obligations: [
        thg("obligation.thg.store_and_id"),
        thg("obligation.thg.route_by_destination"),
        thg("obligation.thg.hub_visibility"),
        seller("obligation.seller.stock_forecast"),
        seller("obligation.seller.prepaid_wallet"),
      ],
      tradeoff: { id: "tradeoff.storage_vs_per_order" },
      nextStep: CONSULTATION,
    },
    evidenceIds: [
      "evidence.intake_operational_id",
      "evidence.hub_modules",
      "evidence.prepaid_transparency",
      "evidence.destination_coverage",
      "evidence.storage_cost", // absent today
    ],
    outcomeId: null,
    verified: false,
  },
];

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
