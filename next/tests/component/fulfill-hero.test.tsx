// @vitest-environment happy-dom
// WEB-002 H1 ownership: the single page H1 is the feature-owned art-directed headline; the CMS
// service identity (hero_title → serviceLabel) is the eyebrow (with a localized default when
// absent); CMS hero_sub + bullets still render. CMS never supplies the giant H1.
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";

// The hero test asserts on the H1 / eyebrow / subtitle / rail text, not the decorative image.
vi.mock("next/image", () => ({ default: () => null }));

import HeroSection from "@/features/fulfill/ui/hero-section";
import { getFulfillParityContent } from "@/features/fulfill/parity-content";
import { getFulfillContent } from "@/features/fulfill";
import type { FulfillContent } from "@/features/fulfill";
import { copyForLocale } from "../support/lead-test-utils";


/** Resolved once: the parity copy is pure data, so rebuilding it per render proved nothing
 *  and only made the assertions below harder to read. */
const PARITY = getFulfillParityContent("en");
const marketing = copyForLocale("en");
const copy = getFulfillContent("en");

function content(overrides: Partial<FulfillContent> = {}): FulfillContent {
  return {
    present: true,
    serviceLabel: "THG Fulfill",
    heroSubtitle: "CMS subtitle here.",
    heroEyebrow: "",
    points: ["VN/CN/US POD", "Item-level QC", "US e-com standard"],
    catalog: [],
    ...overrides,
  };
}

afterEach(cleanup);

describe("Fulfill hero H1 ownership", () => {
  it("renders exactly one H1 and it is the art-directed headline, not the CMS label", () => {
    render(<HeroSection lang="en" parity={PARITY} marketingCopy={marketing} copy={copy} content={content()} />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe(copy.heroHeadline);
    expect(h1s[0].textContent).not.toBe("THG Fulfill");
  });

  it("shows the CMS service label as the eyebrow when present", () => {
    const { container } = render(
      <HeroSection lang="en" parity={PARITY} marketingCopy={marketing} copy={copy} content={content()} />,
    );
    const section = container.querySelector("section") as HTMLElement;
    expect(within(section).getByText("THG Fulfill")).toBeTruthy(); // eyebrow badge
  });

  it("falls back to the localized default badge when the CMS label is missing", () => {
    render(
      <HeroSection
        lang="en"
        parity={PARITY} marketingCopy={marketing}
        copy={copy}
        content={content({ serviceLabel: "" })}
      />,
    );
    expect(screen.getByText(copy.heroBadge)).toBeTruthy();
  });

  it("prefers the CMS hero_eyebrow over the service label when the editor set one", () => {
    render(
      <HeroSection
        lang="en"
        parity={PARITY} marketingCopy={marketing}
        copy={copy}
        content={content({ heroEyebrow: "Fulfillment Operations", serviceLabel: "THG Fulfill" })}
      />,
    );
    // hero_eyebrow wins; the eyebrow field is now consumed, not dropped.
    expect(screen.getByText("Fulfillment Operations")).toBeTruthy();
  });

  it("renders the CMS subtitle and the operational rail points", () => {
    render(<HeroSection lang="en" parity={PARITY} marketingCopy={marketing} copy={copy} content={content()} />);
    expect(screen.getByText("CMS subtitle here.")).toBeTruthy();
    expect(screen.getByText("Item-level QC")).toBeTruthy();
  });
  // R3 parity guards: these three blocks were dropped in the original migration and restored from
  // the Vite hero. Asserting them here is what makes a future regression fail a test rather than
  // silently shrink the page.
  it("renders the restored platform rail with every integrated storefront", () => {
    render(<HeroSection lang="en" parity={PARITY} marketingCopy={marketing} copy={copy} content={content()} />);
    expect(screen.getByText(PARITY.platformsLabel)).toBeTruthy();
    for (const platform of ["Shopify", "Etsy", "WooCommerce", "Amazon", "TikTok Shop"]) {
      expect(screen.getByText(platform)).toBeTruthy();
    }
  });

  it("renders the restored POD transformation stages in order", () => {
    render(<HeroSection lang="en" parity={PARITY} marketingCopy={marketing} copy={copy} content={content()} />);
    expect(screen.getByText(PARITY.podProcess)).toBeTruthy();
    const stages = [PARITY.blankTshirt, PARITY.dtgPrint, PARITY.brandedProduct];
    const rendered = stages.map((stage) => screen.getByText(stage));
    expect(rendered).toHaveLength(3);
    // Document order must match the process order — the transformation only reads correctly
    // left-to-right (blank unit -> print -> branded product).
    for (let i = 1; i < rendered.length; i += 1) {
      expect(
        rendered[i - 1].compareDocumentPosition(rendered[i]) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
    expect(screen.getByText(PARITY.yourBrand)).toBeTruthy();
  });
});
