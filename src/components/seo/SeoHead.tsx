// Per-page SEO head — emits title, description, canonical, hreflang, og:*, twitter:*.
// Uses react-helmet-async for SSR/prerender compatibility.

import { Helmet } from "react-helmet-async";

import { useI18n } from "@/lib/i18n";

const SITE_BASE = "https://thgfulfill.com";
const DEFAULT_OG_IMAGE = `${SITE_BASE}/og-default.jpg`;

interface Props {
  title: string;
  description: string;
  /** Path of current page (without origin), e.g. "/", "/thg-fulfill", "/blog/foo" */
  path: string;
  /** Optional override og:image absolute URL. Defaults to /og-default.jpg */
  ogImage?: string;
  /** Defaults to "website". Use "article" for blog posts. */
  ogType?: "website" | "article";
  /** Article-specific (when ogType="article") */
  publishedTime?: string;
  /** Mark page noindex (e.g. /agent internal tool) */
  noindex?: boolean;
}

export function SeoHead({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  publishedTime,
  noindex,
}: Props) {
  const { language } = useI18n();
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${SITE_BASE}${fullPath}`;

  return (
    <Helmet>
      <html lang={language === "zh" ? "zh-CN" : language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Hreflang alternates — same path, different lang */}
      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="vi" href={canonical} />
      <link rel="alternate" hrefLang="zh" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      {/* OpenGraph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={language === "vi" ? "vi_VN" : language === "zh" ? "zh_CN" : "en_US"} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}
    </Helmet>
  );
}
