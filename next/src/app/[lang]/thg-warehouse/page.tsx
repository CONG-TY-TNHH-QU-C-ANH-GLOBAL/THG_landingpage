import type { Metadata } from "next";

import type { Locale } from "@/shared/i18n";
import {
  ServiceRoute,
  serviceMetadata,
  type ServiceSeo,
} from "@/features/services/ui/service-route";

// WEB-002 — /{lang}/thg-warehouse. Thin binding: slug + SEO strings, everything else is the shared
// service route. SSG + ISR per the migration map.
export const revalidate = 300;

const WAREHOUSE_SEO: Readonly<Record<Locale, ServiceSeo>> = {
  en: {
    title: "THG Warehouse — US warehousing and domestic fulfillment",
    description:
      "US warehouse storage and domestic fulfillment for cross-border sellers, with per-order handling and tracked domestic delivery.",
    navKey: "nav.thg_warehouse",
  },
  vi: {
    title: "THG Warehouse — kho và fulfill nội địa Mỹ",
    description:
      "Lưu kho tại Mỹ và fulfill nội địa cho seller xuyên biên giới, xử lý theo từng đơn và giao nội địa có tracking.",
    navKey: "nav.thg_warehouse",
  },
  zh: {
    title: "THG Warehouse — 美国仓储与本土履约",
    description: "面向跨境卖家的美国仓储与本土履约服务，逐单处理并提供可追踪的美国国内配送。",
    navKey: "nav.thg_warehouse",
  },
};

type PageProps = Readonly<{ params: Promise<{ lang: string }> }>;

export function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return serviceMetadata("thg-warehouse", WAREHOUSE_SEO, params);
}

export default function ThgWarehousePage({ params }: PageProps) {
  return ServiceRoute({ slug: "thg-warehouse", seo: WAREHOUSE_SEO, params });
}
