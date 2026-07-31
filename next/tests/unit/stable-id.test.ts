import { describe, it, expect } from "vitest";

import { withStableIds, withStableStringIds } from "../../src/shared/model/stable-id";

// The identity contract behind every React key in the CMS-backed routes: DOMAIN SCOPE +
// NORMALIZED CONTENT, with duplicates numbered rather than deduplicated.
//
// `normalize` was rewritten from two chained regexes to one forward pass because
// `.replace(/^-+|-+$/g, "")` is polynomial — `-+$` is a greedy quantifier anchored to the end,
// retried at every position of a long dash run. The differential test below is the evidence
// that the rewrite changed nothing observable; the timing test is the evidence that it fixed
// the complexity class.

/** The exact implementation that shipped before the rewrite, for differential comparison. */
function legacyNormalize(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

/** Ids are `scope:normalized`, so the normalized fragment is recoverable from the id. */
const normalizedOf = (id: string) => id.slice("s:".length);

describe("normalization is unchanged by the rewrite", () => {
  it("matches the previous implementation on representative content", () => {
    const samples = [
      "Daily ops",
      "Chính sách vận chuyển",
      "运输政策",
      "  leading and trailing  ",
      "---dashes---",
      "Multiple   spaces\tand\ttabs",
      "punctuation!!! everywhere???",
      "MiXeD CaSe",
      "",
      "!!!",
      "a-b-c",
      "Insurance & benefits (full cover)",
      "3y experience",
      "Émile Zola",
      "x".repeat(200),
      `${"a".repeat(60)} ${"b".repeat(60)}`,
      "-".repeat(50),
      `${"-".repeat(30)}tail`,
      `head${"-".repeat(30)}`,
    ];
    for (const sample of samples) {
      const [{ id }] = withStableStringIds("s", [sample]);
      expect(normalizedOf(id) || "item", sample).toBe(legacyNormalize(sample) || "item");
    }
  });

  it("matches the previous implementation on generated inputs", () => {
    // Deterministic pseudo-random so a failure is reproducible.
    let seed = 12345;
    const next = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    const alphabet = "abcXYZ0129 \t-_.,!éü中 ";

    for (let i = 0; i < 400; i++) {
      const length = Math.floor(next() * 90);
      let sample = "";
      for (let j = 0; j < length; j++) {
        sample += alphabet[Math.floor(next() * alphabet.length)];
      }
      const [{ id }] = withStableStringIds("s", [sample]);
      expect(normalizedOf(id) || "item", JSON.stringify(sample)).toBe(
        legacyNormalize(sample) || "item",
      );
    }
  });

  it("bounds the id fragment at 64 characters", () => {
    const [{ id }] = withStableStringIds("s", ["a".repeat(500)]);
    expect(normalizedOf(id)).toHaveLength(64);
  });
});

describe("normalization is linear", () => {
  it("handles a long dash run that made the old pattern quadratic", () => {
    // `-+$` retried at every position of the run. Loose budget: this catches a
    // complexity-class regression, not a slow CI box.
    const started = performance.now();
    withStableStringIds("s", [`${"-".repeat(400_000)}x`]);
    expect(performance.now() - started).toBeLessThan(1000);
  });

  it("handles a very long paragraph", () => {
    const started = performance.now();
    withStableStringIds("s", ["word ".repeat(200_000)]);
    expect(performance.now() - started).toBeLessThan(1000);
  });
});

describe("the stable-ID contract", () => {
  it("keeps the domain scope in the identity", () => {
    const [a] = withStableStringIds("policy-a", ["Terms"]);
    const [b] = withStableStringIds("policy-b", ["Terms"]);
    // Same content in different sections must not collide.
    expect(a.id).not.toBe(b.id);
    expect(a.id.startsWith("policy-a:")).toBe(true);
  });

  it("is deterministic across calls", () => {
    const once = withStableStringIds("s", ["Alpha", "Beta"]).map((i) => i.id);
    const twice = withStableStringIds("s", ["Alpha", "Beta"]).map((i) => i.id);
    expect(once).toEqual(twice);
  });

  it("survives reordering — an id follows its content, not its position", () => {
    const forward = withStableStringIds("s", ["Alpha", "Beta", "Gamma"]);
    const reversed = withStableStringIds("s", ["Gamma", "Beta", "Alpha"]);
    const idOf = (list: typeof forward, text: string) =>
      list.find((i) => i.value === text)!.id;
    for (const text of ["Alpha", "Beta", "Gamma"]) {
      expect(idOf(forward, text)).toBe(idOf(reversed, text));
    }
  });

  it("NUMBERS duplicates rather than deduplicating them", () => {
    // Business content may legitimately repeat; removing it to obtain a React key would be the
    // wrong trade.
    const items = withStableStringIds("s", ["Same", "Other", "Same", "Same"]);
    expect(items.map((i) => i.value)).toEqual(["Same", "Other", "Same", "Same"]);
    expect(new Set(items.map((i) => i.id)).size).toBe(4);
    expect(items[0].id).toBe("s:same");
    expect(items[2].id).toBe("s:same~2");
    expect(items[3].id).toBe("s:same~3");
  });

  it("gives content that normalizes to nothing a usable id", () => {
    const items = withStableStringIds("s", ["!!!", "???"]);
    // Both normalize to "", so both fall back to `item` and are then disambiguated.
    expect(new Set(items.map((i) => i.id)).size).toBe(2);
  });

  it("works on objects through a content selector", () => {
    const items = withStableIds("s", [{ h: "One" }, { h: "One" }], (x) => x.h);
    expect(new Set(items.map((i) => i.id)).size).toBe(2);
  });
});
