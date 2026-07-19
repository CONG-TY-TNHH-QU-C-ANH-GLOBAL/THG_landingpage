import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { z } from "zod";

import { cmsFetch, resolveCmsBaseUrl } from "../../src/shared/cms/cmsFetch";
import {
  CmsHttpError,
  CmsShapeError,
  CmsParseError,
  CmsNetworkError,
  isCmsNotFound,
} from "../../src/shared/cms/errors";

// FND-004 transport acceptance (AC-01/02/03/04/15/21/41 + owner timeout/abort/invalid-JSON/env
// cases). The narrowest test seam: stub global `fetch` and `CMS_API_URL` via vitest built-ins —
// no injected-fetch production param, no new mocking library (TEST_PLAN §Unit).

const schema = z.object({ items: z.array(z.object({ id: z.number() })) });
const listSchema = z.array(z.object({ id: z.number() }));

type FetchImpl = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

function mockFetch(impl: FetchImpl) {
  const fn = vi.fn(impl);
  vi.stubGlobal("fetch", fn);
  return fn;
}

function jsonResponse(
  body: unknown,
  init: { ok?: boolean; status?: number; statusText?: string } = {},
): Response {
  const { ok = true, status = 200, statusText = "OK" } = init;
  return { ok, status, statusText, json: async () => body } as unknown as Response;
}

function nonJsonResponse(
  init: { ok?: boolean; status?: number; statusText?: string } = {},
): Response {
  const { ok = true, status = 200, statusText = "OK" } = init;
  return {
    ok,
    status,
    statusText,
    json: async () => {
      throw new SyntaxError("Unexpected token < in JSON");
    },
  } as unknown as Response;
}

function abortError(): Error {
  const err = new Error("The operation was aborted");
  err.name = "AbortError";
  return err;
}

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe("resolveCmsBaseUrl", () => {
  it("defaults to localhost when unset (parity with fetchJson)", () => {
    expect(resolveCmsBaseUrl(undefined)).toBe("http://localhost:8080/api/v1");
    expect(resolveCmsBaseUrl("")).toBe("http://localhost:8080/api/v1");
    expect(resolveCmsBaseUrl("   ")).toBe("http://localhost:8080/api/v1");
  });

  it("normalizes trailing slashes so base+path never double-slashes", () => {
    expect(resolveCmsBaseUrl("https://cms.thgfulfill.com/api/v1/")).toBe(
      "https://cms.thgfulfill.com/api/v1",
    );
    expect(resolveCmsBaseUrl("https://cms.thgfulfill.com/api/v1///")).toBe(
      "https://cms.thgfulfill.com/api/v1",
    );
  });

  it("throws on a malformed configured base without echoing the value (AC-41)", () => {
    let caught: Error | undefined;
    try {
      resolveCmsBaseUrl("not-a-valid-url");
    } catch (e) {
      caught = e as Error;
    }
    expect(caught?.message).toMatch(/Invalid CMS_API_URL/);
    expect(caught?.message).not.toContain("not-a-valid-url");
  });
});

describe("cmsFetch — request construction (AC-01, AC-15)", () => {
  it("builds URL from CMS_API_URL + path and sends Accept: application/json", async () => {
    vi.stubEnv("CMS_API_URL", "https://cms.thgfulfill.com/api/v1");
    const fetchMock = mockFetch(async () => jsonResponse({ items: [] }));

    await cmsFetch("/faqs?lang=vi&scope=home", schema);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, reqInit] = fetchMock.mock.calls[0];
    expect(url).toBe("https://cms.thgfulfill.com/api/v1/faqs?lang=vi&scope=home");
    const headers = (reqInit as RequestInit).headers as Headers;
    expect(headers.get("Accept")).toBe("application/json");
  });

  it("performs no locale inference: lang stays exactly what the loader passed (vi/en/zh)", async () => {
    for (const lang of ["vi", "en", "zh"] as const) {
      const fetchMock = mockFetch(async () => jsonResponse({ items: [] }));
      await cmsFetch(`/homepage?lang=${lang}`, schema);
      expect(fetchMock.mock.calls[0][0]).toBe(`http://localhost:8080/api/v1/homepage?lang=${lang}`);
      vi.unstubAllGlobals();
    }
  });

  it("merges caller init headers under the Accept default (parity)", async () => {
    const fetchMock = mockFetch(async () => jsonResponse({ items: [] }));
    await cmsFetch("/homepage?lang=vi", schema, {
      init: { headers: { "X-Trace": "abc" } },
    });
    const headers = (fetchMock.mock.calls[0][1] as RequestInit).headers as Headers;
    expect(headers.get("Accept")).toBe("application/json");
    expect(headers.get("X-Trace")).toBe("abc");
  });

  it("preserves headers passed as a Headers instance, and a caller Accept wins", async () => {
    const fetchMock = mockFetch(async () => jsonResponse({ items: [] }));
    await cmsFetch("/homepage?lang=vi", schema, {
      init: { headers: new Headers({ "X-Trace": "abc", Accept: "application/vnd.cms+json" }) },
    });
    const headers = (fetchMock.mock.calls[0][1] as RequestInit).headers as Headers;
    expect(headers.get("X-Trace")).toBe("abc");
    expect(headers.get("Accept")).toBe("application/vnd.cms+json");
  });

  it("passes revalidate/tags through to Next's fetch cache slot (reserved for FND-006)", async () => {
    const fetchMock = mockFetch(async () => jsonResponse({ items: [] }));
    await cmsFetch("/homepage?lang=vi", schema, { revalidate: 3600, tags: ["home"] });
    const reqInit = fetchMock.mock.calls[0][1] as RequestInit & {
      next?: { revalidate?: number; tags?: string[] };
    };
    expect(reqInit.next).toEqual({ revalidate: 3600, tags: ["home"] });
  });
});

describe("cmsFetch — success (AC-01, AC-21)", () => {
  it("returns the parsed, schema-validated DTO", async () => {
    mockFetch(async () => jsonResponse({ items: [{ id: 1 }, { id: 2 }] }));
    await expect(cmsFetch("/homepage?lang=vi", schema)).resolves.toEqual({
      items: [{ id: 1 }, { id: 2 }],
    });
  });

  it("returns a schema-valid empty list unchanged (empty state, not an error)", async () => {
    mockFetch(async () => jsonResponse([]));
    await expect(cmsFetch("/jobs?lang=vi", listSchema)).resolves.toEqual([]);
  });
});

describe("cmsFetch — error taxonomy (AC-02, AC-03, AC-04)", () => {
  it("throws CmsShapeError with the exact message and logs Zod issues", async () => {
    mockFetch(async () => jsonResponse({ items: [{ id: "not-a-number" }] }));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(cmsFetch("/faqs?lang=vi", schema)).rejects.toThrowError(
      "CMS /faqs?lang=vi: response shape mismatch",
    );
    await expect(cmsFetch("/faqs?lang=vi", schema)).rejects.toBeInstanceOf(CmsShapeError);
    expect(errSpy).toHaveBeenCalledWith(
      "[CMS] Schema validation failed for /faqs?lang=vi:",
      expect.any(Array),
    );
  });

  it("uses the JSON body's error field on non-2xx, not the status text", async () => {
    mockFetch(async () =>
      jsonResponse({ error: "boom" }, { ok: false, status: 500, statusText: "Internal Server Error" }),
    );
    const e = (await cmsFetch("/pricing", schema).catch((x) => x)) as CmsHttpError;
    expect(e).toBeInstanceOf(CmsHttpError);
    expect(e.status).toBe(500);
    expect(e.message).toContain("boom");
    expect(e.message).not.toContain("Internal Server Error");
  });

  it("falls back to {status} {statusText} when the error body is not JSON", async () => {
    mockFetch(async () =>
      nonJsonResponse({ ok: false, status: 500, statusText: "Internal Server Error" }),
    );
    const e = (await cmsFetch("/pricing", schema).catch((x) => x)) as CmsHttpError;
    expect(e).toBeInstanceOf(CmsHttpError);
    expect(e.message).toContain("500 Internal Server Error");
  });

  it("distinguishes a 404 via isCmsNotFound (real 404 path)", async () => {
    mockFetch(async () =>
      jsonResponse({ error: "not found" }, { ok: false, status: 404, statusText: "Not Found" }),
    );
    const e = (await cmsFetch("/blog/missing?lang=vi", schema).catch((x) => x)) as CmsHttpError;
    expect(e).toBeInstanceOf(CmsHttpError);
    expect(e.status).toBe(404);
    expect(isCmsNotFound(e)).toBe(true);
    expect(isCmsNotFound(new Error("nope"))).toBe(false);
    expect(isCmsNotFound(undefined)).toBe(false);
  });

  it("throws CmsParseError (distinct from CmsShapeError) for a 2xx non-JSON body", async () => {
    mockFetch(async () => nonJsonResponse());
    const e = (await cmsFetch("/homepage?lang=vi", schema).catch((x) => x)) as CmsParseError;
    expect(e).toBeInstanceOf(CmsParseError);
    expect(e).not.toBeInstanceOf(CmsShapeError);
  });
});

describe("cmsFetch — network / timeout / abort (deterministic, distinct)", () => {
  it("normalizes a plain fetch rejection to CmsNetworkError reason=network", async () => {
    mockFetch(async () => {
      throw new TypeError("fetch failed");
    });
    const e = (await cmsFetch("/homepage?lang=vi", schema).catch((x) => x)) as CmsNetworkError;
    expect(e).toBeInstanceOf(CmsNetworkError);
    expect(e.reason).toBe("network");
  });

  it("aborts on the bounded timeout with reason=timeout", async () => {
    vi.useFakeTimers();
    mockFetch(
      (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(abortError()));
        }),
    );
    const pending = cmsFetch("/slow", schema, { timeoutMs: 1000 }).catch((x) => x);
    await vi.advanceTimersByTimeAsync(1000);
    const e = (await pending) as CmsNetworkError;
    expect(e).toBeInstanceOf(CmsNetworkError);
    expect(e.reason).toBe("timeout");
  });

  it("reports a caller-initiated abort as reason=aborted (distinct from timeout)", async () => {
    const controller = new AbortController();
    controller.abort();
    mockFetch((_url, init) => {
      if (init?.signal?.aborted) return Promise.reject(abortError());
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(abortError()));
      });
    });
    const e = (await cmsFetch("/x", schema, { signal: controller.signal }).catch(
      (x) => x,
    )) as CmsNetworkError;
    expect(e).toBeInstanceOf(CmsNetworkError);
    expect(e.reason).toBe("aborted");
  });

  it("composes a signal passed via init (not silently dropped) as reason=aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    mockFetch((_url, init) => {
      if (init?.signal?.aborted) return Promise.reject(abortError());
      return new Promise<Response>(() => {});
    });
    const e = (await cmsFetch("/x", schema, { init: { signal: controller.signal } }).catch(
      (x) => x,
    )) as CmsNetworkError;
    expect(e).toBeInstanceOf(CmsNetworkError);
    expect(e.reason).toBe("aborted");
  });

  it("timeoutMs bounds a stalled response body, not just the headers (reason=timeout)", async () => {
    vi.useFakeTimers();
    mockFetch((_url, init) =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        json: () =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject(abortError()));
          }),
      } as unknown as Response),
    );
    const pending = cmsFetch("/slow-body", schema, { timeoutMs: 1000 }).catch((x) => x);
    await vi.advanceTimersByTimeAsync(1000);
    const e = (await pending) as CmsNetworkError;
    expect(e).toBeInstanceOf(CmsNetworkError);
    expect(e.reason).toBe("timeout");
  });
});

describe("cmsFetch — error hygiene / redaction (AC-41)", () => {
  it("never leaks headers, request body, tokens or the env base into the thrown error", async () => {
    vi.stubEnv("CMS_API_URL", "https://cms.thgfulfill.com/api/v1");
    mockFetch(async () =>
      jsonResponse({ error: "boom" }, { ok: false, status: 500, statusText: "Internal Server Error" }),
    );
    const e = (await cmsFetch("/pricing", schema, {
      init: {
        headers: { Authorization: "Bearer super-secret-token" },
        body: JSON.stringify({ pii: "alice@example.com" }),
      },
    }).catch((x) => x)) as CmsHttpError;

    const serialized = `${JSON.stringify(e.safeMeta())} ${e.message} ${String(e.stack ?? "")}`;
    expect(serialized).not.toContain("super-secret-token");
    expect(serialized).not.toContain("alice@example.com");
    expect(serialized).not.toContain("cms.thgfulfill.com");
    expect(e.safeMeta()).toEqual({ name: "CmsHttpError", path: "/pricing", status: 500 });
  });
});

describe("resolveCmsBaseUrl environment policy (owner-mandated)", () => {
  it("development: missing CMS_API_URL uses the approved localhost default", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("CMS_API_URL", "");
    expect(resolveCmsBaseUrl(undefined)).toBe("http://localhost:8080/api/v1");
  });

  it("test env: missing CMS_API_URL uses the localhost default", () => {
    vi.stubEnv("NODE_ENV", "test");
    expect(resolveCmsBaseUrl(undefined)).toBe("http://localhost:8080/api/v1");
  });

  it("production runtime: missing CMS_API_URL fails loud — never localhost", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PHASE", "");
    expect(() => resolveCmsBaseUrl(undefined)).toThrow(/CMS_API_URL is required in production/);
    expect(() => resolveCmsBaseUrl("   ")).toThrow(/CMS_API_URL is required in production/);
    // and the error never carries a URL value
    try {
      resolveCmsBaseUrl(undefined);
    } catch (e) {
      expect(String(e)).not.toContain("localhost");
      expect(String(e)).not.toContain("8080");
    }
  });

  it("production BUILD phase: prerender may use the default (deployment injects the runtime value)", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PHASE", "phase-production-build");
    expect(resolveCmsBaseUrl(undefined)).toBe("http://localhost:8080/api/v1");
  });

  it("production runtime with explicit CMS_API_URL uses exactly that origin", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PHASE", "");
    expect(resolveCmsBaseUrl("https://cms.example.com/api/v1/")).toBe("https://cms.example.com/api/v1");
  });
});
