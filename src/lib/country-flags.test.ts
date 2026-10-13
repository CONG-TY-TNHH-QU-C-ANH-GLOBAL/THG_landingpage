import { describe, expect, it } from "vitest";

import { groupOriginCounts } from "@/lib/country-flags";

describe("groupOriginCounts", () => {
  it("merges GB and UK into one United Kingdom row", () => {
    const groups = groupOriginCounts({ CN: 120, GB: 11, FR: 9, UK: 5 });
    expect(groups.map((g) => [g.code, g.count])).toEqual([["CN", 120], ["GB", 16], ["FR", 9]]);
    expect(groups.find((g) => g.code === "GB")?.rawKeys).toEqual(["GB", "UK"]);
  });

  it("merges case and whitespace variants of the same code", () => {
    const groups = groupOriginCounts({ US: 3, us: 2, " US ": 1 });
    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ code: "US", count: 6 });
  });

  it("drops empty, Unknown and zero-count keys", () => {
    expect(groupOriginCounts({ "": 4, Unknown: 7, JP: 0, VN: 2 })).toEqual([
      { code: "VN", rawKeys: ["VN"], count: 2 },
    ]);
  });
});
