// THE CONTENT REGISTRIES — the contract between the catalogue and the rendering edge.
//
// The registries exist because the ids used to be declared twice: once where a plan cites them and
// once where they are labelled, with nothing holding the two lists together. A typo resolved to a
// placeholder, an unlabelled id shipped silently, and a label could outlive the plan that used it.
//
// The type system now catches the label side at build time (`satisfies Record<Name, LabelSource>`).
// This suite catches what types cannot: that the registries and the catalogue agree in BOTH
// directions at runtime, that every emitted id actually resolves, and that a plan id — which is
// stamped into every lead and is therefore a permanent public contract — is derived exactly as
// published.
import { describe, it, expect } from "vitest";

import {
  CONSTRAINTS,
  EVIDENCE,
  SELLER_OBLIGATIONS,
  THG_OBLIGATIONS,
  TRADEOFFS,
  constraintId,
  evidenceId,
  tradeoffId,
} from "@/shared/planning/ids";
import { PLAN_CATALOGUE } from "@/shared/planning/catalogue";
import { SITUATIONS, SUPPLY_MODELS } from "@/shared/planning/plan";
import { AUTHORED_LABEL_IDS, buildPlanLabels } from "@/features/fulfill/ui/plan-labels";
import { getFulfillContent } from "@/features/fulfill";
import { getFulfillParityContent } from "@/features/fulfill/parity-content";
import { SUPPORTED_LOCALES } from "@/shared/i18n";

/** Every id the catalogue actually emits. */
const emitted = {
  constraints: new Set(PLAN_CATALOGUE.map((t) => t.constraint.id)),
  thg: new Set(
    PLAN_CATALOGUE.flatMap((t) =>
      t.course.obligations.filter((o) => o.party === "thg").map((o) => o.id),
    ),
  ),
  seller: new Set(
    PLAN_CATALOGUE.flatMap((t) =>
      t.course.obligations.filter((o) => o.party === "seller").map((o) => o.id),
    ),
  ),
  tradeoffs: new Set(
    PLAN_CATALOGUE.map((t) => ("none" in t.course.tradeoff ? t.course.tradeoff.reasonId : t.course.tradeoff.id)),
  ),
  evidence: new Set(PLAN_CATALOGUE.flatMap((t) => t.evidenceIds)),
};

const registry = {
  constraints: (Object.keys(CONSTRAINTS) as (keyof typeof CONSTRAINTS)[]).map(constraintId),
  thg: THG_OBLIGATIONS.map((n) => `obligation.thg.${n}`),
  seller: SELLER_OBLIGATIONS.map((n) => `obligation.seller.${n}`),
  tradeoffs: TRADEOFFS.map(tradeoffId),
  evidence: EVIDENCE.map(evidenceId),
};

describe("registry ↔ catalogue", () => {
  it.each(Object.keys(registry) as (keyof typeof registry)[])(
    "%s: every id the catalogue emits is a registry member",
    (group) => {
      const strays = [...emitted[group]].filter((id) => !registry[group].includes(id));
      expect(strays, "an id outside the registry cannot be labelled or reviewed").toEqual([]);
    },
  );

  it.each(Object.keys(registry) as (keyof typeof registry)[])(
    "%s: the registry has no orphan — every member is cited by a plan",
    (group) => {
      const orphans = registry[group].filter((id) => !emitted[group].has(id));
      // An orphan is content nobody can reach: either a plan lost a citation, or the id outlived
      // the plan that used it. Both are worth failing over while the catalogue is this small.
      expect(orphans).toEqual([]);
    },
  );

  it("derives the party from the registry an obligation came from, never from its spelling", () => {
    for (const template of PLAN_CATALOGUE) {
      for (const obligation of template.course.obligations) {
        expect(obligation.id.startsWith(`obligation.${obligation.party}.`)).toBe(true);
      }
    }
  });

  it("gives one constraint one kind, however many plans cite it", () => {
    const byId = new Map<string, string>();
    for (const { constraint } of PLAN_CATALOGUE) {
      const seen = byId.get(constraint.id);
      if (seen) expect(seen).toBe(constraint.kind);
      byId.set(constraint.id, constraint.kind);
    }
    // `transit_cancellations` is cited by two plans; the kind is a property of the constraint.
    expect(byId.size).toBe(Object.keys(CONSTRAINTS).length);
  });
});

describe("plan identity", () => {
  it("covers every situation × supply model exactly once", () => {
    expect(PLAN_CATALOGUE).toHaveLength(SITUATIONS.length * SUPPLY_MODELS.length);
    expect(new Set(PLAN_CATALOGUE.map((t) => t.planId)).size).toBe(PLAN_CATALOGUE.length);
  });

  it("derives the published plan id, which every lead is attributed to", () => {
    // Locked deliberately: changing one of these silently orphans every consultation already
    // recorded against it.
    expect(PLAN_CATALOGUE.map((t) => t.planId).sort()).toEqual([
      "expand-custom",
      "expand-sourced",
      "launch-custom",
      "launch-sourced",
      "operate-custom",
      "operate-sourced",
    ]);
  });
});

describe("label coverage", () => {
  it.each(SUPPORTED_LOCALES)("resolves every emitted id in %s", (lang) => {
    const labels = buildPlanLabels(lang, getFulfillContent(lang), getFulfillParityContent(lang));
    const unresolved = Object.values(emitted)
      .flatMap((set) => [...set])
      .filter((id) => labels(id) === "—");
    expect(unresolved, "an unresolved id renders as a placeholder in production").toEqual([]);
  });

  it("enumerates the unconfirmed assertions rather than hiding them in comments", () => {
    // Not a target to hit — a number that should fall as operations signs each claim off. It is
    // asserted so the count cannot grow without someone noticing.
    expect(AUTHORED_LABEL_IDS).toHaveLength(13);
    // All five trade-offs are authored: they are the commercially sensitive half of every plan and
    // not one of them has a published source.
    expect(AUTHORED_LABEL_IDS.filter((id) => id.startsWith("tradeoff."))).toHaveLength(5);
    // Every seller-side obligation too — THG's published content describes what THG does.
    expect(AUTHORED_LABEL_IDS.filter((id) => id.startsWith("obligation.seller."))).toHaveLength(4);
  });
});
