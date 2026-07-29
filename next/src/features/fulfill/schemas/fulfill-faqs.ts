import { z } from "zod";

import { localeSchema } from "@/shared/cms/schemas";

// `GET /faqs?lang=&scope=fulfill` — feeds the fulfill route's visible FAQ section AND its
// FAQPage JSON-LD (unlike the home scope, which is JSON-LD only). Only fulfill-scope FAQs may
// reach this route; a mismatched scope is a contract violation [FACT: CMS faqs/index.ts echoes
// the requested scope]. EN/ZH rows are already status='reviewed' server-side; VI is source.

export const cmsFulfillFaqSchema = z.object({
  id: z.number(),
  position: z.number(),
  question: z.string(),
  answer: z.string(),
});
export type CmsFulfillFaq = z.infer<typeof cmsFulfillFaqSchema>;

export const fulfillFaqsResponseSchema = z.object({
  locale: localeSchema,
  scope: z.literal("fulfill"),
  faqs: z.array(cmsFulfillFaqSchema),
});
export type CmsFulfillFaqsResponse = z.infer<typeof fulfillFaqsResponseSchema>;
