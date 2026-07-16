import type { Locale } from "../config/locales";

// Landing-domain locale types built on the canonical `Locale` (config/locales.ts). No locale
// arrays are duplicated here — only the route-param shape consumers use.
export type { Locale };

/**
 * RAW route params for the `[lang]` segment. `lang` is the unvalidated URL segment typed as
 * `string` — it becomes a `Locale` only after `isSupportedLocale` narrows it. Do not model
 * incoming route data as `Locale`.
 */
export interface LocaleRouteParams {
  readonly lang: string;
}
