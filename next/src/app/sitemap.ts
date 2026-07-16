import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/shared/i18n";
import { buildAlternates, localeUrl } from "@/shared/seo";

// Sitemap foundation (FND-003). Each entry expands to one URL per locale with the canonical
// hreflang alternates (parity structure: scripts/generate-sitemap.ts). Only routes that exist
// in next/ AND are indexable may be listed — leaked noindex URLs fail the SEO gate (SPEC §17).
//
// ponytail: empty today — the [lang] foundation page is deliberately noindex (FND-002
// placeholder). WEB-001 adds { path: "/", changeFrequency: "weekly", priority: 1.0 } with the
// real homepage; later route families append their rows; CMS-driven entries (blog/jobs) join
// with their slices via GET /sitemap. Full parity with the Vite sitemap is the M9/M10 gate.
interface IndexableRoute {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}

const INDEXABLE_ROUTES: readonly IndexableRoute[] = [];

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
