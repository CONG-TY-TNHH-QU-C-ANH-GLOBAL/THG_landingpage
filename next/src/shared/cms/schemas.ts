import { z } from "zod";

import { SUPPORTED_LOCALES } from "@/shared/i18n";

// Cross-cutting CMS wire primitives (FND-005 CODE_STRUCTURE "Shared-primitive ownership").
// Endpoint-specific schemas live with their owning feature; only genuinely shared shapes
// belong here. Zod strips unknown keys, so declaring consumed fields only stays compatible
// with the full wire payload [FACT: src/lib/cmsSchemas.ts:1-13 header semantics].

/** Locale echo on localized CMS responses — derived from the FND-002 canonical set. */
export const localeSchema = z.enum(SUPPORTED_LOCALES);

/** `GET /site-settings` — consumed fields only (FloatingContact contact links + the
 *  AboutVideo global default). `settings` is nullable on the wire
 *  [FACT: src/lib/cmsSchemas.ts:217-221]. */
export const cmsSiteSettingsSchema = z.object({
  contact_phone: z.string().nullable(),
  facebook_url: z.string().nullable(),
  about_video_url: z.string().nullable(),
});
export type CmsSiteSettings = z.infer<typeof cmsSiteSettingsSchema>;

export const siteSettingsResponseSchema = z.object({
  settings: cmsSiteSettingsSchema.nullable(),
});
export type CmsSiteSettingsResponse = z.infer<typeof siteSettingsResponseSchema>;
