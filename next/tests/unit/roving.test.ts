// The roving-tabindex keyboard contract, tested where it lives.
//
// Every exclusive-selection group on the site routes through this one function, so the contract is
// asserted once instead of being re-asserted (and allowed to drift) per component: arrows move in
// both axes, Home/End jump, the ends wrap, and any other key is left to the browser.
import { describe, it, expect } from "vitest";

import { rovingIndex } from "@/shared/ui/roving";

const LAST = 3;

describe("rovingIndex", () => {
  it("moves forward on both forward arrows", () => {
    expect(rovingIndex("ArrowDown", 0, LAST)).toBe(1);
    expect(rovingIndex("ArrowRight", 1, LAST)).toBe(2);
  });

  it("moves backward on both backward arrows", () => {
    expect(rovingIndex("ArrowUp", 2, LAST)).toBe(1);
    expect(rovingIndex("ArrowLeft", 1, LAST)).toBe(0);
  });

  it("wraps at both ends, so a group has no dead edge", () => {
    expect(rovingIndex("ArrowDown", LAST, LAST)).toBe(0);
    expect(rovingIndex("ArrowUp", 0, LAST)).toBe(LAST);
  });

  it("jumps to the ends on Home and End", () => {
    expect(rovingIndex("Home", 2, LAST)).toBe(0);
    expect(rovingIndex("End", 1, LAST)).toBe(LAST);
  });

  it("returns null for keys it does not own, so the caller does not swallow them", () => {
    for (const key of ["Tab", "Enter", " ", "Escape", "a", "PageDown"]) {
      expect(rovingIndex(key, 1, LAST)).toBeNull();
    }
  });

  it("handles a single-option group without moving anywhere", () => {
    expect(rovingIndex("ArrowDown", 0, 0)).toBe(0);
    expect(rovingIndex("ArrowUp", 0, 0)).toBe(0);
  });
});
