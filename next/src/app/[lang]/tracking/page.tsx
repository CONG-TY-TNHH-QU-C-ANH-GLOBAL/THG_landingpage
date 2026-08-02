import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import { BreadcrumbJsonLd, buildPageMetadata, localeUrl } from "@/shared/seo";
import { buildHubTrackingLink } from "@/integrations/hub";

// WEB-008 — /{lang}/tracking. Fully static: no CMS read, no order lookup, no searchParams.
//
// The Vite page rendered an order-ID form that fetched VITE_TRACKING_LOOKUP_URL from the
// browser. That variable has no default and is not configured here, so its real production
// behavior is to accept an order ID and then answer "lookup unavailable" — asking for input it
// cannot serve — while putting an order identifier on the public plane. WEB-008 §6 replaces it
// with a deep-link to the Hub, which owns authenticated order and shipment truth.
//
// This page therefore claims nothing about any order. It explains where tracking lives and
// links there; when the Hub origin is unconfigured or fails validation it explains the same
// thing WITHOUT a CTA rather than rendering a broken button.
export const dynamic = "force-static";

type PageProps = Readonly<{ params: Promise<{ lang: string }> }>;

const TRACKING_SEO: Readonly<Record<Locale, { title: string; description: string }>> = {
  en: {
    title: "Order tracking — THG Fulfill",
    description:
      "Track THG orders and shipments in the THG Hub, where order and delivery status is kept.",
  },
  vi: {
    title: "Theo dõi đơn hàng — THG Fulfill",
    description:
      "Theo dõi đơn hàng và vận đơn THG trong THG Hub, nơi lưu trạng thái đơn và giao hàng.",
  },
  zh: {
    title: "订单追踪 — THG Fulfill",
    description: "在 THG Hub 中跟踪 THG 订单与运单，订单及配送状态均保存在该系统中。",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) return {};
  return buildPageMetadata({
    lang,
    routeId: "/tracking",
    title: TRACKING_SEO[lang].title,
    description: TRACKING_SEO[lang].description,
    // Indexable: the page's own content (where tracking lives, how to reach it) is complete
    // and true regardless of the Hub link, unlike a CMS-backed page with no content.
    indexable: true,
  });
}

export default async function TrackingPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();

  const copy = await getMarketingCopy(lang);
  const t = tFrom(copy);
  const link = buildHubTrackingLink(lang);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), url: localeUrl(lang, "/") },
          { name: t("nav.tracking"), url: localeUrl(lang, "/tracking") },
        ]}
      />
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6">
          <h1 className="mb-2 text-2xl font-semibold text-navy">{t("nav.tracking")}</h1>
          <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {t("tracking.hub_explainer")}
          </p>

          {link ? (
            <a
              href={link.url}
              // The Hub is a separate application; rel prevents the opener reference and
              // referrer leakage across that boundary.
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t("tracking.open_hub")}
            </a>
          ) : (
            // No validated Hub origin: say where tracking lives, offer no link. A CTA that
            // goes nowhere is worse than no CTA.
            <p className="rounded-xl border border-border/60 bg-card p-4 text-[13px] text-muted-foreground">
              {t("tracking.hub_unavailable")}
            </p>
          )}

          <p className="mt-6 text-[13px] text-muted-foreground">{t("tracking.no_public_lookup")}</p>
        </main>
      </div>
    </>
  );
}
