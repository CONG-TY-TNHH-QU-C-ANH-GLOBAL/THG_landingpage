import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import { BreadcrumbJsonLd, buildPageMetadata, localeUrl } from "@/shared/seo";
import { loadShippingRoutes, ShippingDocument } from "@/features/policies";

// WEB-007 — /{lang}/shipping-policy. Same posture as /policy: thin route, feature-owned
// composition, SSG + ISR (migration map: "SSG + revalidate (tag: shipping-routes)").
export const revalidate = 300;

type PageProps = Readonly<{ params: Promise<{ lang: string }> }>;

// Ported verbatim from src/lib/i18n/translations/seo.ts.
const SHIPPING_SEO: Readonly<Record<Locale, { title: string; description: string }>> = {
  en: {
    title: "Shipping Policy & Delivery Times by Route | THG Fulfill",
    description:
      "Detailed shipping policy by route: delivery times, restrictions, customs and surcharges for VN/CN to US, EU and UK lanes.",
  },
  vi: {
    title: "Chính sách vận chuyển & thời gian giao theo tuyến | THG Fulfill",
    description:
      "Chính sách vận chuyển chi tiết theo tuyến: thời gian giao, hạn chế, hải quan và phụ phí cho tuyến VN/CN đi Mỹ, EU, UK.",
  },
  zh: {
    title: "各线路运输政策与时效 | THG Fulfill",
    description: "按线路的详细运输政策：VN/CN到美国、欧盟、英国线路的时效、限制、清关与附加费。",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) return {};

  // Indexable only when routes actually rendered — an empty or unavailable locale must not
  // be indexed as if it published shipping terms (WEB-007 §12).
  const result = await loadShippingRoutes(lang);

  return buildPageMetadata({
    lang,
    routeId: "/shipping-policy",
    title: SHIPPING_SEO[lang].title,
    description: SHIPPING_SEO[lang].description,
    indexable: result.status === "ready",
  });
}

export default async function ShippingPolicyPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();

  const [copy, result] = await Promise.all([getMarketingCopy(lang), loadShippingRoutes(lang)]);
  const t = tFrom(copy);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), url: localeUrl(lang, "/") },
          { name: t("spolicy.title"), url: localeUrl(lang, "/shipping-policy") },
        ]}
      />
      <ShippingDocument result={result} copy={copy} />
    </>
  );
}
