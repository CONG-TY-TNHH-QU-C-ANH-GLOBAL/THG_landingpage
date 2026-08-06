// @vitest-environment happy-dom
//
// The planner's interaction contract. Three things are asserted, and all three are invisible in a
// screenshot:
//
//   RESTING STATE    with nothing answered there are no narrowing attributes, so the server's markup
//                    is already correct and hydration changes nothing. This is what makes the
//                    "all six plans, no JavaScript" guarantee hold.
//   NARROWING        one answer narrows the set, two answers select one plan — expressed as data
//                    attributes that CSS matches, never by unmounting a plan.
//   KEYBOARD         real radiogroup semantics: one tab stop per group, arrows move AND select,
//                    Home/End jump, both ends wrap.
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";

import PlanSelector from "@/shared/planning/ui/plan-selector.client";
import { SITUATIONS, SUPPLY_MODELS } from "@/shared/planning/plan";

const labels = Object.fromEntries([
  ["ui.q_situation", "Where are you today?"],
  ["ui.q_supply", "What do you sell?"],
  ["ui.all_plans", "Three situations · two supply models"],
  ...SITUATIONS.map((s) => [`situation.${s}`, `situation-${s}`]),
  ...SUPPLY_MODELS.map((m) => [`supply.${m}`, `supply-${m}`]),
]);

/** Stand-ins for the server-rendered plans: the selector never sees plan content, only the two
 *  attributes it narrows on. */
function renderSelector() {
  return render(
    <PlanSelector labels={labels}>
      {SITUATIONS.flatMap((situation) =>
        SUPPLY_MODELS.map((supplyModel) => (
          <div
            key={`${situation}:${supplyModel}`}
            data-situation={situation}
            data-supply={supplyModel}
          >
            {situation}:{supplyModel}
          </div>
        )),
      )}
    </PlanSelector>,
  );
}

/** The element the narrowing CSS matches against: the plans' own container. */
function narrowingStack(container: HTMLElement): HTMLElement {
  const plan = container.querySelector("[data-situation][data-supply]") as HTMLElement;
  return plan.parentElement as HTMLElement;
}

/** The plans inside a captured stack. Scoped to direct children, because once both questions are
 *  answered the stack carries the same two attributes and would otherwise count itself. */
function plansIn(stack: HTMLElement): NodeListOf<Element> {
  return stack.querySelectorAll(":scope > [data-situation][data-supply]");
}

afterEach(cleanup);

describe("plan selector — resting state", () => {
  it("renders every plan and declares no narrowing before either question is answered", () => {
    const { container } = renderSelector();
    const stack = narrowingStack(container);
    expect(plansIn(stack)).toHaveLength(6);

    // The narrowing container carries no attribute yet, which is why the server's markup needs no
    // special case and there is nothing for hydration to correct.
    expect(stack.getAttribute("data-situation")).toBeNull();
    expect(stack.getAttribute("data-supply")).toBeNull();
  });

  it("announces the unnarrowed set politely rather than silently", () => {
    renderSelector();
    const status = screen.getByRole("status");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.textContent).toBe(labels["ui.all_plans"]);
  });

  it("exposes exactly two questions, both as named radiogroups", () => {
    renderSelector();
    const groups = screen.getAllByRole("radiogroup");
    expect(groups).toHaveLength(2);
    expect(within(groups[0]).getAllByRole("radio")).toHaveLength(SITUATIONS.length);
    expect(within(groups[1]).getAllByRole("radio")).toHaveLength(SUPPLY_MODELS.length);
  });
});

describe("plan selector — narrowing", () => {
  it("narrows by attribute, and never unmounts a plan", () => {
    const { container } = renderSelector();
    const groups = screen.getAllByRole("radiogroup");
    const narrowing = narrowingStack(container);

    fireEvent.click(within(groups[0]).getAllByRole("radio")[1]);
    expect(narrowing.getAttribute("data-situation")).toBe(SITUATIONS[1]);
    expect(narrowing.getAttribute("data-supply")).toBeNull();

    fireEvent.click(within(groups[1]).getAllByRole("radio")[1]);
    expect(narrowing.getAttribute("data-supply")).toBe(SUPPLY_MODELS[1]);

    // All six are still in the DOM. Narrowing is a presentation state, so a crawler and a
    // JS-disabled visitor keep the complete answer.
    expect(plansIn(narrowing)).toHaveLength(6);
  });

  it("announces what the set was narrowed to", () => {
    renderSelector();
    const groups = screen.getAllByRole("radiogroup");
    fireEvent.click(within(groups[0]).getAllByRole("radio")[0]);
    fireEvent.click(within(groups[1]).getAllByRole("radio")[0]);
    expect(screen.getByRole("status").textContent).toContain(`situation-${SITUATIONS[0]}`);
    expect(screen.getByRole("status").textContent).toContain(`supply-${SUPPLY_MODELS[0]}`);
  });
});

describe("plan selector — keyboard", () => {
  it("keeps exactly one tab stop per group", () => {
    renderSelector();
    const [situationGroup] = screen.getAllByRole("radiogroup");
    const radios = within(situationGroup).getAllByRole("radio");
    expect(radios.filter((r) => r.getAttribute("tabindex") === "0")).toHaveLength(1);
  });

  it("moves AND selects on arrow keys, and wraps at both ends", () => {
    renderSelector();
    const [situationGroup] = screen.getAllByRole("radiogroup");
    const radios = within(situationGroup).getAllByRole("radio");

    fireEvent.keyDown(radios[0], { key: "ArrowDown" });
    expect(radios[1].getAttribute("aria-checked")).toBe("true");

    fireEvent.keyDown(radios[1], { key: "ArrowUp" });
    expect(radios[0].getAttribute("aria-checked")).toBe("true");

    // Wraparound: backwards from the first lands on the last.
    fireEvent.keyDown(radios[0], { key: "ArrowUp" });
    expect(radios[radios.length - 1].getAttribute("aria-checked")).toBe("true");
  });

  it("jumps to the ends on Home and End", () => {
    renderSelector();
    const [situationGroup] = screen.getAllByRole("radiogroup");
    const radios = within(situationGroup).getAllByRole("radio");

    fireEvent.keyDown(radios[0], { key: "End" });
    expect(radios[radios.length - 1].getAttribute("aria-checked")).toBe("true");

    fireEvent.keyDown(radios[radios.length - 1], { key: "Home" });
    expect(radios[0].getAttribute("aria-checked")).toBe("true");
  });

  it("leaves keys it does not own to the browser", () => {
    renderSelector();
    const [situationGroup] = screen.getAllByRole("radiogroup");
    const radios = within(situationGroup).getAllByRole("radio");
    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    radios[0].dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});
