import { describe, expect, it } from "vitest";

import { THREE_PL_PACKAGING, THREE_PL_PACK_TIERS } from "./threePlPricing";

describe("3PL pricing source", () => {
  it("keeps the supplied pick-pack and packaging tiers", () => {
    expect(THREE_PL_PACK_TIERS).toHaveLength(5);
    expect(THREE_PL_PACK_TIERS.map((tier) => tier.price)).toEqual([1.2, 1.7, 2.2, 2.7, 3.2]);
    expect(THREE_PL_PACKAGING).toHaveLength(6);
  });
});
