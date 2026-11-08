import { describe, expect, it } from "vitest";

import { estimateLabelSavings, formatUsd } from "./labelCalc";

describe("estimateLabelSavings", () => {
  it("matches the default sliders: 2,000 labels x $6.50 at 3%", () => {
    const est = estimateLabelSavings(2000, 6.5, 3);
    expect(est.retail).toBe(13000);
    expect(est.monthly).toBe(390);
    expect(est.withThg).toBe(12610);
    expect(est.yearly).toBe(4680);
  });

  it("saves nothing at zero volume", () => {
    expect(estimateLabelSavings(0, 6.5, 5)).toEqual({ retail: 0, monthly: 0, withThg: 0, yearly: 0 });
  });
});

describe("formatUsd", () => {
  it("rounds to whole dollars with thousands separators", () => {
    expect(formatUsd(1234.4)).toBe("$1,234");
    expect(formatUsd(0)).toBe("$0");
  });
});
