// Landing-domain service-page models (WEB-002). Plain data, zero imports (FND-005).
//
// One model serves THG Express, THG Warehouse and THG Order. They are DIFFERENT products with
// different content — the model is shared, the content never is: each page reads its own CMS
// service record and its own `page_slug` block set. THG Fulfill deliberately does NOT use this
// path; it has an approved bespoke design (features/fulfill) and combining them would merge two
// distinct service propositions into one template.

/** CMS page slugs this generic renderer serves. Fulfill is absent on purpose. */
export const SERVICE_PAGE_SLUGS = ["thg-express", "thg-warehouse", "thg-order"] as const;
export type ServicePageSlug = (typeof SERVICE_PAGE_SLUGS)[number];

/** Block kinds the CMS actually publishes (registry-confirmed: `bun run check:pg-kind-inventory`).
 *  Rendering is per-kind so a new kind cannot silently render as something it is not — an
 *  unregistered kind is dropped and logged rather than guessed at. */
export const RENDERED_BLOCK_KINDS = [
  "pain_point",
  "solution",
  "process_step",
  "shipping_lane",
  "policy",
  "stat",
] as const;
export type RenderedBlockKind = (typeof RENDERED_BLOCK_KINDS)[number];

export function isRenderedBlockKind(kind: string): kind is RenderedBlockKind {
  return (RENDERED_BLOCK_KINDS as readonly string[]).includes(kind);
}

/** One CMS block, locale-resolved. `extras` carries the kind-specific payload keys the CMS
 *  documents (num, tag, time, features, note, items, val) as already-stringified values —
 *  the renderer never reaches into raw JSON. */
export interface ServiceBlock {
  id: number;
  kind: RenderedBlockKind;
  position: number;
  icon: string | null;
  title: string | null;
  description: string | null;
  extras: {
    /** process_step step number. */
    num: string | null;
    /** solution / shipping_lane / policy chip. */
    tag: string | null;
    /** shipping_lane transit time. */
    time: string | null;
    /** shipping_lane feature bullets, or policy items. Each carries a mapper-owned stable id
     *  (block id + normalized text) — a lane may legitimately repeat a feature line, so
     *  duplicates are numbered rather than deduplicated. */
    items: readonly { id: string; text: string }[];
    /** shipping_lane footnote. */
    note: string | null;
    /** stat value. */
    value: string | null;
  };
}

export interface ServiceProduct {
  name: string;
  price: string | null;
  time: string | null;
  origin: string | null;
  image: string | null;
}

/** The CMS `services` record for this page. */
export interface ServiceRecord {
  id: string;
  name: string;
  tagline: string | null;
  heroEyebrow: string | null;
  heroTitle: string | null;
  heroSub: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  bodyMarkdown: string | null;
  bullets: readonly string[];
  gallery: readonly { url: string; alt: string }[];
  products: readonly ServiceProduct[];
}

export interface ServiceFaq {
  id: number;
  question: string;
  answer: string;
}

/** Everything one service route renders. `blocks` is grouped by kind, each group in CMS
 *  position order. */
export interface ServicePageContent {
  slug: ServicePageSlug;
  service: ServiceRecord | null;
  blocksByKind: Readonly<Partial<Record<RenderedBlockKind, readonly ServiceBlock[]>>>;
  faqs: readonly ServiceFaq[];
}

export type ServicePageResult =
  | { status: "ready"; content: ServicePageContent }
  /** CMS answered, but this page has no published service record AND no blocks. */
  | { status: "empty"; content: ServicePageContent }
  | { status: "unavailable"; reason: "http" | "contract" | "network" };

/** True when nothing publishable came back for this locale. Drives the honest empty state and
 *  the noindex decision — a service page with no content must not be indexed as if it sold
 *  something. */
export function isServicePageEmpty(content: ServicePageContent): boolean {
  const hasBlocks = Object.values(content.blocksByKind).some((g) => (g?.length ?? 0) > 0);
  return content.service === null && !hasBlocks && content.faqs.length === 0;
}
