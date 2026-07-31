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

/** Longest id fragment kept from an item's content. */
const MAX_LENGTH = 64;

/** Single-character alphanumeric test. A class with NO quantifier cannot backtrack, so this is
 *  O(1) per call and keeps the exact Unicode semantics of the previous `\p{Letter}\p{Number}`
 *  classes — an accented or CJK heading normalizes the same way it did before. */
const ALPHANUMERIC_CHAR = /[\p{Letter}\p{Number}]/u;

/**
 * Lowercase, collapse every run of non-alphanumeric characters to a single `-`, drop leading
 * and trailing separators, and bound the length. Not a URL slug — only local key stability, so
 * it just has to be deterministic and collision-resistant within one small list.
 *
 * Written as ONE forward pass. It replaces
 * `.replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-+|-+$/g, "")`, whose second pattern
 * is polynomial: `-+$` is a greedy quantifier anchored to the end, so a global scan retries it
 * at every position of a long dash run. The scanner never revisits a position, so it is linear
 * by construction rather than a re-tuned regex.
 *
 * Output is byte-identical to the previous implementation — a differential test in
 * tests/unit/stable-id.test.ts asserts that over generated inputs.
 */
function normalize(value: string): string {
  const lower = value.normalize("NFKD").toLowerCase();
  const out: string[] = [];
  let separatorPending = false;

  // Iterating the string yields CODE POINTS, matching the `u`-flagged patterns this replaces.
  for (const ch of lower) {
    if (!ALPHANUMERIC_CHAR.test(ch)) {
      // A run of separators collapses to one, and a leading run is dropped because nothing has
      // been emitted yet. A trailing run is dropped by never being flushed.
      separatorPending = true;
      continue;
    }
    if (separatorPending && out.length > 0) out.push("-");
    separatorPending = false;
    out.push(ch);
    // Everything past the cap would be discarded anyway, so the scan can stop — which also
    // bounds the work on a very long paragraph. One iteration can emit a separator AND a
    // character, so this may overshoot by one; the slice below is what actually enforces the
    // cap, exactly as the previous `.slice(0, 64)` did.
    if (out.length >= MAX_LENGTH) break;
  }

  return out.join("").slice(0, MAX_LENGTH);
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
