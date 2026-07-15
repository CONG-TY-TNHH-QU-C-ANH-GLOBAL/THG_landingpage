// Single source of truth for supported locales (FND-002). Everything — routing, dictionary
// loading and static params — derives the canonical `Locale` type and checks from here.
// Values are read-only; no mutable arrays are exposed.
export const SUPPORTED_LOCALES = ["vi", "en", "zh"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "vi";

/** `<html lang>` value per locale (zh → zh-CN, parity with the current Vite app). */
export const HTML_LANG: Readonly<Record<Locale, string>> = Object.freeze({
  vi: "vi",
  en: "en",
  zh: "zh-CN",
});

/** Type guard — the one canonical supported-locale check. */
export function isSupportedLocale(value: unknown): value is Locale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Safe parser — returns the narrowed `Locale` or throws (no silent fallback). */
export function assertSupportedLocale(value: unknown): Locale {
  if (!isSupportedLocale(value)) {
    throw new Error(`Unsupported locale: ${String(value)}`);
  }
  return value;
}
