import type { CmsServicesResponse } from "../schemas/services";
import type { Service } from "../models/service";

/** Live services in display order (parity: ServicesSection.tsx:112 filter + sort);
 *  nullable wire fields become "" (careers.ts precedent, FND-005 §15). */
export function liveServicesFromDto(dto: CmsServicesResponse): Service[] {
  return dto.services
    .filter((s) => s.status === "live")
    .sort((a, b) => a.position - b.position)
    .map((s) => ({
      id: s.id,
      name: s.name,
      tagline: s.tagline ?? "",
      icon: s.icon ?? "",
      heroEyebrow: s.hero_eyebrow ?? "",
      body: s.body_md ?? "",
      bullets: s.bullets,
      ctaText: s.cta_text ?? "",
      ctaUrl: s.cta_url,
    }));
}
