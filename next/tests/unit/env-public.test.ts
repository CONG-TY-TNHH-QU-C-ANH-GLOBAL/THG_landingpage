import { describe, it, expect, vi, afterEach } from "vitest";

import { resolvePublicCmsApiUrl } from "../../src/shared/config/env.public";
import { postLead, CMS_BASE, type LeadInput } from "../../src/shared/ui/lead-api";

// PR #75 owner review: NEXT_PUBLIC_CMS_API_URL is BUILD-TIME client config. The resolver must
// allow the localhost default only in dev/test and refuse to bake localhost into a production
// build. postLead behavior (endpoint, payload, timeout, AbortSignal) must stay unchanged.

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("resolvePublicCmsApiUrl environment policy", () => {
  it("development: missing NEXT_PUBLIC_CMS_API_URL uses the approved localhost default", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(resolvePublicCmsApiUrl(undefined)).toBe("http://localhost:8080/api/v1");
    expect(resolvePublicCmsApiUrl("")).toBe("http://localhost:8080/api/v1");
    expect(resolvePublicCmsApiUrl("   ")).toBe("http://localhost:8080/api/v1");
  });

  it("test env: missing NEXT_PUBLIC_CMS_API_URL uses the localhost default", () => {
    vi.stubEnv("NODE_ENV", "test");
    expect(resolvePublicCmsApiUrl(undefined)).toBe("http://localhost:8080/api/v1");
  });

  it("production: missing NEXT_PUBLIC_CMS_API_URL throws — never a localhost bundle", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => resolvePublicCmsApiUrl(undefined)).toThrow(/NEXT_PUBLIC_CMS_API_URL is required/);
    expect(() => resolvePublicCmsApiUrl("  ")).toThrow(/NEXT_PUBLIC_CMS_API_URL is required/);
  });

  it("production: the error carries no baked localhost value and no secret", () => {
    vi.stubEnv("NODE_ENV", "production");
    try {
      resolvePublicCmsApiUrl(undefined);
      throw new Error("expected throw");
    } catch (e) {
      const msg = String(e);
      expect(msg).not.toContain("http://localhost:8080");
      expect(msg).not.toContain("localhost:8080/api/v1");
    }
  });

  it("explicit production value is used and trailing-slash normalized", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(resolvePublicCmsApiUrl("https://cms.thgfulfill.com/api/v1")).toBe(
      "https://cms.thgfulfill.com/api/v1",
    );
    expect(resolvePublicCmsApiUrl("https://cms.thgfulfill.com/api/v1///")).toBe(
      "https://cms.thgfulfill.com/api/v1",
    );
  });
});

describe("postLead behavior is unchanged", () => {
  const input: LeadInput = {
    name: "A",
    email: "a@example.com",
    source_page: "/vi",
    locale: "vi",
    turnstile_token: "tok",
  };

  it("POSTs JSON to <CMS_BASE>/leads with a bounded AbortSignal", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200 }) as unknown as Response);
    vi.stubGlobal("fetch", fetchMock);

    await postLead(input);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${CMS_BASE}/leads`);
    expect(CMS_BASE).not.toMatch(/\/$/); // normalized, no double slash before /leads
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body as string)).toEqual(input);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("throws a stable status-only error on non-2xx without leaking the CMS body", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => ({ secret: "internal-detail" }),
    }) as unknown as Response);
    vi.stubGlobal("fetch", fetchMock);

    const err = (await postLead(input).catch((e) => e)) as Error;
    expect(err.message).toContain("500");
    expect(err.message).not.toContain("internal-detail");
  });
});
