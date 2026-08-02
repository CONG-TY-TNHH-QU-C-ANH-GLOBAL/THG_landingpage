import type { Metadata } from "next";

import type { Locale } from "@/shared/i18n";
import {
  ServiceRoute,
  serviceMetadata,
  type ServiceSeo,
} from "@/features/services/ui/service-route";

// WEB-002 — /{lang}/thg-order. Thin binding: slug + SEO strings, everything else is the shared
// service route. SSG + ISR per the migration map.
export const revalidate = 300;

const ORDER_SEO: Readonly<Record<Locale, ServiceSeo>> = {
  en: {
    title: "THG Dropship — order and tracking management for sellers",
    description:
      "Seller-facing order and tracking management: place orders sourced from Taobao and 1688, and follow fulfillment and delivery status in one place.",
    navKey: "nav.thg_order",
  },
  vi: {
    title: "THG Dropship — quản lý đơn hàng và theo dõi vận đơn cho seller",
    description:
      "Quản lý đơn hàng và theo dõi vận đơn cho seller: đặt hàng nguồn Taobao, 1688 và theo dõi trạng thái fulfill, giao hàng ở cùng một nơi.",
    navKey: "nav.thg_order",
  },
  zh: {
    title: "THG 代发 — 面向卖家的订单与物流管理",
    description: "面向卖家的订单与物流管理：下单采购淘宝、1688 货源，并在同一处跟踪履约与配送状态。",
    navKey: "nav.thg_order",
  },
};

type PageProps = Readonly<{ params: Promise<{ lang: string }> }>;

export function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return serviceMetadata("thg-order", ORDER_SEO, params);
}

export default function ThgOrderPage({ params }: PageProps) {
  return ServiceRoute({ slug: "thg-order", seo: ORDER_SEO, params });
}
