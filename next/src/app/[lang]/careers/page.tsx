import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import { BreadcrumbJsonLd, buildPageMetadata, localeUrl } from "@/shared/seo";
import { CareersList, loadJobs } from "@/features/careers";

// WEB-006 — /{lang}/careers. Server Component; thin route file. SSG + ISR (tag: jobs).
export const revalidate = 300;

type PageProps = Readonly<{ params: Promise<{ lang: string }> }>;

const CAREERS_SEO: Readonly<Record<Locale, { title: string; description: string }>> = {
  en: {
    title: "Careers at THG Fulfill — open positions",
    description:
      "Open roles at THG Fulfill across operations, sourcing, sales and engineering in Vietnam and China.",
  },
  vi: {
    title: "Tuyển dụng tại THG Fulfill — vị trí đang mở",
    description:
      "Các vị trí đang tuyển tại THG Fulfill: vận hành, sourcing, kinh doanh và kỹ thuật tại Việt Nam và Trung Quốc.",
  },
  zh: {
    title: "THG Fulfill 招聘 — 在招职位",
    description: "THG Fulfill 在越南和中国的运营、采购、销售与技术岗位招聘信息。",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) return {};
  const result = await loadJobs(lang);

  return buildPageMetadata({
    lang,
    routeId: "/careers",
    title: CAREERS_SEO[lang].title,
    description: CAREERS_SEO[lang].description,
    // A careers index with no open roles is not a useful search result, and indexing it as
    // though it listed vacancies would be a false claim.
    indexable: result.status === "ready",
  });
}

export default async function CareersPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();

  const [copy, result] = await Promise.all([getMarketingCopy(lang), loadJobs(lang)]);
  const t = tFrom(copy);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), url: localeUrl(lang, "/") },
          { name: t("nav.careers"), url: localeUrl(lang, "/careers") },
        ]}
      />
      <CareersList result={result} copy={copy} lang={lang} />
    </>
  );
}
