import type { Metadata } from "next";
import type { Locale } from "@/shared/i18n";
import { buildAlternates } from "./buildAlternates";
import { resolveSiteOrigin } from "./site";

// The authoritative FND-003 metadata boundary (CONTRACTS §"Authoritative boundary"):
// buildPageMetadata({lang, routeId, title, description, image, indexable}) returns canonical,
// hreflang, Open Graph locale and robots. Values are parity with the Vite SeoHead
// [FACT: src/components/seo/SeoHead.tsx] — same og:site_name, og:image defaults/dimensions,
// og:locale mapping and Twitter card. Route files pass content; they never build URLs.

const SITE_NAME = "THG Fulfill";
const TWITTER_HANDLE = "@THGFulfill";
const OG_LOCALE: Readonly<Record<Locale, string>> = Object.freeze({
  vi: "vi_VN",
  en: "en_US",
  zh: "zh_CN",
});

export interface PageMetadataInput {
  lang: Locale;
  /** Locale-less base path of the route, e.g. "/" for home, "/blog" for the blog index. */
  routeId: string;
  title: string;
  description: string;
  /** Absolute og:image override. Defaults to the site-wide /og-default.jpg (parity). */
  image?: string;
  indexable: boolean;
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const { lang, routeId, title, description, image, indexable } = input;
  const { canonical, languages } = buildAlternates(lang, routeId);
  const ogImage = image ?? `${resolveSiteOrigin()}/og-default.jpg`;

  return {
    title,
    description,
    alternates: { canonical, languages },
    robots: { index: indexable, follow: indexable },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      locale: OG_LOCALE[lang],
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title,
      description,
      images: [ogImage],
    },
  };
}
