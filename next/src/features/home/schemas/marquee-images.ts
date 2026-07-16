import { z } from "zod";

// `GET /marquee-images` — locale-less [FACT: CS-004]; the home image band
// [FACT: src/components/ImageMarquee.tsx; src/pages/Index.tsx:28-30].

export const cmsMarqueeImageSchema = z.object({
  id: z.number(),
  position: z.number(),
  src: z.string(),
  alt_text: z.string(),
});
export type CmsMarqueeImage = z.infer<typeof cmsMarqueeImageSchema>;

export const marqueeImagesResponseSchema = z.object({
  images: z.array(cmsMarqueeImageSchema),
});
export type CmsMarqueeImagesResponse = z.infer<typeof marqueeImagesResponseSchema>;
