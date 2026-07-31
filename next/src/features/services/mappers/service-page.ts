import type {
  FaqsResponseDto,
  ServiceBlocksResponseDto,
  ServicesResponseDto,
} from "../schemas/service-page";
import {
  isRenderedBlockKind,
  type RenderedBlockKind,
  type ServiceBlock,
  type ServiceFaq,
  type ServicePageSlug,
  type ServiceRecord,
} from "../models/service-page";

// Pure DTO → model mappers (FND-005). No I/O, no framework.

/** Read a payload value as a trimmed string, or null. The CMS payload is `Record<string,
 *  unknown>` by contract, so every read is narrowed here rather than cast at the call site. */
function payloadString(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  if (typeof value === "string" && value.trim().length > 0) return value.trim();
  // A number is legitimate for `num` / `val`; anything else is not a display value.
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

/** Read a payload value as a string list. Non-string entries are dropped rather than coerced —
 *  an object rendered via String() would print "[object Object]" on a marketing page. */
function payloadList(payload: Record<string, unknown>, key: string): string[] {
  const value = payload[key];
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

/** Select the live service whose CMS id matches the page slug.
 *
 *  Returns null when the service is absent, draft or archived — the page then renders its
 *  honest empty state. The landing never re-derives publish state; it only refuses to render
 *  a record the CMS did not mark live. */
export function serviceRecordFromDto(
  dto: ServicesResponseDto,
  slug: ServicePageSlug,
): ServiceRecord | null {
  const found = dto.services.find((s) => s.id === slug && s.status === "live");
  if (!found) return null;
  return {
    id: found.id,
    name: found.name,
    tagline: found.tagline,
    heroEyebrow: found.hero_eyebrow,
    heroTitle: found.hero_title,
    heroSub: found.hero_sub,
    ctaText: found.cta_text,
    ctaUrl: found.cta_url,
    bodyMarkdown: found.body_md,
    bullets: found.bullets.map((b) => b.trim()).filter((b) => b.length > 0),
    // A gallery entry with no resolved URL cannot render; `media_id` alone is an unhydrated
    // reference the landing must not try to resolve itself.
    gallery: found.gallery
      .filter((g): g is { url: string; alt?: string } => typeof g.url === "string" && g.url.length > 0)
      .map((g) => ({ url: g.url, alt: g.alt ?? "" })),
    products: found.products.map((p) => ({
      name: p.name,
      price: p.price ?? null,
      time: p.time ?? null,
      origin: p.origin ?? null,
      image: p.image ?? null,
    })),
  };
}

/** Anomaly reasons, safe to log — they carry no editor content. */
export type BlockAnomaly = "unregistered-kind" | "malformed";
export type BlockAnomalyLogger = (kind: string, reason: BlockAnomaly, id: number) => void;

/** Group blocks by kind, each group in CMS position order.
 *
 *  A block whose `kind` is not in the code-owned registry is DROPPED, not guessed at: rendering
 *  an unknown kind through some default template would present content in a shape the operator
 *  did not choose. A block with neither title nor description nor a stat value is malformed and
 *  is dropped too — a half-rendered card reads as a broken page. Both emit a diagnostic. */
export function serviceBlocksFromDto(
  dto: ServiceBlocksResponseDto,
  log?: BlockAnomalyLogger,
): Partial<Record<RenderedBlockKind, ServiceBlock[]>> {
  const grouped: Partial<Record<RenderedBlockKind, ServiceBlock[]>> = {};

  for (const raw of dto.blocks) {
    if (!isRenderedBlockKind(raw.kind)) {
      log?.(raw.kind, "unregistered-kind", raw.id);
      continue;
    }
    const title = raw.title?.trim() || null;
    const description = raw.description?.trim() || null;
    const value = payloadString(raw.payload, "val");
    if (!title && !description && !value) {
      log?.(raw.kind, "malformed", raw.id);
      continue;
    }

    const block: ServiceBlock = {
      id: raw.id,
      kind: raw.kind,
      position: raw.position,
      icon: raw.icon,
      title,
      description,
      extras: {
        num: payloadString(raw.payload, "num"),
        tag: payloadString(raw.payload, "tag"),
        time: payloadString(raw.payload, "time"),
        // shipping_lane uses `features`, policy uses `items` — one model field, both sources.
        items: [...payloadList(raw.payload, "features"), ...payloadList(raw.payload, "items")],
        note: payloadString(raw.payload, "note"),
        value,
      },
    };
    grouped[raw.kind] = [...(grouped[raw.kind] ?? []), block];
  }

  for (const kind of Object.keys(grouped) as RenderedBlockKind[]) {
    grouped[kind] = grouped[kind]!.slice().sort((a, b) => a.position - b.position);
  }
  return grouped;
}

export function serviceFaqsFromDto(dto: FaqsResponseDto): ServiceFaq[] {
  return dto.faqs
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((f) => ({ id: f.id, question: f.question, answer: f.answer }));
}
