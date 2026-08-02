import type { Metadata } from "next";

import type { Locale } from "@/shared/i18n";
import {
  ServiceRoute,
  serviceMetadata,
  type ServiceSeo,
} from "@/features/services/ui/service-route";

// WEB-002 — /{lang}/thg-express. Thin binding: slug + SEO strings, everything else is the shared
// service route. SSG + ISR per the migration map.
export const revalidate = 300;

const EXPRESS_SEO: Readonly<Record<Locale, ServiceSeo>> = {
  en: {
    title: "THG Express — international shipping VN/CN to US, UK and EU",
    description:
      "Cross-border line-haul from Vietnam and China to the US, UK and EU: transit times, restrictions and customs handling per lane.",
    navKey: "nav.thg_express",
  },
  vi: {
    title: "THG Express — vận chuyển quốc tế VN/CN đi US, UK, EU",
    description:
      "Vận chuyển xuyên biên giới từ Việt Nam và Trung Quốc đi Mỹ, Anh và EU: thời gian, hạn chế và xử lý hải quan theo từng tuyến.",
    navKey: "nav.thg_express",
  },
  zh: {
    title: "THG Express — 越南/中国至美国、英国、欧盟国际运输",
    description: "从越南和中国到美国、英国和欧盟的跨境干线运输：各线路的时效、限制与清关处理。",
    navKey: "nav.thg_express",
  },
};

type PageProps = Readonly<{ params: Promise<{ lang: string }> }>;

export function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return serviceMetadata("thg-express", EXPRESS_SEO, params);
}

export default function ThgExpressPage({ params }: PageProps) {
  return ServiceRoute({ slug: "thg-express", seo: EXPRESS_SEO, params });
}
