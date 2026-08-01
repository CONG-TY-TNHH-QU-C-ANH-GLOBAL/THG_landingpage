// How a CMS date column becomes a machine-readable value.
//
// Several CMS date fields are free-text (`published_date`, `deadline`), so what arrives is
// whatever an operator typed. Both features were checking validity at the point of use and
// getting it subtly wrong in different ways: the blog route tested `/^\d{4}-\d{2}-\d{2}$/` in
// JSX, which accepts the non-existent `2026-02-30`, and the careers route tested
// `!Number.isNaN(Date.parse(...))`, which accepts `01/01/2030` and then renders it through
// `new Date(...).toISOString()` — parsed as LOCAL midnight, so in Asia/Ho_Chi_Minh the emitted
// `validThrough` was 2029-12-31, a day early. A posting can be advertised as already closed.
//
// One rule, stated once: the value must be `YYYY-MM-DD` AND survive a UTC round-trip, which is
// what rejects impossible calendar dates. Anything else is not a date this app will claim.

const ISO_DATE_SHAPE = /^\d{4}-\d{2}-\d{2}$/;

/** The value as a machine-readable ISO date, or null when it is not one. */
export function isoDateOrNull(value: string | null | undefined): string | null {
  const raw = value?.trim() ?? "";
  if (!ISO_DATE_SHAPE.test(raw)) return null;
  // Anchored to UTC so the result never shifts across a timezone, and compared back so
  // `2026-02-30` — which JS rolls forward to March 2 — is rejected rather than silently moved.
  const parsed = new Date(`${raw}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== raw ? null : raw;
}
