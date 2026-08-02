import { z } from "zod";

// Transport DTOs for the generic service page: GET /services, /service-blocks, /faqs.
// Mirrors the frozen CMS contract [FACT: CMS src/openapi/paths.ts + feature schemas].

const localeSchema = z.enum(["en", "vi", "zh"]);

const serviceGalleryItemSchema = z.object({
  url: z.string().optional(),
  media_id: z.number().int().optional(),
  alt: z.string().optional(),
});

const serviceProductSchema = z.object({
  name: z.string(),
  price: z.string().optional(),
  time: z.string().optional(),
  origin: z.string().optional(),
  image: z.string().optional(),
  media_id: z.number().int().optional(),
});

const serviceItemSchema = z.object({
  id: z.string(),
  position: z.number().int(),
  icon: z.string().nullable(),
  status: z.enum(["draft", "live", "archived"]),
  name: z.string(),
  tagline: z.string().nullable(),
  hero_eyebrow: z.string().nullable(),
  hero_title: z.string().nullable(),
  hero_sub: z.string().nullable(),
  cta_text: z.string().nullable(),
  cta_url: z.string().nullable(),
  body_md: z.string().nullable(),
  bullets: z.array(z.string()),
  gallery: z.array(serviceGalleryItemSchema),
  videos: z.array(z.unknown()),
  products: z.array(serviceProductSchema),
});

export const servicesResponseSchema = z.object({
  locale: localeSchema,
  services: z.array(serviceItemSchema),
});

export type ServicesResponseDto = z.infer<typeof servicesResponseSchema>;

const serviceBlockItemSchema = z.object({
  id: z.number().int(),
  kind: z.string(),
  position: z.number().int(),
  icon: z.string().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  // Server-parsed; a malformed row arrives as {} rather than failing the response (the CMS
  // documents this degradation). `unknown` values are narrowed in the mapper.
  payload: z.record(z.string(), z.unknown()),
});

export const serviceBlocksResponseSchema = z.object({
  locale: localeSchema,
  page_slug: z.string(),
  kind: z.string().nullable(),
  blocks: z.array(serviceBlockItemSchema),
});

export type ServiceBlocksResponseDto = z.infer<typeof serviceBlocksResponseSchema>;

export const faqsResponseSchema = z.object({
  locale: localeSchema,
  scope: z.string(),
  faqs: z.array(
    z.object({
      id: z.number().int(),
      position: z.number().int(),
      question: z.string(),
      answer: z.string(),
    }),
  ),
});

export type FaqsResponseDto = z.infer<typeof faqsResponseSchema>;
