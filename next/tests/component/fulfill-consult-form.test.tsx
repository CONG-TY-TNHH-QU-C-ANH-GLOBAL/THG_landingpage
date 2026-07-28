// @vitest-environment happy-dom
// WEB-002 land-and-expand — the Fulfill inline form has a FIXED primary (fulfill, always in
// service_interests), no primary selector, optional adjacent interests, and submits
// surface="fulfill-inline" through the real /leads transport. Stays isolated from a separately
// mounted global dialog (independent field state + unique IDs).
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor, within } from "@testing-library/react";

import FulfillConsultationForm from "@/features/fulfill/ui/fulfill-consultation-form";
import { LeadFormDialog } from "@/shared/ui/lead-form-dialog";
import { copyForLocale, mockLeadsFetch, lastLeadBody } from "../support/lead-test-utils";

const copy = copyForLocale("en");

function fill(scope: HTMLElement, name = "Jane", email = "jane@example.com") {
  fireEvent.change(within(scope).getByLabelText(/Full name/), { target: { value: name } });
  fireEvent.change(within(scope).getByLabelText(/^Email/), { target: { value: email } });
}

beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Fulfill inline consultation form (multi-intent, fixed primary)", () => {
  it("does NOT render a primary service selector", () => {
    render(<FulfillConsultationForm lang="en" copy={copy} />);
    expect(screen.queryByLabelText(copy["lead_form.service_label"])).toBeNull();
  });

  it("submits primary=fulfill (in interests), surface=fulfill-inline, with details", async () => {
    const fetchMock = mockLeadsFetch();
    const { getByTestId } = render(<FulfillConsultationForm lang="en" copy={copy} />);
    const form = getByTestId("fulfill-consult-form");
    fill(form);
    fireEvent.change(within(form).getByLabelText(copy["lead_form.product_type_label"]), {
      target: { value: "drinkware" },
    });
    fireEvent.submit(form);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = lastLeadBody(fetchMock);
    expect(body.primary_service).toBe("fulfill");
    expect(body.service_interests).toEqual(["fulfill"]);
    expect(body.surface).toBe("fulfill-inline");
    expect(body.source_page).toBe("/thg-fulfill");
    expect(body.service_details).toEqual({ fulfill: { product_type: "drinkware" } });
  });

  it("captures adjacent interests as secondaries (no details fabricated)", async () => {
    const fetchMock = mockLeadsFetch();
    const { getByTestId } = render(<FulfillConsultationForm lang="en" copy={copy} />);
    const form = getByTestId("fulfill-consult-form");
    fill(form);
    fireEvent.click(within(form).getByRole("checkbox", { name: "THG Warehouse" }));
    fireEvent.submit(form);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = lastLeadBody(fetchMock);
    expect(body.primary_service).toBe("fulfill");
    expect(body.service_interests).toEqual(["fulfill", "warehouse"]);
    expect(body.service_details).toBeUndefined(); // warehouse secondary carries no details
  });

  it("blocks submit and flags fields when required inputs are empty", async () => {
    const fetchMock = mockLeadsFetch();
    const { getByTestId } = render(<FulfillConsultationForm lang="en" copy={copy} />);
    const form = getByTestId("fulfill-consult-form");
    fireEvent.submit(form);
    await waitFor(() =>
      expect(within(form).getByLabelText(/Full name/).getAttribute("aria-invalid")).toBe("true"),
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows a success state after a successful submit", async () => {
    mockLeadsFetch();
    const { getByTestId } = render(<FulfillConsultationForm lang="en" copy={copy} />);
    fill(getByTestId("fulfill-consult-form"));
    fireEvent.submit(getByTestId("fulfill-consult-form"));
    await waitFor(() => expect(screen.getByTestId("fulfill-consult-success")).toBeTruthy());
  });

  it("coexists with the global dialog: independent state, unique IDs, no cross-submit", async () => {
    const fetchMock = mockLeadsFetch();
    render(
      <>
        <FulfillConsultationForm lang="en" copy={copy} />
        <LeadFormDialog lang="en" copy={copy} trigger={<button type="button">Open</button>} />
      </>,
    );
    fireEvent.click(screen.getByText("Open"));

    const inlineForm = screen.getByTestId("fulfill-consult-form");
    const inlineName = within(inlineForm).getByLabelText(/Full name/) as HTMLInputElement;
    expect(inlineName.id).not.toBe("lead-name");
    expect(document.querySelectorAll("#lead-name")).toHaveLength(1);

    fireEvent.change(inlineName, { target: { value: "Inline Jane" } });
    expect((document.getElementById("lead-name") as HTMLInputElement).value).toBe("");

    fireEvent.change(within(inlineForm).getByLabelText(/^Email/), {
      target: { value: "jane@example.com" },
    });
    fireEvent.submit(inlineForm);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(lastLeadBody(fetchMock).surface).toBe("fulfill-inline");
  });
});
