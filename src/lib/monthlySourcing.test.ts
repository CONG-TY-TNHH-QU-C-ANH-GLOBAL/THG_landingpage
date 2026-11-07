import { describe, expect, it } from "vitest";

import { monthlySourcingHref } from "./monthlySourcing";

describe("monthly product sourcing links", () => {
  it("opens the fixed LP template, not an in-app route", () => {
    expect(monthlySourcingHref({ year: 2026, month: 1 })).toBe(
      "https://lp.thgfulfill.com/thang-1-2026",
    );
  });

  it("keeps the year in the canonical destination for December", () => {
    expect(monthlySourcingHref({ year: 2027, month: 12 })).toBe(
      "https://lp.thgfulfill.com/thang-12-2027",
    );
  });
});
