// XSS gate for any HTML rendered via dangerouslySetInnerHTML. DOMPurify with
// a conservative allowlist — covers everything we currently emit from CMS
// (policy tables, terminology snippets, careers CTA copy) without permitting
// <script>, inline event handlers, or javascript: URLs.

import DOMPurify from "dompurify";
import { createElement, useMemo, type HTMLAttributes } from "react";

const ALLOWED_TAGS = [
  "a",
  "b",
  "br",
  "code",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
];

// `style` deliberately excluded: CMS/translated HTML is rendered through this,
// and arbitrary inline CSS allows full-page `position:fixed` overlays and
// `background:url()` exfil. The emitted markup styles via `class` only.
const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "class", "className"];

// UGC link policy (Business Plan §4 anti-spam-backlink rule): every link
// inside user-generated content carries rel="ugc nofollow noopener noreferrer"
// so Google never counts community backlinks, and external links open in a
// new tab. Implemented as a DOMPurify hook gated by a module flag — the hook
// registers once, the flag scopes it to UGC sanitize passes only (DOMPurify
// is synchronous, so the flag can't leak across concurrent calls).
let ugcPass = false;

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (!ugcPass || node.tagName !== "A") return;
  node.setAttribute("rel", "ugc nofollow noopener noreferrer");
  const href = node.getAttribute("href") ?? "";
  if (/^https?:\/\//i.test(href)) {
    node.setAttribute("target", "_blank");
  }
});

interface SanitizeOptions {
  /** Treat the payload as user-generated content — enforces the UGC link policy. */
  ugc?: boolean;
}

export function sanitizeHtml(input: string, options?: SanitizeOptions): string {
  ugcPass = options?.ugc === true;
  try {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ALLOW_DATA_ATTR: false,
    });
  } finally {
    ugcPass = false;
  }
}

/** HTML tags allowed for the `as` prop — keeps types tight without enumerating SVG. */
type SafeHtmlTag =
  | "div"
  | "span"
  | "p"
  | "td"
  | "th"
  | "li"
  | "section"
  | "article"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

type SafeHtmlProps = HTMLAttributes<HTMLElement> & {
  html: string;
  as?: SafeHtmlTag;
  /** User-generated content — links get rel="ugc nofollow noopener noreferrer". */
  ugc?: boolean;
};

/**
 * Drop-in replacement for `dangerouslySetInnerHTML` that runs every payload
 * through DOMPurify first. Memoizes per `html` string so repeated re-renders
 * skip the sanitize pass.
 */
export function SafeHtml({ html, as: Tag = "div", ugc, ...rest }: SafeHtmlProps) {
  const safe = useMemo(() => sanitizeHtml(html, { ugc }), [html, ugc]);
  return createElement(Tag, { ...rest, dangerouslySetInnerHTML: { __html: safe } });
}
