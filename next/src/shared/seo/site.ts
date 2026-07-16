import { publicEnv } from "@/shared/config/env.public";
import type { Locale } from "@/shared/i18n";

// The single canonical source of the production site origin (FND-003 SPEC §6, CONTRACTS
// "Locale and metadata"). Every canonical, hreflang, Open Graph, robots and sitemap URL is
// built from here — route files never hardcode the production domain.

const DEFAULT_SITE_ORIGIN = "https://thgfulfill.com";

/** Resolve and normalize the public site origin (`NEXT_PUBLIC_SITE_URL`, default production
 *  origin). A malformed or non-HTTP(S) configured value fails loud; the value is not echoed
 *  into the error. */
export function resolveSiteOrigin(raw: string | undefined = publicEnv.siteUrl): string {
  const origin = (raw && raw.trim()) || DEFAULT_SITE_ORIGIN;
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    throw new Error("Invalid NEXT_PUBLIC_SITE_URL: not a valid URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Invalid NEXT_PUBLIC_SITE_URL: must be an http(s) URL");
  }
  return url.origin;
}

/** Locale-prefixed path for a locale-less base path: ("vi", "/") → "/vi";
 *  ("en", "/blog") → "/en/blog". Never double-slashes, never trailing-slashes the root. */
export function localePath(lang: Locale, path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return p === "/" ? `/${lang}` : `/${lang}${p.replace(/\/+$/, "")}`;
}

/** Absolute locale URL on the canonical origin. */
export function localeUrl(lang: Locale, path = "/", origin: string = resolveSiteOrigin()): string {
  return `${origin}${localePath(lang, path)}`;
}
