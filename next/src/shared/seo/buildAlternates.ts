import { SUPPORTED_LOCALES, DEFAULT_LOCALE, HTML_LANG, type Locale } from "@/shared/i18n";
import { localeUrl, resolveSiteOrigin } from "./site";

// Canonical + hreflang set for an editorial route (FND-003 CONTRACTS "Locale and metadata";
// parity: src/components/seo/SeoHead.tsx). hreflang codes come from the FND-002 HTML_LANG
// mapping (zh → zh-CN); x-default points at the default locale (/vi).

export interface AlternateLinkSet {
  canonical: string;
  /** hreflang code → absolute URL, including x-default. */
  languages: Record<string, string>;
}

export function buildAlternates(lang: Locale, path = "/"): AlternateLinkSet {
  const origin = resolveSiteOrigin();
  const languages: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    languages[HTML_LANG[locale]] = localeUrl(locale, path, origin);
  }
  languages["x-default"] = localeUrl(DEFAULT_LOCALE, path, origin);
  return { canonical: localeUrl(lang, path, origin), languages };
}
