import type { ReactNode } from "react";

// Server-side markdown → React for CMS editorial bodies.
//
// Promoted to shared/ when blog and careers became its second and third consumers; it was
// written for WEB-007 policy and shipping-route bodies. It is NOT a markdown framework and
// must not become one — the supported subset is what the CMS and legacy data actually
// contain, and everything else degrades to readable prose rather than disappearing.
//
// Why not react-markdown + remark-gfm: they are the natural reach, and this deliberately does
// not reach for them. The renderer never produces an HTML string, so there is nothing to
// sanitize and no dangerouslySetInnerHTML anywhere in the path — React escapes editor text
// itself. That is a structural guarantee rather than trust in a filter list, and it costs no
// dependency. The Vite renderer built HTML and pushed it through a sanitizer
// [FACT: src/components/shipping-policy/RouteRenderer.tsx + src/lib/sanitizeHtml].
//
// Supported, and nothing else:
//   `#`..`######`  headings (rendered at a caller-chosen base level so page structure stays
//                  semantic — a body heading must never outrank the page h1)
//   `-` / `*`      unordered list items
//   `1.`           ordered list items
//   `>`            blockquote
//   `---`          thematic break
//   `**bold**`     inline strong
//   `[a](https://) inline link, ABSOLUTE http(s) only
//   🚨 / ⚠ / 📌     callout lines
//
// ponytail: no tables, images, code fences, or nested lists. If a CMS body starts using one,
// add that single construct here — do not swap in a general parser. Unknown syntax already
// renders as its literal text, so the failure mode is "plain but readable", never blank.
//
// Server-compatible: no hooks, no browser API, no "use client".

const CALLOUTS = [
  { prefix: "🚨", tone: "danger" as const },
  { prefix: "⚠", tone: "warn" as const },
  { prefix: "📌", tone: "note" as const },
];

const CALLOUT_STYLE: Readonly<Record<"danger" | "warn" | "note", string>> = {
  danger: "border-red-300 bg-red-50 text-red-900",
  warn: "border-amber-300 bg-amber-50 text-amber-900",
  note: "border-sky-300 bg-sky-50 text-sky-900",
};

/** Split inline `**bold**` and `[label](https://…)` into React nodes.
 *
 *  Only absolute http(s) links are turned into anchors — a `javascript:` or relative target
 *  in editor content stays literal text, so a malicious or mistaken href can never be
 *  rendered as a live link. */
export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else {
      nodes.push(
        <a
          key={key++}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-primary underline"
        >
          {match[2]}
        </a>,
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

interface Section {
  /** null for the lead-in lines that precede the first `##` heading. */
  heading: string | null;
  lines: string[];
}

/** Split a markdown body into `##`-delimited sections, preserving the untitled lead-in. */
export function splitSections(markdown: string): Section[] {
  const sections: Section[] = [{ heading: null, lines: [] }];
  for (const raw of markdown.split("\n")) {
    const line = raw.trimEnd();
    const heading = /^##\s+(.*)$/.exec(line);
    if (heading) {
      sections.push({ heading: heading[1].trim(), lines: [] });
    } else {
      sections[sections.length - 1].lines.push(line);
    }
  }
  // Drop the lead-in when the body starts with a heading (its `lines` are all blank).
  return sections.filter((s) => s.heading !== null || s.lines.some((l) => l.trim().length > 0));
}

/** Render one section's lines: list items grouped, callouts boxed, the rest prose.
 *
 *  `baseHeadingLevel` is the level a single `#` maps to — 2 under a page h1, 3 inside a
 *  section that already has its own h2. Deeper markdown headings step down from there and
 *  clamp at h6, so a body can never break the page outline. */
export function MarkdownLines({
  lines,
  baseHeadingLevel = 3,
}: Readonly<{ lines: readonly string[]; baseHeadingLevel?: 2 | 3 | 4 }>) {
  const out: ReactNode[] = [];
  let bullets: string[] = [];
  let numbered: string[] = [];

  const flushBullets = () => {
    if (bullets.length === 0) return;
    out.push(
      <ul key={`ul-${out.length}`} className="my-1.5 list-disc space-y-1 pl-5">
        {bullets.map((b, i) => (
          <li key={i}>{renderInline(b)}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  const flushNumbered = () => {
    if (numbered.length === 0) return;
    out.push(
      <ol key={`ol-${out.length}`} className="my-1.5 list-decimal space-y-1 pl-5">
        {numbered.map((b, i) => (
          <li key={i}>{renderInline(b)}</li>
        ))}
      </ol>,
    );
    numbered = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line.length === 0) {
      flushBullets();
      flushNumbered();
      continue;
    }

    const callout = CALLOUTS.find((c) => line.startsWith(c.prefix));
    if (callout) {
      flushBullets();
      out.push(
        <p
          key={`c-${out.length}`}
          className={`my-2 rounded-lg border px-3 py-2 text-[13px] ${CALLOUT_STYLE[callout.tone]}`}
        >
          {renderInline(line.slice(callout.prefix.length).trim())}
        </p>,
      );
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flushBullets();
      // Depth is relative to the caller's base so a body can never emit a heading that
      // outranks the page's own h1, and the document outline stays valid.
      const level = Math.min(6, baseHeadingLevel + heading[1].length - 1);
      const Tag = `h${level}` as "h2" | "h3" | "h4" | "h5" | "h6";
      out.push(
        <Tag key={`h-${out.length}`} className="mt-4 mb-1 font-semibold text-navy">
          {renderInline(heading[2])}
        </Tag>,
      );
      continue;
    }

    if (/^---+$/.test(line)) {
      flushBullets();
      out.push(<hr key={`hr-${out.length}`} className="my-5 border-border/60" />);
      continue;
    }

    if (line.startsWith(">")) {
      flushBullets();
      out.push(
        <blockquote
          key={`q-${out.length}`}
          className="my-3 border-l-4 border-[#d4b96a] pl-4 text-foreground/80 italic"
        >
          {renderInline(line.replace(/^>\s?/, ""))}
        </blockquote>,
      );
      continue;
    }

    const ordered = /^(\d+)\.\s+(.*)$/.exec(line);
    if (ordered) {
      flushBullets();
      numbered.push(ordered[2]);
      continue;
    }
    flushNumbered();

    if (/^[-*]\s+/.test(line)) {
      bullets.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }

    flushBullets();
    out.push(
      <p key={`p-${out.length}`} className="my-1.5">
        {renderInline(line)}
      </p>,
    );
  }
  flushBullets();
  flushNumbered();
  return <>{out}</>;
}
