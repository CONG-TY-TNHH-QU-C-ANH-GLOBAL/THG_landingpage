import { z } from "zod";

import { localeSchema } from "@/shared/cms/schemas";

// `GET /services?lang=` — narrowed to the fields the home services grid consumes
// [FACT: src/components/ServicesSection.tsx card rendering]. The remaining service shape
// (hero_title/hero_sub, gallery, videos, products) joins with the WEB-002 service pages.

export const cmsServiceSchema = z.object({
  id: z.string(),
  position: z.number(),
  icon: z.string().nullable(),
  status: z.enum(["draft", "live", "archived"]),
  name: z.string(),
  tagline: z.string().nullable(),
  hero_eyebrow: z.string().nullable(),
  cta_text: z.string().nullable(),
  cta_url: z.string().nullable(),
  body_md: z.string().nullable(),
  bullets: z.array(z.string()),
});
export type CmsService = z.infer<typeof cmsServiceSchema>;

export const servicesResponseSchema = z.object({
  locale: localeSchema,
  services: z.array(cmsServiceSchema),
});
export type CmsServicesResponse = z.infer<typeof servicesResponseSchema>;
