// THE CONTENT REGISTRIES — every id the planning domain can reference, declared once.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// WHY THIS FILE EXISTS
//
// The catalogue names ids. The rendering edge labels ids. Before this registry existed, those were
// two independent lists of the same ~60 strings, written in two shapes, with nothing to hold them
// together: a typo in either place resolved silently to a placeholder, an id could be added to the
// catalogue and never labelled, and a label could outlive the plan that used it. The two lists also
// carried the same information three times over — `{ id: "obligation.thg.print_on_demand", party:
// "thg" }` states "this is an obligation" and "it is THG's" twice each.
//
// So the id is declared here, exactly once, in the registry for its kind. Everything else is
// derived:
//
//   · the qualified string      — from the registry it belongs to
//   · an obligation's `party`   — from which registry it belongs to
//   · a constraint's `kind`     — a property of the constraint, not of each plan that cites it
//   · label coverage            — `satisfies Record<Id, …>` at the rendering edge, so an unlabelled
//                                 id is a build failure rather than a placeholder in production
//
// The registries are locale-free and framework-free, like the rest of the domain. They hold no
// copy: a label lives with the content tree that can produce it.

import type { Constraint, Obligation } from "./plan";

// ── Constraints ─────────────────────────────────────────────────────────────────────────────────

/**
 * Every constraint, with its kind.
 *
 * The kind belongs to the constraint. `transit_cancellations` is a failing status quo whichever
 * plan cites it, and stating that per-plan made it possible for two plans to disagree about the
 * same constraint.
 */
export const CONSTRAINTS = {
  no_operation_yet: "absent-operation",
  no_supply_chain: "absent-operation",
  transit_cancellations: "failing-status-quo",
  order_management_errors: "scaling-limit",
  inventory_control: "scaling-limit",
} as const satisfies Record<string, Constraint["kind"]>;

export type ConstraintName = keyof typeof CONSTRAINTS;

// ── Obligations ─────────────────────────────────────────────────────────────────────────────────

/** What THG undertakes to do. */
export const THG_OBLIGATIONS = [
  "print_on_demand",
  "item_level_qc",
  "us_standard_pack",
  "route_by_destination",
  "us_domestic_fulfillment",
  "hub_visibility",
  "bulk_intake",
  "support_channels",
  "store_and_id",
  "source_per_order",
  "ship_per_order",
] as const;

/** What the seller must supply for the plan to function. */
export const SELLER_OBLIGATIONS = [
  "print_ready_artwork",
  "sku_mapping",
  "sku_sync",
  "prepaid_wallet",
  "product_specs",
  "stock_forecast",
] as const;

export type ThgObligationName = (typeof THG_OBLIGATIONS)[number];
export type SellerObligationName = (typeof SELLER_OBLIGATIONS)[number];

// ── Trade-offs ──────────────────────────────────────────────────────────────────────────────────

export const TRADEOFFS = [
  "per_unit_vs_bulk",
  "us_production_cost_vs_transit",
  "prepaid_model",
  "sourcing_scope_limits",
  "storage_vs_per_order",
] as const;

export type TradeoffName = (typeof TRADEOFFS)[number];

// ── Evidence ────────────────────────────────────────────────────────────────────────────────────

export const EVIDENCE = [
  "production_geography",
  "item_level_qc",
  "us_standard_pack",
  "destination_coverage",
  "tracking",
  "intake_operational_id",
  "hub_modules",
  "bulk_csv_intake",
  "prepaid_transparency",
  "payment_rails",
  "compensation_policy",
  "sourcing_scope",
  // Cited but unpublished. They resolve to `absent` and render as labelled gaps; the day the CMS
  // carries a figure the same plans gain proof with no change here.
  "basecost",
  "lead_time",
  "storage_cost",
] as const;

export type EvidenceName = (typeof EVIDENCE)[number];

// ── Qualified ids ───────────────────────────────────────────────────────────────────────────────
//
// The wire format. Self-describing on purpose: an id that surfaces in a log, a CRM record or a DOM
// attribute says what kind of thing it is without a lookup. Built here so the prefix is written
// once rather than at every one of the sixty use sites.

export const constraintId = (name: ConstraintName) => `constraint.${name}`;
export const evidenceId = (name: EvidenceName) => `evidence.${name}`;
export const tradeoffId = (name: TradeoffName) => `tradeoff.${name}`;

/** The party is not stated alongside the id — it IS which registry the id came from. */
export const thgObligation = (name: ThgObligationName): Obligation => ({
  id: `obligation.thg.${name}`,
  party: "thg",
});

export const sellerObligation = (name: SellerObligationName): Obligation => ({
  id: `obligation.seller.${name}`,
  party: "seller",
});

/** The constraint, with the kind the registry holds for it. */
export const constraint = (name: ConstraintName): Constraint => ({
  id: constraintId(name),
  kind: CONSTRAINTS[name],
});
