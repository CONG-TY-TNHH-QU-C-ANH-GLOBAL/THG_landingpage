// S3 · PLAN — "What do you propose for my situation?"
//
// The pivot. Everything before it earns the right to ask two questions; everything after it
// substantiates the answer.
//
// WHAT SHIPS TO THE BROWSER: two question groups and their state. Every plan is rendered on the
// server as static HTML, so a crawler and a JS-disabled visitor receive all six in full — a real
// answer rather than a placeholder — and the planning engine never reaches the client.
//
// PLANS ARE PRODUCED, NOT WRITTEN HERE. `selectPlan` composes each one from the catalogue; this file
// resolves evidence and hands the result to a renderer. Business reasoning stays outside
// presentation, which is what keeps it reviewable by people who do not read React.
//
// This replaced a four-lane service switcher, which made capability an INPUT the seller had to pick.
// A seller who knew which of four services they needed would not need a plan.
import { SITUATIONS, SUPPLY_MODELS, type Evidence } from "@/shared/planning/plan";
import { selectPlan, summarizeForHandoff } from "@/shared/planning/select";
import { PlanView } from "@/shared/planning/ui/plan-view";
import PlanSelector from "@/shared/planning/ui/plan-selector.client";
import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";
import type { FulfillContent } from "../models/fulfill";
import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";
import { buildPlanLabels } from "./plan-labels";
import { ConsultCta } from "./consult-cta";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";

interface Props {
  lang: Locale;
  marketingCopy: MarketingCopy;
  copy: FulfillCopy;
  parity: FulfillParityCopy;
  content: FulfillContent;
  movement: MovementCopy;
}

/**
 * Evidence resolution — the single place CMS and published content enter the reasoning flow.
 *
 * Anything not returned here resolves to `absent` in the domain and renders as a labelled gap. That
 * is why `basecost`, `lead_time` and `storage_cost` look for a real CMS value and return nothing when
 * there isn't one: the day the catalogue carries prices, the same plans gain proof and no other file
 * changes.
 */
function makeEvidenceResolver(
  content: FulfillContent,
  labels: (id: string) => string,
): (id: string) => Evidence | undefined {
  const priced = content.catalog.find((item) => item.price);
  const timed = content.catalog.find((item) => item.leadTime);

  // Statements THG has published as a concrete fact, as opposed to a qualitative undertaking.
  const PUBLISHED = new Set([
    "evidence.production_geography",
    "evidence.destination_coverage",
    "evidence.payment_rails",
    "evidence.compensation_policy",
    "evidence.sourcing_scope",
    "evidence.prepaid_transparency",
    "evidence.hub_modules",
    "evidence.bulk_csv_intake",
  ]);

  return (id: string) => {
    if (id === "evidence.basecost") {
      return priced?.price
        ? { id, kind: "published", value: priced.price, source: "cms:catalog.price" }
        : undefined; // → absent
    }
    // Storage cost is NOT the catalogue's base cost. Presenting a per-unit production price as a
    // warehousing figure would publish a number THG has not stated, in the plan and in the
    // consultation handoff both. It stays absent until a storage-cost field exists.
    if (id === "evidence.storage_cost") return undefined;
    if (id === "evidence.lead_time") {
      return timed?.leadTime
        ? { id, kind: "published", value: timed.leadTime, source: "cms:catalog.lead_time" }
        : undefined; // → absent
    }
    if (!id.startsWith("evidence.")) return undefined;
    // A published ground must carry its value. If the content behind the id resolves to nothing the
    // ground is absent, not an empty published fact.
    const value = labels(id);
    if (PUBLISHED.has(id)) {
      return value ? { id, kind: "published", value, source: "thg:published-content" } : undefined;
    }
    return { id, kind: "committed", source: "thg:published-content" };
  };
}

export default function PlanSection({
  lang,
  marketingCopy,
  copy,
  parity,
  content,
  movement,
}: Readonly<Props>) {
  const labels = buildPlanLabels(lang, copy, parity);
  const resolveEvidence = makeEvidenceResolver(content, labels);

  // Every plan, produced on the server. `producedAt` stays null: a statically rendered plan has no
  // meaningful production instant, and reading a clock here would break the purity that lets the
  // same selection be reproduced in a CRM months later.
  const plans = SITUATIONS.flatMap((situation) =>
    SUPPLY_MODELS.map((supplyModel) => selectPlan({ situation, supplyModel, resolveEvidence })),
  ).filter((plan): plan is NonNullable<typeof plan> => plan !== null);

  // The island receives resolved strings, never the resolver — a function cannot cross the client
  // boundary, so the label system and all three of its locales stay on the server. Derived from the
  // registries, so adding a situation cannot leave a control unlabelled.
  const selectorLabels = Object.fromEntries(
    [
      "ui.q_situation",
      "ui.q_supply",
      "ui.all_plans",
      ...SITUATIONS.map((s) => `situation.${s}`),
      ...SUPPLY_MODELS.map((m) => `supply.${m}`),
    ].map((id) => [id, labels(id)]),
  );

  return (
    <Movement id="plan" aliases={["studio"]} tone="surface">
      <Heading
        index={MOVEMENT_INDEX.plan}
        eyebrow={movement.plan}
        title={movement.planTitle}
        lead={movement.planIntro}
      />

      <PlanSelector labels={selectorLabels}>
        {plans.map((plan) => (
          // The two data attributes are what the narrowing CSS matches on. They live here rather
          // than inside PlanView because they are a selection concern, not part of a plan.
          <div
            key={plan.identity.planId}
            data-situation={plan.subject.situation.value}
            data-supply={plan.subject.supplyModel.value}
          >
            <PlanView
              plan={plan}
              labels={labels}
              action={
                <ConsultCta
                  lang={lang}
                  copy={marketingCopy}
                  label={copy.consultCta}
                  // CONVERSION MOMENT 1. Each plan's CTA carries that plan's own summary, so the
                  // lead record names the plan that produced it. No analytics transport is invented
                  // here: the lead is the conversion event and it is already persisted, so
                  // plan → consultation is answerable from the leads table alone.
                  message={summarizeForHandoff(plan, labels)}
                />
              }
            />
          </div>
        ))}
      </PlanSelector>
    </Movement>
  );
}
