import { z } from "zod";

// `GET /integrations` — locale-less [FACT: CS-004]. Narrowed to rendered fields: the grid
// shows name + color_class with local visuals [FACT: src/components/IntegrationsSection.tsx:64-71].

export const cmsIntegrationSchema = z.object({
  id: z.number(),
  position: z.number(),
  name: z.string(),
  color_class: z.string().nullable(),
});
export type CmsIntegration = z.infer<typeof cmsIntegrationSchema>;

export const integrationsResponseSchema = z.object({
  integrations: z.array(cmsIntegrationSchema),
});
export type CmsIntegrationsResponse = z.infer<typeof integrationsResponseSchema>;
