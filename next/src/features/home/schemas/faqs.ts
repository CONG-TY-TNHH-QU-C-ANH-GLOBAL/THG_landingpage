import { z } from "zod";

import { localeSchema } from "@/shared/cms/schemas";

// `GET /faqs?lang=&scope=home` — feeds ONLY the home FaqPage JSON-LD; the visible FAQ
// section stays static i18n [FACT: src/pages/Index.tsx:27,52; WEB-001 SPEC §5].

export const cmsFaqSchema = z.object({
  id: z.number(),
  position: z.number(),
  question: z.string(),
  answer: z.string(),
});
export type CmsFaq = z.infer<typeof cmsFaqSchema>;

export const faqsResponseSchema = z.object({
  locale: localeSchema,
  // This feature only ever requests home-scope FAQs; a mismatched scope is a contract
  // violation and must not become home JSON-LD.
  scope: z.literal("home"),
  faqs: z.array(cmsFaqSchema),
});
export type CmsFaqsResponse = z.infer<typeof faqsResponseSchema>;
