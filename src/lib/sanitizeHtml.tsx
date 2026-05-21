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

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "class", "className", "style"];

export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
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
};

/**
 * Drop-in replacement for `dangerouslySetInnerHTML` that runs every payload
 * through DOMPurify first. Memoizes per `html` string so repeated re-renders
 * skip the sanitize pass.
 */
export function SafeHtml({ html, as: Tag = "div", ...rest }: SafeHtmlProps) {
  const safe = useMemo(() => sanitizeHtml(html), [html]);
  return createElement(Tag, { ...rest, dangerouslySetInnerHTML: { __html: safe } });
}
