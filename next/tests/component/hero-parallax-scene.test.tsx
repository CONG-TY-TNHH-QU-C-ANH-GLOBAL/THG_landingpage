// @vitest-environment happy-dom
// WEB-001A: guards the two hard requirements from IMPLEMENTATION_BASELINE.md "Reduced
// motion is structural, not slowed" — (1) under prefers-reduced-motion the scene never
// gains the sticky/tall-track class and never attaches a scroll/resize listener (the
// static markup below IS the complete scene, nothing to animate into); (2) when motion
// is allowed, the scene opts in and the layer content (network node copy) is present
// either way, so reduced-motion users see the same real information, not a placeholder.
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";

import { HeroParallaxScene } from "@/features/home/ui/hero-parallax-scene";

afterEach(cleanup);

class FakeIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? matches : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  window.IntersectionObserver = FakeIntersectionObserver as unknown as typeof IntersectionObserver;
}

const SCENE_PROPS = {
  imageSrc: "/assets/globe-3d.png",
  imageSrcAvif: "/assets/globe-3d.avif",
  imageSrcWebp: "/assets/globe-3d.webp",
  imageAlt: "THG Fulfill global logistics network",
  apac: { value: "Vietnam · China", caption: "Asia-Pacific" },
  us: { value: "$1.2", caption: "US domestic fulfill" },
  eu: { value: "5-8", caption: "delivery days" },
};

describe("HeroParallaxScene (WEB-001A)", () => {
  it("under prefers-reduced-motion: no sticky class, no scroll/resize listeners, full static content", () => {
    mockReducedMotion(true);
    const addSpy = vi.spyOn(window, "addEventListener");

    const { getByTestId } = render(
      <HeroParallaxScene {...SCENE_PROPS}>
        <h1>Test headline</h1>
      </HeroParallaxScene>,
    );
    const scene = getByTestId("hero-parallax-scene");

    expect(scene.className).not.toMatch(/motionOn/i);
    expect(addSpy.mock.calls.some(([type]) => type === "scroll")).toBe(false);
    expect(addSpy.mock.calls.some(([type]) => type === "resize")).toBe(false);

    // WEB-001A regression guard: children (the headline/CTA column) must render inside
    // the scene's own sticky/grid structure, not as a detached sibling — an earlier
    // version left it outside, which stretched the grid row to the 200vh scroll-track
    // height and centered the text mid-page, clipping the H1 below the fold.
    expect(scene.contains(getByTestId("hero-copy"))).toBe(true);
    expect(getByTestId("hero-copy").textContent).toContain("Test headline");

    const stageText = getByTestId("hero-globe-stage").textContent ?? "";
    expect(stageText).toContain("Vietnam · China");
    expect(stageText).toContain("$1.2");
    expect(stageText).toContain("5-8");
  });

  it("when motion is allowed: opts into the sticky scene and attaches rAF-deduped scroll/resize listeners", () => {
    mockReducedMotion(false);
    const addSpy = vi.spyOn(window, "addEventListener");

    const { getByTestId } = render(
      <HeroParallaxScene {...SCENE_PROPS}>
        <h1>Test headline</h1>
      </HeroParallaxScene>,
    );
    const scene = getByTestId("hero-parallax-scene");

    expect(scene.className).toMatch(/motionOn/i);
    expect(scene.contains(getByTestId("hero-copy"))).toBe(true);
    expect(addSpy.mock.calls.some(([type, , opts]) => type === "scroll" && (opts as AddEventListenerOptions)?.passive)).toBe(
      true,
    );
    expect(addSpy.mock.calls.some(([type]) => type === "resize")).toBe(true);
  });
});
