import { z } from "zod";

import { localeSchema } from "@/shared/cms/schemas";

// `GET /services?lang=` — narrowed to the fields the home services grid consumes
// [FACT: src/components/ServicesSection.tsx:112,146-169]. The full service shape (hero_*,
// gallery, videos, products) joins with the WEB-002 service-pages slice.

export const cmsServiceSchema = z.object({
  id: z.string(),
  position: z.number(),
  icon: z.string().nullable(),
  status: z.enum(["draft", "live", "archived"]),
  name: z.string(),
  tagline: z.string().nullable(),
});
export type CmsService = z.infer<typeof cmsServiceSchema>;

export const servicesResponseSchema = z.object({
  locale: localeSchema,
  services: z.array(cmsServiceSchema),
});
export type CmsServicesResponse = z.infer<typeof servicesResponseSchema>;
