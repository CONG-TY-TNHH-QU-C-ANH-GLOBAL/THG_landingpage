import { z } from "zod";

import { localeSchema } from "@/shared/cms/schemas";

// Public `GET /service-blocks?page_slug=&lang=` contract — parity with the CMS emitter
// [FACT: CMS routes/api/v1/(public)/service-blocks/index.ts] and the legacy landing schema
// (src/lib/cmsSchemas.ts serviceBlockSchema). `kind` is a free-form string (the DB column has no
// CHECK), `payload` is already a parsed object, and `payload.key` (validated in the mapper) binds a
// block to a code-owned Fulfill role. Media for media-bearing kinds lives in `payload`; the text
// roles this page consumes (journey_step / capability / section_copy) use only title + description.

export const cmsServiceBlockSchema = z.object({
  id: z.number(),
  kind: z.string(),
  position: z.number(),
  icon: z.string().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  payload: z.record(z.string(), z.unknown()),
});
export type CmsServiceBlock = z.infer<typeof cmsServiceBlockSchema>;

export const serviceBlocksResponseSchema = z.object({
  locale: localeSchema,
  page_slug: z.string(),
  kind: z.string().nullable(),
  blocks: z.array(cmsServiceBlockSchema),
});
export type CmsServiceBlocksResponse = z.infer<typeof serviceBlocksResponseSchema>;
