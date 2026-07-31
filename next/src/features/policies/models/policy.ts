// Landing-domain policy models (WEB-007 §7). Plain data, zero imports (FND-005).
//
// The CMS owns policy authority; these are the ONLY shapes the UI sees. Wire names
// (`body_md`, `image_list`, `text_blocks`, `position`) stop at the mapper.

/** A typed paragraph group inside a text-mode policy. `tone` drives the callout style —
 *  it is presentation intent from the editor, not arbitrary markup. */
export interface PolicyTextBlock {
  /** Mapper-owned stable identity (policy slug + normalized heading). Two blocks may share a
   *  heading, so repeats are disambiguated rather than deduplicated. */
  id: string;
  tone: "normal" | "warn" | "info";
  heading: string;
  /** Each paragraph carries its own stable id — the array index is positional and would
   *  re-key every later paragraph when one is inserted above it. */
  paragraphs: readonly { id: string; text: string }[];
}

/** In-page navigation entry. `anchor` is the fragment this section is reachable at. */
export interface PolicySummary {
  slug: string;
  title: string;
  /** Emoji or the literal "tiktok" sentinel the icon renderer understands; null → default. */
  icon: string | null;
  mode: "image" | "text";
  summary: string | null;
}

/** One fully-loaded policy section rendered on the page. */
export interface PolicyDetail {
  slug: string;
  title: string;
  icon: string | null;
  mode: "image" | "text";
  /** Scanned page images (image-mode policies). Absolute CMS media URLs. */
  images: readonly string[];
  /** Structured prose (text-mode policies). */
  blocks: readonly PolicyTextBlock[];
  /** Raw markdown body. Empty string when the CMS row has none. */
  bodyMarkdown: string;
  summary: string | null;
}

/** True when this policy carries nothing a visitor can read in the requested locale.
 *  Drives the honest empty state AND the noindex decision (OQ-P-001 is unresolved, so a
 *  locale with no approved body must not be indexed as if it had content). */
export function isPolicyContentEmpty(policy: PolicyDetail): boolean {
  return (
    policy.images.length === 0 &&
    policy.blocks.length === 0 &&
    policy.bodyMarkdown.trim().length === 0
  );
}

/** Page outcome. `empty` is a CONFIRMED empty policy set; `unavailable` is a CMS failure.
 *  They are separate so an outage never renders as "no policies published yet". */
export type PolicyPageResult =
  | { status: "ready"; policies: readonly PolicyDetail[] }
  | { status: "empty"; policies: readonly PolicyDetail[] }
  | {
      status: "unavailable";
      policies: readonly PolicyDetail[];
      reason: "http" | "contract" | "network";
    };
