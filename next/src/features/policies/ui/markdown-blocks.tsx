import type { ReactNode } from "react";

// Server-side markdown → React for CMS policy/route bodies.
//
// TWO structural guarantees, both deliberate:
//
// 1. NO HTML IS EVER PRODUCED. The Vite renderer built an HTML string and pushed it through a
//    sanitizer [FACT: src/components/shipping-policy/RouteRenderer.tsx + src/lib/sanitizeHtml].
//    This emits React elements, so there is nothing to sanitize and no dangerouslySetInnerHTML
//    anywhere in the path. Editor text is escaped by React itself — a structural guarantee
//    rather than trust in a filter list (WEB-007 §14).
//
// 2. NO REGEX, ANYWHERE. Every construct is recognized by a small forward scanner over the
//    line. The previous version used alternation and `\s+`-then-`.*` patterns, which are
//    backtracking-prone: a long malformed line (`"#".repeat(50_000)`, `"**".repeat(20_000)`)
//    could cost super-linear time on a SERVER render, which is a denial-of-service surface on
//    operator-supplied content. Scanning gives an O(n) bound per line that is provable by
//    inspection — each character is examined a bounded number of times and no position is ever
//    revisited. Replacing one regex with a cleverer regex would not have that property.
//
// PARSING PRODUCES NODES, NOT ELEMENTS. Every node carries its source range and a
// parser-owned `id` derived from it, so React keys come from parser identity rather than array
// position. Two identical paragraphs in one document are distinct nodes because their source
// ranges differ.
//
// The supported subset is what the CMS bodies actually contain: `#`..`######` headings,
// `-`/`*` bullets, `1.` ordered items, `>` quotes, `---` rules, `**bold**`,
// `[text](https://…)` links, and the 🚨 / ⚠ / 📌 callout prefixes. Anything else renders as
// its literal text — an unsupported construct degrades to readable prose, never to blank.
// This is intentionally narrow and must not become a general markdown framework.

// ── Inline nodes ────────────────────────────────────────────────────────────────────────────

export type InlineNode =
  | { type: "text"; id: string; value: string }
  | { type: "strong"; id: string; value: string }
  | { type: "link"; id: string; label: string; href: string };

const BOLD = "**";
const LINK_HTTPS = "https://";
const LINK_HTTP = "http://";

/** True when `text` has `needle` at `at`. Bounded, allocation-free. */
function hasAt(text: string, at: number, needle: string): boolean {
  if (at + needle.length > text.length) return false;
  for (let i = 0; i < needle.length; i++) {
    if (text[at + i] !== needle[i]) return false;
  }
  return true;
}

/**
 * Parse inline `**bold**` and `[label](https://…)` in ONE forward pass.
 *
 * `scan` only ever moves forward: when a candidate does not close, the opener is consumed as
 * literal text and scanning resumes AFTER it. That is what makes a pathological input like
 * `"**".repeat(20_000)` linear — there is no position to backtrack to.
 *
 * Only absolute http(s) targets become anchors. A `javascript:`, `data:` or relative target in
 * editor content stays literal text, so a malicious or mistaken href can never be rendered as
 * a live link.
 */
/** A recognized inline construct and the offset to resume scanning from. `node` carries no id
 *  — parseInline assigns it, so the readers stay pure and id-free. */
interface InlineMatch {
  node: { type: "strong"; value: string } | { type: "link"; label: string; href: string };
  next: number;
}

/** `**bold**`. Requires non-empty content, so `****` stays literal. */
function readBoldAt(text: string, at: number): InlineMatch | null {
  if (!hasAt(text, at, BOLD)) return null;
  const close = text.indexOf(BOLD, at + BOLD.length);
  if (close <= at + BOLD.length) return null;
  return {
    node: { type: "strong", value: text.slice(at + BOLD.length, close) },
    next: close + BOLD.length,
  };
}

/** True only for an absolute http(s) target with no whitespace. A `javascript:`, `data:` or
 *  relative target in editor content must stay literal text, so it can never become a live
 *  link. */
function isRenderableHref(href: string): boolean {
  const absolute = href.startsWith(LINK_HTTPS) || href.startsWith(LINK_HTTP);
  return absolute && !href.includes(" ");
}

/** `[label](https://…)`. */
function readLinkAt(text: string, at: number): InlineMatch | null {
  if (text[at] !== "[") return null;
  const labelEnd = text.indexOf("]", at + 1);
  if (labelEnd <= at + 1 || text[labelEnd + 1] !== "(") return null;
  const hrefEnd = text.indexOf(")", labelEnd + 2);
  if (hrefEnd <= labelEnd + 2) return null;

  const href = text.slice(labelEnd + 2, hrefEnd);
  if (!isRenderableHref(href)) return null;
  return {
    node: { type: "link", label: text.slice(at + 1, labelEnd), href },
    next: hrefEnd + 1,
  };
}

const INLINE_READERS = [readBoldAt, readLinkAt] as const;

/** The first construct starting at `at`, or null when this position is ordinary text. */
function readInlineAt(text: string, at: number): InlineMatch | null {
  for (const read of INLINE_READERS) {
    const match = read(text, at);
    if (match) return match;
  }
  return null;
}

/** Short id discriminator per node type, preserving the existing `-t` / `-b` / `-a` scheme. */
const INLINE_ID_TAG = { text: "t", strong: "b", link: "a" } as const;

/**
 * Parse inline `**bold**` and `[label](https://…)` in ONE forward pass.
 *
 * `scan` only ever moves forward: when no reader matches, the character is consumed as literal
 * text and scanning resumes at the next position. That is what makes a pathological input like
 * `"**".repeat(20_000)` linear — there is no position to backtrack to.
 */
export function parseInline(text: string, idPrefix: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let literalStart = 0;
  let scan = 0;
  let seq = 0;

  const nextId = (type: InlineNode["type"]) => `${idPrefix}-${INLINE_ID_TAG[type]}${seq++}`;

  const flushLiteral = (upTo: number) => {
    if (upTo <= literalStart) return;
    nodes.push({ type: "text", id: nextId("text"), value: text.slice(literalStart, upTo) });
  };

  while (scan < text.length) {
    const match = readInlineAt(text, scan);
    if (!match) {
      scan += 1;
      continue;
    }
    flushLiteral(scan);
    nodes.push({ ...match.node, id: nextId(match.node.type) });
    scan = match.next;
    literalStart = scan;
  }

  flushLiteral(text.length);
  return nodes;
}

/** Render inline nodes. Keys are parser-owned ids, never the array index. */
export function renderInline(text: string, idPrefix: string): ReactNode[] {
  return parseInline(text, idPrefix).map((node) => {
    if (node.type === "strong") return <strong key={node.id}>{node.value}</strong>;
    if (node.type === "link") {
      return (
        <a
          key={node.id}
          href={node.href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-primary underline"
        >
          {node.label}
        </a>
      );
    }
    return <span key={node.id}>{node.value}</span>;
  });
}

// ── Block nodes ─────────────────────────────────────────────────────────────────────────────

export type CalloutTone = "danger" | "warn" | "note";

interface NodeBase {
  /** Stable, parser-owned identity: type plus the source line range it came from. Unique
   *  because block source ranges never overlap. */
  id: string;
  /** 0-based index of the first source line this node was built from. */
  sourceStart: number;
  /** 0-based index of the last source line, inclusive. */
  sourceEnd: number;
}

export type BlockNode =
  | (NodeBase & { type: "heading"; depth: number; text: string })
  | (NodeBase & { type: "paragraph"; text: string })
  | (NodeBase & { type: "quote"; text: string })
  | (NodeBase & { type: "callout"; tone: CalloutTone; text: string })
  | (NodeBase & { type: "rule" })
  | (NodeBase & {
      type: "list";
      ordered: boolean;
      items: readonly { id: string; text: string }[];
    });

const CALLOUTS: readonly { prefix: string; tone: CalloutTone }[] = [
  { prefix: "🚨", tone: "danger" },
  { prefix: "⚠", tone: "warn" },
  { prefix: "📌", tone: "note" },
];

const CALLOUT_STYLE: Readonly<Record<CalloutTone, string>> = {
  danger: "border-red-300 bg-red-50 text-red-900",
  warn: "border-amber-300 bg-amber-50 text-amber-900",
  note: "border-sky-300 bg-sky-50 text-sky-900",
};

/** Count the leading run of `ch`, capped at `max`. Linear and bounded. */
function leadingRun(line: string, ch: string, max = line.length): number {
  let n = 0;
  while (n < line.length && n < max && line[n] === ch) n += 1;
  return n;
}

function skipSpaces(line: string, from: number): number {
  let i = from;
  while (i < line.length && (line[i] === " " || line[i] === "\t")) i += 1;
  return i;
}

/** `#`..`######` followed by at least one space. Returns null for `#nospace` or a bare run. */
function readHeading(line: string): { depth: number; text: string } | null {
  const hashes = leadingRun(line, "#", 7);
  if (hashes === 0 || hashes > 6) return null;
  const afterSpace = skipSpaces(line, hashes);
  if (afterSpace === hashes) return null; // no separating space
  return { depth: hashes, text: line.slice(afterSpace) };
}

/** `-` or `*` followed by a space. Two markers, so Sonar reported two `startsWith` issues on
 *  this line rather than one duplicated finding — both index comparisons are replaced. */
const BULLET_MARKERS = ["-", "*"] as const;

function readBullet(line: string): string | null {
  if (!BULLET_MARKERS.some((marker) => line.startsWith(marker))) return null;
  const afterSpace = skipSpaces(line, 1);
  if (afterSpace === 1) return null;
  return line.slice(afterSpace);
}

/** `<digits>.` followed by a space. Digit run is bounded so a 10k-digit line cannot be slow. */
function readOrdered(line: string): string | null {
  let i = 0;
  while (i < line.length && i < 9 && line[i] >= "0" && line[i] <= "9") i += 1;
  if (i === 0 || line[i] !== ".") return null;
  const afterSpace = skipSpaces(line, i + 1);
  if (afterSpace === i + 1) return null;
  return line.slice(afterSpace);
}

/** Three or more `-` and nothing else. */
function isRule(line: string): boolean {
  if (line.length < 3) return false;
  return leadingRun(line, "-") === line.length;
}

function readCallout(line: string): { tone: CalloutTone; text: string } | null {
  for (const { prefix, tone } of CALLOUTS) {
    if (line.startsWith(prefix)) return { tone, text: line.slice(prefix.length).trim() };
  }
  return null;
}

/**
 * Parse a block of source lines into typed nodes.
 *
 * One forward pass; consecutive list items of the same kind are merged into one `list` node.
 * `baseHeadingLevel` is the level a single `#` maps to — deeper headings step down and clamp
 * at h6, so a CMS body can never outrank the page's own h1 or break the document outline.
 * `lineOffset` lets a caller that already split the document report source positions relative
 * to the whole body, which keeps node ids unique across sections.
 */
/** Source range plus the id derived from it — the identity every node carries. */
function nodeIdentity(type: string, start: number, end: number, lineOffset: number) {
  return {
    id: `${type}-${lineOffset + start}-${lineOffset + end}`,
    sourceStart: lineOffset + start,
    sourceEnd: lineOffset + end,
  };
}

// ── Single-line block readers ───────────────────────────────────────────────────────────────
// One responsibility each: recognize a kind, or return null. Order matters — the array below
// is the precedence, and a paragraph is the fallback when every reader declines.

type LineReader = (line: string, at: number, lineOffset: number) => BlockNode | null;

const readCalloutLine: LineReader = (line, at, lineOffset) => {
  const callout = readCallout(line);
  if (!callout) return null;
  return {
    type: "callout",
    ...nodeIdentity("callout", at, at, lineOffset),
    tone: callout.tone,
    text: callout.text,
  };
};

const readRuleLine: LineReader = (line, at, lineOffset) =>
  isRule(line) ? { type: "rule", ...nodeIdentity("rule", at, at, lineOffset) } : null;

const readHeadingLine: LineReader = (line, at, lineOffset) => {
  const heading = readHeading(line);
  if (!heading) return null;
  return {
    type: "heading",
    ...nodeIdentity("heading", at, at, lineOffset),
    depth: heading.depth,
    text: heading.text,
  };
};

const readQuoteLine: LineReader = (line, at, lineOffset) =>
  line.startsWith(">")
    ? {
        type: "quote",
        ...nodeIdentity("quote", at, at, lineOffset),
        text: line.slice(1).trim(),
      }
    : null;

const LINE_READERS: readonly LineReader[] = [
  readCalloutLine,
  readRuleLine,
  readHeadingLine,
  readQuoteLine,
];

/** The block this line makes on its own. Falls back to a paragraph, which is what keeps
 *  unsupported syntax readable instead of dropping it. */
function readSingleLine(line: string, at: number, lineOffset: number): BlockNode {
  for (const read of LINE_READERS) {
    const node = read(line, at, lineOffset);
    if (node) return node;
  }
  return { type: "paragraph", ...nodeIdentity("paragraph", at, at, lineOffset), text: line };
}

/**
 * A run of consecutive same-kind list items starting at `at`, or null when this line is not a
 * list item. Each item keeps its own SOURCE LINE as identity, so two identical bullets stay
 * distinct.
 */
function readListRun(
  lines: readonly string[],
  at: number,
  lineOffset: number,
): { node: BlockNode; next: number } | null {
  const firstBullet = readBullet(lines[at].trim());
  const ordered = firstBullet === null && readOrdered(lines[at].trim()) !== null;
  if (firstBullet === null && !ordered) return null;

  const items: { id: string; text: string }[] = [];
  let i = at;
  while (i < lines.length) {
    const candidate = lines[i].trim();
    const text = ordered ? readOrdered(candidate) : readBullet(candidate);
    if (text === null) break;
    items.push({ id: `li-${lineOffset + i}`, text });
    i += 1;
  }

  return {
    node: {
      type: "list",
      ...nodeIdentity("list", at, i - 1, lineOffset),
      ordered,
      items,
    },
    next: i,
  };
}

/**
 * Parse a block of source lines into typed nodes.
 *
 * One forward pass; consecutive list items of the same kind merge into one `list` node.
 * `lineOffset` lets a caller that already split the document report source positions relative
 * to the whole body, which keeps node ids unique across sections.
 */
export function parseBlocks(
  lines: readonly string[],
  { lineOffset = 0 }: { lineOffset?: number } = {},
): BlockNode[] {
  const nodes: BlockNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.length === 0) {
      i += 1;
      continue;
    }

    const list = readListRun(lines, i, lineOffset);
    if (list) {
      nodes.push(list.node);
      i = list.next;
      continue;
    }

    nodes.push(readSingleLine(line, i, lineOffset));
    i += 1;
  }

  return nodes;
}

/** Render parsed blocks. Every key is a parser-owned node id. */
export function MarkdownLines({
  lines,
  baseHeadingLevel = 3,
  lineOffset = 0,
}: Readonly<{
  lines: readonly string[];
  baseHeadingLevel?: 2 | 3 | 4;
  lineOffset?: number;
}>) {
  return (
    <>
      {parseBlocks(lines, { lineOffset }).map((node) => {
        switch (node.type) {
          case "heading": {
            const level = Math.min(6, baseHeadingLevel + node.depth - 1);
            const Tag = `h${level}` as "h2" | "h3" | "h4" | "h5" | "h6";
            return (
              <Tag key={node.id} className="mt-4 mb-1 font-semibold text-navy">
                {renderInline(node.text, node.id)}
              </Tag>
            );
          }
          case "rule":
            return <hr key={node.id} className="my-5 border-border/60" />;
          case "quote":
            return (
              <blockquote
                key={node.id}
                className="my-3 border-l-4 border-[#d4b96a] pl-4 text-foreground/80 italic"
              >
                {renderInline(node.text, node.id)}
              </blockquote>
            );
          case "callout":
            return (
              <p
                key={node.id}
                className={`my-2 rounded-lg border px-3 py-2 text-[13px] ${CALLOUT_STYLE[node.tone]}`}
              >
                {renderInline(node.text, node.id)}
              </p>
            );
          case "list": {
            const items = node.items.map((item) => (
              <li key={item.id}>{renderInline(item.text, item.id)}</li>
            ));
            return node.ordered ? (
              <ol key={node.id} className="my-1.5 list-decimal space-y-1 pl-5">
                {items}
              </ol>
            ) : (
              <ul key={node.id} className="my-1.5 list-disc space-y-1 pl-5">
                {items}
              </ul>
            );
          }
          default:
            return (
              <p key={node.id} className="my-1.5">
                {renderInline(node.text, node.id)}
              </p>
            );
        }
      })}
    </>
  );
}

// ── Document sectioning ─────────────────────────────────────────────────────────────────────

export interface MarkdownSection {
  /** null for the lead-in lines that precede the first `##` heading. */
  heading: string | null;
  lines: string[];
  /** 0-based index of this section's first line in the original body. Feeds `lineOffset` so
   *  node ids stay unique across sections of the same document. */
  lineOffset: number;
  /** Stable identity for React, derived from the source position rather than the heading text
   *  — two sections may legitimately share a heading. */
  id: string;
}

/** Split a body into `##`-delimited sections, preserving the untitled lead-in. */
export function splitSections(markdown: string): MarkdownSection[] {
  const all = markdown.split("\n");
  const sections: MarkdownSection[] = [
    { heading: null, lines: [], lineOffset: 0, id: "section-0" },
  ];

  for (let index = 0; index < all.length; index++) {
    const line = all[index].trimEnd();
    // A section break is exactly `##` + space; `###` is a sub-heading and stays inside.
    const isSectionHeading =
      leadingRun(line, "#", 3) === 2 && skipSpaces(line, 2) > 2 && line.length > 2;
    if (isSectionHeading) {
      sections.push({
        heading: line.slice(skipSpaces(line, 2)).trim(),
        lines: [],
        lineOffset: index + 1,
        id: `section-${index}`,
      });
    } else {
      sections.at(-1)!.lines.push(line);
    }
  }

  // Drop the lead-in when the body starts with a heading (its lines are all blank).
  return sections.filter(
    (s) => s.heading !== null || s.lines.some((l) => l.trim().length > 0),
  );
}
