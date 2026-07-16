import type { CmsIntegrationsResponse } from "../schemas/integrations";
import type { Integration } from "../models/integration";

/** Integration tiles in position order (parity: IntegrationsSection.tsx:37). */
export function integrationsFromDto(dto: CmsIntegrationsResponse): Integration[] {
  return [...dto.integrations]
    .sort((a, b) => a.position - b.position)
    .map((i) => ({ id: i.id, name: i.name, colorClass: i.color_class }));
}
