import type { MetadataRoute } from "next";

// Sitemap foundation (FND-003). Only routes that exist in next/ AND are indexable may be
// listed — leaked noindex URLs fail the SEO gate (SPEC §17), and the only existing route is
// the deliberately-noindex [lang] foundation page, so the sitemap is valid and empty.
//
// ponytail: WEB-001 adds the home rows when the real homepage lands — one entry per locale:
// { url: localeUrl(lang, "/"), changeFrequency: "weekly", priority: 1.0,
//   alternates: { languages: buildAlternates(lang, "/").languages } }
// (parity structure: scripts/generate-sitemap.ts). CMS-driven entries (blog/jobs) join with
// their slices; full parity with the Vite sitemap is the M9/M10 gate.
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
