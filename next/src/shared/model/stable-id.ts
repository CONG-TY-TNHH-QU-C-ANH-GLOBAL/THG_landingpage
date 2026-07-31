// Stable identities for CMS arrays that carry no id of their own.
//
// Several CMS collections are plain string arrays or unkeyed objects — policy paragraphs,
// route notes, rate-table rows. Rendering them needs a React key, and the array index is the
// wrong answer: it is positional, so inserting one row at the top re-keys everything below it
// and React reconciles the wrong nodes. Renaming the index to `idx` or `position` does not
// change that.
//
// The identity here is DOMAIN SCOPE + NORMALIZED CONTENT: an item keeps its key when the list
// is reordered or something is inserted above it, and only changes when its own text changes.
//
// Duplicates are handled EXPLICITLY rather than deduplicated. Two identical policy paragraphs
// are legitimate business content — a document may repeat a sentence — so the second
// occurrence gets a `~2` suffix instead of being dropped or silently colliding. Removing
// business content to obtain a React key would be the wrong trade.

/** Lowercase, collapse whitespace, strip anything that is not alphanumeric or a separator, and
 *  bound the length. Not a slug for a URL — only for local key stability, so the transform
 *  only has to be deterministic and collision-resistant enough within one small list. */
function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export interface Identified<T> {
  id: string;
  value: T;
}

/**
 * Attach a stable id to each item of a list.
 *
 * `scope` is the surrounding domain identity (a policy slug, a route slug plus table index —
 * anything already unique on the page), so ids never collide across sections.
 * `contentOf` extracts the text that defines the item; items whose content normalizes
 * identically are disambiguated in order.
 */
export function withStableIds<T>(
  scope: string,
  items: readonly T[],
  contentOf: (item: T) => string,
): Identified<T>[] {
  const seen = new Map<string, number>();
  return items.map((value) => {
    const base = normalize(contentOf(value)) || "item";
    const nth = (seen.get(base) ?? 0) + 1;
    seen.set(base, nth);
    // First occurrence keeps the clean id; repeats are numbered rather than dropped.
    return { id: nth === 1 ? `${scope}:${base}` : `${scope}:${base}~${nth}`, value };
  });
}

/** The common case: a list of plain strings. */
export function withStableStringIds(
  scope: string,
  items: readonly string[],
): Identified<string>[] {
  return withStableIds(scope, items, (s) => s);
}
