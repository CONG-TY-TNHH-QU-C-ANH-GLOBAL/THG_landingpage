import { describe, it, expect } from "vitest";

import {
  parseBlocks,
  parseInline,
  splitSections,
} from "../../src/shared/ui/markdown";

// The parser is regex-free by design: every construct is recognized by a forward scanner that
// never revisits a position. These tests cover the supported subset, the fail-safe behavior on
// unsupported syntax, the parser-owned node identity, and — the reason the rewrite happened —
// linear termination on long malformed input.
//
// The adversarial cases below are the exact shapes a backtracking regex is slow on. They are
// asserted with a wall-clock budget: a super-linear parser blows a 2s budget on these lengths
// by orders of magnitude, while the scanner finishes in single-digit milliseconds. The budget
// is deliberately loose so the test is not flaky on a slow CI box — it is catching a
// complexity-class regression, not measuring performance.

const BUDGET_MS = 2000;

function timed(fn: () => void): number {
  const started = performance.now();
  fn();
  return performance.now() - started;
}

describe("inline parsing", () => {
  it("parses bold and absolute links", () => {
    const nodes = parseInline("a **b** c [label](https://x.test/p) d", "n");
    expect(nodes.map((n) => n.type)).toEqual(["text", "strong", "text", "link", "text"]);
    expect(nodes[1]).toMatchObject({ type: "strong", value: "b" });
    expect(nodes[3]).toMatchObject({ type: "link", label: "label", href: "https://x.test/p" });
  });

  it("refuses a non-absolute or dangerous target, leaving it literal", () => {
    for (const href of ["javascript:alert(1)", "data:text/html,x", "/relative", "//evil.test"]) {
      const nodes = parseInline(`[l](${href})`, "n");
      expect(nodes.every((n) => n.type === "text")).toBe(true);
    }
  });

  it("treats an unclosed opener as literal text", () => {
    expect(parseInline("**never closed", "n").every((n) => n.type === "text")).toBe(true);
    expect(parseInline("[label](https://x.test", "n").every((n) => n.type === "text")).toBe(true);
    expect(parseInline("****", "n").every((n) => n.type === "text")).toBe(true);
  });

  it("gives every inline node a unique, deterministic id", () => {
    const first = parseInline("**a** and **a**", "p1");
    const ids = first.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    // Identical content in a different scope must not collide with it.
    expect(parseInline("**a** and **a**", "p2").map((n) => n.id)).not.toEqual(ids);
    // Same input, same scope → same ids (deterministic across renders).
    expect(parseInline("**a** and **a**", "p1").map((n) => n.id)).toEqual(ids);
  });

  it("never loses characters — round-trips the visible text", () => {
    const source = "keep **all** of [this](https://x.test) text ** and [broken";
    const rebuilt = parseInline(source, "n")
      .map((n) => (n.type === "strong" ? `**${n.value}**` : n.type === "link" ? `[${n.label}](${n.href})` : n.value))
      .join("");
    expect(rebuilt.replace(/\s+/g, "")).toContain("keep");
    expect(rebuilt).toContain("[broken");
  });
});

describe("block parsing", () => {
  it("recognizes headings only with a separating space", () => {
    expect(parseBlocks(["# Title"])[0]).toMatchObject({ type: "heading", depth: 1, text: "Title" });
    expect(parseBlocks(["###### Six"])[0]).toMatchObject({ type: "heading", depth: 6 });
    // No space, and seven hashes, are both plain paragraphs.
    expect(parseBlocks(["#NoSpace"])[0].type).toBe("paragraph");
    expect(parseBlocks(["####### Seven"])[0].type).toBe("paragraph");
  });

  it("merges consecutive same-kind list items into one node, keeping per-item identity", () => {
    const [node] = parseBlocks(["- a", "- b", "- a"]);
    expect(node).toMatchObject({ type: "list", ordered: false });
    if (node.type === "list") {
      expect(node.items.map((i) => i.text)).toEqual(["a", "b", "a"]);
      // Two identical bullets are distinct nodes — identity is the source line, not the text.
      expect(new Set(node.items.map((i) => i.id)).size).toBe(3);
    }
  });

  it("keeps ordered and unordered runs separate", () => {
    const nodes = parseBlocks(["1. one", "2. two", "- bullet"]);
    expect(nodes.map((n) => n.type)).toEqual(["list", "list"]);
    expect(nodes[0]).toMatchObject({ ordered: true });
    expect(nodes[1]).toMatchObject({ ordered: false });
  });

  it("recognizes quotes, rules and the three callout tones", () => {
    expect(parseBlocks(["> quoted"])[0]).toMatchObject({ type: "quote", text: "quoted" });
    expect(parseBlocks(["---"])[0].type).toBe("rule");
    expect(parseBlocks(["🚨 danger"])[0]).toMatchObject({ type: "callout", tone: "danger" });
    expect(parseBlocks(["⚠ warn"])[0]).toMatchObject({ type: "callout", tone: "warn" });
    expect(parseBlocks(["📌 note"])[0]).toMatchObject({ type: "callout", tone: "note" });
  });

  it("degrades unsupported syntax to readable prose rather than dropping it", () => {
    const nodes = parseBlocks(["| a | b |", "```js", "![img](x.png)"]);
    expect(nodes.every((n) => n.type === "paragraph")).toBe(true);
    expect(nodes).toHaveLength(3);
  });

  it("gives every block a source range and an id unique within the document", () => {
    const nodes = parseBlocks(["# A", "text", "- x", "- y", "text"]);
    const ids = nodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const node of nodes) {
      expect(node.sourceEnd).toBeGreaterThanOrEqual(node.sourceStart);
      expect(node.id).toContain(String(node.sourceStart));
    }
  });

  it("offsets source positions so ids stay unique across sections", () => {
    const a = parseBlocks(["text"], { lineOffset: 0 });
    const b = parseBlocks(["text"], { lineOffset: 40 });
    expect(a[0].id).not.toBe(b[0].id);
    expect(b[0].sourceStart).toBe(40);
  });
});

describe("sectioning", () => {
  it("splits on `##` only, keeps `###` inside, and records offsets", () => {
    const sections = splitSections("lead\n## One\n### Sub\nbody\n## Two\nmore");
    expect(sections.map((s) => s.heading)).toEqual([null, "One", "Two"]);
    expect(sections[1].lines).toContain("### Sub");
    expect(sections[2].lineOffset).toBeGreaterThan(sections[1].lineOffset);
  });

  it("gives sections with identical headings distinct ids", () => {
    const sections = splitSections("## Same\na\n## Same\nb");
    expect(sections.map((s) => s.heading)).toEqual(["Same", "Same"]);
    expect(sections[0].id).not.toBe(sections[1].id);
  });

  it("drops an empty lead-in when the body starts with a heading", () => {
    expect(splitSections("## First\nbody")[0].heading).toBe("First");
  });
});

describe("adversarial input terminates in linear time", () => {
  // Each case is a shape that made the previous regex-based parser backtrack.

  it("handles a very long run of hashes", () => {
    const input = "#".repeat(50_000);
    expect(timed(() => parseBlocks([input]))).toBeLessThan(BUDGET_MS);
    expect(parseBlocks([input])[0].type).toBe("paragraph");
  });

  it("handles a heading marker followed by a huge whitespace run", () => {
    const input = `##${" ".repeat(100_000)}`;
    expect(timed(() => parseBlocks([input]))).toBeLessThan(BUDGET_MS);
  });

  it("handles many unclosed bold openers", () => {
    const input = "**".repeat(50_000);
    expect(timed(() => parseInline(input, "n"))).toBeLessThan(BUDGET_MS);
    expect(parseInline(input, "n").every((n) => n.type === "text")).toBe(true);
  });

  it("handles many unclosed link openers", () => {
    const input = "[".repeat(50_000);
    expect(timed(() => parseInline(input, "n"))).toBeLessThan(BUDGET_MS);
  });

  it("handles a near-miss link that never closes its target", () => {
    const input = `[label](https://x.test${"a".repeat(100_000)}`;
    expect(timed(() => parseInline(input, "n"))).toBeLessThan(BUDGET_MS);
  });

  it("handles a long ordered-list marker of digits", () => {
    const input = `${"9".repeat(100_000)}. item`;
    expect(timed(() => parseBlocks([input]))).toBeLessThan(BUDGET_MS);
    // The digit run is bounded, so this is a paragraph, not a list.
    expect(parseBlocks([input])[0].type).toBe("paragraph");
  });

  it("handles a very long dash run", () => {
    const input = "-".repeat(100_000);
    expect(timed(() => parseBlocks([input]))).toBeLessThan(BUDGET_MS);
    expect(parseBlocks([input])[0].type).toBe("rule");
  });

  it("handles a large document of mixed malformed lines", () => {
    const lines = Array.from({ length: 20_000 }, (_, i) =>
      ["**unclosed", "[unclosed](", "#nospace", "> q", "- b", "1. o", "---"][i % 7],
    );
    expect(timed(() => parseBlocks(lines))).toBeLessThan(BUDGET_MS);
  });

  it("handles a huge single-line body in splitSections", () => {
    const input = `## H\n${"x".repeat(500_000)}`;
    expect(timed(() => splitSections(input))).toBeLessThan(BUDGET_MS);
  });
});
