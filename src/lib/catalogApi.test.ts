import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchCatalogForOrigins, fetchOriginCounts } from "@/lib/catalogApi";

function hubPage(origins: (string | null)[], page: number, pages: number) {
  return {
    ok: true,
    json: async () => ({
      data: origins.map((origin, i) => ({ id: `${page}-${i}`, origin })),
      pagination: { page, limit: 100, total: 0, pages },
      categoryCounts: {},
      originCounts: { CN: 999 },
    }),
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("fetchOriginCounts", () => {
  it("counts origins of the scoped products, not the Hub's global counts", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(hubPage(["CN", "US", "CN", null, " "], 1, 1));
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchOriginCounts({ collection: ["christmas"] })).resolves.toEqual({ CN: 2, US: 1, Unknown: 2 });
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("collection=christmas");
    expect(url).not.toContain("origin=");
  });

  it("walks every page of the scope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(hubPage(["GB", "UK"], 1, 2)).mockResolvedValueOnce(hubPage(["GB"], 2, 2)),
    );
    await expect(fetchOriginCounts({ category: "Apparel" })).resolves.toEqual({ GB: 2, UK: 1 });
  });

  it("fails rather than return partial counts when the scope is too large", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => hubPage(["CN"], 1, 999)));
    await expect(fetchOriginCounts({ search: "shirt" })).rejects.toThrow();
  });
});

describe("fetchCatalogForOrigins", () => {
  it("passes a single code straight through", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(hubPage(["FR"], 1, 1));
    vi.stubGlobal("fetch", fetchMock);
    const res = await fetchCatalogForOrigins({ page: 2, limit: 20 }, ["FR"]);
    expect(res.data).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/origin=FR/);
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/page=2/);
  });

  it("merges every code of one country and paginates the union", async () => {
    const byOrigin: Record<string, (string | null)[]> = { GB: Array(11).fill("GB"), UK: Array(5).fill("UK") };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async (url: string) => {
        const origin = new URL(url).searchParams.get("origin") as string;
        const page = hubPage(byOrigin[origin], 1, 1);
        const body = await page.json();
        body.data = body.data.map((p: { id: string; origin: string | null }) => ({ ...p, id: `${origin}-${p.id}` }));
        return { ok: true, json: async () => body };
      }),
    );
    const first = await fetchCatalogForOrigins({ page: 1, limit: 10, collection: ["christmas"] }, ["GB", "UK"]);
    expect(first.pagination).toEqual({ page: 1, limit: 10, total: 16, pages: 2 });
    expect(first.data).toHaveLength(10);
    const second = await fetchCatalogForOrigins({ page: 2, limit: 10 }, ["GB", "UK"]);
    expect(second.data.map((p) => p.origin)).toEqual(["GB", "UK", "UK", "UK", "UK", "UK"]);
  });
});
