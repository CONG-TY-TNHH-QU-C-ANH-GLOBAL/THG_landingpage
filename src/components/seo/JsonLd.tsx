// JSON-LD structured data injection. Validates with Google Rich Results Test.

import { Helmet } from "react-helmet-async";

const SITE_BASE = "https://thgfulfill.com";

interface OrganizationProps {
  name?: string;
  url?: string;
  logo?: string;
}

export function JsonLdOrganization({ name = "THG Fulfill", url = SITE_BASE, logo = `${SITE_BASE}/logo.png` }: OrganizationProps = {}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    sameAs: [
      "https://www.facebook.com/THGFulfill",
      "https://www.youtube.com/@thgfulfillment",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "121/5 Đ. Kênh 19/5, Sơn Kỳ, Tân Phú",
      addressLocality: "TP.HCM",
      addressCountry: "VN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-335-124-089",
      contactType: "customer service",
      email: "info@thgfulfill.com",
      availableLanguage: ["Vietnamese", "English", "Chinese"],
    },
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

interface ServiceProps {
  name: string;
  description: string;
  url: string;
  provider?: string;
}

export function JsonLdService({ name, description, url, provider = "THG Fulfill" }: ServiceProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: { "@type": "Organization", name: provider },
    areaServed: ["United States", "United Kingdom", "European Union", "Vietnam", "China"],
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

interface FaqItem {
  question: string;
  answer: string;
}

export function JsonLdFaqPage({ faqs }: { faqs: FaqItem[] }) {
  if (faqs.length === 0) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function JsonLdBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}
