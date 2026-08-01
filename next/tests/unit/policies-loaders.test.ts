import { describe, it, expect, vi, beforeEach } from "vitest";

// WEB-007 loader provenance. The distinction that matters: "the CMS says there is nothing"
// and "the CMS did not answer" must NEVER collapse into the same state. The Vite pages
// collapsed them (`!isLoading && length === 0` rendered "No policies available yet" during an
// outage), which told visitors a legal document set was empty when it was merely unreachable.
const { cmsFetch } = vi.hoisted(() => ({ cmsFetch: vi.fn() }));
vi.mock("@/shared/cms", () => ({ cmsFetch }));

import { loadPolicies, loadShippingRoutes } from "@/features/policies/server/loaders";
import { CmsHttpError, CmsNetworkError, CmsShapeError } from "@/shared/cms/errors";
import { resetLoggedCmsFallbacks } from "@/shared/cms/log-fallback";

const policyList = (slugs: string[]) => ({
  locale: "vi",
  policies: slugs.map((slug, i) => ({
    slug,
    title: slug.toUpperCase(),
    icon: null,
    mode: "text",
    summary: null,
    position: i + 1,
  })),
});

const policyDetail = (slug: string) => ({
  locale: "vi",
  policy: {
    slug,
    title: slug.toUpperCase(),
    icon: null,
    mode: "text",
    body_md: "## Terms\n- one",
    image_list: [],
    text_blocks: [],
    summary: null,
    position: 1,
  },
});

const routeList = (slugs: string[]) => ({
  locale: "vi",
  routes: slugs.map((slug, i) => ({
    slug,
    position: i + 1,
    title: slug.toUpperCase(),
    origin: "VN",
    destination: "US",
    kind: "air",
  })),
  total: slugs.length,
});

const routeDetail = (slug: string) => ({
  locale: "vi",
  route: {
    slug,
    position: 1,
    title: slug.toUpperCase(),
    origin: "VN",
    destination: "US",
    kind: "air",
    body_md: "## Lane\n- transit 7d",
    notes: [],
    tables: [],
    updated_at: 1,
  },
});

beforeEach(() => {
  cmsFetch.mockReset();
  resetLoggedCmsFallbacks();
  // React cache() is request-scoped; under vitest there is no request scope, so each
  // loader call re-executes. That is what lets these cases drive cmsFetch per test.
});

describe("loadPolicies", () => {
  it("fans out one detail read per listed slug and returns them in CMS order", async () => {
    cmsFetch
      .mockResolvedValueOnce(policyList(["shipping", "returns"]))
      .mockResolvedValueOnce(policyDetail("shipping"))
      .mockResolvedValueOnce(policyDetail("returns"));

    const result = await loadPolicies("vi");

    expect(result.status).toBe("ready");
    expect(result.policies.map((p) => p.slug)).toEqual(["shipping", "returns"]);
    expect(cmsFetch.mock.calls.map((c) => c[0])).toEqual([
      "/policies?lang=vi",
      "/policies/shipping?lang=vi",
      "/policies/returns?lang=vi",
    ]);
  });

  it("reports a confirmed-empty CMS as `empty`, and issues no detail reads", async () => {
    cmsFetch.mockResolvedValueOnce(policyList([]));
    const result = await loadPolicies("vi");
    expect(result.status).toBe("empty");
    expect(cmsFetch).toHaveBeenCalledTimes(1);
  });

  it("reports a list-read outage as `unavailable`, never as empty", async () => {
    cmsFetch.mockRejectedValueOnce(new CmsNetworkError("/policies?lang=vi", "timeout"));
    const result = await loadPolicies("vi");
    expect(result.status).toBe("unavailable");
    if (result.status === "unavailable") expect(result.reason).toBe("network");
  });

  it("classifies a schema mismatch as a contract failure, not a network one", async () => {
    cmsFetch.mockRejectedValueOnce(new CmsShapeError("/policies?lang=vi"));
    const result = await loadPolicies("vi");
    expect(result.status).toBe("unavailable");
    if (result.status === "unavailable") expect(result.reason).toBe("contract");
  });

  it("keeps the surviving sections when ONE detail read fails", async () => {
    cmsFetch
      .mockResolvedValueOnce(policyList(["shipping", "returns"]))
      .mockResolvedValueOnce(policyDetail("shipping"))
      .mockRejectedValueOnce(new CmsHttpError("/policies/returns?lang=vi", 500, "boom"));

    const result = await loadPolicies("vi");

    expect(result.status).toBe("ready");
    expect(result.policies.map((p) => p.slug)).toEqual(["shipping"]);
  });

  it("degrades to `unavailable` when EVERY detail read fails", async () => {
    cmsFetch
      .mockResolvedValueOnce(policyList(["shipping"]))
      .mockRejectedValueOnce(new CmsHttpError("/policies/shipping?lang=vi", 503, "down"));

    const result = await loadPolicies("vi");

    // The list proved content exists, so an empty render here would be a false claim.
    expect(result.status).toBe("unavailable");
    expect(result.policies).toEqual([]);
  });

  it("tolerates a 404 on one section (operator unpublished it mid-read)", async () => {
    cmsFetch
      .mockResolvedValueOnce(policyList(["shipping", "gone"]))
      .mockResolvedValueOnce(policyDetail("shipping"))
      .mockRejectedValueOnce(new CmsHttpError("/policies/gone?lang=vi", 404, "not found"));

    const result = await loadPolicies("vi");
    expect(result.status).toBe("ready");
    expect(result.policies).toHaveLength(1);
  });

  it("percent-encodes a slug into the detail path", async () => {
    cmsFetch
      .mockResolvedValueOnce(policyList(["a b"]))
      .mockResolvedValueOnce(policyDetail("a b"));
    await loadPolicies("vi");
    expect(cmsFetch.mock.calls[1][0]).toBe("/policies/a%20b?lang=vi");
  });

  it("passes the requested locale through unchanged (no cross-locale fallback)", async () => {
    cmsFetch.mockResolvedValueOnce(policyList([]));
    await loadPolicies("zh");
    expect(cmsFetch.mock.calls[0][0]).toBe("/policies?lang=zh");
  });

  it("rethrows a non-CMS error instead of masking a programming fault as an outage", async () => {
    cmsFetch.mockRejectedValueOnce(new TypeError("undefined is not a function"));
    await expect(loadPolicies("vi")).rejects.toThrow(TypeError);
  });
});

describe("loadShippingRoutes", () => {
  it("returns every live route with its full terms, in CMS order", async () => {
    cmsFetch
      .mockResolvedValueOnce(routeList(["vn-us", "vn-eu"]))
      .mockResolvedValueOnce(routeDetail("vn-us"))
      .mockResolvedValueOnce(routeDetail("vn-eu"));

    const result = await loadShippingRoutes("vi");

    expect(result.status).toBe("ready");
    expect(result.routes.map((r) => r.slug)).toEqual(["vn-us", "vn-eu"]);
  });

  it("reports a confirmed-empty route set as `empty`", async () => {
    cmsFetch.mockResolvedValueOnce(routeList([]));
    expect((await loadShippingRoutes("vi")).status).toBe("empty");
  });

  it("reports an outage as `unavailable`", async () => {
    cmsFetch.mockRejectedValueOnce(new CmsHttpError("/shipping-routes?lang=vi", 502, "bad"));
    const result = await loadShippingRoutes("vi");
    expect(result.status).toBe("unavailable");
    if (result.status === "unavailable") expect(result.reason).toBe("http");
  });
});
