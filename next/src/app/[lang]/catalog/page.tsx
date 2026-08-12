import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isSupportedLocale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import { BreadcrumbJsonLd, buildPageMetadata, localeUrl } from "@/shared/seo";
import { getCatalogCopy, loadCatalogPage, loadCatalogProduct } from "@/features/catalog";
import CatalogBrowser from "@/features/catalog/ui/catalog-browser";
import ProductDetail from "@/features/catalog/ui/product-detail";

// WEB-004 — /{lang}/catalog. Server Component, thin route file. The Hub is read here (ISR 300s),
// never from the browser, so the catalog ships as HTML and the Hub sees one request per
// revalidation window rather than one per visitor keystroke (the Vite behaviour).
export const revalidate = 300;

const PAGE_LIMIT = 24;

type PageProps = Readonly<{
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

/** First value only. A duplicated query key (`?q=a&q=b`) is a malformed URL, not a multi-filter
 *  request — taking the first keeps the Hub call well-formed instead of sending "a,b". */
function one(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
}

function pageNumber(v: string | string[] | undefined): number {
  const n = Number.parseInt(one(v), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) return {};
  const copy = getCatalogCopy(lang);
  return buildPageMetadata({
    lang,
    routeId: "/catalog",
    title: `${copy.title} — THG Fulfill`,
    description: copy.subtitle,
    indexable: true,
  });
}

export default async function CatalogPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();

  const sp = await searchParams;
  const query = {
    q: one(sp.q),
    category: one(sp.category),
    origin: one(sp.origin),
    page: pageNumber(sp.page),
  };
  const productId = one(sp.productId);

  const [marketing, page, product] = await Promise.all([
    getMarketingCopy(lang),
    loadCatalogPage({
      page: query.page,
      limit: PAGE_LIMIT,
      search: query.q || undefined,
      category: query.category || undefined,
      origin: query.origin || undefined,
    }),
    // A deep link resolves the product alongside the grid rather than instead of it: the
    // seller who followed a link from the Fulfill page lands on the spec AND can keep browsing.
    productId ? loadCatalogProduct(productId) : Promise.resolve(null),
  ]);
  const t = tFrom(marketing);
  const copy = getCatalogCopy(lang);

  return (
    <main className="w-full bg-thg-bg">
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), url: localeUrl(lang, "/") },
          { name: copy.title, url: localeUrl(lang, "/catalog") },
        ]}
      />

      <div className="container mx-auto px-4 py-16 md:px-8 lg:py-24">
        <header className="mb-10 max-w-2xl">
          <p className="m-0 font-mono text-xs font-bold uppercase tracking-widest text-thg-gold">
            {copy.eyebrow}
          </p>
          <h1 className="m-0 mt-3 text-3xl font-bold tracking-tight text-thg-textMain md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-thg-textMuted">{copy.subtitle}</p>
        </header>

        {productId ? (
          <div className="mb-16">
            {product ? (
              <ProductDetail product={product} lang={lang} copy={copy} />
            ) : (
              <p className="rounded-xl border border-thg-border bg-thg-surface p-6 text-sm text-thg-textMuted">
                {copy.detailNotFound}
              </p>
            )}
          </div>
        ) : null}

        <CatalogBrowser page={page} query={query} lang={lang} copy={copy} />
      </div>
    </main>
  );
}
