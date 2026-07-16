import type { CmsContactLocationsResponse } from "../schemas/contact-locations";
import type { ContactLocation } from "../models/contactLocation";

/** Footer contact rows in position order (parity: ContactSection.tsx:81). address/phone/url
 *  keep explicit nulls — the display-line nullish chain depends on them (IP-006 §4). */
export function contactLocationsFromDto(dto: CmsContactLocationsResponse): ContactLocation[] {
  return [...dto.locations]
    .sort((a, b) => a.position - b.position)
    .map((l) => ({
      id: l.id,
      kind: l.kind,
      label: l.label,
      address: l.address,
      phone: l.phone,
      url: l.url,
    }));
}
