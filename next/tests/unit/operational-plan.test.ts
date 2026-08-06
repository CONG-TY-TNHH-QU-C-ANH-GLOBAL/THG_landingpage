// THE OPERATIONAL PLAN DOMAIN — invariant tests.
//
// These tests enforce the SHAPE of the domain, not the truth of its content. Nothing here asserts that
// a constraint is the right constraint or that an obligation is real, because only THG operations can
// say that, and a test that pretended otherwise would give false confidence.
//
// What they do lock down is every property the architecture depends on: coverage, purity, the six
// invariants, the honesty of absent evidence, and the specific claim that multiple plans can share one
// capability while differing in everything else.
import { describe, it, expect } from "vitest";

import { CAPABILITIES, SITUATIONS, SUPPLY_MODELS, deriveConfidence } from "@/shared/planning/plan";
import type { Evidence, Subject } from "@/shared/planning/plan";
import { PLAN_CATALOGUE, findTemplate } from "@/shared/planning/catalogue";
import { selectPlan, summarizeForHandoff } from "@/shared/planning/select";

const subjectOf = (plan: NonNullable<ReturnType<typeof selectPlan>>) => plan.subject;

// Anchored lists rather than loose regexes: an unanchored /low|medium|high/ also matches
// "unknown-low", so it would not catch a value the domain never meant to produce.
const CONSTRAINT_KINDS = ["failing-status-quo", "absent-operation", "scaling-limit"];
const CONFIDENCE_LEVELS = ["low", "medium", "high"];

describe("catalogue coverage", () => {
  it("has a plan for every situation × supply model — no combination falls through", () => {
    for (const situation of SITUATIONS) {
      for (const supplyModel of SUPPLY_MODELS) {
        expect(findTemplate(situation, supplyModel), `${situation}:${supplyModel}`).toBeDefined();
      }
    }
  });

  it("has no duplicate plan ids and no duplicate keys", () => {
    const ids = PLAN_CATALOGUE.map((t) => t.planId);
    expect(new Set(ids).size).toBe(ids.length);
    const keys = PLAN_CATALOGUE.map((t) => `${t.situation}:${t.supplyModel}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("only references capabilities that exist", () => {
    for (const template of PLAN_CATALOGUE) {
      for (const capability of template.course.capabilities) {
        expect(CAPABILITIES).toContain(capability);
      }
    }
  });

  it("marks every drafted plan unverified — nothing reaches production claiming review it has not had", () => {
    // This test is expected to be UPDATED, plan by plan, as THG operations signs each one off.
    for (const template of PLAN_CATALOGUE) {
      expect(template.verified, `${template.planId} must stay false until ops confirms it`).toBe(false);
    }
  });
});

describe("the six invariants are present on every plan", () => {
  it.each(SITUATIONS.flatMap((s) => SUPPLY_MODELS.map((m) => [s, m] as const)))(
    "%s / %s carries subject, constraint, course, grounds, expectation, identity",
    (situation, supplyModel) => {
      const plan = selectPlan({ situation, supplyModel });
      expect(plan).not.toBeNull();
      if (!plan) return;

      // 1 SUBJECT — with provenance on every known field.
      expect(plan.subject.situation.provenance).toBe("asked");
      expect(["asked", "inferred"]).toContain(plan.subject.holdsStock.provenance);
      // 2 CONSTRAINT — invariant. A plan without one is a preference, not a plan.
      expect(plan.constraint.id).toBeTruthy();
      expect(CONSTRAINT_KINDS).toContain(plan.constraint.kind);
      // 3 COURSE — capabilities, obligations on BOTH sides, a stated trade-off, a next step.
      expect(plan.course.capabilities.length).toBeGreaterThan(0);
      expect(plan.course.obligations.some((o) => o.party === "thg")).toBe(true);
      expect(plan.course.obligations.some((o) => o.party === "seller")).toBe(true);
      expect(plan.course.tradeoff).toBeTruthy();
      expect(plan.course.nextStep.kind).toBeTruthy();
      // 4 GROUNDS
      expect(plan.grounds.length).toBeGreaterThan(0);
      // 5 EXPECTATION
      expect(CONFIDENCE_LEVELS).toContain(plan.expectation.confidence);
      // 6 IDENTITY
      expect(plan.identity.planId).toBeTruthy();
      expect(plan.identity.catalogueVersion).toBeTruthy();
    },
  );

  it("places obligations on the seller, not only on THG — a one-sided course is a sales pitch", () => {
    for (const template of PLAN_CATALOGUE) {
      const sellerObligations = template.course.obligations.filter((o) => o.party === "seller");
      expect(sellerObligations.length, `${template.planId}`).toBeGreaterThan(0);
    }
  });

  it("states a trade-off explicitly — never an omitted field", () => {
    for (const template of PLAN_CATALOGUE) {
      const t = template.course.tradeoff;
      const stated = "id" in t ? Boolean(t.id) : Boolean(t.none && t.reasonId);
      expect(stated, `${template.planId} must state a trade-off or an explicit "none"`).toBe(true);
    }
  });
});

describe("multiple plans, one capability — the product's central distinction", () => {
  it("produces three DIFFERENT plans that all recommend fulfill", () => {
    const plans = SITUATIONS.map((situation) => selectPlan({ situation, supplyModel: "custom" })!);

    // Same capability across all three.
    for (const plan of plans) {
      expect(plan.course.capabilities).toContain("fulfill");
    }
    // Different in every other respect that matters.
    const constraints = plans.map((p) => p.constraint.id);
    expect(new Set(constraints).size).toBe(3);
    const constraintKinds = plans.map((p) => p.constraint.kind);
    expect(new Set(constraintKinds).size).toBe(3);
    const groundSets = plans.map((p) => p.grounds.map((g) => g.id).join("|"));
    expect(new Set(groundSets).size).toBe(3);
    const obligationSets = plans.map((p) => p.course.obligations.map((o) => o.id).join("|"));
    expect(new Set(obligationSets).size).toBe(3);
  });
});

describe("selection is pure — the same inputs must agree across server, client, CRM and test", () => {
  it("is deterministic", () => {
    const a = selectPlan({ situation: "expanding", supplyModel: "custom", producedAt: "2026-01-01" });
    const b = selectPlan({ situation: "expanding", supplyModel: "custom", producedAt: "2026-01-01" });
    expect(a).toEqual(b);
  });

  it("never reads the clock — producedAt is null unless injected", () => {
    const plan = selectPlan({ situation: "starting", supplyModel: "custom" });
    expect(plan?.identity.producedAt).toBeNull();
  });

  it("infers holdsStock for custom instead of asking", () => {
    const custom = selectPlan({ situation: "starting", supplyModel: "custom" })!;
    expect(subjectOf(custom).holdsStock).toEqual({ value: false, provenance: "inferred" });
  });

  it("records what it deliberately does not know", () => {
    const plan = selectPlan({ situation: "operating", supplyModel: "sourced" })!;
    expect(plan.subject.deferred.map((d) => d.field)).toContain("capital");
    expect(plan.subject.deferred.every((d) => d.resolvedAt === "consultation")).toBe(true);
  });
});

describe("evidence honesty", () => {
  it("keeps an unresolvable citation as `absent` rather than dropping it", () => {
    const plan = selectPlan({ situation: "starting", supplyModel: "custom" })!;
    const template = findTemplate("starting", "custom")!;
    // Every cited id survives resolution, so a missing fact renders as a labelled gap.
    expect(plan.grounds).toHaveLength(template.evidenceIds.length);
    expect(plan.grounds.some((g) => g.kind === "absent")).toBe(true);
  });

  it("upgrades to proof with no change to the plan when evidence becomes available", () => {
    const withoutData = selectPlan({ situation: "starting", supplyModel: "custom" })!;
    const withData = selectPlan({
      situation: "starting",
      supplyModel: "custom",
      // Simulates the day the CMS carries basecost. Same catalogue, same code path.
      resolveEvidence: (id) =>
        id === "evidence.basecost"
          ? { id, kind: "published", value: "from $4.90", source: "cms:catalog.price" }
          : undefined,
    })!;

    expect(withoutData.grounds.find((g) => g.id === "evidence.basecost")?.kind).toBe("absent");
    expect(withData.grounds.find((g) => g.id === "evidence.basecost")?.kind).toBe("published");
    // The plan itself is untouched — only its grounds got stronger.
    expect(withData.identity.planId).toBe(withoutData.identity.planId);
    expect(withData.constraint).toEqual(withoutData.constraint);
    expect(withData.course).toEqual(withoutData.course);
  });
});

describe("confidence is derived, not asserted", () => {
  const subject = (provenance: Subject["situation"]["provenance"]): Subject => ({
    situation: { value: "starting", provenance },
    supplyModel: { value: "custom", provenance: "asked" },
    holdsStock: { value: false, provenance: "inferred" },
    deferred: [],
  });
  const ev = (kind: Evidence["kind"]): Evidence => ({ id: `e.${kind}`, kind, source: "test" });

  it("is high when the subject is known and at least one ground is hard", () => {
    expect(deriveConfidence(subject("asked"), [ev("committed"), ev("published")])).toBe("high");
  });

  it("is medium when grounds are commitments only", () => {
    expect(deriveConfidence(subject("asked"), [ev("committed")])).toBe("medium");
  });

  it("is low when every ground is absent", () => {
    expect(deriveConfidence(subject("asked"), [ev("absent"), ev("absent")])).toBe("low");
  });

  it("is low when any part of the subject was assumed", () => {
    expect(deriveConfidence(subject("assumed"), [ev("published")])).toBe("low");
  });
});

describe("sales handoff", () => {
  it("serializes a plan without the domain doing any formatting", () => {
    const plan = selectPlan({
      situation: "expanding",
      supplyModel: "custom",
      destination: "US",
    })!;
    // The domain is locale-free; labels come from the caller.
    const summary = summarizeForHandoff(plan, (id) => id);

    expect(summary).toContain("situation.expanding");
    expect(summary).toContain("capability.fulfill");
    expect(summary).toContain("US");
    // Reproducibility: which plan, from which catalogue version.
    expect(summary).toContain("expand-custom");
    expect(summary).toContain("0.1.0-draft");
  });
});
