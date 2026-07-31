import type { Locale } from "@/shared/i18n";

// The one code-owned registry of route templates eligible for the sitemap.
//
// The sitemap test used to assert "exactly the 3 home rows". Adding indexable routes made it
// fail, and the tempting fix — change 3 to 12 — swaps one brittle magic number for another:
// it says nothing about WHICH routes are listed and would keep passing if a blocked route
// were added by mistake. The registry is the contract instead, and the test expands it.
//
// ADMISSION RULE. A template belongs here only when its `page.tsx` EXISTS in next/ and the
// route is approved for indexing. A route that is BLOCKED_BY_CONTRACT, DEFERRED_BY_OWNER or
// LEGACY_ONLY_PENDING_DECISION must not enter, because listing it tells a crawler the URL is
// live. `06-migration/09-next-route-completion-status.csv` in the specs workspace is the
// inventory this mirrors; `blocked` below records the routes deliberately kept out so the
// omission is visible rather than silent.
//
// Per-locale indexability is NOT decided here. A route whose CMS content is empty in one
// locale still emits `robots: noindex` from its own generateMetadata, and that is the
// authority a crawler honors. The registry answers "does this route exist and may it be
// listed at all".
//
// DYNAMIC ENTRIES ARE SEPARATE. Blog article and job URLs are CMS-owned and change without a
// build, so they are not static templates and are not listed here — a stale static enumeration
// is worse than none. A CMS-driven detail sitemap is the M9 job (GET /sitemap already exposes
// the blog feed).

export interface IndexableRoute {
  /** Locale-less path. "/" is the homepage. */
  path: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
}

export const INDEXABLE_ROUTES: readonly IndexableRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  // Service pages rank above legal documents — parity with scripts/generate-sitemap.ts.
  { path: "/thg-fulfill", changeFrequency: "weekly", priority: 0.9 },
  { path: "/policy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/shipping-policy", changeFrequency: "monthly", priority: 0.5 },
  // WEB-005 / WEB-006 INDEX routes only. Article and job detail URLs are CMS-owned and change
  // without a build, so they are not static templates — see the header note.
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/careers", changeFrequency: "weekly", priority: 0.6 },
  // WEB-002 service routes.
  { path: "/thg-express", changeFrequency: "weekly", priority: 0.9 },
  { path: "/thg-warehouse", changeFrequency: "weekly", priority: 0.9 },
  { path: "/thg-order", changeFrequency: "weekly", priority: 0.9 },
  // WEB-008. Listed because the route's own content — where tracking lives and how to reach
  // it — is complete and true regardless of the Hub link, unlike a CMS-backed page with no
  // content. The Hub itself is not indexed from here.
  { path: "/tracking", changeFrequency: "monthly", priority: 0.4 },
];

/** Routes deliberately NOT in the registry, and why. Asserted by the sitemap test so a blocked
 *  route cannot be admitted quietly, and so this list cannot rot into a stale comment. */
export const NON_INDEXABLE_ROUTES: Readonly<Record<string, string>> = {
  "/community": "UGC indexability policy unresolved (OQ-P-002)",
  "/community/reviews": "UGC indexability policy unresolved (OQ-P-002)",
  "/catalog": "BLOCKED_BY_CONTRACT — separate Hub catalog API, no frozen contract (PF-013)",
  "/international-pricing": "BLOCKED_BY_CONTRACT — rate-card source ownership unverified",
  "/domestic-pricing": "BLOCKED_BY_CONTRACT — rate-card source ownership unverified",
};

/** Every absolute URL the sitemap lists, as `template x locale`. */
export function expandIndexableRoutes(
  locales: readonly Locale[],
  toUrl: (lang: Locale, path: string) => string,
): { lang: Locale; route: IndexableRoute; url: string }[] {
  return INDEXABLE_ROUTES.flatMap((route) =>
    locales.map((lang) => ({ lang, route, url: toUrl(lang, route.path) })),
  );
}
