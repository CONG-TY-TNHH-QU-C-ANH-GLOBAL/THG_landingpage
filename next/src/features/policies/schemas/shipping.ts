import { z } from "zod";

// Transport DTOs for GET /shipping-routes and GET /shipping-routes/{slug}.
// Mirrors the frozen CMS contract [FACT: CMS src/features/shipping/shipping.schemas.ts].
//
// `rows` cells arrive as string | number | null on the wire; the mapper normalizes every
// cell to a display string so the table renderer never formats a value itself.

const localeSchema = z.enum(["en", "vi", "zh"]);

const shippingRouteSummaryDtoSchema = z.object({
  slug: z.string(),
  position: z.number().int(),
  title: z.string(),
  origin: z.string().nullable(),
  destination: z.string().nullable(),
  kind: z.string().nullable(),
});

export const shippingRoutesResponseSchema = z.object({
  locale: localeSchema,
  routes: z.array(shippingRouteSummaryDtoSchema),
  // Echoed by the CMS as `routes.length`; not a pagination total, so it is accepted and
  // then ignored rather than used to drive any "load more" affordance.
  total: z.number().int(),
});

export type ShippingRoutesResponseDto = z.infer<typeof shippingRoutesResponseSchema>;

const shippingTableDtoSchema = z.object({
  caption: z.string().nullable(),
  columns: z.array(z.object({ key: z.string(), label: z.string() })),
  rows: z.array(z.record(z.string(), z.union([z.string(), z.number(), z.null()]))),
});

const shippingRouteDetailDtoSchema = z.object({
  slug: z.string(),
  position: z.number().int(),
  title: z.string(),
  origin: z.string().nullable(),
  destination: z.string().nullable(),
  kind: z.string().nullable(),
  body_md: z.string().nullable(),
  notes: z.array(z.string()),
  tables: z.array(shippingTableDtoSchema),
  updated_at: z.number().int().optional(),
});

export const shippingRouteResponseSchema = z.object({
  locale: localeSchema,
  route: shippingRouteDetailDtoSchema,
});

export type ShippingRouteResponseDto = z.infer<typeof shippingRouteResponseSchema>;
