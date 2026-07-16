import "server-only";

import { assertSupportedLocale, SUPPORTED_LOCALES, type Locale } from "../config/locales";
import { dictionarySchema } from "../schemas/dictionary.schema";
import type { ReadonlyDictionary } from "../model/dictionary";
import vi from "../dictionaries/vi.json";
import en from "../dictionaries/en.json";
import zh from "../dictionaries/zh.json";

// Server-only. Local dictionaries only — no CMS, no network. Each file is validated ONCE at
// module load (a malformed/incomplete locale file fails the build/tests, not a request), then
// deeply frozen. `getDictionary` is a pure map lookup — no per-render re-parse, no duplicate load.
const RAW: Readonly<Record<Locale, unknown>> = { vi, en, zh };

// Dictionary-specific deep freeze (not a broad generic helper): freezes the nested objects so
// the shared cache cannot be mutated through `.meta` / `.foundation`.
function freezeDictionary(dict: ReadonlyDictionary): ReadonlyDictionary {
  Object.freeze(dict.meta);
  Object.freeze(dict.foundation);
  return Object.freeze(dict);
}

const DICTIONARIES: Readonly<Record<Locale, ReadonlyDictionary>> = Object.freeze(
  Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, freezeDictionary(dictionarySchema.parse(RAW[locale]))]),
  ) as Record<Locale, ReadonlyDictionary>,
);

/** Return the read-only dictionary for a locale. Throws on an unsupported locale. */
export function getDictionary(locale: Locale): ReadonlyDictionary {
  return DICTIONARIES[assertSupportedLocale(locale)];
}
