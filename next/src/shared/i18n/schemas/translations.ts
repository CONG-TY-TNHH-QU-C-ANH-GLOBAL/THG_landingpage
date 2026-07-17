import { z } from "zod";

import { localeSchema } from "@/shared/cms/schemas";

// `GET /translations?lang=` — operator per-key overrides merged over the static copy
// (FND-002 chain; placement per FND-005 CODE_STRUCTURE "shared/i18n/schemas/translations").
// Parity source: src/lib/cmsSchemas.ts:223-227.
export const translationsResponseSchema = z.object({
  locale: localeSchema,
  translations: z.record(z.string(), z.string()),
});
export type CmsTranslationsResponse = z.infer<typeof translationsResponseSchema>;
