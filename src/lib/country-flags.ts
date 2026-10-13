/**
 * THG-CAT-005: resolver cờ + tên quốc gia ĐỘNG (auto mọi nước theo ISO).
 * Cờ sinh thuật toán từ mã ISO 2 chữ; tên đa ngữ (en/vi/zh) từ
 * `Intl.DisplayNames` (CLDR native trình duyệt, KHÔNG cần dependency ngoài).
 * KHÔNG hardcode danh sách nước — thêm nước mới ở Backend là tự hiện cờ + tên.
 */

type Lang = "en" | "vi" | "zh";

// Mã ops hay nhập nhưng KHÔNG phải ISO alpha-2 chuẩn → map sang ISO.
const ALIAS: Record<string, string> = { UK: "GB" };
// Thực thể không phải ISO country (vd EU) → cờ + tên riêng.
const SPECIAL_FLAG: Record<string, string> = { EU: "\u{1F1EA}\u{1F1FA}" };
const SPECIAL_NAME: Record<string, Record<Lang, string>> = {
  EU: { en: "European Union", vi: "Liên minh Châu Âu", zh: "欧盟" },
};

// Cache 1 instance / locale (Intl.DisplayNames không rẻ để tạo lại mỗi lần).
const displayNamesCache = new Map<Lang, Intl.DisplayNames | null>();
function getDisplayNames(locale: Lang): Intl.DisplayNames | null {
  if (displayNamesCache.has(locale)) return displayNamesCache.get(locale)!;
  let dn: Intl.DisplayNames | null = null;
  try {
    dn = new Intl.DisplayNames([locale], { type: "region" });
  } catch {
    dn = null; // môi trường không hỗ trợ → fallback mã
  }
  displayNamesCache.set(locale, dn);
  return dn;
}

export function normalizeCountryCode(code: string): string {
  const c = (code || "").trim().toUpperCase();
  return ALIAS[c] ?? c;
}

/** Mã ISO 2 chữ → cờ emoji. Mã lạ → cờ trắng. */
export function countryFlag(code: string): string {
  const raw = (code || "").trim().toUpperCase();
  if (SPECIAL_FLAG[raw]) return SPECIAL_FLAG[raw];
  const c = normalizeCountryCode(raw);
  if (!/^[A-Z]{2}$/.test(c)) return "\u{1F3F3}\u{FE0F}";
  return [...c].map((ch) => String.fromCodePoint(0x1f1e6 + ch.charCodeAt(0) - 65)).join("");
}

/** Mã quốc gia → tên đa ngữ. Fallback = mã. */
export function countryName(code: string, locale: Lang = "vi"): string {
  const raw = (code || "").trim();
  if (!raw) return "";
  const upper = raw.toUpperCase();
  if (SPECIAL_NAME[upper]) return SPECIAL_NAME[upper][locale];
  const c = normalizeCountryCode(upper);
  if (!/^[A-Z]{2}$/.test(c)) return upper;
  const dn = getDisplayNames(locale);
  try {
    return dn?.of(c) || upper;
  } catch {
    return upper;
  }
}

export interface OriginGroup {
  /** Canonical ISO code shown to the user (UK → GB). */
  code: string;
  /** Raw Hub values that normalize to `code`, largest count first. */
  rawKeys: string[];
  count: number;
}

/** Collapse Hub origin counts that name the same country (e.g. "GB" + "UK",
 *  or a stray lowercase/space variant) into one row per country, sorted by
 *  count. Empty and "Unknown" keys are dropped, as the rail always did. */
export function groupOriginCounts(counts: Record<string, number>): OriginGroup[] {
  const groups = new Map<string, OriginGroup>();
  for (const [raw, n] of Object.entries(counts)) {
    if (!raw || raw.trim() === "" || raw === "Unknown" || !(n > 0)) continue;
    const code = normalizeCountryCode(raw);
    const group = groups.get(code) ?? { code, rawKeys: [], count: 0 };
    group.rawKeys.push(raw);
    group.count += n;
    groups.set(code, group);
  }
  const out = [...groups.values()];
  for (const g of out) g.rawKeys.sort((a, b) => (counts[b] || 0) - (counts[a] || 0));
  return out.sort((a, b) => b.count - a.count);
}
