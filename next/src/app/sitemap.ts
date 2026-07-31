import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/shared/i18n";
import { buildAlternates, localeUrl } from "@/shared/seo";

// Sitemap (FND-003 foundation, first rows added by WEB-001). Only indexable routes that
// exist in next/ may be listed (SPEC §17). Home: priority 1.0 weekly — parity with
// scripts/generate-sitemap.ts. Further route families append with their slices; CMS-driven
// entries (blog/jobs) join via GET /sitemap with theirs. Full Vite parity is the M9/M10 gate.
const INDEXABLE_ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  // WEB-002 / WEB-007. Priorities mirror scripts/generate-sitemap.ts: a service page ranks
  // above a legal document. These are listed unconditionally because the route exists in
  // next/ and is structurally indexable; a locale whose CMS content is empty still emits
  // `robots: noindex` from its own generateMetadata, which is the authority crawlers honor.
  { path: "/thg-fulfill", changeFrequency: "weekly", priority: 0.9 },
  { path: "/policy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/shipping-policy", changeFrequency: "monthly", priority: 0.5 },
  // WEB-005 / WEB-006 index routes. Article and job DETAIL URLs are not listed here: their
  // slugs are CMS-owned and change without a build, so enumerating them in a static sitemap
  // would go stale. They are reachable from these indexes, which is what a crawler follows.
  // A CMS-driven detail sitemap is the M9 job (GET /sitemap already exposes the blog feed).
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/careers", changeFrequency: "weekly", priority: 0.6 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.flatMap((route) =>
    SUPPORTED_LOCALES.map((lang) => ({
      url: localeUrl(lang, route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages: buildAlternates(lang, route.path).languages },
    })),
  );
}
