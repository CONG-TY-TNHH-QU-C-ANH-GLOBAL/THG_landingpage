// DOM-anchor identity for the blog category sections. Pure, no imports (FND-005).
//
// THE BUG. The list built both sides of the link with `encodeURIComponent(category)` — the href
// as `#${encoded}` and the section as `id={encoded}`. A browser DECODES a fragment before it
// matches an element id, so for "Báo cáo" it navigates to `#B%C3%A1o%20c%C3%A1o`, decodes that
// to `Báo cáo`, and looks for an element whose id is `Báo cáo` — while the element that exists
// has the literal id `B%C3%A1o%20c%C3%A1o`. Every category containing a space or a diacritic —
// which is most of them in the primary locale — had a jump link that went nowhere.
//
// WHY NOT `withStableIds`. That was checked first and it does not fit. It normalizes with NFKD
// and then treats anything non-alphanumeric as a separator, so a combining accent becomes a
// hyphen: "Báo cáo" → "ba-o-ca-o", "Tin tức" → "tin-tu-c". It also passes CJK straight through
// ("新闻" → "新闻"), which puts non-ASCII back into the id and re-opens the same encode/decode
// question. Its own header says what it is for — "Not a URL slug — only local key stability".
// A React key is never parsed by a browser; a fragment is. Different problem, different rule.
//
// THE RULE HERE. Fold diacritics rather than splitting them (NFD, then drop the combining
// marks), map the Vietnamese `đ` explicitly because it is a single code point that NFD does not
// decompose, lowercase, and collapse everything else to single hyphens. That yields
// "bao-cao" and "tin-tuc" — ASCII, readable, and identical whether the browser encodes the
// fragment or not. A label with no ASCII-able content at all (pure CJK, emoji) has no readable
// slug to offer, so it falls back to a short deterministic hash of the original label: still
// stable across builds, still collision-checked, and never empty.
//
// Anchors are allocated ONCE, for the whole group list, so the href and the section id are the
// same string by construction rather than by two calls that must agree.

/** Combining marks left behind by NFD. */
const COMBINING_MARKS = /\p{Mark}/gu;

/** Runs of anything that is not an unaccented ASCII letter or digit. */
const NON_SLUG_RUN = /[^a-z0-9]+/g;

/** FNV-1a. Only needs to be deterministic and well-spread over a handful of category labels —
 *  this is an anchor, not a checksum. */
function hashLabel(label: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < label.length; i += 1) {
    hash ^= label.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

/** The readable part of an anchor for one label, or "" when the label has none. */
function slugify(label: string): string {
  return label
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(NON_SLUG_RUN, "-")
    .replace(/^-+|-+$/g, "");
}

export interface CategoryAnchor<T> {
  /** The operator's label, rendered as written. */
  category: string;
  /** Fragment identity — used verbatim as both the `id` and the `href` fragment. */
  anchorId: string;
  items: readonly T[];
}

/**
 * Allocate one anchor per group, resolving collisions in order.
 *
 * Two distinct labels can share a slug — "Tin tức" and "Tin tuc", or any two CJK labels that
 * both fall back to a hash — so the second and later occurrences are suffixed. Numbering rather
 * than dropping keeps both sections reachable; a jump link that silently pointed at the wrong
 * section would be worse than an ugly fragment.
 */
export function allocateCategoryAnchors<T>(
  groups: readonly (readonly [string, readonly T[]])[],
): CategoryAnchor<T>[] {
  const used = new Map<string, number>();
  return groups.map(([category, items]) => {
    const base = slugify(category) || `c-${hashLabel(category)}`;
    const nth = (used.get(base) ?? 0) + 1;
    used.set(base, nth);
    return { category, anchorId: nth === 1 ? base : `${base}-${nth}`, items };
  });
}
