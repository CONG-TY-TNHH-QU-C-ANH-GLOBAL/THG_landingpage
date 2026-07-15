import { DEFAULT_LOCALE, isSupportedLocale } from "./locales";

// Pure, request-safe URL mechanics for locale routing. No I/O, no framework imports — this
// is the only i18n module `proxy.ts` depends on. The approved route contract uses a
// permanent, method-preserving redirect.
export const LOCALE_REDIRECT_STATUS = 308 as const;

export interface LocaleRouteDecision {
  readonly kind: "pass" | "redirect";
  /** Redirect target pathname (no query — the caller preserves the query string). */
  readonly location?: string;
}

/**
 * Decide the locale routing action for a pathname (no query):
 * - `/`                          → redirect to `/{default}`
 * - `/{supported}/...`           → pass
 * - `/{unsupported 2-letter}/..` → redirect to `/{default}{rest}` (normalize, parity with Vite)
 * - anything else                → pass (falls through to Next routing / real 404)
 *
 * Never emits a target that itself redirects → no redirect loop.
 */
export function decodeLocaleRoute(pathname: string): LocaleRouteDecision {
  if (pathname === "/") {
    return { kind: "redirect", location: `/${DEFAULT_LOCALE}` };
  }

  const segments = pathname.split("/"); // "/en/x" → ["", "en", "x"]
  const first = segments[1] ?? "";

  if (isSupportedLocale(first)) {
    return { kind: "pass" };
  }

  if (/^[a-z]{2}$/i.test(first)) {
    const rest = segments.slice(2).join("/");
    const location = rest ? `/${DEFAULT_LOCALE}/${rest}` : `/${DEFAULT_LOCALE}`;
    return { kind: "redirect", location };
  }

  return { kind: "pass" };
}
