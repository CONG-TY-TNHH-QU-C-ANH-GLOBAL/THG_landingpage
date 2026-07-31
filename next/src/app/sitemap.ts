import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/shared/i18n";
import { buildAlternates, localeUrl } from "@/shared/seo";
import { expandIndexableRoutes } from "@/shared/seo/indexable-routes";

// Sitemap (FND-003). The route templates live in shared/seo/indexable-routes — a route may be
// listed only when its page.tsx exists in next/ and it is approved for indexing, so a blocked
// or deferred route cannot appear. This file only expands templates x locales and attaches the
// hreflang alternate set.
//
// CMS-driven detail URLs (blog articles, jobs) are deliberately absent: their slugs change
// without a build, so a static enumeration would go stale. That is the M9 job.

export default function sitemap(): MetadataRoute.Sitemap {
  return expandIndexableRoutes(SUPPORTED_LOCALES, localeUrl).map(({ lang, route, url }) => ({
    url,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: { languages: buildAlternates(lang, route.path).languages },
  }));
}
