import { withStableStringIds } from "@/shared/model/stable-id";

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

/**
 * Would this normalized block render anything a visitor can read?
 *
 * The rule is derived from what the two renderers actually output, not from a guess. BlockCard
 * renders `num`, `tag`, `time`, `title`, `description`, `items` and `note`; StatCard renders
 * `value` and `title` [FACT: ui/service-page-view.tsx:34-81]. Every one of those eight fields
 * therefore counts, and a block carrying any of them is real content.
 *
 * The previous guard tested only title/description/value, and it ran BEFORE the extras were
 * extracted, so it could not have consulted them. That dropped legitimate blocks: a
 * shipping_lane whose card is a tag, a transit time and a feature list; a policy that is a
 * heading-less list of items with a footnote; a process_step that is just its step number. All
 * of those render correctly and all of them were being discarded as malformed.
 *
 * `icon` is deliberately NOT counted. It renders `aria-hidden="true"`, so a block carrying only
 * an icon is an empty card with a decorative glyph — visible, but nothing a reader can read.
 */
function hasMeaningfulServiceBlockContent(block: ServiceBlock): boolean {
  const { num, tag, time, items, note, value } = block.extras;
  return (
    items.length > 0 ||
    Boolean(block.title ?? block.description ?? num ?? tag ?? time ?? note ?? value)
  );
}

/** Group blocks by kind, each group in CMS position order.
 *
 *  A block whose `kind` is not in the code-owned registry is DROPPED, not guessed at: rendering
 *  an unknown kind through some default template would present content in a shape the operator
 *  did not choose. A registered block that would render nothing readable is malformed and is
 *  dropped too — a half-rendered card reads as a broken page. Both emit a diagnostic.
 *
 *  The block is normalized ONCE and then judged, so the guard sees exactly the fields the
 *  renderer will see. Extracting the payload before and after a guard is how the two drifted. */
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

    const block: ServiceBlock = {
      id: raw.id,
      kind: raw.kind,
      position: raw.position,
      icon: raw.icon,
      title: raw.title?.trim() || null,
      description: raw.description?.trim() || null,
      extras: {
        num: payloadString(raw.payload, "num"),
        tag: payloadString(raw.payload, "tag"),
        time: payloadString(raw.payload, "time"),
        // shipping_lane uses `features`, policy uses `items` — one model field, both sources.
        // Scoped to the block's own id so two lanes with the same feature line never collide.
        items: withStableStringIds(`${raw.kind}-${raw.id}`, [
          ...payloadList(raw.payload, "features"),
          ...payloadList(raw.payload, "items"),
        ]).map(({ id: itemId, value }) => ({ id: itemId, text: value })),
        note: payloadString(raw.payload, "note"),
        value: payloadString(raw.payload, "val"),
      },
    };

    if (!hasMeaningfulServiceBlockContent(block)) {
      log?.(raw.kind, "malformed", raw.id);
      continue;
    }
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
