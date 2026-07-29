import type { Locale } from "./config/locales";

// Platform localized-value primitive (domain-neutral). A `LocalizedText` is one string translated
// into every supported locale — the same shape marketing-copy.ts models inline as `CopyEntry`,
// lifted here so feature-local copy modules can author and resolve localized content without
// repeating a full copy tree per locale. It carries NO domain names; feature meaning lives in the
// feature that composes these values.

/** A string present in every supported locale. The `Record<Locale, …>` type guarantees, at compile
 *  time, that no locale is missing — so a lookup never silently returns another language. */
export type LocalizedText = Readonly<Record<Locale, string>>;

/** Author a LocalizedText positionally in SUPPORTED_LOCALES order (vi, en, zh). Requiring all three
 *  arguments makes locale completeness a call-site guarantee. */
export function tr(vi: string, en: string, zh: string): LocalizedText {
  return { vi, en, zh };
}

/** Resolve a LocalizedText to a single locale. Intentionally has NO cross-locale fallback: the type
 *  already requires every locale, so this cannot produce mixed-language output. */
export function localize(locale: Locale, text: LocalizedText): string {
  return text[locale];
}
