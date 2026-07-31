import type { ReactNode } from "react";

// Server-side markdown → React for CMS policy/route bodies.
//
// The Vite renderer built an HTML string (`inlineHtml`) and pushed it through a sanitizer
// [FACT: src/components/shipping-policy/RouteRenderer.tsx + src/lib/sanitizeHtml]. This
// version never produces HTML at all: it emits React elements, so there is nothing to
// sanitize and no dangerouslySetInnerHTML anywhere in the path. Editor text is escaped by
// React itself, which satisfies WEB-007 §14 ("no arbitrary HTML") structurally rather than
// by trusting a filter list.
//
// The supported subset is exactly what the CMS bodies use today: `##` sections, `###`
// subheadings, `-`/`*` bullets, `**bold**`, `[text](https://…)` links, and the 🚨 / ⚠ / 📌
// callout prefixes. Anything else renders as plain text — an unsupported construct degrades
// to readable prose rather than disappearing.

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

/** Render one section's lines: bullets grouped into a list, callouts boxed, the rest prose. */
export function MarkdownLines({ lines }: Readonly<{ lines: readonly string[] }>) {
  const out: ReactNode[] = [];
  let bullets: string[] = [];

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

  for (const raw of lines) {
    const line = raw.trim();
    if (line.length === 0) {
      flushBullets();
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

    const sub = /^###\s+(.*)$/.exec(line);
    if (sub) {
      flushBullets();
      out.push(
        <h4 key={`h-${out.length}`} className="mt-4 mb-1 font-semibold text-navy">
          {sub[1]}
        </h4>,
      );
      continue;
    }

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
  return <>{out}</>;
}
