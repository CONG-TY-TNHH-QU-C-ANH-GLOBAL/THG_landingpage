import { ArrowRight } from "lucide-react";

import { campaignLandingHref, type Campaign } from "@/lib/campaigns";
import { useI18n } from "@/lib/i18n";
import { CampaignLink } from "./CampaignLink";
import { CampaignMenuItems } from "./CampaignMenuItems";
import { CampaignNavLabel } from "./CampaignNavItem";

/** The featured campaign inside the mobile menu: a highlighted, red-outlined
 *  group with its menu items and a link to the landing. */
export function CampaignMobileGroup({
  campaign,
  onNavigate,
}: Readonly<{ campaign: Campaign; onNavigate: () => void }>) {
  const { t, language } = useI18n();
  return (
    <section className="mb-3 rounded-2xl border border-red-500/60 bg-red-50/60 p-3" aria-label={campaign.nav_label ?? campaign.title}>
      <CampaignLink
        target={campaignLandingHref(campaign, language)}
        onClick={onNavigate}
        className="flex items-center gap-2 px-2 py-1.5 text-sm font-bold text-red-700"
      >
        <CampaignNavLabel campaign={campaign} />
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold">
          {campaign.cta_label ?? t("nav.campaign_cta")} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </CampaignLink>
      <CampaignMenuItems items={campaign.menu_items} onNavigate={onNavigate} className="mt-1" />
    </section>
  );
}
