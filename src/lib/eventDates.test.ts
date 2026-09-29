import { describe, expect, it } from "vitest";

import { formatEventDates } from "./eventDates";

describe("formatEventDates", () => {
  it("shows a single day as dd/MM/yyyy", () => {
    expect(formatEventDates("2026-10-31", null)).toBe("31/10/2026");
  });

  it("shows a range for multi-day events", () => {
    expect(formatEventDates("2026-07-14", "2026-07-15")).toBe("14/07/2026 – 15/07/2026");
  });

  it("treats an end date equal to the start as a single day", () => {
    expect(formatEventDates("2026-07-14", "2026-07-14")).toBe("14/07/2026");
  });

  it("leaves a value it cannot parse untouched", () => {
    expect(formatEventDates("Q4/2026", undefined)).toBe("Q4/2026");
  });
});
