// @vitest-environment happy-dom
// WEB-001B conversion section — the verified POST /leads contract is the boundary
// under test: payload keys must match the existing LeadFormDialog contract exactly
// (no region/primary-market, no service-interest), validation/success states must be
// real, and the Community Knowledge Loop must stay a plain locale-aware link with
// zero consultation PII in either pre- or post-submit state.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor, act } from "@testing-library/react";

import ConversionSection from "@/features/home/ui/conversion-section";
import { MARKETING_COPY } from "@/shared/i18n/marketing-copy";
import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";

function copyFor(locale: Locale): MarketingCopy {
  return Object.fromEntries(Object.entries(MARKETING_COPY).map(([k, v]) => [k, v[locale]]));
}

// The verified CMS leads schema — the payload may never carry anything else.
const CONTRACT_KEYS = ["name", "email", "phone", "message", "source_page", "locale", "utm", "turnstile_token"];

function mockLeadsFetch(status = 201, body: unknown = { ok: true, id: 1 }) {
  const fn = vi.fn(async () => ({
    ok: status < 400,
    status,
    statusText: "Created",
    json: async () => body,
    text: async () => JSON.stringify(body),
  }) as unknown as Response);
  vi.stubGlobal("fetch", fn);
  return fn;
}

function fillRequired(name = "Nguyen Van A", email = "a@example.com") {
  fireEvent.change(screen.getByLabelText(/.+/, { selector: "#consult-name" }), { target: { value: name } });
  fireEvent.change(document.getElementById("consult-email") as HTMLInputElement, { target: { value: email } });
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ConversionSection — /leads contract (WEB-001B)", () => {
  it("blocks submit and marks fields invalid when required fields are empty", async () => {
    const fetchMock = mockLeadsFetch();
    render(<ConversionSection lang="en" copy={copyFor("en")} />);

    fireEvent.submit(screen.getByTestId("consult-form"));

    await waitFor(() => {
      expect(screen.getByTestId("consult-status").textContent).toBe(MARKETING_COPY["lead_form.err_required"].en);
    });
    expect((document.getElementById("consult-name") as HTMLInputElement).getAttribute("aria-invalid")).toBe("true");
    expect((document.getElementById("consult-email") as HTMLInputElement).getAttribute("aria-invalid")).toBe("true");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits exactly the verified contract keys — no service-interest, no market", async () => {
    const fetchMock = mockLeadsFetch();
    render(<ConversionSection lang="vi" copy={copyFor("vi")} />);

    fillRequired();
    fireEvent.change(document.getElementById("consult-phone") as HTMLInputElement, { target: { value: "0912 345 678" } });
    fireEvent.change(document.getElementById("consult-message") as HTMLTextAreaElement, { target: { value: "POD 200 don/ngay" } });
    fireEvent.submit(screen.getByTestId("consult-form"));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/leads$/);
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;

    for (const key of Object.keys(body)) {
      expect(CONTRACT_KEYS, `unexpected payload key "${key}"`).toContain(key);
    }
    expect(body).not.toHaveProperty("region");
    expect(body).not.toHaveProperty("service_interest");
    expect(body).not.toHaveProperty("serviceInterest");
    expect(body).not.toHaveProperty("primary_market");
    expect(body.name).toBe("Nguyen Van A");
    expect(body.email).toBe("a@example.com");
    expect(body.phone).toBe("0912 345 678");
    expect(body.locale).toBe("vi");
    expect(typeof body.turnstile_token).toBe("string");
  });

  it("omits empty optional phone/message from the payload", async () => {
    const fetchMock = mockLeadsFetch();
    render(<ConversionSection lang="en" copy={copyFor("en")} />);

    fillRequired();
    fireEvent.submit(screen.getByTestId("consult-form"));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const body = JSON.parse(String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body)) as Record<string, unknown>;
    expect(body).not.toHaveProperty("phone");
    expect(body).not.toHaveProperty("message");
  });

  it("shows the private-receipt success state and announces it politely", async () => {
    mockLeadsFetch();
    render(<ConversionSection lang="en" copy={copyFor("en")} />);

    fillRequired();
    fireEvent.submit(screen.getByTestId("consult-form"));

    expect(await screen.findByTestId("consult-success")).toBeTruthy();
    const status = screen.getByTestId("consult-status");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.textContent).toBe(MARKETING_COPY["lead_form.success_title"].en);
    // privacy reassurance stays visible in the success state
    expect(screen.getByTestId("consult-success").textContent).toContain(MARKETING_COPY["consult.privacy"].en);
  });

  it("fails safely: generic localized copy only, CMS body never rendered, retry stays enabled", async () => {
    // Owner-accepted CodeRabbit security finding: backend diagnostics must not
    // reach public UI. The mocked CMS body is a sentinel that must never render.
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = mockLeadsFetch(500, { error: "secret-internal-detail" });
    render(<ConversionSection lang="en" copy={copyFor("en")} />);

    fillRequired("Nguyen Van A", "leak-check@example.com");
    fireEvent.submit(screen.getByTestId("consult-form"));

    await waitFor(() => {
      expect(screen.getByTestId("consult-status").textContent).toBe(MARKETING_COPY["lead_form.err_generic"].en);
    });
    const pageText = document.body.textContent ?? "";
    expect(pageText).not.toContain("secret-internal-detail");
    expect(pageText).not.toContain("CMS /leads");
    expect(pageText).not.toContain("500");
    expect(screen.queryByTestId("consult-success")).toBeNull();
    expect((document.getElementById("consult-name") as HTMLInputElement).disabled).toBe(false);

    // form data is never logged
    const logged = JSON.stringify([...logSpy.mock.calls, ...warnSpy.mock.calls, ...errorSpy.mock.calls]);
    expect(logged).not.toContain("leak-check@example.com");
    expect(logged).not.toContain("secret-internal-detail");

    // retry works: a second submit reaches the network again and can succeed
    mockLeadsFetch(201);
    fireEvent.submit(screen.getByTestId("consult-form"));
    expect(await screen.findByTestId("consult-success")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns the form to a recoverable state after a timeout/abort", async () => {
    // Genuine cancellation observation: AbortSignal.timeout is mocked to return a
    // controlled controller's signal, the fetch mock resolves ONLY through that
    // signal's abort event, and the test then fires the deadline itself. The
    // rejection can only come from the abort path — a manually thrown error
    // would leave the request pending and the assertions below would fail.
    const controller = new AbortController();
    vi.spyOn(AbortSignal, "timeout").mockReturnValue(controller.signal);

    let receivedSignal: AbortSignal | undefined;
    const fn = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          receivedSignal = init?.signal ?? undefined;
          receivedSignal?.addEventListener("abort", () => reject(receivedSignal?.reason), { once: true });
        }),
    );
    vi.stubGlobal("fetch", fn);
    render(<ConversionSection lang="vi" copy={copyFor("vi")} />);

    fillRequired();
    fireEvent.submit(screen.getByTestId("consult-form"));

    // the request is in flight, carrying exactly the deadline signal
    await waitFor(() => expect(fn).toHaveBeenCalledTimes(1));
    expect(receivedSignal).toBe(controller.signal);
    expect(screen.getByTestId("consult-status").textContent).toBe(MARKETING_COPY["lead_form.submitting"].vi);

    // the deadline fires — same abort reason fetch raises on a real timeout
    act(() => controller.abort(new DOMException("The operation timed out.", "TimeoutError")));

    await waitFor(() => {
      expect(screen.getByTestId("consult-status").textContent).toBe(MARKETING_COPY["lead_form.err_generic"].vi);
    });
    expect(receivedSignal?.aborted).toBe(true);
    expect((document.getElementById("consult-email") as HTMLInputElement).disabled).toBe(false);
    expect(document.body.textContent).not.toContain("TimeoutError");
  });

  // Deterministic email check (replaced the super-linear regex — Sonar S5852):
  // behavior parity cases, including hostile long input (no timing assertion —
  // linear parsing is verified structurally; Sonar confirms the static issue).
  const HOSTILE = `${"a".repeat(50_000)}@${".".repeat(5_000)}`;
  it.each([
    ["plain", false],
    ["a@b", false],
    ["a@b.", false],
    ["a@.b", false],
    ["a b@c.d", false],
    ["two@@at.vn", false],
    ["", false],
    [HOSTILE, false],
    ["a@b.c", true],
    ["ňam.việt@thương-mại.vn", true],
  ])("email shape validation: %j → submits: %s", async (email, submits) => {
    const fetchMock = mockLeadsFetch();
    render(<ConversionSection lang="en" copy={copyFor("en")} />);
    fillRequired("Name", email as string);
    fireEvent.submit(screen.getByTestId("consult-form"));
    if (submits) {
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    } else {
      await waitFor(() => {
        expect(screen.getByTestId("consult-status").textContent).toBe(MARKETING_COPY["lead_form.err_required"].en);
      });
      expect(fetchMock).not.toHaveBeenCalled();
      expect((document.getElementById("consult-email") as HTMLInputElement).getAttribute("aria-invalid")).toBe("true");
    }
  });
});

describe("ConversionSection — Community separation (WEB-001B)", () => {
  it.each(["vi", "en", "zh"] as const)("Knowledge Loop CTA is a plain locale-aware link — %s", (locale) => {
    render(<ConversionSection lang={locale} copy={copyFor(locale)} />);
    const cta = screen.getByTestId("knowledge-loop-cta");
    expect(cta.getAttribute("href")).toBe(`/${locale}/community`);
  });

  it("never leaks consultation data into the Community path after submit", async () => {
    mockLeadsFetch();
    render(<ConversionSection lang="vi" copy={copyFor("vi")} />);

    fillRequired("Private Name", "private@example.com");
    fireEvent.submit(screen.getByTestId("consult-form"));
    await screen.findByTestId("consult-success");

    // post-submit handoff appears, with the explicit separation reassurance
    const post = screen.getByTestId("knowledge-loop-post-submit");
    expect(post.textContent).toContain(MARKETING_COPY["kl.sep1"].vi);

    // the CTA remains a bare link: same href, no query params, no PII anywhere in the loop
    const cta = screen.getByTestId("knowledge-loop-cta");
    expect(cta.getAttribute("href")).toBe("/vi/community");
    const loopText = screen.getByTestId("knowledge-loop").textContent ?? "";
    expect(loopText).not.toContain("Private Name");
    expect(loopText).not.toContain("private@example.com");
  });
});
