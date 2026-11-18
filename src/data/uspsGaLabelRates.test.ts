import { describe, expect, it } from "vitest";

import {
  readUspsGaRows,
  USPS_GA_LABEL_RATES_SNAPSHOT,
  USPS_GA_ZONE_KEYS,
  uspsGaRateFor,
} from "./uspsGaLabelRates";

const WEIGHTS = [4, 8, 12, 15.999, ...Array.from({ length: 20 }, (_, i) => (i + 1) * 16)];

describe("USPS GA label rate snapshot", () => {
  it("has five tiers of the 24 workbook weights with Zone 1-9", () => {
    expect(USPS_GA_LABEL_RATES_SNAPSHOT).toHaveLength(5);
    for (const tier of USPS_GA_LABEL_RATES_SNAPSHOT) {
      expect(tier.map((r) => r.oz)).toEqual(WEIGHTS);
      for (const row of tier) {
        for (const key of USPS_GA_ZONE_KEYS) expect(row[key]).toBeGreaterThan(0);
      }
    }
  });

  // Pinned from Bang_gia_usps_ga_label.xlsx (same values as CMS migration 0071).
  it("matches the workbook's corner cells", () => {
    const [t1, t2, , , t5] = USPS_GA_LABEL_RATES_SNAPSHOT;
    expect(t1[0]).toEqual({ oz: 4, g: 113, z1: 4.49, z2: 4.56, z3: 4.59, z4: 4.73, z5: 4.82, z6: 5, z7: 5.09, z8: 5.32, z9: 7.48 });
    expect(t1[3]).toMatchObject({ oz: 15.999, g: 454, z1: 5.98, z9: 9.86 });
    expect(t1[23]).toMatchObject({ oz: 320, g: 9072, z1: 10.96, z9: 47.29 });
    expect(t2[0].z1).toBeLessThanOrEqual(t1[0].z1);
    expect(t5[23].z9).toBeLessThanOrEqual(t1[23].z9);
  });
});

describe("readUspsGaRows", () => {
  const good = USPS_GA_LABEL_RATES_SNAPSHOT[0];

  it("accepts a CMS payload of 24 numeric rows and drops extra fields", () => {
    const rows = readUspsGaRows(good.map((r) => ({ ...r, note: "x" })));
    expect(rows).toEqual(good);
  });

  it("rejects anything that is not exactly 24 numeric rows", () => {
    expect(readUspsGaRows(null)).toBeNull();
    expect(readUspsGaRows({})).toBeNull();
    expect(readUspsGaRows(good.slice(0, 23))).toBeNull();
    expect(readUspsGaRows(good.map((r, i) => (i === 5 ? { ...r, z9: "7.5" } : r)))).toBeNull();
    expect(readUspsGaRows(good.map((r, i) => (i === 5 ? { ...r, z9: Number.NaN } : r)))).toBeNull();
  });
});

describe("uspsGaRateFor", () => {
  const t1 = USPS_GA_LABEL_RATES_SNAPSHOT[0];

  it("picks the first weight ceiling that covers the parcel", () => {
    expect(uspsGaRateFor(t1, 4, 1)).toBe(4.49);
    expect(uspsGaRateFor(t1, 4.1, 1)).toBe(t1[1].z1);
    expect(uspsGaRateFor(t1, 16, 9)).toBe(t1[4].z9);
    expect(uspsGaRateFor(t1, 320, 9)).toBe(47.29);
  });

  it("returns undefined past 320 oz or for a zone outside 1-9", () => {
    expect(uspsGaRateFor(t1, 321, 1)).toBeUndefined();
    expect(uspsGaRateFor(t1, 4, 0)).toBeUndefined();
    expect(uspsGaRateFor(t1, 4, 10)).toBeUndefined();
  });
});
