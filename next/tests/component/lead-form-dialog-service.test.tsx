// @vitest-environment happy-dom
// WEB-002 land-and-expand — the global dialog is multi-intent: a primary need (or "need
// guidance"), optional adjacent interests, per-primary details, submitted with
// surface="global-services-dialog". Switching the primary preserves common fields AND secondary
// interests. Exercises the real LeadFormDialog through the real /leads transport (fetch mocked).
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";

import { LeadFormDialog } from "@/shared/ui/lead-form-dialog";
import { copyForLocale, mockLeadsFetch, lastLeadBody } from "../support/lead-test-utils";

const copy = copyForLocale("en");

function open(initialService?: "fulfill" | "express") {
  render(
    <LeadFormDialog
      lang="en"
      copy={copy}
      trigger={<button type="button">Open</button>}
      initialService={initialService}
    />,
  );
  fireEvent.click(screen.getByText("Open"));
}
function fillRequired() {
  fireEvent.change(document.getElementById("lead-name") as HTMLInputElement, { target: { value: "Jane" } });
  fireEvent.change(document.getElementById("lead-email") as HTMLInputElement, {
    target: { value: "jane@example.com" },
  });
}
const primarySelect = () => screen.getByLabelText(copy["lead_form.service_label"]) as HTMLSelectElement;
const submitBtn = () => screen.getByRole("button", { name: copy["lead_form.submit"] });

beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("global multi-intent LeadFormDialog", () => {
  it("renders an accessible primary selector defaulting to 'need guidance'", () => {
    open();
    expect(primarySelect().tagName).toBe("SELECT");
    expect(primarySelect().value).toBe(""); // guidance
  });

  it("submits a generic 'need guidance' lead (no intent) with surface only", async () => {
    const fetchMock = mockLeadsFetch();
    open();
    fillRequired();
    fireEvent.click(submitBtn());
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = lastLeadBody(fetchMock);
    expect(body.primary_service).toBeUndefined();
    expect(body.service_interests).toBeUndefined();
    expect(body.surface).toBe("global-services-dialog");
  });

  it("preselects a primary and shows its detail group", () => {
    open("fulfill");
    expect(primarySelect().value).toBe("fulfill");
    expect(screen.getByLabelText(copy["lead_form.product_type_label"])).toBeTruthy();
  });

  it("submits primary + interests + validated details", async () => {
    const fetchMock = mockLeadsFetch();
    open("fulfill");
    fillRequired();
    fireEvent.change(screen.getByLabelText(copy["lead_form.product_type_label"]), {
      target: { value: "apparel" },
    });
    // Adjacent interest.
    fireEvent.click(screen.getByRole("checkbox", { name: "THG Warehouse" }));
    fireEvent.click(submitBtn());
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = lastLeadBody(fetchMock);
    expect(body.primary_service).toBe("fulfill");
    expect(body.service_interests).toEqual(["fulfill", "warehouse"]);
    expect(body.service_details).toEqual({ fulfill: { product_type: "apparel" } });
    expect(body.surface).toBe("global-services-dialog");
  });

  it("changing primary preserves common fields + secondary interests and clears orphaned details", async () => {
    const fetchMock = mockLeadsFetch();
    open("fulfill");
    fillRequired();
    fireEvent.change(screen.getByLabelText(copy["lead_form.product_type_label"]), {
      target: { value: "apparel" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "THG Warehouse" }));

    // Switch primary fulfill → express.
    fireEvent.change(primarySelect(), { target: { value: "express" } });
    // Fulfill detail group is gone; common field preserved; warehouse interest preserved.
    expect(screen.queryByLabelText(copy["lead_form.product_type_label"])).toBeNull();
    expect((document.getElementById("lead-name") as HTMLInputElement).value).toBe("Jane");
    expect((screen.getByRole("checkbox", { name: "THG Warehouse" }) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(submitBtn());
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = lastLeadBody(fetchMock);
    expect(body.primary_service).toBe("express");
    expect(body.service_interests).toEqual(["express", "warehouse"]);
    expect(body.service_details).toBeUndefined(); // no fulfill details leaked
  });
});
