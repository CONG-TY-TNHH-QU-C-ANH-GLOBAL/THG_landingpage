// THE OPERATIONAL PLAN — the product's canonical decision artifact.
//
// This module is the domain, and nothing else. No React, no Next, no CMS types, no localized strings,
// no formatting. That constraint is not stylistic: the Plan is meant to be consumed by the landing
// page, CRM workflows, sales handoff, internal tooling, analytics, documentation and assistants, so it
// cannot carry anything that only makes sense inside one of them.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────────────
// A PLAN IS NOT A CAPABILITY.
//
// Capability is one attribute of `Course`. Two sellers may be routed to the same capability and still
// need entirely different plans: an independent artist launching their first POD line and an
// established brand expanding into the US both belong on `fulfill`, but their constraint, the evidence
// that persuades them, the obligations they take on, and the consultation a salesperson should prepare
// are different in every respect.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────────────
// THE SIX INVARIANTS
//
//   1 SUBJECT      whose plan is this, and how do we know      → `Subject`
//   2 CONSTRAINT   why act at all                              → `Constraint`
//   3 COURSE       who does what, and what is given up         → `Course`
//   4 GROUNDS      on what basis                               → `Evidence[]`
//   5 EXPECTATION  what changes, and how far to trust it       → `Expectation`
//   6 IDENTITY     which plan, from which logic, from what     → `PlanIdentity`
//
// Renderers and downstream consumers read ONLY these six. That is what makes plan content evolvable
// without touching anything that displays it: new plans, reworded constraints, new capabilities and new
// seller situations are all data. The single change that would force every consumer to change is the
// addition of a SEVENTH invariant — which is why the set above is the real architecture, not the
// storage technique underneath it.

/** Every capability THG can place inside a plan. A future service is a new member here plus catalogue
 *  rows — no domain change. Mirrors the backend service contract where the two overlap. */
export const CAPABILITIES = ["fulfill", "express", "warehouse", "dropship"] as const;
export type CapabilityId = (typeof CAPABILITIES)[number];

/** How the seller recognises themselves. One question that carries stage, volume band and market
 *  maturity together, because sellers classify abstract attributes ("what stage are you?") unreliably
 *  and being asked reads as interrogation. A new seller journey — agencies, aggregators — is a new
 *  member here, not a new mechanism. */
export const SITUATIONS = ["starting", "expanding", "operating"] as const;
export type SituationId = (typeof SITUATIONS)[number];

/** What the seller sells. This is what routes capability. */
export const SUPPLY_MODELS = ["custom", "sourced"] as const;
export type SupplyModel = (typeof SUPPLY_MODELS)[number];

export const DESTINATIONS = ["US", "UK", "WW"] as const;
export type DestinationId = (typeof DESTINATIONS)[number];

// ── 1 · SUBJECT ──────────────────────────────────────────────────────────────────────────────────────

/**
 * How a field's value came to be known. Part of the invariant rather than bookkeeping: "asked" and
 * "assumed" carry different authority, and a consumer that cannot tell them apart will over-trust a
 * guess. It also lets an interface show the seller what it inferred, so they can correct it.
 */
export type Provenance = "asked" | "inferred" | "measured" | "assumed" | "deferred";

export interface Known<T> {
  value: T;
  provenance: Provenance;
}

// Artwork measurement (pixel dimensions, aspect ratio, effective DPI) was part of an earlier design in
// which geometry SELECTED a product. Under this domain the supply model determines capability, and THG
// publishes no print-area specification for a DPI figure to be measured against — so the measurement
// proved nothing it claimed to prove. Deleted rather than carried forward. If print-area specs are ever
// published it returns as `Evidence` of kind `measured`, which needs no change here.

export interface Subject {
  situation: Known<SituationId>;
  supplyModel: Known<SupplyModel>;
  holdsStock: Known<boolean>;
  destination?: Known<DestinationId>;
  /** Dimensions intentionally not gathered here, with the reason. `capital` is invasive on a public
   *  page and changes commercial terms rather than the plan; it belongs in the consultation. */
  deferred: readonly { field: string; resolvedAt: "consultation" }[];
}

// ── 2 · CONSTRAINT ───────────────────────────────────────────────────────────────────────────────────

/**
 * Why acting is necessary. INVARIANT — a plan without a constraint is a preference.
 *
 * `kind` distinguishes the two shapes a constraint takes, which is what an earlier draft of this design
 * got wrong by treating constraint as optional: a first-time seller's blocker is not a failing status
 * quo, it is the ABSENCE of one. Both are constraints.
 */
export interface Constraint {
  id: string;
  kind: "failing-status-quo" | "absent-operation" | "scaling-limit";
}

// ── 3 · COURSE ───────────────────────────────────────────────────────────────────────────────────────

/** An obligation, and on whom it falls. A course that only lists what THG does is a sales pitch; every
 *  real plan places work on both parties. */
export interface Obligation {
  id: string;
  party: "thg" | "seller";
}

/**
 * What the seller gives up. NULLABLE — but null must be STATED, never an omitted field, because an
 * absent field cannot distinguish "no material trade-off" from "we have not worked it out". Downstream
 * consumers guess wrong about that silence.
 */
export type Tradeoff = { id: string } | { none: true; reasonId: string };

/** What happens next. Abstract on purpose: a consultation on the landing page, a proposal in CRM, an
 *  onboarding task in internal tooling. Not a button. */
export interface NextStep {
  kind: "consultation" | "self-serve" | "proposal" | "onboarding";
  /** Optional capability the step concerns, e.g. opening a Hub account. */
  capability?: CapabilityId;
}

export interface Course {
  capabilities: readonly CapabilityId[];
  obligations: readonly Obligation[];
  tradeoff: Tradeoff;
  nextStep: NextStep;
}

// ── 4 · GROUNDS ──────────────────────────────────────────────────────────────────────────────────────

/**
 * On what basis the plan rests.
 *
 * `kind` is the honesty mechanism of the whole system:
 *
 *   measured   computed from something real and present (artwork DPI at a stated print width)
 *   published  THG has stated it publicly (compensation policy, payment rails, production geography)
 *   committed  a qualitative commitment with no figure (item-level QC on every order)
 *   absent     the field exists in the model and has no value yet
 *
 * `absent` is why this design can ship honestly today and get stronger for free later: a plan cites the
 * evidence it wants, an absent citation renders as a LABELLED GAP rather than silence, and the day the
 * CMS carries basecost and in-house time the same plan gains proof with no code change.
 *
 * An honest gap is compliant. A fabricated figure is a violation.
 */
export type EvidenceKind = "measured" | "published" | "committed" | "absent";

/**
 * A ground, discriminated by kind so the type system enforces the honesty rule the prose states.
 *
 * `measured` and `published` MUST carry a value: a fact without its figure is not a fact, and
 * allowing one made it possible for `deriveConfidence` to count an empty ground as proof.
 * `committed` and `absent` must NOT carry one: a commitment has no figure, and an absent ground
 * has no value by definition.
 */
export type Evidence =
  | {
      id: string;
      kind: "measured" | "published";
      /** Never synthesised to fill a slot. */
      value: string;
      /** Where the claim comes from — a CMS field path, a published policy, or a computation. */
      source: string;
    }
  | {
      id: string;
      kind: "committed" | "absent";
      source: string;
    };

// ── 5 · EXPECTATION ──────────────────────────────────────────────────────────────────────────────────

/**
 * `outcome` is nullable because an outcome asserted without evidence is an invented promise, and this
 * system will not make one.
 *
 * `confidence` is a FIELD, not a tone of voice. An assistant or a CRM has to know whether to assert or
 * hedge, and it cannot infer that from prose. Derived deterministically — see `deriveConfidence`.
 */
export type Confidence = "low" | "medium" | "high";

export interface Expectation {
  outcomeId: string | null;
  confidence: Confidence;
}

// ── 6 · IDENTITY ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Which plan, produced by which logic, from what inputs.
 *
 * Non-negotiable for the consumers beyond the landing page: without a catalogue version you cannot
 * explain a recommendation you made three months ago, and without the inputs you cannot reproduce it.
 * `producedAt` is INJECTED rather than read from the clock, because selection must stay pure — a
 * function that reads the time cannot be evaluated identically on a server and a client.
 */
export interface PlanIdentity {
  planId: string;
  catalogueVersion: string;
  producedAt: string | null;
  /**
   * Whether THG operations has confirmed this plan's business assertions.
   *
   * Carried onto the plan rather than left behind in the catalogue, because a consumer that cannot
   * see it will present a drafted plan exactly like a signed-off one. Every surface that renders a
   * plan is expected to say so when this is false — a gap is displayed, never filled.
   */
  verified: boolean;
}

// ── THE PLAN ─────────────────────────────────────────────────────────────────────────────────────────

export interface OperationalPlan {
  identity: PlanIdentity;
  subject: Subject;
  constraint: Constraint;
  course: Course;
  grounds: readonly Evidence[];
  expectation: Expectation;
}

/**
 * A catalogue entry: everything about a plan that is independent of a particular seller. The Subject,
 * Identity and Confidence are computed per selection; the rest is authored.
 *
 * `verified` records whether THG operations has confirmed the business assertions in this entry. Drafted
 * entries ship as `false` and the structure is tested; nothing tests whether the copy is TRUE, because
 * only THG can say that.
 */
export interface PlanTemplate {
  planId: string;
  situation: SituationId;
  supplyModel: SupplyModel;
  constraint: Constraint;
  course: Course;
  /** Evidence ids this plan cites. Resolution to values happens at the edge, never in the domain. */
  evidenceIds: readonly string[];
  outcomeId: string | null;
  verified: boolean;
}

/**
 * Deterministic confidence. Explainable on purpose: the rule is stated here rather than tuned, so any
 * consumer can justify why a plan was presented as firm or as provisional.
 *
 *   high    the subject was asked or measured throughout, AND at least one ground is measured/published
 *   medium  the subject is complete, but every ground is only a commitment
 *   low     any part of the subject is assumed, or the plan cites no grounds at all, or every
 *           ground it cites is absent
 */
export function deriveConfidence(subject: Subject, grounds: readonly Evidence[]): Confidence {
  // The destination joins the set when it is present: a plan built on an assumed destination is
  // built on an assumption, whatever its grounds say.
  const known = [
    subject.situation,
    subject.supplyModel,
    subject.holdsStock,
    ...(subject.destination ? [subject.destination] : []),
  ];
  const anyAssumed = known.some((k) => k.provenance === "assumed");
  const hardGrounds = grounds.filter((g) => g.kind === "measured" || g.kind === "published").length;
  const allAbsent = grounds.length > 0 && grounds.every((g) => g.kind === "absent");

  if (anyAssumed || allAbsent || grounds.length === 0) return "low";
  if (hardGrounds > 0) return "high";
  return "medium";
}
