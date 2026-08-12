import type { Locale } from "./config/locales";

// Country code → flag + localized name. Ported verbatim in behaviour from the Vite
// resolver [src/lib/country-flags.ts, THG-CAT-005]; only the `Lang` type is swapped for
// the shared `Locale`. Kept algorithmic on purpose: flags are derived from the ISO code
// and names come from `Intl.DisplayNames` (CLDR, built into the runtime), so a new origin
// added on the Hub renders correctly with no frontend change and no dependency.

/** Codes ops enter that are not ISO alpha-2 → their ISO equivalent. */
const ALIAS: Record<string, string> = { UK: "GB" };
/** Non-country entities that still need a flag/name. */
const SPECIAL_FLAG: Record<string, string> = { EU: "\u{1F1EA}\u{1F1FA}" };
const SPECIAL_NAME: Record<string, Record<Locale, string>> = {
  EU: { vi: "Liên minh Châu Âu", en: "European Union", zh: "欧盟" },
};

// One Intl.DisplayNames instance per locale — construction is not cheap enough to repeat
// per product card.
const displayNamesCache = new Map<Locale, Intl.DisplayNames | null>();
function getDisplayNames(locale: Locale): Intl.DisplayNames | null {
  const cached = displayNamesCache.get(locale);
  if (cached !== undefined) return cached;
  let dn: Intl.DisplayNames | null = null;
  try {
    dn = new Intl.DisplayNames([locale], { type: "region" });
  } catch {
    dn = null; // runtime without region display names → fall back to the raw code
  }
  displayNamesCache.set(locale, dn);
  return dn;
}

export function normalizeCountryCode(code: string): string {
  const c = code.trim().toUpperCase();
  return ALIAS[c] ?? c;
}

/** ISO alpha-2 → flag emoji. Unknown code → white flag, never an empty box. */
export function countryFlag(code: string): string {
  const raw = code.trim().toUpperCase();
  if (SPECIAL_FLAG[raw]) return SPECIAL_FLAG[raw];
  const c = normalizeCountryCode(raw);
  if (!/^[A-Z]{2}$/.test(c)) return "\u{1F3F3}\u{FE0F}";
  return [...c].map((ch) => String.fromCodePoint(0x1f1e6 + ch.charCodeAt(0) - 65)).join("");
}

/** Country code → localized name. Falls back to the uppercased code, never to another language. */
export function countryName(code: string, locale: Locale): string {
  const raw = code.trim();
  if (!raw) return "";
  const upper = raw.toUpperCase();
  if (SPECIAL_NAME[upper]) return SPECIAL_NAME[upper][locale];
  const c = normalizeCountryCode(upper);
  if (!/^[A-Z]{2}$/.test(c)) return upper;
  try {
    return getDisplayNames(locale)?.of(c) || upper;
  } catch {
    return upper;
  }
}
