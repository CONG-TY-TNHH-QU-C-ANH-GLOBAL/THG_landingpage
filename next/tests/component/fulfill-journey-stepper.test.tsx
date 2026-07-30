// @vitest-environment happy-dom
// WEB-002: the journey's interaction contract — the 4 steps form a keyboard-operable tablist,
// selection is single, and the decorative stage reflects the selected step via data-step (the
// hook the scoped CSS reads). Exercises the real exported island, no test-only replica.
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// next/image needs the Next runtime; this DOM test asserts on the tablist + stage data-step, not
// on images, so the mock renders nothing.
vi.mock("next/image", () => ({ default: () => null }));

import JourneyStepper from "@/features/fulfill/ui/journey-stepper";
import { getFulfillContent, applyServiceBlocks } from "@/features/fulfill";
import { fulfillServiceContentFromDto } from "@/features/fulfill/mappers/serviceBlocks";
import { serviceBlocksResponseSchema } from "@/features/fulfill/schemas/service-blocks";

afterEach(cleanup);

const STEPS = [
  { index: "STEP 01 / 04", title: "Design Input", description: "d0" },
  { index: "STEP 02 / 04", title: "Processing", description: "d1" },
  { index: "STEP 03 / 04", title: "Quality Assurance", description: "d2" },
  { index: "STEP 04 / 04", title: "Dispatch Ready", description: "d3" },
] as const;

const IMAGES = [
  { src: "/a.jpg", alt: "", step: 0, widthPct: 62 },
  { src: "/b.png", alt: "", step: 1, widthPct: 74 },
  { src: "/b.png", alt: "", step: 2, widthPct: 74 },
  { src: "/b.png", alt: "", step: 3, widthPct: 74 },
] as const;

function renderStepper() {
  return render(
    <JourneyStepper
      steps={STEPS}
      images={IMAGES}
      hubStages={["Received", "Processing", "QC", "Packed"]}
      hubLabel="Hub System"
      reference="ref"
      stepsLabel="Steps"
    />,
  );
}

/** The stage is the aria-hidden element carrying data-step. */
function stage(container: HTMLElement): HTMLElement {
  const el = container.querySelector("[data-step]");
  if (!(el instanceof HTMLElement)) throw new Error("stage not found");
  return el;
}

describe("JourneyStepper", () => {
  it("renders 4 tabs with the first selected and only one roving-tabindex entry", () => {
    renderStepper();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs[0].getAttribute("tabindex")).toBe("0");
    expect(tabs[1].getAttribute("tabindex")).toBe("-1");
  });

  it("click selects a step and moves the stage to that data-step", () => {
    const { container } = renderStepper();
    fireEvent.click(screen.getByRole("tab", { name: /Quality Assurance/ }));

    const tabs = screen.getAllByRole("tab");
    expect(tabs[2].getAttribute("aria-selected")).toBe("true");
    expect(tabs[0].getAttribute("aria-selected")).toBe("false");
    expect(stage(container).getAttribute("data-step")).toBe("2");
  });

  // Key handling lives on the focusable tabs (roving tabindex), so keys are fired on the tab that
  // currently holds focus — the pattern a real keyboard user exercises.
  it("ArrowRight/ArrowLeft/Home/End navigate with wraparound and move focus with the active tab", () => {
    const { container } = renderStepper();
    const tabs = screen.getAllByRole("tab");

    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(stage(container).getAttribute("data-step")).toBe("1");
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1].getAttribute("tabindex")).toBe("0");
    expect(tabs[0].getAttribute("tabindex")).toBe("-1");

    fireEvent.keyDown(tabs[1], { key: "ArrowLeft" });
    expect(stage(container).getAttribute("data-step")).toBe("0");
    expect(document.activeElement).toBe(tabs[0]);

    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" }); // wrap to last
    expect(stage(container).getAttribute("data-step")).toBe("3");

    fireEvent.keyDown(tabs[3], { key: "Home" });
    expect(stage(container).getAttribute("data-step")).toBe("0");

    fireEvent.keyDown(tabs[0], { key: "End" });
    expect(stage(container).getAttribute("data-step")).toBe("3");

    fireEvent.keyDown(tabs[3], { key: "ArrowRight" }); // wrap to first
    expect(stage(container).getAttribute("data-step")).toBe("0");
  });

  it("ArrowDown/ArrowUp also navigate (vertical orientation) with wraparound", () => {
    const { container } = renderStepper();
    const tabs = screen.getAllByRole("tab");

    fireEvent.keyDown(tabs[0], { key: "ArrowUp" }); // wrap up to last
    expect(stage(container).getAttribute("data-step")).toBe("3");
    fireEvent.keyDown(tabs[3], { key: "ArrowDown" }); // wrap down to first
    expect(stage(container).getAttribute("data-step")).toBe("0");
  });

  it("ignores keys that are not tab navigation", () => {
    const { container } = renderStepper();
    fireEvent.keyDown(screen.getAllByRole("tab")[0], { key: "a" });
    expect(stage(container).getAttribute("data-step")).toBe("0");
  });

  it("keeps a labelled tablist with exactly one focusable tab (tabIndex 0) and the rest -1", () => {
    renderStepper();
    expect(screen.getByRole("tablist").getAttribute("aria-label")).toBe("Steps");
    const tabs = screen.getAllByRole("tab");
    expect(tabs.filter((t) => t.getAttribute("tabindex") === "0")).toHaveLength(1);
    expect(tabs[0].getAttribute("tabindex")).toBe("0");
    expect(tabs.slice(1).every((t) => t.getAttribute("tabindex") === "-1")).toBe(true);
  });

  // Renders the real island with copy that has been overlaid by CMS service-blocks: an overlaid
  // role shows the CMS title, a non-overlaid role keeps the localized fallback — proving the
  // pipeline reaches the DOM without changing the tablist structure/order.
  it("renders CMS-overlaid journey titles while keeping fallback titles for unmapped roles", () => {
    const base = getFulfillContent("vi");
    const content = fulfillServiceContentFromDto(
      serviceBlocksResponseSchema.parse({
        locale: "vi",
        page_slug: "thg-fulfill",
        kind: null,
        blocks: [{ id: 1, kind: "journey_step", position: 0, icon: null, title: "Nhận thiết kế (CMS)", description: "desc", payload: { key: "design-input" } }],
      }),
    );
    const merged = applyServiceBlocks(base, content);
    render(
      <JourneyStepper
        steps={merged.steps}
        images={IMAGES}
        hubStages={merged.hubStages}
        hubLabel="Hub System"
        reference={merged.journeyReference}
        stepsLabel={merged.journeyTitle}
      />,
    );
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4); // structure unchanged
    expect(tabs[0].textContent).toContain("Nhận thiết kế (CMS)"); // CMS overlay
    expect(tabs[1].textContent).toContain(base.steps[1].title); // fallback preserved
  });
});
