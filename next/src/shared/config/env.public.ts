// Client-safe environment. ONLY `NEXT_PUBLIC_*` values may appear here — never a secret.
// `NEXT_PUBLIC_SITE_URL` (FND-003): canonical site origin override; unset → production
// default in shared/seo/site.ts. Consumed only through `resolveSiteOrigin`.
// `NEXT_PUBLIC_CMS_API_URL` (WEB-001): public CMS base for the reused lead-form island's
// client-side POST — public by design, parity with Vite's VITE_CMS_API_URL [WEB-001 §14].
// `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (WEB-001): Cloudflare Turnstile site key (public).
export const publicEnv = Object.freeze({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? undefined,
  cmsApiUrl: process.env.NEXT_PUBLIC_CMS_API_URL ?? undefined,
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? undefined,
});

export type PublicEnv = typeof publicEnv;
