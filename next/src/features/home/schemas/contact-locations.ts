import { z } from "zod";

import { localeSchema } from "@/shared/cms/schemas";

// `GET /contact-locations?lang=` — footer ContactSection rows. The kind enum keeps the full
// wire value set [FACT: src/lib/cmsSchemas.ts:117-126] (validates every row).

export const cmsContactLocationSchema = z.object({
  id: z.number(),
  position: z.number(),
  kind: z.enum(["office", "warehouse", "phone", "email", "website"]),
  label: z.string(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  url: z.string().nullable(),
  lang_class: z.string().nullable(),
});
export type CmsContactLocation = z.infer<typeof cmsContactLocationSchema>;

export const contactLocationsResponseSchema = z.object({
  locale: localeSchema,
  locations: z.array(cmsContactLocationSchema),
});
export type CmsContactLocationsResponse = z.infer<typeof contactLocationsResponseSchema>;
