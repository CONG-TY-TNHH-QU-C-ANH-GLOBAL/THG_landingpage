// Per-page SEO head — emits title, description, canonical, hreflang, og:*, twitter:*.
// Uses react-helmet-async for SSR/prerender compatibility.

import { Helmet } from "react-helmet-async";

import { useI18n } from "@/lib/i18n";
import type { Language } from "@/lib/i18n/types";
import { useCmsSeoPages } from "@/hooks/useCmsContent";
import { hrefLang, localizedUrl, normalizeSeoPath, SITE_BASE } from "@/lib/seoRoutes";

const DEFAULT_OG_IMAGE = `${SITE_BASE}/og-default.jpg`;

interface Props {
  title: string;
  description: string;
  /** Path of current page (without origin), e.g. "/", "/thg-fulfill", "/blog/foo" */
  path: string;
  /** Optional override og:image absolute URL. Defaults to /og-default.jpg */
  ogImage?: string;
  /** Alt text for og:image / twitter:image (accessibility + SEO). */
  ogImageAlt?: string;
  /** Defaults to "website". Use "article" for blog posts. */
  ogType?: "website" | "article";
  /** Article-specific (when ogType="article") */
  publishedTime?: string;
  /** Mark page noindex (e.g. /agent internal tool) */
  noindex?: boolean;
  /** Prevent capability URLs (for example review previews) leaking via Referer. */
  noReferrer?: boolean;
  /** Locales with genuinely published content. Static pages default to all locales. */
  availableLocales?: readonly Language[];
}

const TWITTER_HANDLE = "@THGFulfill";

export function SeoHead({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt,
  ogType = "website",
  publishedTime,
  noindex,
  noReferrer,
  availableLocales = ["vi", "en", "zh"],
}: Props) {
  const { language } = useI18n();
  const fullPath = normalizeSeoPath(path) || "/";
  const seoPages = useCmsSeoPages();
  const cmsSeo = seoPages.data?.find((page) => page.route === fullPath && page.locale === language);
  const effectiveTitle = cmsSeo?.title || title;
  const effectiveDescription = cmsSeo?.meta_description || description;
  const effectiveOgImage = cmsSeo?.og_image_url || ogImage;
  const effectiveNoindex = noindex || cmsSeo?.indexable === false;
  // With URL-prefix routing, canonical always includes the language segment.
  const canonical = localizedUrl(language, fullPath);
  const localeLinks = availableLocales.map((locale) => ({
    locale,
    hrefLang: hrefLang(locale),
    href: localizedUrl(locale, fullPath),
  }));
  const defaultLocale = availableLocales.includes("vi") ? "vi" : availableLocales[0];

  return (
    <Helmet>
      <html lang={language === "zh" ? "zh-CN" : language} />
      <title>{effectiveTitle}</title>
      <meta name="description" content={effectiveDescription} />
      <link rel="canonical" href={canonical} />

      {/* Hreflang — now that URL-prefix routing (/en/*, /vi/*, /zh/*) is live
          we can correctly declare all 3 alternate URLs for each page.
          x-default points to /vi as the primary audience locale. */}
      {localeLinks.map((alternate) => (
        <link key={alternate.locale} rel="alternate" hrefLang={alternate.hrefLang} href={alternate.href} />
      ))}
      {defaultLocale && (
        <link rel="alternate" hrefLang="x-default" href={localizedUrl(defaultLocale, fullPath)} />
      )}

      {/* OpenGraph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="THG Fulfill" />
      <meta property="og:title" content={effectiveTitle} />
      <meta property="og:description" content={effectiveDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={effectiveOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
      <meta property="og:locale" content={language === "vi" ? "vi_VN" : language === "zh" ? "zh_CN" : "en_US"} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={effectiveTitle} />
      <meta name="twitter:description" content={effectiveDescription} />
      <meta name="twitter:image" content={effectiveOgImage} />
      {ogImageAlt && <meta name="twitter:image:alt" content={ogImageAlt} />}

      {/* Robots */}
      {effectiveNoindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}
      {noReferrer && <meta name="referrer" content="no-referrer" />}
    </Helmet>
  );
}
