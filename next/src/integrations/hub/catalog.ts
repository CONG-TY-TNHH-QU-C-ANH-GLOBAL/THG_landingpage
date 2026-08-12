import "server-only";

import { z } from "zod";

// THG Hub public catalog transport. Ported from the Vite client
// [src/lib/catalogApi.ts] with the two changes the Next architecture requires:
//
//   1. Server-side, not browser-side. The Vite page fetched from the client on every
//      filter keystroke. Here the catalog is read during render/ISR, so the browser
//      receives HTML and the Hub sees one request per revalidation window, not one per
//      visitor. No Hub URL is inlined into the client bundle.
//   2. Zod-validated at the boundary, like every other upstream read in this app
//      (shared/cms/cmsFetch). The Vite client cast `res.json()` straight to its
//      interface, so a Hub shape change surfaced as a render crash instead of a
//      typed failure the loader can degrade.
//
// This is NOT the CMS. It deliberately does not reuse shared/cms/cmsFetch: that module
// resolves CMS_API_URL, throws CmsError, and logs under a `[CMS]` prefix — using it for
// Hub reads would attribute Hub outages to the CMS in every log line. The overlap is
// ~20 lines of native fetch/abort, not worth a shared abstraction with two upstreams.

/** Hub catalog base. Mirrors the Vite `VITE_CATALOG_API_URL` fallback — the canonical Hub
 *  origin, also used by integrations/hub/tracking-link.ts. `||` not `??`: an empty env
 *  string must fall through to the default, not produce a broken URL. */
const API_BASE =
  process.env.HUB_CATALOG_API_URL?.trim() || "https://hub.thgfulfill.com/api/public/catalog";

/** Whole-request budget. Mirrors DEFAULT_CMS_TIMEOUT_MS: a Hub that accepts the socket and
 *  never answers must degrade the section, not hang a prerender. */
const TIMEOUT_MS = 8000;

/** Catalog reads are content, not truth-of-record — revalidate on the page's own cadence. */
const REVALIDATE_S = 300;

const collectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  count: z.number().optional(),
});

/** Editorial spec block. Every field is optional because the Hub synthesises it per category
 *  and older rows predate it; `null` is a real response value, not a mistake. */
const productDescriptionSchema = z
  .object({
    material: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
    care: z.array(z.string()).optional(),
    prodTime: z.string().optional(),
    shipTime: z.string().optional(),
    subcategory: z.string().optional(),
    moq: z.number().optional(),
  })
  .nullable();

const variantSchema = z.object({
  id: z.string().optional(),
  variant: z.string(),
  series: z.string().nullable().optional(),
  color: z.string().optional(),
  weight: z.number().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  priceSbtt: z.number().optional(),
  priceSbsl: z.number().optional(),
  thgSku: z.string().optional(),
  supplierSku: z.string().optional(),
});

// `.catch`/`.default` on the collection-ish fields: a product with a malformed `images` entry
// should lose its gallery, not drop the whole page to a fallback. Identity fields (id/name)
// have no default — a product without them is not renderable and correctly fails the parse.
const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string().default(""),
  category: z.string().default(""),
  status: z.string().default(""),
  origin: z.string().nullable().default(null),
  sizes: z.array(z.string()).catch([]),
  colors: z.array(z.string()).catch([]),
  images: z.array(z.string()).catch([]),
  videos: z.array(z.string()).catch([]),
  description: productDescriptionSchema.catch(null),
  templateUrl: z.string().nullable().default(null),
  priceFrom: z.number().nullable().default(null),
  priceTo: z.number().nullable().default(null),
  currency: z.string().default("USD"),
  thgSku: z.string().nullable().default(null),
  collections: z.array(collectionSchema).catch([]),
  variants: z.array(variantSchema).catch([]).optional(),
  createdAt: z.string().default(""),
  updatedAt: z.string().default(""),
});

const catalogResponseSchema = z.object({
  data: z.array(productSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
  categoryCounts: z.record(z.string(), z.number()).catch({}),
  originCounts: z.record(z.string(), z.number()).catch({}),
  collections: z.array(collectionSchema).catch([]).optional(),
  /** Live taxonomy from the Hub (`product_categories`, sortOrder). Absent on older deploys. */
  categories: z.array(z.object({ name: z.string(), slug: z.string() })).catch([]).optional(),
});

export type HubCatalogProduct = z.infer<typeof productSchema>;
export type HubCatalogCollection = z.infer<typeof collectionSchema>;
export type HubCatalogResponse = z.infer<typeof catalogResponseSchema>;

/** Any failed Hub catalog read: non-2xx, unparseable body, shape mismatch, or no response at
 *  all. One type because every caller treats them identically — degrade this surface. `path`
 *  is request-derived and secret-free; the Hub base URL is never echoed. */
export class HubCatalogError extends Error {
  constructor(
    readonly path: string,
    readonly reason: "http" | "parse" | "shape" | "network" | "timeout",
    readonly status?: number,
  ) {
    super(`Hub catalog ${path}: ${reason}${status ? ` (${status})` : ""}`);
    this.name = "HubCatalogError";
  }

  safeMeta(): Record<string, string | number> {
    return { name: this.name, path: this.path, reason: this.reason, ...(this.status ? { status: this.status } : {}) };
  }
}

async function hubFetch<T extends z.ZodTypeAny>(path: string, schema: T): Promise<z.infer<T>> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_S, tags: ["hub-catalog"] },
    });
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    throw new HubCatalogError(path, timedOut ? "timeout" : "network");
  }

  if (!res.ok) throw new HubCatalogError(path, "http", res.status);

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new HubCatalogError(path, "parse");
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    // Zod issues only — never the raw body (parity with cmsFetch's redaction rule).
    console.error(`[HUB] catalog schema validation failed for ${path}:`, parsed.error.issues);
    throw new HubCatalogError(path, "shape");
  }
  return parsed.data;
}

export interface HubCatalogParams {
  page?: number;
  limit?: number;
  category?: string;
  origin?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  collection?: readonly string[];
}

/** Query the catalog. Parameter names and the comma-joined `collection` encoding are the Hub's
 *  contract — kept byte-identical to the Vite client so both frontends hit the same cache keys. */
export function fetchHubCatalog(params: HubCatalogParams = {}): Promise<HubCatalogResponse> {
  const sp = new URLSearchParams();
  if (params.page) sp.set("page", String(params.page));
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.category) sp.set("category", params.category);
  if (params.origin) sp.set("origin", params.origin);
  if (params.search) sp.set("search", params.search);
  if (params.sortBy) sp.set("sortBy", params.sortBy);
  if (params.sortOrder) sp.set("sortOrder", params.sortOrder);
  if (params.collection?.length) sp.set("collection", params.collection.join(","));

  const qs = sp.toString();
  return hubFetch(qs ? `?${qs}` : "", catalogResponseSchema);
}

/** One product with its variants. Throws HubCatalogError("http", 404) for an unknown id — the
 *  signal a deep-linked `?productId=` turns into "product not found" rather than a crash. */
export function fetchHubProduct(id: string): Promise<HubCatalogProduct> {
  return hubFetch(`/${encodeURIComponent(id)}`, productSchema);
}

/** True iff the id does not exist on the Hub. */
export const isHubProductNotFound = (e: unknown): boolean =>
  e instanceof HubCatalogError && e.reason === "http" && e.status === 404;
