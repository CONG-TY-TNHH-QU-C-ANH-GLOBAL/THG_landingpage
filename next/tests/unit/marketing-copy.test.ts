import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { getMarketingCopy } from "../../src/shared/i18n/server/get-marketing-copy";
import { MARKETING_COPY } from "../../src/shared/i18n/marketing-copy";
import { resetLoggedCmsFallbacks } from "../../src/shared/cms/log-fallback";

// WEB-001 marketing-copy resolution: CMS overlay wins per key, static copy is the offline
// fallback, and an unavailable CMS is an expected recoverable state — a redaction-safe
// WARNING, never console.error (Next dev promotes console.error into overlay entries).

type FetchImpl = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

function mockFetch(impl: FetchImpl) {
  const fn = vi.fn(impl);
  vi.stubGlobal("fetch", fn);
  return fn;
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status < 400,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: async () => body,
  } as unknown as Response;
}

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  resetLoggedCmsFallbacks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("getMarketingCopy", () => {
  it("resolves static copy per locale and lets the CMS overlay win per key", async () => {
    mockFetch(async () =>
      jsonResponse({ locale: "vi", translations: { "nav.services": "CMS override" } }),
    );
    const copy = await getMarketingCopy("vi");
    expect(copy["nav.services"]).toBe("CMS override");
    expect(copy["nav.pricing"]).toBe(MARKETING_COPY["nav.pricing"].vi);
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("falls back to the full static copy when the CMS is unavailable — warning only", async () => {
    mockFetch(async () => {
      throw new TypeError("fetch failed");
    });
    const copy = await getMarketingCopy("en");
    expect(copy["nav.services"]).toBe(MARKETING_COPY["nav.services"].en);
    expect(console.error).not.toHaveBeenCalled();
    const warns = (console.warn as ReturnType<typeof vi.fn>).mock.calls;
    expect(warns).toHaveLength(1);
    const serialized = JSON.stringify(warns[0]);
    expect(serialized).toContain("/translations?lang=en");
    // Redaction-safe metadata only: no base URL, no payload text.
    expect(serialized).not.toContain("localhost:8080");
    expect(serialized).not.toContain("fetch failed");
  });

  it("dedupes the warning when layout and page both resolve the same failing locale", async () => {
    mockFetch(async () => {
      throw new TypeError("fetch failed");
    });
    await getMarketingCopy("vi");
    await getMarketingCopy("vi");
    expect((console.warn as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
  });

  it("does not leak the CMS error-body text into any log on HTTP failure", async () => {
    mockFetch(async () => jsonResponse({ error: "secret-internal-detail" }, 500));
    await getMarketingCopy("zh");
    const all = JSON.stringify([
      ...(console.warn as ReturnType<typeof vi.fn>).mock.calls,
      ...(console.error as ReturnType<typeof vi.fn>).mock.calls,
    ]);
    expect(all).not.toContain("secret-internal-detail");
  });

  it("rethrows non-CMS programming errors unchanged (never downgraded to a warning)", async () => {
    vi.stubEnv("CMS_API_URL", "not-a-valid-url");
    mockFetch(async () => jsonResponse({ locale: "vi", translations: {} }));
    await expect(getMarketingCopy("vi")).rejects.toThrow(/Invalid CMS_API_URL/);
    expect(console.warn).not.toHaveBeenCalled();
  });
});
