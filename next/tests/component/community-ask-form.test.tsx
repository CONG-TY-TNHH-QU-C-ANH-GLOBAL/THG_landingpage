// @vitest-environment happy-dom
// Ask Question flow: client-side pre-flight, the exact submit contract, moderation-first
// confirmation, owner-token capture, and error handling that never surfaces CMS copy.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";

import { AskQuestionDialog } from "@/features/community/client/ask-question-dialog";
import { getOwnerToken } from "@/features/community/client/owner-store";
import { MARKETING_COPY } from "@/shared/i18n/marketing-copy";
import type { MarketingCopy } from "@/shared/i18n/marketing";

const OWNER_TOKEN = "f".repeat(64);

// The real dictionary, so a renamed or missing key fails here rather than rendering a
// raw key string in production.
const copyFor = (locale: "vi" | "en" | "zh"): MarketingCopy =>
  Object.fromEntries(Object.entries(MARKETING_COPY).map(([key, entry]) => [key, entry[locale]]));

const CATEGORIES = [{ slug: "van-chuyen", name: "Vận chuyển & Tracking" }];

const toasts: { error: string[]; success: string[] } = { error: [], success: [] };
vi.mock("sonner", () => ({
  toast: {
    error: (m: string) => toasts.error.push(m),
    success: (m: string) => toasts.success.push(m),
  },
}));

function mockFetch(status = 201, body: unknown = { ok: true, id: 1, slug: "s", status: "pending" }) {
  // The parameters are declared so the mock's recorded call tuple keeps its real shape.
  const fn = vi.fn(
    async (_input: string | URL | Request, _init?: RequestInit) =>
      ({ ok: status < 400, status, statusText: "OK", json: async () => body }) as unknown as Response,
  );
  vi.stubGlobal("fetch", fn);
  return fn;
}

async function openForm(locale: "vi" | "en" | "zh" = "en") {
  const copy = copyFor(locale);
  render(<AskQuestionDialog lang={locale} copy={copy} categories={CATEGORIES} />);
  fireEvent.click(screen.getByRole("button", { name: new RegExp(copy["community.ask_button"]) }));
  await screen.findByRole("dialog");
  return copy;
}

function fill(values: Partial<Record<"ask-name" | "ask-email" | "ask-title" | "ask-body", string>>) {
  for (const [id, value] of Object.entries(values)) {
    const field = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
    fireEvent.change(field, { target: { value } });
  }
}

const VALID = {
  "ask-name": "Minh",
  "ask-email": "minh@example.com",
  "ask-title": "Ship VN sang US mất bao lâu",
  "ask-body": "Mình bán POD và khách hàng ở Mỹ, thời gian thực tế là bao nhiêu ngày?",
};

beforeEach(() => {
  toasts.error = [];
  toasts.success = [];
  globalThis.localStorage?.clear();
  vi.unstubAllGlobals();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Ask Question pre-flight", () => {
  it("states moderation-first in the dialog description, before anything is typed", async () => {
    const copy = await openForm();
    expect(screen.getByText(copy["community.form_desc"])).toBeTruthy();
  });

  it("blocks an empty submit and never calls the CMS", async () => {
    const fetchMock = mockFetch();
    const copy = await openForm();
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

    await waitFor(() => expect(toasts.error).toContain(copy["community.form_err_required"]));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("enforces the title ≥8 / body ≥20 bounds that mirror the CMS schema", async () => {
    const fetchMock = mockFetch();
    const copy = await openForm();
    fill({ ...VALID, "ask-title": "short", "ask-body": "too short" });
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

    await waitFor(() => expect(toasts.error).toContain(copy["community.form_err_short"]));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("declares the maxlengths the CMS enforces so input cannot exceed them", async () => {
    await openForm();
    expect(document.getElementById("ask-title")?.getAttribute("maxlength")).toBe("200");
    expect(document.getElementById("ask-body")?.getAttribute("maxlength")).toBe("5000");
    expect(document.getElementById("ask-name")?.getAttribute("maxlength")).toBe("80");
    expect(document.getElementById("ask-email")?.getAttribute("type")).toBe("email");
  });

  it("marks the email as never shown publicly", async () => {
    const copy = await openForm();
    expect(screen.getByText(copy["community.form_email_hint"])).toBeTruthy();
  });
});

describe("Ask Question submit contract", () => {
  it("posts the exact CMS field names and the resolved Turnstile token", async () => {
    const fetchMock = mockFetch();
    await openForm();
    fill(VALID);
    const select = document.getElementById("ask-category") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "van-chuyen" } });
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [rawUrl, rawInit] = fetchMock.mock.calls[0];
    const url = String(rawUrl);
    const init = rawInit as RequestInit;
    expect(url).toBe("http://localhost:8080/api/v1/community/questions");
    expect(JSON.parse(String(init.body))).toEqual({
      title: "Ship VN sang US mất bao lâu",
      body: "Mình bán POD và khách hàng ở Mỹ, thời gian thực tế là bao nhiêu ngày?",
      category_slug: "van-chuyen",
      author_name: "Minh",
      author_email: "minh@example.com",
      locale: "en",
      // No site key configured in tests → the dev bypass sentinel, which the CMS accepts
      // only when its own secret is unset.
      turnstile_token: "DEV_BYPASS",
    });
  });

  it("omits category_slug entirely when no topic is chosen", async () => {
    const fetchMock = mockFetch();
    await openForm();
    fill(VALID);
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body));
    expect(body).not.toHaveProperty("category_slug");
  });

  it("confirms pending review and never claims publication", async () => {
    mockFetch();
    const copy = await openForm();
    fill(VALID);
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

    await screen.findByText(copy["community.form_success_title"]);
    expect(screen.getByText(copy["community.form_success_desc"])).toBeTruthy();
    // The form is gone, so a double submit is impossible.
    expect(screen.getByRole("dialog").querySelector("form")).toBeNull();
  });

  it("stores the owner token and offers the withdraw hint only when one came back", async () => {
    mockFetch(201, { ok: true, id: 1, slug: "ship-vn-us", status: "pending", owner_token: OWNER_TOKEN });
    const copy = await openForm();
    fill(VALID);
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

    await screen.findByText(copy["community.form_success_title"]);
    expect(screen.getByText(copy["community.withdraw_hint"])).toBeTruthy();
    expect(getOwnerToken("ship-vn-us")).toBe(OWNER_TOKEN);
  });

  it("hides the withdraw hint when the CMS returned no owner token", async () => {
    mockFetch(201, { ok: true, id: 1, slug: "ship-vn-us", status: "pending" });
    const copy = await openForm();
    fill(VALID);
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

    await screen.findByText(copy["community.form_success_title"]);
    expect(screen.queryByText(copy["community.withdraw_hint"])).toBeNull();
    expect(getOwnerToken("ship-vn-us")).toBeNull();
  });
});

describe("Ask Question failure handling", () => {
  it("shows rate-limit copy on 429 and never the CMS message", async () => {
    mockFetch(429, { error: "Quá nhiều yêu cầu. Thử lại sau 1 giờ." });
    const copy = await openForm();
    fill(VALID);
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

    await waitFor(() => expect(toasts.error).toContain(copy["community.err_rate_limited"]));
    expect(toasts.error.join(" ")).not.toContain("Quá nhiều yêu cầu");
  });

  it("shows captcha copy on 403, the status Turnstile failure actually uses", async () => {
    mockFetch(403, { error: "Turnstile verification failed" });
    const copy = await openForm();
    fill(VALID);
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

    await waitFor(() => expect(toasts.error).toContain(copy["community.err_captcha_failed"]));
  });

  it("keeps the form and the typed values after a recoverable failure so retry is possible", async () => {
    mockFetch(429, { error: "rate limited" });
    await openForm();
    fill(VALID);
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

    await waitFor(() => expect(toasts.error).toHaveLength(1));
    expect(screen.getByRole("dialog").querySelector("form")).toBeTruthy();
    expect((document.getElementById("ask-body") as HTMLTextAreaElement).value).toBe(VALID["ask-body"]);
  });

  it("maps a validation rejection to generic copy, never the raw Vietnamese Zod message", async () => {
    mockFetch(400, { error: "Tiêu đề tối thiểu 8 ký tự" });
    const copy = await openForm();
    fill(VALID);
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

    await waitFor(() => expect(toasts.error).toContain(copy["community.form_err_generic"]));
    expect(toasts.error.join(" ")).not.toContain("Tiêu đề tối thiểu");
  });
});

describe("Ask Question localization", () => {
  it("renders chrome in each locale and tags the submission with it", async () => {
    for (const locale of ["vi", "en", "zh"] as const) {
      const fetchMock = mockFetch();
      const copy = await openForm(locale);
      expect(screen.getByText(copy["community.form_title"])).toBeTruthy();
      fill(VALID);
      fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);

      await waitFor(() => expect(fetchMock).toHaveBeenCalled());
      const body = JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body));
      expect(body.locale).toBe(locale);
      cleanup();
    }
  });
});
