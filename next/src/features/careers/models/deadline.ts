// The application-deadline contract. Pure, no imports (FND-005).
//
// `deadline` is a free-text CMS column and operators fill it in Vietnamese day-first form. The
// approved parity source accepts DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY and ISO YYYY-MM-DD, and
// returns null for anything else, which callers read as "no deadline → always open"
// [FACT: legacy src/lib/deadline.ts:1-19].
//
// WHY THIS IS NOT `isoDateOrNull`. That shared helper is deliberately ISO-only and stays that
// way: it serves the blog's `published_date`, which the CMS emits as YYYY-MM-DD. Day-first
// tolerance is an operator-input concern specific to this column, so it is owned here rather
// than loosened globally where it would also start reinterpreting blog dates.
//
// WHAT WAS BROKEN. Every deadline in the live CMS is DD/MM/YYYY — "30/08/2026", "30/07/2026" —
// and nothing in this app could read them:
//
//   isExpired  called Date.parse("30/07/2026"), which is NaN because there is no month 30, and
//              NaN was treated as "not a date → not expired". So NO job ever expired. Two
//              postings whose deadlines had passed were still rendering as open, still
//              indexable, and still emitting JobPosting structured data.
//   validThrough  came from the ISO-only helper, so it was null for every posting and the
//              property was omitted from all of them.
//
// NO Date ROUND-TRIP. The ISO string is assembled from the matched digits. Legacy built a local
// Date and formatted its local components specifically to avoid `toISOString()` shifting VN
// (UTC+7) midnight back a day [FACT: legacy JobDetailPage.tsx:15-23]; composing the string
// directly has the same result and cannot drift at all.

/** Day-first: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY. Each group is a bounded digit run with no
 *  alternation or nested quantifier, so there is nothing to backtrack over. */
const DAY_FIRST = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/;

/** ISO YYYY-MM-DD. */
const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad = (value: number): string => String(value).padStart(2, "0");

/** True when the numbers name a real calendar day — rejects 2026-02-30 and month 13. */
function isRealDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1) return false;
  // Day 0 of the NEXT month is the last day of this one; no Date arithmetic leaves UTC.
  return day <= new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * The operator's deadline as a machine-readable ISO date, or null when it is not one.
 *
 * Null is not an error state — it is "this operator did not state a machine-readable deadline",
 * and every caller treats that as an open vacancy rather than hiding the post.
 */
export function deadlineIsoFrom(value: string | null | undefined): string | null {
  const raw = value?.trim() ?? "";

  const dayFirst = DAY_FIRST.exec(raw);
  if (dayFirst) {
    const [, d, m, y] = dayFirst;
    return isRealDate(Number(y), Number(m), Number(d))
      ? `${y}-${pad(Number(m))}-${pad(Number(d))}`
      : null;
  }

  const iso = ISO.exec(raw);
  if (iso) {
    const [, y, m, d] = iso;
    return isRealDate(Number(y), Number(m), Number(d)) ? `${y}-${pad(Number(m))}-${pad(Number(d))}` : null;
  }

  return null;
}
