import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";

import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import { SeoHead } from "@/components/seo/SeoHead";
import { CampaignCover } from "@/components/campaigns/CampaignCover";
import { useCmsCampaigns } from "@/hooks/useCmsContent";
import { formatCampaignDates } from "@/lib/campaigns";
import { useI18n } from "@/lib/i18n";
import "@/lib/i18n/translations/campaigns";

export default function CampaignsPage() {
  const { language, t } = useI18n();
  const query = useCmsCampaigns(language);
  const campaigns = query.data?.campaigns ?? [];
  const isEmpty = !query.isLoading && !query.isError && campaigns.length === 0;
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={t("campaign.seo_title")}
        description={t("campaign.subtitle")}
        path="/campaigns"
        noindex={isEmpty || query.isError}
      />
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <ScrollReveal>
          <header className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[.22em] text-primary">TH Group</p>
            <h1 className="mt-4 text-4xl font-bold text-navy md:text-5xl">{t("campaign.title")}</h1>
            <p className="mt-4 text-muted-foreground">{t("campaign.subtitle")}</p>
          </header>
        </ScrollReveal>
        {query.isLoading && <p className="py-16 text-center text-muted-foreground">{t("campaign.loading")}</p>}
        {query.isError && (
          <div className="py-16 text-center" role="alert">
            <p className="text-muted-foreground">{t("campaign.load_error")}</p>
            <button
              type="button"
              onClick={() => void query.refetch()}
              disabled={query.isFetching}
              className="mt-4 font-semibold text-primary"
            >
              {t("campaign.retry")}
            </button>
          </div>
        )}
        {isEmpty && <p className="py-16 text-center text-muted-foreground">{t("campaign.empty")}</p>}
        <section className="grid gap-7 md:grid-cols-2">
          {campaigns.map((campaign) => {
            const dates = formatCampaignDates(campaign.start_date, campaign.end_date);
            return (
              <ScrollReveal key={campaign.slug}>
                <Link
                  to={`/${language}/campaigns/${encodeURIComponent(campaign.slug)}`}
                  className="group block h-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-[16/8] overflow-hidden">
                    <CampaignCover
                      src={campaign.cover_url}
                      alt={campaign.title}
                      className="transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    {dates ? (
                      <p className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        {dates}
                      </p>
                    ) : null}
                    <h2 className="text-xl font-bold text-navy group-hover:text-primary">{campaign.title}</h2>
                    {campaign.summary ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {campaign.summary}
                      </p>
                    ) : null}
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      {t("nav.campaign_cta")}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </section>
      </main>
    </div>
  );
}
