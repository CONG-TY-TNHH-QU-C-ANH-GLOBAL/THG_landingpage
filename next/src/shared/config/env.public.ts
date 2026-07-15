// Client-safe environment. ONLY `NEXT_PUBLIC_*` values may appear here — never a secret.
// FND-001 introduces no public env vars; `NEXT_PUBLIC_SITE_URL` arrives with FND-003.
export const publicEnv = Object.freeze({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? undefined,
});

export type PublicEnv = typeof publicEnv;
