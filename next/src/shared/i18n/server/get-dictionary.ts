import "server-only";

import { assertSupportedLocale, SUPPORTED_LOCALES, type Locale } from "../config/locales";
import { dictionarySchema } from "../schemas/dictionary.schema";
import type { ReadonlyDictionary } from "../model/dictionary";
import vi from "../dictionaries/vi.json";
import en from "../dictionaries/en.json";
import zh from "../dictionaries/zh.json";

// Server-only. Local dictionaries only — no CMS, no network. Each file is validated ONCE at
// module load (a malformed/incomplete locale file fails the build/tests, not a request), then
// frozen. `getDictionary` is a pure map lookup — no per-render re-parse, no duplicate load.
const RAW: Readonly<Record<Locale, unknown>> = { vi, en, zh };

const DICTIONARIES: Readonly<Record<Locale, ReadonlyDictionary>> = Object.freeze(
  Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, Object.freeze(dictionarySchema.parse(RAW[locale]))]),
  ) as Record<Locale, ReadonlyDictionary>,
);

/** Return the read-only dictionary for a locale. Throws on an unsupported locale. */
export function getDictionary(locale: Locale): ReadonlyDictionary {
  return DICTIONARIES[assertSupportedLocale(locale)];
}
