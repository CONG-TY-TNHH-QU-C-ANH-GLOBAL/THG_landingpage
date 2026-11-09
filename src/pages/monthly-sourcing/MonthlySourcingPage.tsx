import { Link, useParams } from "react-router-dom";

import ContactSection from "@/components/ContactSection";
import Navbar from "@/components/Navbar";
import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { useCmsMonthlySourcingMonth } from "@/hooks/useCmsContent";
import { CmsHttpError } from "@/lib/cmsClient";
import { useI18n } from "@/lib/i18n";
import { SITE_BASE } from "@/lib/seoRoutes";
import "@/lib/i18n/translations/sourcing";

const BASE_PATH = "/top-nguon-hang";
/** The first screens' worth of pages load eagerly; the rest load as the reader scrolls. */
const EAGER_PAGES = 2;

function StatusShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-40 pb-24 text-center">{children}</div>
    </div>
  );
}

/** Monthly "Top sản phẩm & nguồn hàng": the report's pages as one vertical scroll, on the main domain. */
export default function MonthlySourcingPage() {
  const { slug = "" } = useParams();
  const { language, t } = useI18n();
  const query = useCmsMonthlySourcingMonth(slug);
  const month = query.data;
  const path = `${BASE_PATH}/${slug}`;

  if (query.isLoading) {
    return (
      <StatusShell>
        <SeoHead title="Top sản phẩm & nguồn hàng — TH Group" description="" path={path} noindex />
        <p className="text-muted-foreground">{t("sourcing_page.loading")}</p>
      </StatusShell>
    );
  }

  if (!month) {
    const notFound = query.error instanceof CmsHttpError && query.error.status === 404;
    return (
      <StatusShell>
        <SeoHead title="Top sản phẩm & nguồn hàng — TH Group" description="" path={path} noindex />
        <div role={notFound ? undefined : "alert"}>
          <p className="text-muted-foreground">{t(notFound ? "sourcing_page.not_found" : "sourcing_page.load_error")}</p>
          {notFound ? (
            <Link className="mt-4 inline-block font-semibold text-primary" to={`/${language}`}>
              {t("sourcing_page.back")}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => void query.refetch()}
              disabled={query.isFetching}
              className="mt-4 font-semibold text-primary"
            >
              {t("sourcing_page.retry")}
            </button>
          )}
        </div>
      </StatusShell>
    );
  }

  const first = month.pages[0];
  const description = `${month.title} — ${t("sourcing_page.lead")}`;

  return (
    <div className="min-h-screen bg-background">
      {/* The PDF text is Vietnamese: only the VI URL is indexed, other locales are noindex duplicates. */}
      <SeoHead
        title={`${month.title} | TH Group`}
        description={description}
        path={path}
        ogImage={first?.url}
        availableLocales={["vi"]}
        noindex={language !== "vi"}
      />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: `${SITE_BASE}/vi` },
          { name: month.title, url: `${SITE_BASE}/vi${path}` },
        ]}
      />
      <Navbar />

      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{t("sourcing_page.eyebrow")}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight leading-tight mb-4">{month.title}</h1>
          <p className="text-navy/70 leading-relaxed mb-6">{t("sourcing_page.lead")}</p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Button asChild className="rounded-full bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white border-0 px-6 py-5 font-bold">
              <a href={month.pdf_url} target="_blank" rel="noopener noreferrer">
                {t("sourcing_page.open_pdf")}
              </a>
            </Button>
            <LeadFormDialog
              sourcePage={`${path}`}
              trigger={
                <Button variant="outline" className="rounded-full px-6 py-5 font-semibold">
                  {t("sourcing_page.consult")}
                </Button>
              }
            />
          </div>

          {month.pages.length > 0 ? (
            <>
              <p className="mb-3 text-center text-xs text-muted-foreground">{t("sourcing_page.scroll_hint")}</p>
              <ol className="flex flex-col gap-5" aria-label={month.title}>
                {month.pages.map((page, index) => (
                  <li key={page.url} className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
                    <img
                      src={page.url}
                      width={page.width}
                      height={page.height}
                      alt={t("sourcing_page.page_alt").replace("{n}", String(index + 1)).replace("{total}", String(month.pages.length))}
                      loading={index < EAGER_PAGES ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      decoding="async"
                      className="block h-auto w-full"
                      style={{ aspectRatio: `${page.width} / ${page.height}` }}
                    />
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p className="rounded-2xl border border-border/60 bg-card p-6 text-center text-navy/70">{t("sourcing_page.no_pages")}</p>
          )}

          <div className="mt-12 rounded-3xl bg-navy px-6 py-10 text-center text-white">
            <h2 className="mb-2 text-2xl font-bold">{t("sourcing_page.cta_title")}</h2>
            <p className="mb-6 text-white/75">{t("sourcing_page.cta_sub")}</p>
            <LeadFormDialog
              sourcePage={`${path}#cta`}
              trigger={
                <Button className="rounded-full bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white border-0 px-8 py-6 font-bold">
                  {t("sourcing_page.consult")}
                </Button>
              }
            />
          </div>
        </div>
      </main>

      <ContactSection />
    </div>
  );
}
