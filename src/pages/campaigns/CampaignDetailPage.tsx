import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";

import Navbar from "@/components/Navbar";
import { ArticleMarkdown } from "@/components/article/ArticleMarkdown";
import { CampaignCover } from "@/components/campaigns/CampaignCover";
import { CampaignLink } from "@/components/campaigns/CampaignLink";
import { CampaignMenuItems } from "@/components/campaigns/CampaignMenuItems";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { SeoHead } from "@/components/seo/SeoHead";
import { useCmsCampaign } from "@/hooks/useCmsContent";
import { formatCampaignDates, resolveCampaignHref } from "@/lib/campaigns";
import { CmsHttpError } from "@/lib/cmsClient";
import { useI18n } from "@/lib/i18n";
import { SITE_BASE } from "@/lib/seoRoutes";
import "@/lib/i18n/translations/campaigns";

/** Loading / error / not-found states share one centred layout. */
function StatusShell({ path, title, noindex, children }: Readonly<{ path: string; title?: string; noindex?: boolean; children: ReactNode }>) {
  return (
    <div className="min-h-screen">
      {title ? <SeoHead title={title} description="" path={path} noindex={noindex} /> : null}
      <Navbar />
      <div className="pt-40 text-center">{children}</div>
    </div>
  );
}

export default function CampaignDetailPage() {
  const { slug = "" } = useParams();
  const { language, t } = useI18n();
  const query = useCmsCampaign(slug, language);
  const campaign = query.data?.campaign;
  const path = `/campaigns/${slug}`;

  if (query.isLoading) {
    return (
      <StatusShell path={path}>
        <p className="text-muted-foreground">{t("campaign.loading")}</p>
      </StatusShell>
    );
  }
  if (!campaign) {
    const notFound = query.error instanceof CmsHttpError && query.error.status === 404;
    return (
      <StatusShell path={path} title={`${t("campaign.title")} — TH Group`} noindex>
        <div role={notFound ? undefined : "alert"}>
          <p className="text-muted-foreground">{t(notFound ? "campaign.not_found" : "campaign.load_error")}</p>
          {notFound ? (
            <Link className="mt-4 inline-block font-semibold text-primary" to={`/${language}/campaigns`}>
              {t("campaign.back")}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => void query.refetch()}
              disabled={query.isFetching}
              className="mt-4 font-semibold text-primary"
            >
              {t("campaign.retry")}
            </button>
          )}
        </div>
      </StatusShell>
    );
  }

  const available = query.data?.available_locales ?? [];
  const locales = available.length ? available : [language];
  const landing = resolveCampaignHref(campaign.landing_path, language);
  const dates = formatCampaignDates(campaign.start_date, campaign.end_date);
  const cta = campaign.cta_label ?? t("nav.campaign_cta");
  const url = `${SITE_BASE}/${language}/campaigns/${campaign.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={campaign.seo_title ?? `${campaign.title} — TH Group`}
        description={campaign.seo_description ?? campaign.summary ?? ""}
        path={`/campaigns/${campaign.slug}`}
        ogImage={campaign.og_image_url ?? campaign.cover_url ?? undefined}
        ogImageAlt={campaign.title}
        availableLocales={locales}
        // VI-fallback copy served under /en or /zh is not a translation.
        noindex={!locales.includes(language)}
      />
      <JsonLdBreadcrumb
        items={[
          { name: t("campaign.home"), url: `${SITE_BASE}/${language}` },
          { name: t("campaign.title"), url: `${SITE_BASE}/${language}/campaigns` },
          { name: campaign.title, url },
        ]}
      />
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 pt-28 pb-20">
        <Link to={`/${language}/campaigns`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t("campaign.back")}
        </Link>
        <header className="mt-8">
          {dates ? (
            <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {dates}
            </p>
          ) : null}
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-navy md:text-5xl">{campaign.title}</h1>
          {campaign.summary ? (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{campaign.summary}</p>
          ) : null}
          {landing ? (
            <CampaignLink
              target={landing}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              {cta} <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </CampaignLink>
          ) : null}
        </header>
        {campaign.cover_url ? (
          <div className="mt-8 aspect-[16/7] overflow-hidden rounded-3xl">
            <CampaignCover src={campaign.cover_url} alt={campaign.title} eager />
          </div>
        ) : null}
        {campaign.menu_items.length > 0 ? (
          <CampaignMenuItems items={campaign.menu_items} className="mt-8 grid gap-2 space-y-0 sm:grid-cols-2" />
        ) : null}
        {campaign.body_md ? (
          <article className="mt-10">
            <ArticleMarkdown markdown={campaign.body_md} contentsLabel={t("campaign.contents")} />
          </article>
        ) : null}
      </main>
    </div>
  );
}
