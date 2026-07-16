// Client-safe environment. ONLY `NEXT_PUBLIC_*` values may appear here — never a secret.
// `NEXT_PUBLIC_SITE_URL` (FND-003): canonical site origin override; unset → production
// default in shared/seo/site.ts. Consumed only through `resolveSiteOrigin`.
export const publicEnv = Object.freeze({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? undefined,
});

export type PublicEnv = typeof publicEnv;
