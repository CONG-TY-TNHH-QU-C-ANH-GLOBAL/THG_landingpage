import type { Locale } from "@/shared/i18n";

// Server-side only by construction: these dates are rendered in Server Components and
// never re-rendered on the client, so there is no Node-vs-browser ICU hydration risk.

const DATE_LOCALES: Readonly<Record<Locale, string>> = Object.freeze({
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
});

/** null publishedAt renders no date at all rather than an epoch fallback. */
export function formatPublishedAt(millis: number | null, lang: Locale): string | null {
  return millis === null ? null : new Date(millis).toLocaleDateString(DATE_LOCALES[lang]);
}
