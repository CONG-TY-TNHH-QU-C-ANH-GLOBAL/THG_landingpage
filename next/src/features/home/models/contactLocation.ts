export type ContactLocationKind = "office" | "warehouse" | "phone" | "email" | "website";

// Footer contact row (FND-005), already position-sorted. address/phone/url stay nullable —
// the section picks its display line with a nullish chain [FACT: ContactSection.tsx:86],
// so "" defaults would silently change which line shows.

export interface ContactLocation {
  id: number;
  kind: ContactLocationKind;
  label: string;
  address: string | null;
  phone: string | null;
  url: string | null;
  /** CMS font hint ("font-cn" switches the CJK font stack); null → default font. */
  langClass: string | null;
}
