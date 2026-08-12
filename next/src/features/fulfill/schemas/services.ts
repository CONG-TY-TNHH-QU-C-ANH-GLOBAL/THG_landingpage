import { z } from "zod";

import { localeSchema } from "@/shared/cms/schemas";

// `GET /services?lang=` — the FULL per-service shape (WEB-002 service pages), a superset of
// the home services-grid schema (features/home/schemas/services.ts, which narrows to card
// fields). The fulfill route selects the single `id:"thg-fulfill"` service and consumes its
// hero_title/hero_sub, bullets, body and product catalog. gallery/videos are accepted but the
// route does not render them yet [FACT: CMS routes/api/v1/(public)/services/index.ts flat shape].

export const cmsServiceProductSchema = z.object({
  name: z.string(),
  price: z.string().optional(),
  time: z.string().optional(),
  origin: z.string().optional(),
  // Resolved to a URL server-side by the CMS media hydrator; may be absent (empty catalog).
  image: z.string().optional(),
  media_id: z.number().optional(),
  // Optional link to a THG Hub catalog product. NOT published by the CMS today — accepted here
  // so that the day an editor can pick a real product, the landing needs no code change and no
  // redeploy. Until then the Fulfill section resolves its own featured ids.
  product_id: z.string().optional(),
});
export type CmsServiceProduct = z.infer<typeof cmsServiceProductSchema>;

export const cmsServiceGalleryItemSchema = z.object({
  url: z.string().optional(),
  media_id: z.number().optional(),
  alt: z.string().optional(),
});

export const cmsServiceVideoSchema = z.object({
  youtube_id: z.string(),
  caption_key: z.string().optional(),
  caption: z.string().optional(),
  thumb: z.string().optional(),
});

export const cmsFullServiceSchema = z.object({
  id: z.string(),
  position: z.number(),
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
  gallery: z.array(cmsServiceGalleryItemSchema),
  videos: z.array(cmsServiceVideoSchema),
  products: z.array(cmsServiceProductSchema),
});
export type CmsFullService = z.infer<typeof cmsFullServiceSchema>;

export const fullServicesResponseSchema = z.object({
  locale: localeSchema,
  services: z.array(cmsFullServiceSchema),
});
export type CmsFullServicesResponse = z.infer<typeof fullServicesResponseSchema>;
