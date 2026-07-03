// Shared i18n types. Keep this file React-free.

export type Language = "en" | "vi" | "zh";

/** Flat key → per-locale string map ("nav.services" → { en, vi, zh }). */
export type TranslationDict = Record<string, Record<Language, string>>;
