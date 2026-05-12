/// <reference types="vite/client" />

declare module "*.avif" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_CMS_API_URL: string;
  readonly VITE_GA4_ID?: string;
  readonly VITE_GTM_ID?: string;
  readonly VITE_FB_PIXEL_ID?: string;
  readonly VITE_TIKTOK_PIXEL_ID?: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
