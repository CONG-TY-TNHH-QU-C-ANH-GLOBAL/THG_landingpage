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

/** Safe internal failure category — server-side only, never rendered. */
export type ContactUnavailableReason = "network" | "http" | "contract";

// The observable states of the CMS contact directory (WEB-001 owner requirement): a valid
// empty list is a CONFIRMED absence of published records; an unreachable/invalid CMS is
// "unavailable" and carries the verified production fallback rows to render instead —
// never presented as if THG had no locations.
export type ContactLocationsResult =
  | { status: "ready"; locations: readonly ContactLocation[] }
  | { status: "empty"; locations: readonly ContactLocation[] }
  | { status: "unavailable"; locations: readonly ContactLocation[]; reason: ContactUnavailableReason };
