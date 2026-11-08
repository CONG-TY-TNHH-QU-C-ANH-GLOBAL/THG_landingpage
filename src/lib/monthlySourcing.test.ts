import { afterEach, describe, expect, it, vi } from "vitest";

import { cmsClient } from "./cmsClient";
import { monthlySourcingResponseSchema } from "./cmsSchemas";
import { monthlySourcingHref } from "./monthlySourcing";

const response = {
  year: 2026,
  months: [
    { month: 1, title: "Top sản phẩm & nguồn hàng tháng 1/2026", slug: "thang-1-2026" },
  ],
};

afterEach(() => vi.restoreAllMocks());

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

  it("accepts only a canonical, non-duplicated month that belongs to the active year", () => {
    expect(monthlySourcingResponseSchema.parse(response)).toEqual(response);
    expect(monthlySourcingResponseSchema.safeParse({
      ...response,
      months: [{ ...response.months[0], slug: "thang-1-2027" }],
    }).success).toBe(false);
    expect(monthlySourcingResponseSchema.safeParse({
      ...response,
      year: 2101,
      months: [{ ...response.months[0], slug: "thang-1-2101" }],
    }).success).toBe(false);
    expect(monthlySourcingResponseSchema.safeParse({
      ...response,
      months: [response.months[0], response.months[0]],
    }).success).toBe(false);
  });

  it("loads the active year without a locale parameter", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(response));

    await expect(cmsClient.getMonthlySourcing()).resolves.toEqual(response);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/monthly-sourcing",
      { headers: { Accept: "application/json" } },
    );
  });
});
