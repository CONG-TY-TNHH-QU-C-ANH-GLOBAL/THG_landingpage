import { describe, expect, it } from "vitest";

import { THREE_PL_PACKAGING, THREE_PL_PACK_TIERS, THREE_PL_USPS_RATES } from "./threePlPricing";

describe("3PL pricing source", () => {
  it("preserves every pricing.js rate and all eight USPS zones", () => {
    expect(THREE_PL_USPS_RATES).toHaveLength(24);
    expect(THREE_PL_USPS_RATES.every((row) => row.length === 9)).toBe(true);
    expect(THREE_PL_USPS_RATES[0]).toEqual([4, 5.6, 5.66, 5.71, 5.88, 6.01, 6.23, 6.36, 6.63]);
    expect(THREE_PL_USPS_RATES.at(-1)).toEqual([320, 13.52, 13.7, 14.92, 17.45, 22.96, 29.37, 32.4, 38.11]);
  });

  it("keeps the supplied pick-pack and packaging tiers", () => {
    expect(THREE_PL_PACK_TIERS).toHaveLength(5);
    expect(THREE_PL_PACK_TIERS.map((tier) => tier.price)).toEqual([1.2, 1.7, 2.2, 2.7, 3.2]);
    expect(THREE_PL_PACKAGING).toHaveLength(6);
  });
});
