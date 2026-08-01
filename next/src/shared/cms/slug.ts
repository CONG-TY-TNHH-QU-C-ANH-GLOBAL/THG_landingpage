// The slug contract shared by every CMS-backed detail route.
//
// The READ schemas type `slug` as a bare string, so a slug reaches `generateStaticParams` —
// and therefore a generated route param — without ever being checked. The rule below is not
// invented here: it is the CMS's own WRITE-side validation, which is character-for-character
// identical across blog, careers, policies and shipping
// [FACT: CMS blog.actions.ts:41, careers.actions.ts:62 — z.string().min(1).max(200)
// .regex(/^[a-z0-9-]+$/)]. Blog and careers share this module because they demonstrably share
// that contract, not because both fields happen to be called `slug`.
//
// WHAT THIS IS AND IS NOT. It is a routing-safety and contract-conformance check: a value that
// cannot be a single path segment (empty, whitespace, `/`, `\`, `?`, `#`, `%`, `.`, `..`,
// control characters) must never become a route param. It is NOT a quality judgement. A slug
// like `httpsthgfulfillcomvicareers` — a URL an operator pasted into the slug field — is ugly
// CMS data but a perfectly safe path segment, and it passes. Rejecting it would hide a real
// job posting to fix a content problem the landing does not own.
//
// The rule is applied as a FILTER at static-param generation, not as schema rejection. The
// list loaders are deliberately resilient (a CMS outage yields `[]`, and `dynamicParams` covers
// anything unlisted), so failing the whole response over one malformed row would turn a single
// bad record into a blank blog. Dropping that one row from the prerender set is proportionate;
// with `dynamicParams = true` the route still answers if the CMS later serves it.

/** Upper bound from the CMS write contract; keeps a pathological value out of the path. */
const MAX_SLUG_LENGTH = 200;

/** Lowercase alphanumerics and hyphens, one or more. No anchored quantifier that can backtrack:
 *  the class has a single `+` over a character set, which is linear. */
const CMS_SLUG = /^[a-z0-9-]+$/;

/** True when a CMS slug is safe and in-contract to use as a `[slug]` route param. */
export function isRoutableSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= MAX_SLUG_LENGTH && CMS_SLUG.test(slug);
}
