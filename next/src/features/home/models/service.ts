// Home services-grid card (FND-005). Only live services reach this model, already in
// display order — the status filter and position sort live in the mapper
// [FACT: ServicesSection.tsx:112].

export interface Service {
  id: string;
  name: string;
  /** "" when the CMS has no tagline (renders nothing, parity with `s.tagline &&`). */
  tagline: string;
  /** Icon key for the local illustration fallback; "" when unset. */
  icon: string;
  /** Small uppercase tag above the card title; "" renders nothing. */
  heroEyebrow: string;
  /** Card body teaser (markdown source rendered as text today); "" renders nothing. */
  body: string;
  /** Bullet list; the card shows the first three. */
  bullets: readonly string[];
  /** CTA label; "" falls back to the dictionary "learn more" copy. */
  ctaText: string;
  /** CTA destination; null hides the link (parity with `s.cta_url &&`). */
  ctaUrl: string | null;
}
