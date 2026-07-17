// Parity source: src/lib/turnstile.ts. Cloudflare Turnstile site key — set via
// NEXT_PUBLIC_TURNSTILE_SITE_KEY at build time. When blank (local dev), forms fall back to
// the DEV_BYPASS token; the CMS accepts it only when its TURNSTILE_SECRET_KEY is also empty.
import { publicEnv } from "@/shared/config/env.public";

export const TURNSTILE_SITE_KEY: string = publicEnv.turnstileSiteKey?.trim() || "";

export const TURNSTILE_DEV_TOKEN = "DEV_BYPASS";

export const isTurnstileEnabled = (): boolean => TURNSTILE_SITE_KEY.length > 0;
