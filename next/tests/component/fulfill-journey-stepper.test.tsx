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

  it("ArrowDown advances selection and wraps at the end", () => {
    const { container } = renderStepper();
    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "ArrowDown" });
    expect(stage(container).getAttribute("data-step")).toBe("1");

    fireEvent.keyDown(tablist, { key: "End" });
    expect(stage(container).getAttribute("data-step")).toBe("3");

    fireEvent.keyDown(tablist, { key: "ArrowDown" });
    expect(stage(container).getAttribute("data-step")).toBe("0");
  });
});
