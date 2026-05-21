// Centralized URLs for media assets that live in the CMS R2 bucket under the
// `landing/` prefix. Resolved at runtime from VITE_CMS_API_URL so the same
// code points at local-dev CMS, staging, or prod without rebuilding.
//
// To replace any of these images:
//   bunx wrangler r2 object put thg-media/landing/<key> --file=<path> --remote
// (run from the cmsthgfulfill workspace where wrangler.jsonc lives).

const CMS_API_BASE: string =
  (import.meta.env.VITE_CMS_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8080/api/v1";

const LANDING_MEDIA = `${CMS_API_BASE}/media/landing`;

/** Marketing illustration on /thg-express. */
export const EXPRESS_HERO_URL = `${LANDING_MEDIA}/express-2.png`;

/** Packaging photo on /domestic-pricing. */
export const WAREHOUSE_PACKAGING_URL = `${LANDING_MEDIA}/warehouse-bao-bi.png`;

/** Customer testimonial avatars on /thg-order. Names match the operator-edited
 *  records in CMS, keyed by short slug so we can swap photos without touching
 *  the page component. */
export const TESTIMONIAL_AVATARS = {
  lanHuong: `${LANDING_MEDIA}/testimonial-lan-huong.jpg`,
  minhKhoa: `${LANDING_MEDIA}/testimonial-minh-khoa.jpg`,
  thuyPhuong: `${LANDING_MEDIA}/testimonial-thuy-phuong.jpg`,
  quangTri: `${LANDING_MEDIA}/testimonial-quang-tri.jpg`,
  baoNgoc: `${LANDING_MEDIA}/testimonial-bao-ngoc.jpg`,
} as const;
