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
}
