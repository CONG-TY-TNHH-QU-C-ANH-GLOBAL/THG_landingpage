// @vitest-environment happy-dom
// WEB-001B homepage redesign — section content ownership and public-UI hygiene.
// Exercises the real exported Server Components (rendered client-side here; the
// only client behavior is the InViewOnce class toggle, inert in this DOM).
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";

import PillarAtlasSection from "@/features/home/ui/pillar-atlas-section";
import EcosystemAtlasSection from "@/features/home/ui/ecosystem-atlas-section";
import CoverageSection from "@/features/home/ui/coverage-section";
import WhoWeServeSection from "@/features/home/ui/who-we-serve-section";
import WhyThgSection from "@/features/home/ui/why-thg-section";
import ProofStripSection from "@/features/home/ui/proof-strip-section";
import { MARKETING_COPY } from "@/shared/i18n/marketing-copy";
import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";
import type { Service } from "@/features/home/models/service";

afterEach(cleanup);

const LOCALES: readonly Locale[] = ["vi", "en", "zh"];

function copyFor(locale: Locale): MarketingCopy {
  return Object.fromEntries(Object.entries(MARKETING_COPY).map(([k, v]) => [k, v[locale]]));
}

function service(id: string, overrides: Partial<Service> = {}): Service {
  return {
    id,
    name: `Name ${id}`,
    tagline: `Tagline ${id}`,
    icon: "📦",
    heroEyebrow: `Eyebrow ${id}`,
    body: `Body ${id}`,
    bullets: [`${id} cap one`, `${id} cap two`],
    ctaText: `Explore ${id}`,
    ctaUrl: `/${id}`,
    ...overrides,
  };
}

const FOUR_SERVICES: readonly Service[] = [
  service("thg-fulfill"),
  service("thg-express"),
  service("thg-warehouse"),
  service("thg-order"),
];

// Prototype/annotation strings that must never reach the public UI
// (IMPLEMENTATION_BASELINE.md "Anti-patterns": no debug chrome, no approval
// ribbons, no placeholder trust content).
const FORBIDDEN_PUBLIC_STRINGS = [
  "APPROVED BY OWNER",
  "IMPLEMENTATION BASELINE",
  "PROPOSED FIELD",
  "CONTRACT REVIEW",
  "Trustpilot",
  "pending publication",
  "Design notes",
];

function expectNoAnnotationChrome(container: HTMLElement) {
  const text = container.textContent ?? "";
  for (const s of FORBIDDEN_PUBLIC_STRINGS) {
    expect(text).not.toContain(s);
  }
}

describe("PillarAtlasSection (WEB-001B)", () => {
  it.each(LOCALES)("renders all four pillars from CMS services with real CTAs — %s", (locale) => {
    const { container } = render(<PillarAtlasSection copy={copyFor(locale)} services={FOUR_SERVICES} />);

    for (const variant of ["fulfill", "express", "warehouse", "dropship"]) {
      expect(screen.getByTestId(`pillar-${variant}`)).toBeTruthy();
    }
    for (const s of FOUR_SERVICES) {
      const card = screen.getByRole("heading", { level: 3, name: s.name }).closest("div");
      expect(card).toBeTruthy();
      // capability manifest lines come from the CMS bullets, indexed 01/02
      const list = within(screen.getByTestId(`pillar-${s.id === "thg-order" ? "dropship" : s.id.replace("thg-", "")}`));
      expect(list.getByText(s.bullets[0])).toBeTruthy();
      const cta = list.getByRole("link");
      expect(cta.getAttribute("href")).toBe(s.ctaUrl);
    }
    expectNoAnnotationChrome(container);
  });

  it("maps CMS service ids onto their atlas slots (fulfill = anchor panel)", () => {
    render(<PillarAtlasSection copy={copyFor("en")} services={FOUR_SERVICES} />);
    expect(within(screen.getByTestId("pillar-fulfill")).getByText("Name thg-fulfill")).toBeTruthy();
    expect(within(screen.getByTestId("pillar-dropship")).getByText("Name thg-order")).toBeTruthy();
  });

  it("falls back to position order for unknown service ids", () => {
    const unknown = [service("svc-a"), service("svc-b"), service("svc-c"), service("svc-d")];
    render(<PillarAtlasSection copy={copyFor("en")} services={unknown} />);
    expect(within(screen.getByTestId("pillar-fulfill")).getByText("Name svc-a")).toBeTruthy();
    expect(within(screen.getByTestId("pillar-dropship")).getByText("Name svc-d")).toBeTruthy();
  });

  it("keeps the explicit empty state when CMS returns no services", () => {
    render(<PillarAtlasSection copy={copyFor("en")} services={[]} />);
    expect(screen.getByText(MARKETING_COPY["services.empty"].en)).toBeTruthy();
  });
});

describe("EcosystemAtlasSection (WEB-001B)", () => {
  it.each(LOCALES)("renders the six-stage flow owned by real pillars — %s", (locale) => {
    const copy = copyFor(locale);
    const { container } = render(<EcosystemAtlasSection copy={copy} />);

    // Mobile variant: same six stages, same owner language.
    const mobile = screen.getByTestId("ecosystem-atlas-mobile");
    expect(mobile.querySelectorAll("li")).toHaveLength(6);

    // Owner micro-labels are the real service names (never invented pillar labels).
    const text = container.textContent ?? "";
    for (const key of ["nav.thg_order", "nav.thg_fulfill", "nav.thg_warehouse", "nav.thg_express"]) {
      expect(text).toContain(copy[key]);
    }
    // Stage titles are existing verified production terms.
    for (const key of ["hero.feature1", "about.img2_title", "hero.feature3", "hero.feature4", "process.s3_title", "process.s4_title"]) {
      expect(text).toContain(copy[key]);
    }
    expectNoAnnotationChrome(container);
  });

  it("marks exactly two anchor hubs (Warehouse + Fulfillment)", () => {
    render(<EcosystemAtlasSection copy={copyFor("en")} />);
    const mobile = screen.getByTestId("ecosystem-atlas-mobile");
    const anchors = [...mobile.querySelectorAll("li")].filter((li) => li.className.includes("mStepAnchor"));
    expect(anchors).toHaveLength(2);
  });
});

describe("supporting sections (WEB-001B)", () => {
  it.each(LOCALES)("proof strip renders only the three factual lines — %s", (locale) => {
    const copy = copyFor(locale);
    const { container } = render(<ProofStripSection copy={copy} />);
    for (const key of ["proof.item1", "proof.item2", "proof.item3"]) {
      expect(container.textContent).toContain(copy[key]);
    }
    expectNoAnnotationChrome(container);
  });

  it.each(LOCALES)("coverage lists the five verified regions — %s", (locale) => {
    const copy = copyFor(locale);
    const { container } = render(<CoverageSection copy={copy} />);
    for (const i of [1, 2, 3, 4, 5]) {
      expect(container.textContent).toContain(copy[`coverage.r${i}_name`]);
    }
    expectNoAnnotationChrome(container);
  });

  it.each(LOCALES)("who-we-serve renders the four verified production seller groups — %s", (locale) => {
    const copy = copyFor(locale);
    const { container } = render(<WhoWeServeSection copy={copy} />);
    for (const i of [1, 2, 3, 4]) {
      expect(container.textContent).toContain(copy[`sellers.t${i}_title`]);
    }
    // the prototype's invented personas never ship
    expect(container.textContent).not.toContain("International partners evaluating THG");
    expectNoAnnotationChrome(container);
  });

  it.each(LOCALES)("why-THG renders all six production advantages — %s", (locale) => {
    const copy = copyFor(locale);
    const { container } = render(<WhyThgSection copy={copy} />);
    for (const i of [1, 2, 3, 4, 5, 6]) {
      expect(container.textContent).toContain(copy[`adv.a${i}_title`]);
    }
    expectNoAnnotationChrome(container);
  });
});
