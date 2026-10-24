import { ArrowRight } from "lucide-react";

import { useCmsCampaigns } from "@/hooks/useCmsContent";
import { campaignLandingHref, formatCampaignDates, pickHomeFeatured } from "@/lib/campaigns";
import { useI18n } from "@/lib/i18n";
import { CampaignLink } from "./CampaignLink";
import { CampaignMenuItems } from "./CampaignMenuItems";

/**
 * Slim seasonal strip on the home page for the CMS's home_featured campaign.
 * Renders nothing while loading, on error, or when marketing toggles it off.
 */
export function CampaignHomeBanner() {
  const { t, language } = useI18n();
  const { data } = useCmsCampaigns(language);
  const campaign = pickHomeFeatured(data?.campaigns);
  if (!campaign) return null;

  const dates = formatCampaignDates(campaign.start_date, campaign.end_date);
  return (
    <section aria-label={campaign.title} className="container mx-auto px-4 py-6">
      <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(110deg,#7f1d1d_0%,#b91c1c_45%,#991b1b_75%,#14532d_130%)] p-6 text-white shadow-[0_20px_50px_-20px_rgba(127,29,29,0.6)] md:p-8">
        {campaign.cover_url ? (
          <img
            src={campaign.cover_url}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-y-0 right-0 hidden h-full w-1/3 object-cover opacity-40 [mask-image:linear-gradient(to_left,black,transparent)] md:block"
          />
        ) : null}
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-red-200">
              TH GROUP{dates ? ` · ${dates}` : ""}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold leading-tight md:text-3xl">{campaign.title}</h2>
            {campaign.summary ? <p className="mt-2 text-sm text-white/85 md:text-base">{campaign.summary}</p> : null}
          </div>
          <CampaignLink
            target={campaignLandingHref(campaign, language)}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-bold text-red-700 shadow-md transition hover:-translate-y-0.5 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white lg:self-center"
          >
            {campaign.cta_label ?? t("nav.campaign_cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CampaignLink>
        </div>
        <CampaignMenuItems items={campaign.menu_items} variant="cards" className="relative mt-5" />
      </div>
    </section>
  );
}
