import { useEffect, useRef, type FocusEvent } from "react";
import { ArrowRight } from "lucide-react";

import { campaignLandingHref, type Campaign } from "@/lib/campaigns";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { CampaignCover } from "./CampaignCover";
import { CampaignLink } from "./CampaignLink";
import { CampaignMenuItems } from "./CampaignMenuItems";

const PANEL_ID = "campaign-mega-menu";

/** Pill label shared by the desktop trigger and the mobile group header. */
export function CampaignNavLabel({ campaign }: Readonly<{ campaign: Campaign }>) {
  return (
    <>
      <span>{campaign.nav_label ?? campaign.title}</span>
      {campaign.nav_badge ? (
        <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide text-white">
          {campaign.nav_badge}
        </span>
      ) : null}
    </>
  );
}

interface Props {
  campaign: Campaign;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClose: () => void;
}

/**
 * The featured campaign's navbar item: a red-outlined pill linking to the
 * campaign landing, with a hover/focus mega-menu (menu items on the left,
 * promo panel on the right). Open state is owned by the Navbar so only one
 * dropdown is open at a time.
 */
export function CampaignNavItem({ campaign, open, onEnter, onLeave, onClose }: Readonly<Props>) {
  const { t, language } = useI18n();
  const triggerRef = useRef<HTMLAnchorElement>(null);
  // Escape returns focus to the trigger; that focus must not reopen the panel.
  const suppressFocusOpen = useRef(false);
  const landing = campaignLandingHref(campaign, language);
  const cta = campaign.cta_label ?? t("nav.campaign_cta");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      onClose();
      suppressFocusOpen.current = true;
      triggerRef.current?.focus();
      suppressFocusOpen.current = false;
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Keyboard users open the panel by focusing the trigger and close it by
  // tabbing out of the whole item.
  const handleFocus = () => {
    if (!suppressFocusOpen.current) onEnter();
  };
  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onClose();
  };

  return (
    <div className="relative hidden xl:block" onMouseEnter={onEnter} onMouseLeave={onLeave} onFocus={handleFocus} onBlur={handleBlur}>
      <CampaignLink
        ref={triggerRef}
        target={landing}
        onClick={onClose}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        className="ml-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-red-500/70 px-3 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 hover:border-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
      >
        <CampaignNavLabel campaign={campaign} />
      </CampaignLink>

      <div
        id={PANEL_ID}
        className={cn(
          "absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-all duration-300",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0 pointer-events-none",
        )}
        style={{ transitionTimingFunction: "var(--motion-spring)" }}
      >
        <div className="grid w-[720px] grid-cols-[1fr_300px] gap-4 rounded-2xl border border-border/40 bg-card/95 p-4 shadow-[0_20px_60px_-15px_hsl(0_70%_35%/0.25)] backdrop-blur-2xl">
          <nav aria-label={t("nav.campaign_menu")}>
            <CampaignMenuItems items={campaign.menu_items} highlightFirst onNavigate={onClose} />
          </nav>
          <aside className="flex flex-col overflow-hidden rounded-xl bg-red-950 text-white">
            <div className="h-36 shrink-0">
              <CampaignCover src={campaign.cover_url} alt={campaign.title} />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-200">TH GROUP</p>
              <p className="mt-2 font-serif text-2xl font-bold leading-tight">{campaign.title}</p>
              {campaign.summary ? (
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/80">{campaign.summary}</p>
              ) : null}
              <CampaignLink
                target={landing}
                onClick={onClose}
                className="mt-auto inline-flex items-center justify-center gap-2 self-start rounded-full bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                {cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CampaignLink>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
