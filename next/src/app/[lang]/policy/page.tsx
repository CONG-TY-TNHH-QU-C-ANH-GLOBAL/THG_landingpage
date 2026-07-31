import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import { BreadcrumbJsonLd, buildPageMetadata, localeUrl } from "@/shared/seo";
import { loadPolicies, PolicyDocument } from "@/features/policies";

// WEB-007 — /{lang}/policy. Server Component; the page file is thin (params → feature loader
// → feature view). Static-first with ISR, matching the migration map's "SSG + revalidate
// (tag: policies)". Tag-based invalidation is FND-006's to wire; the time window is the
// policy this route owns today.
export const revalidate = 300;

type PageProps = Readonly<{ params: Promise<{ lang: string }> }>;

// SEO strings stay feature-local (same posture as thg-fulfill) — they are not operator-
// editable chrome. Ported verbatim from src/lib/i18n/translations/seo.ts.
const POLICY_SEO: Readonly<Record<Locale, { title: string; description: string }>> = {
  en: {
    title: "Policies — Shipping, Returns & Compensation | THG Fulfill",
    description:
      "THG Fulfill operational policies: shipping terms, returns, cargo insurance and compensation for lost or damaged items.",
  },
  vi: {
    title: "Chính sách — Vận chuyển, Đổi trả & Bồi thường | THG Fulfill",
    description:
      "Chính sách vận hành THG Fulfill: điều khoản vận chuyển, đổi trả, bảo hiểm hàng hóa và bồi thường khi mất/hư hỏng.",
  },
  zh: {
    title: "政策——运输、退换与赔偿 | THG Fulfill",
    description: "THG Fulfill运营政策：运输条款、退换、货物保险及丢失或损坏赔偿。",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) return {};

  // Indexability follows the content, not the route. OQ-P-001 (EN/ZH policy bodies relied on
  // the retired GTranslate) is still open, so a locale whose policy set is empty or
  // unavailable must not be indexed as though it carried the terms — WEB-007 §12. The read is
  // request-memoized, so this does not double-fetch against the page body.
  const result = await loadPolicies(lang);

  return buildPageMetadata({
    lang,
    routeId: "/policy",
    title: POLICY_SEO[lang].title,
    description: POLICY_SEO[lang].description,
    indexable: result.status === "ready",
  });
}

export default async function PolicyPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();

  const [copy, result] = await Promise.all([getMarketingCopy(lang), loadPolicies(lang)]);
  const t = tFrom(copy);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), url: localeUrl(lang, "/") },
          { name: t("policy.title"), url: localeUrl(lang, "/policy") },
        ]}
      />
      <PolicyDocument result={result} copy={copy} />
    </>
  );
}
