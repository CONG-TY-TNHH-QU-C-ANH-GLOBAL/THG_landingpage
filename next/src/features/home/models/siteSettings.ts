// Site-wide contact/settings model (FND-005). Link derivations are precomputed in the
// mapper (parity: FloatingContact.tsx:21-35,57-60); null hides the corresponding button
// [FACT: WEB-001 SPEC §5 "empty CMS value hides that button"].

export interface SiteSettings {
  /** `tel:+84…` link, or null when the CMS has no usable phone. */
  telUrl: string | null;
  /** `https://zalo.me/84…` link derived from the same phone. */
  zaloUrl: string | null;
  /** `https://m.me/…` derived from the Facebook page URL. */
  messengerUrl: string | null;
  /** Global default for the about video; the homepage EN block overrides it. */
  aboutVideoUrl: string | null;
}
