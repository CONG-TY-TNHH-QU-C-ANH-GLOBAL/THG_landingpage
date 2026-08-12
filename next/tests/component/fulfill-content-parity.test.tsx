// @vitest-environment happy-dom
//
// THE CONTENT-PARITY GATE (redesign PR 0.7).
//
// The THG Fulfill redesign moves copy between sections, merges sections and rewrites presentation.
// The one guarantee that must survive every one of those PRs is that NOTHING disappears: every
// localized string the route can render must still be rendered, in all three locales.
//
// So this suite does not assert on layout, class names or structure — those are the things the
// redesign is allowed to change. It walks the two copy trees (localized-content.ts and
// parity-content.ts), collects every leaf string, renders the whole composed page, and asserts the
// rendered output is a SUPERSET of that vocabulary. A section rewrite that silently drops a
// paragraph fails here rather than in production.
//
// Two fixtures are needed because several fields are mutually exclusive by design: a CMS-empty read
// renders the localized fallbacks (hero subtitle, catalog products, FAQ empty state), a populated
// read renders the CMS branch (catalog intro, basecost/lead-time labels, real answers). Parity is
// asserted against the UNION of both, which is exactly the set of strings the route can ever show.
import type { ReactElement } from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";

// next/image and next/link need the Next runtime. The image mock keeps `alt` in the DOM because
// some catalog copy (catalogFallback[].alt) is only ever exposed as alternative text.
vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt?: string; src?: string }) => <img alt={alt ?? ""} src={String(src ?? "")} />,
}));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a href={String(href ?? "#")}>{children}</a>
  ),
}));
// The inline consultation form is a secured client island (Turnstile + /leads transport) and carries
// no Fulfill-scoped copy of its own — its labels come from the shared marketing dictionary. Stubbing
// it keeps this suite focused on the feature's copy trees.
vi.mock("@/features/fulfill/ui/fulfill-consultation-form", () => ({ default: () => null }));

// The movement list below mirrors what app/[lang]/thg-fulfill/page.tsx actually composes. That
// is the point of the suite: if a copy key stops being rendered by the REAL page, this fails,
// which it cannot do if the list includes sections the page no longer mounts. (plan-section,
// proof-section and act-section were deleted with the redesign and their imports here went
// stale — the suite could not even compile.)
import HeroSection from "@/features/fulfill/ui/hero-section";
import PainBentoGrid from "@/features/fulfill/ui/pain-bento-grid";
import ProcessSection from "@/features/fulfill/ui/process-section";
import HubGuideSection from "@/features/fulfill/ui/hub-guide-section";
import ConsultCTASection from "@/features/fulfill/ui/consult-cta-section";
import CommitmentSection from "@/features/fulfill/ui/commitment-section";
import ScopeSection from "@/features/fulfill/ui/scope-section";
import FulfillmentVisualShowcase from "@/features/fulfill/ui/fulfillment-visual-showcase";
import LibrarySection from "@/features/fulfill/ui/library-section";
import EcosystemSection from "@/features/fulfill/ui/ecosystem-section";
import IndexSection from "@/features/fulfill/ui/index-section";
import { getMovementCopy } from "@/features/fulfill/ui/movement-copy";

import { getFulfillContent } from "@/features/fulfill";
import type { FulfillContent } from "@/features/fulfill";
import { getCatalogCopy, type CatalogProduct } from "@/features/catalog";
import { getFulfillParityContent } from "@/features/fulfill/parity-content";
import { SUPPORTED_LOCALES, type Locale } from "@/shared/i18n";
import { copyForLocale } from "../support/lead-test-utils";

afterEach(cleanup);

/** Fields that are deliberately NOT rendered, each for a documented reason. Anything else missing
 *  from the DOM is a parity regression. */
const INTENTIONALLY_UNRENDERED: readonly string[] = [
  // parity-content.ts marks this RESERVED: the logistics-gallery chapter needs CMS `gallery[]`
  // plumbed into the fulfill model first (a data change, out of scope for a presentation redesign).
  // The copy is ported so the slice is content-complete on arrival.
  "galleryTitle",

  // ── ORPHANED BY THE ELEVEN-MOVEMENT REDESIGN ────────────────────────────────────────────────
  // Approved copy whose owning movement was deleted (act/plan/proof/handoff/qualify/recognise/
  // operate). It is still authored, still translated, and no longer reaches a visitor.
  //
  // Listed rather than deleted, and listed by KEY rather than by string, because the decision to
  // drop published content belongs to whoever owns the content — not to a cleanup pass. Every
  // entry here is a question for that owner: restore the movement, or retire the copy. What this
  // list does buy is that the gate stays strict for everything else: a key that stops rendering
  // tomorrow and is not named here still fails the suite, which is what it is for.
  //
  // localized-content.ts — the journey chapter and the operations hero:
  "heroHeadline", // superseded on the page by heroHeadlineLong
  "heroBadge",
  "pointsFallback",
  "journeyEyebrow",
  "journeyTitle",
  "journeyIntro",
  "journeyReference",
  "steps",
  "hubStages", // the static Hub visibility panel went with the movement that framed it
  "hubCaption",
  //
  // parity-content.ts — the "Our Solution" chapter and two Hub-guide trimmings:
  "solutionEyebrow",
  "solutionTitle",
  "solutionIntro",
  "advantages",
  "ecountTitle",
  "ecountIntro",
  "ecountSkuLink",
  "hubCtaTitle",
  "hubCtaDesc",
  "hubCtaLabel",
  // These two now live in the catalog feature's copy (features/catalog/localized-content.ts),
  // because the product card that shows them is shared with /{lang}/catalog. The parity copies
  // survive only as inputs to plan-labels.ts.
  "basecostLabel",
  "leadTimeLabel",
];

/** Structural (non-visible) values: asset paths and stable ids, not user-facing copy. */
const STRUCTURAL_KEYS: readonly string[] = ["image", "id"];

/** Every string leaf in a resolved copy tree, minus structural values and documented exclusions. */
function collectStrings(node: unknown, key = ""): string[] {
  if (INTENTIONALLY_UNRENDERED.includes(key)) return [];
  if (typeof node === "string") {
    if (STRUCTURAL_KEYS.includes(key)) return [];
    const value = node.trim();
    return value.length > 0 ? [value] : [];
  }
  if (Array.isArray(node)) return node.flatMap((child) => collectStrings(child, key));
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([childKey, child]) => collectStrings(child, childKey));
  }
  return [];
}

/** Rendered text plus the attributes that carry copy to assistive tech. */
function snapshotText(container: HTMLElement): string {
  const attributes = Array.from(container.querySelectorAll("[alt],[title],[aria-label]"))
    .flatMap((el) => [
      el.getAttribute("alt"),
      el.getAttribute("title"),
      el.getAttribute("aria-label"),
    ])
    .filter((v): v is string => Boolean(v));
  return [container.textContent ?? "", ...attributes].join("\n");
}

/**
 * Everything the page can show.
 *
 * The seven answers are no longer behind a disclosure — the index renders them unfolded — but the
 * exclusive-selection groups (the planner's two questions, the library's resource list) still show
 * a different panel per selection. "Parity" therefore means REACHABLE, not simultaneously visible:
 * visit every control in turn and accumulate. The suite fails if a redesign ever makes a string
 * unreachable, which is the thing that would actually hurt.
 */
function reachableVocabulary(container: HTMLElement): string {
  const parts = [snapshotText(container)];

  // Accordion disclosures (the FAQ).
  for (const trigger of Array.from(container.querySelectorAll<HTMLElement>("button[aria-expanded]"))) {
    if (trigger.getAttribute("aria-expanded") === "true") continue;
    fireEvent.click(trigger);
    parts.push(snapshotText(container));
  }

  // Exclusive-selection groups: the Hub System explorer's tabs and the Learning Library's resource
  // radios. Each selection reveals a different panel, so every one has to be visited before the page
  // can be said to have shown all of its content.
  for (const control of Array.from(
    container.querySelectorAll<HTMLElement>('[role="tab"],[role="radio"]'),
  )) {
    fireEvent.click(control);
    parts.push(snapshotText(container));
  }

  return parts.join("\n");
}

const EMPTY_CMS: FulfillContent = {
  present: false,
  serviceLabel: "",
  heroSubtitle: "",
  heroEyebrow: "",
  points: [],
  catalog: [],
};

/** A populated read: exercises the CMS branch of every section that has one. The third product
 *  carries only a `note`, which is the one field suppressed whenever structured metadata exists. */
function populatedCms(): FulfillContent {
  return {
    present: true,
    serviceLabel: "THG Fulfill",
    heroSubtitle: "CMS hero subtitle.",
    heroEyebrow: "CMS eyebrow",
    points: ["CMS point one", "CMS point two", "CMS point three"],
    catalog: [
      {
        name: "CMS Apparel",
        image: "/assets/fulfill/apparel.png",
        note: "",
        price: "$4.90",
        leadTime: "48h",
        origin: "VN",
        productId: "",
      },
      {
        name: "CMS Drinkware",
        image: "/assets/fulfill/drinkware.png",
        note: "",
        price: "$6.20",
        leadTime: "72h",
        origin: "CN",
        productId: "",
      },
      { name: "CMS Fleece", image: "/assets/fulfill/fleece.png", note: "note-only product", price: "", leadTime: "", origin: "", productId: "" },
    ],
  };
}

/** A resolved Hub product, as loadFulfillFeaturedProducts returns it. Passing `[]` instead
 *  exercises the Hub-unavailable branch, where the section shows its illustrative cards. */
function hubProducts(): readonly CatalogProduct[] {
  return [
    {
      id: "hub-1",
      name: "180 g Milk Thread Women's Heat Transfer T-Shirt — Double-sided",
      sku: "9A2WSN",
      thgSku: "THG-VN001-ABC",
      category: "Apparel",
      origin: "PH",
      image: "https://cdn.thgfulfill.com/catalog/x_01.png",
      images: ["https://cdn.thgfulfill.com/catalog/x_01.png"],
      videos: [],
      price: "$6.00",
      prodTime: "3 - 5",
      shipTime: "8 - 12",
      material: [],
      features: [],
      care: [],
      sizes: [],
      colors: [],
      collections: [],
      variants: [],
    },
  ];
}

/**
 * The whole composed page.
 *
 * Every movement is handed the same bag of resolved content and takes the slice it needs, so this
 * lists the movements rather than restating each one's prop signature. That keeps the suite from
 * being a second, drifting copy of `page.tsx`: the thing under test here is that no string is lost
 * when movements are reordered or merged, not which props each one happens to accept today.
 */
function renderPage(lang: Locale, cms: FulfillContent, faqsMode: "empty" | "fallback") {
  const parity = getFulfillParityContent(lang);
  const props = {
    lang,
    copy: getFulfillContent(lang),
    catalogCopy: getCatalogCopy(lang),
    parity,
    movement: getMovementCopy(lang),
    marketingCopy: copyForLocale(lang),
    content: cms,
    // Hub products only when the CMS read is populated, so both catalog branches are covered
    // across the two renders vocabularyFor() performs.
    products: cms.present ? hubProducts() : [],
    faqs: faqsMode === "fallback" ? parity.faqFallback : [],
  };

  // A component that reads a subset of the bag is assignable to one that takes the whole bag, so
  // this stays fully typed: adding a required prop to any movement fails the build here.
  // `| null` because HubGuideSection renders nothing when its parity copy is absent.
  const MOVEMENTS: readonly ((p: typeof props) => ReactElement | null)[] = [
    HeroSection,
    PainBentoGrid,
    ProcessSection,
    HubGuideSection,
    CommitmentSection,
    ConsultCTASection,
    ScopeSection,
    FulfillmentVisualShowcase,
    LibrarySection,
    EcosystemSection,
    IndexSection,
  ];

  return render(
    <main>
      {MOVEMENTS.map((Movement, i) => (
        <Movement key={i} {...props} />
      ))}
    </main>,
  );
}

/** Union of what the route renders across both CMS states. */
function vocabularyFor(lang: Locale): string {
  const empty = renderPage(lang, EMPTY_CMS, "empty");
  const emptyText = reachableVocabulary(empty.container);
  cleanup();
  const populated = renderPage(lang, populatedCms(), "fallback");
  const populatedText = reachableVocabulary(populated.container);
  cleanup();
  return `${emptyText}\n${populatedText}`;
}

describe.each(SUPPORTED_LOCALES)("THG Fulfill content parity — %s", (lang) => {
  it("renders every string in the Fulfill copy tree", () => {
    const rendered = vocabularyFor(lang);
    const missing = collectStrings(getFulfillContent(lang)).filter((s) => !rendered.includes(s));
    expect(missing).toEqual([]);
  });

  it("renders every string in the restored parity copy tree", () => {
    const rendered = vocabularyFor(lang);
    const missing = collectStrings(getFulfillParityContent(lang)).filter((s) => !rendered.includes(s));
    expect(missing).toEqual([]);
  });

  it("renders the seven public FAQ answers when the CMS set is empty (localized fallback)", () => {
    const parity = getFulfillParityContent(lang);
    const { container } = renderPage(lang, EMPTY_CMS, "fallback");
    const rendered = reachableVocabulary(container);
    expect(parity.faqFallback).toHaveLength(7);
    for (const faq of parity.faqFallback) {
      expect(rendered).toContain(faq.question);
      expect(rendered).toContain(faq.answer);
    }
  });

  it("keeps every published anchor target on the page, including the retired ones", () => {
    const { container } = renderPage(lang, populatedCms(), "fallback");
    // Every id an external link, bookmark or nav entry may already point at. `solution`, `videos`,
    // `studio`, `passport` and `journey` are RETIRED ids kept alive as alias targets after the
    // movements that owned them were replaced — dropping one silently breaks links that exist in
    // the wild, and nothing in a visual review would catch it.
    for (const id of [
      "top",
      "challenges",
      "plan",
      "studio",
      "process",
      "journey",
      "passport",
      "catalog",
      "evidence",
      "solution",
      "library",
      "videos",
      "trust",
      "handbook",
      "order-guide",
      "hub-guide",
      "hub-cta",
      "capabilities",
      "system",
      "qa",
      "consult",
      "contact",
    ]) {
      expect(container.querySelector(`#${id}`), `missing anchor #${id}`).toBeTruthy();
    }
    // The six Hub guide chapters are individually deep-linkable.
    for (const section of getFulfillParityContent(lang).hubSections) {
      expect(container.querySelector(`#hub-${section.id}`)).toBeTruthy();
    }
  });
});

describe("THG Fulfill content parity — cross-locale", () => {
  it("does not leak another locale's copy into a rendered page", () => {
    const { container } = renderPage("vi", populatedCms(), "fallback");
    const rendered = reachableVocabulary(container);
    // The art-directed H1 is distinct per locale, so it is the sharpest leak detector.
    // `heroHeadlineLong` is the key the redesigned hero renders — and it needs this check most:
    // it shipped as a hardcoded Vietnamese literal, so /en and /zh showed Vietnamese until it
    // moved into the copy tree. That is exactly the leak this test exists to catch.
    expect(rendered).toContain(getFulfillContent("vi").heroHeadlineLong);
    expect(rendered).not.toContain(getFulfillContent("en").heroHeadlineLong);
    expect(rendered).not.toContain(getFulfillContent("zh").heroHeadlineLong);
  });
});
