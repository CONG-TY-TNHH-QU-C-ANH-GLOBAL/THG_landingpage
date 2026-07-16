import { z } from "zod";

import { localeSchema } from "@/shared/cms/schemas";

// `GET /homepage?lang=` — operator-edited content blocks. The kind enum keeps the FULL wire
// value set [FACT: src/lib/cmsSchemas.ts:230-243]: it validates every array item, so a
// narrowed enum would fail the whole parse on blocks the homepage doesn't consume.

export const cmsHomepageBlockKindSchema = z.enum([
  "hero",
  "trust",
  "services_grid",
  "about_video",
  "marquee",
  "sellers",
  "process",
  "advantages",
  "integrations",
  "testimonials",
  "faq",
  "contact",
]);

export const cmsHomepageBlockSchema = z.object({
  kind: cmsHomepageBlockKindSchema,
  position: z.number(),
  payload: z.record(z.string(), z.string()),
});
export type CmsHomepageBlock = z.infer<typeof cmsHomepageBlockSchema>;

export const homepageResponseSchema = z.object({
  locale: localeSchema,
  blocks: z.array(cmsHomepageBlockSchema),
});
export type CmsHomepageResponse = z.infer<typeof homepageResponseSchema>;
