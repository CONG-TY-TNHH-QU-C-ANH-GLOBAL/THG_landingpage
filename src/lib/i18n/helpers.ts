// Pure i18n helpers. Keep this file React-free.

import type { Language } from "./types";

// Compact constructor for a single locale triple — keeps large blocks of
// entries from tripping the copy-paste detector on the repeated
// `{ en, vi, zh }` object skeleton.
export const tr = (en: string, vi: string, zh: string): Record<Language, string> => ({ en, vi, zh });
