// TRACEABILITY OF THE OPERATIONAL PLAN — the sales-handoff summary, end to end.
//
// `tests/unit/operational-plan.test.ts` proves the domain serializes a plan. This file proves the other
// half: that the FEATURE can actually label one, in every locale.
//
// The failure it exists to catch is quiet rather than loud. A missing label id does not throw — it
// resolves to the `—` placeholder — so a handoff message can degrade to "—: —" and still submit
// successfully. The CRM would then receive an unreadable lead, and nothing in the build, the type
// checker or the rendered page would object. That is exactly the class of defect a test has to hold.
import { describe, it, expect } from "vitest";

import { SITUATIONS, SUPPLY_MODELS } from "@/shared/planning/plan";
import { CATALOGUE_VERSION } from "@/shared/planning/catalogue";
import { selectPlan, summarizeForHandoff } from "@/shared/planning/select";
import { getFulfillContent } from "@/features/fulfill";
import { getFulfillParityContent } from "@/features/fulfill/parity-content";
import { buildPlanLabels } from "@/features/fulfill/ui/plan-labels";
import { SUPPORTED_LOCALES } from "@/shared/i18n";

const PLACEHOLDER = "—";

/** Every plan the catalogue can produce, summarized in one locale. */
function summaries(lang: (typeof SUPPORTED_LOCALES)[number]) {
  const labels = buildPlanLabels(lang, getFulfillContent(lang), getFulfillParityContent(lang));
  return SITUATIONS.flatMap((situation) =>
    SUPPLY_MODELS.map((supplyModel) => {
      const plan = selectPlan({ situation, supplyModel })!;
      return { planId: plan.identity.planId, text: summarizeForHandoff(plan, labels) };
    }),
  );
}

describe.each(SUPPORTED_LOCALES)("Operational Plan handoff — %s", (lang) => {
  it("labels every plan with no unresolved ids", () => {
    for (const { planId, text } of summaries(lang)) {
      expect(text, `${planId} has an unresolved label`).not.toContain(PLACEHOLDER);
      // A raw id leaking through means a label was never authored for it.
      expect(text, `${planId} leaked a raw id`).not.toMatch(/\b(constraint|obligation|handoff)\./);
    }
  });

  it("carries the plan id and catalogue version, so a lead can be traced back", () => {
    for (const { planId, text } of summaries(lang)) {
      expect(text).toContain(planId);
      // Read from the catalogue, so bumping the version does not fail an unrelated test.
      expect(text).toContain(CATALOGUE_VERSION);
    }
  });
});

describe("Operational Plan handoff — attribution", () => {
  it("gives each of the six plans a DISTINCT summary", () => {
    // If two plans serialized identically, the leads table could not tell them apart and the whole
    // "does the planner work" question would be unanswerable.
    const texts = summaries("vi").map((s) => s.text);
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("stays short enough to be read in a CRM row", () => {
    for (const { planId, text } of summaries("vi")) {
      expect(text.split("\n").length, planId).toBeLessThanOrEqual(5);
    }
  });
});
