import type { Metadata } from "next";

import { buildPageMetadata } from "@/shared/seo";
import type { Locale } from "@/shared/i18n";

// Community indexability is ON HOLD pending OQ-P-002.
//
// Community UGC has no locale dimension: one Vietnamese question is served under all
// three locale prefixes. OQ-P-002 lists five candidate policies for that situation
// (Vietnamese-only indexability; EN/ZH shells noindex; canonical-to-Vietnamese;
// human-approved localized summaries; a localized UGC data model) and explicitly selects
// NONE of them. It also records that three independently indexable, self-canonical
// duplicates are not approved. COM-001 and COM-002 are both status: DRAFT.
//
// So this emits the only posture that commits to no candidate:
//   - robots: noindex, nofollow on every community route, in every locale;
//   - NO canonical and NO hreflang alternates at all — a self-canonical per locale would
//     itself be picking the unapproved three-duplicate policy, and a noindex page needs
//     no canonical;
//   - no community entries in the sitemap (see app/sitemap.ts).
//
// The CMS `indexable` flag is still carried end to end through the model, so enabling the
// approved policy later is a change to this one function, not a re-architecture.
//
// ponytail: single choke point on purpose — flip it here once OQ-P-002 is decided.
export function buildCommunityMetadata(input: {
  lang: Locale;
  routeId: string;
  title: string;
  description: string;
}): Metadata {
  const base = buildPageMetadata({ ...input, indexable: false });
  return { ...base, alternates: undefined };
}

/** Safe meta description from user-generated text: whitespace collapsed, hard-capped.
 *  Operates on plain text — the Vite version sliced raw HTML, which could emit a
 *  half-open tag into the description. */
export function safeDescription(text: string, fallback: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (!flat) return fallback;
  return flat.length > 160 ? `${flat.slice(0, 157)}…` : flat;
}
