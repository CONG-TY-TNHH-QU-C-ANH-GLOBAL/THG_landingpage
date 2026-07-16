import type { CmsMarqueeImagesResponse } from "../schemas/marquee-images";
import type { MarqueeImage } from "../models/marqueeImage";

/** Marquee images in position order (parity: src/pages/Index.tsx:28-30 sort). */
export function marqueeImagesFromDto(dto: CmsMarqueeImagesResponse): MarqueeImage[] {
  return [...dto.images]
    .sort((a, b) => a.position - b.position)
    .map((img) => ({ id: img.id, src: img.src, alt: img.alt_text }));
}
