// Locale-resolved marketing copy for the ported Vite components (WEB-001). The resolution
// chain (CMS overlay → static[lang] → static.en → key) happens server-side in
// `server/get-marketing-copy`; components receive the flat resolved map — serializable, so
// client islands can take it as a prop. Parity source: src/lib/i18n/index.tsx.

export type MarketingCopy = Readonly<Record<string, string>>;

/** The `t()` the ported components use: resolved value or the key itself (parity). */
export function tFrom(copy: MarketingCopy): (key: string) => string {
  return (key) => copy[key] ?? key;
}
