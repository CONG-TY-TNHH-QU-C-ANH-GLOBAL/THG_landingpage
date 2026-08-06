// @vitest-environment happy-dom
//
// S1 · QUALIFY — the contract for the movement a seller reads first.
//
// Three things are asserted because all three are load-bearing and none is visible in a screenshot:
//
//   H1 OWNERSHIP   the single H1 is the feature-owned art-directed headline. A CMS field supplies
//                  the eyebrow above it and never the heading itself, so an editor cannot change
//                  the page's most important SEO signal by renaming a service record.
//   SCOPE          services, origins and destinations are present without interaction, because they
//                  are gate G0: everything after them is wasted on a seller they exclude.
//   NO CTA         the movement carries no lead surface. A seller who has not yet learned what the
//                  service covers cannot meaningfully request a consultation.
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";

// The scope panel is text; the decorative image mock keeps this suite focused on it.
vi.mock("next/image", () => ({ default: () => null }));

import QualifySection from "@/features/fulfill/ui/qualify-section";
import { getMovementCopy } from "@/features/fulfill/ui/movement-copy";
import { getFulfillParityContent } from "@/features/fulfill/parity-content";
import { getFulfillContent } from "@/features/fulfill";
import type { FulfillContent } from "@/features/fulfill";

const copy = getFulfillContent("en");
const movement = getMovementCopy("en");
const faqs = getFulfillParityContent("en").faqFallback;

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

function renderSection(overrides: Partial<FulfillContent> = {}) {
  return render(
    <QualifySection copy={copy} content={content(overrides)} movement={movement} faqs={faqs} />,
  );
}

afterEach(cleanup);

describe("S1 qualify — heading ownership", () => {
  it("renders exactly one H1, and it is the art-directed headline rather than the CMS label", () => {
    renderSection();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe(copy.heroHeadline);
    expect(h1s[0].textContent).not.toBe("THG Fulfill");
  });

  it("shows the CMS service label as the eyebrow when present", () => {
    const { container } = renderSection();
    const section = container.querySelector("section") as HTMLElement;
    expect(within(section).getByText("THG Fulfill")).toBeTruthy();
  });

  it("falls back to the localized default badge when the CMS label is missing", () => {
    renderSection({ serviceLabel: "" });
    expect(screen.getByText(copy.heroBadge)).toBeTruthy();
  });

  it("prefers an editor-set hero eyebrow over the service identity", () => {
    renderSection({ heroEyebrow: "Fulfillment Operations", serviceLabel: "THG Fulfill" });
    expect(screen.getByText("Fulfillment Operations")).toBeTruthy();
  });
});

describe("S1 qualify — the scope gate", () => {
  it("states services, production origins and destinations without any interaction", () => {
    renderSection();
    expect(screen.getByText(movement.scopeServices)).toBeTruthy();
    expect(screen.getByText(movement.scopeOrigins)).toBeTruthy();
    expect(screen.getByText(movement.scopeDestinations)).toBeTruthy();
    expect(screen.getByText("POD · Dropship")).toBeTruthy();
    expect(screen.getByText("US · UK · WW")).toBeTruthy();
  });

  it("renders the published scope answer at the point the question is asked", () => {
    renderSection();
    expect(screen.getByText(faqs[0].answer)).toBeTruthy();
  });

  it("renders the exit for a seller this service does not serve", () => {
    renderSection();
    expect(screen.getByText(movement.exitTitle)).toBeTruthy();
    expect(screen.getByText(movement.exitText)).toBeTruthy();
  });

  it("renders the CMS subtitle and the operational rail", () => {
    renderSection();
    expect(screen.getByText("CMS subtitle here.")).toBeTruthy();
    expect(screen.getByText("Item-level QC")).toBeTruthy();
  });
});

describe("S1 qualify — conversion discipline", () => {
  it("carries no lead surface: conversion is earned later, not asked for on arrival", () => {
    const { container } = renderSection();
    expect(container.querySelectorAll("button")).toHaveLength(0);
    expect(container.querySelectorAll("form")).toHaveLength(0);
  });
});
