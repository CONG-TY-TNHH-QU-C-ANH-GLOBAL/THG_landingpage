// The static (fallback) dictionary, assembled at runtime from the domains the
// loaded code actually uses. Keep this file React-free.
//
// Shell domains (nav, contact, common, seo) are registered by the provider.
// Every other domain file registers itself when imported, and each module that
// uses its keys imports it — so a page's copy ships in that page's chunk
// instead of all 1,300 keys in the entry bundle. i18nDomains.test.ts fails if
// a module uses a key from a domain it does not import.

import type { Language, TranslationDict } from "./types";

const dictionary: TranslationDict = {};

export function registerTranslations(dict: TranslationDict): void {
    Object.assign(dictionary, dict);
}

/** The locale's string, else English, else undefined (the caller shows the key). */
export function lookupStatic(key: string, language: Language): string | undefined {
    const entry = dictionary[key];
    return entry ? entry[language] || entry.en || undefined : undefined;
}
