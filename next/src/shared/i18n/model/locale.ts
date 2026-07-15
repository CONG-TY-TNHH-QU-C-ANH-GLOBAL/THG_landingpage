import type { Locale } from "../config/locales";

// Landing-domain locale types built on the canonical `Locale` (config/locales.ts). No locale
// arrays are duplicated here — only the route-param shape consumers use.
export type { Locale };

/** Route params for the `[lang]` segment (validated before use). */
export interface LocaleRouteParams {
  readonly lang: Locale;
}
