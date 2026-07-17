// Parity source: src/components/seo/JsonLd.tsx (JsonLdOrganization defaults + JsonLdFaqPage).
// Server Components emitting structured data through the FND-003 safe serializer; the FAQ
// input is the same FND-005 model array the page loads — never a raw DTO.
import { JsonLdScript } from "@/shared/seo";
import type { Faq } from "../models/faq";

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "THG Fulfill",
  url: "https://thgfulfill.com",
  logo: "https://thgfulfill.com/logo.png",
  sameAs: [
    "https://www.facebook.com/THGFulfill",
    "https://www.youtube.com/@thgfulfillment",
    "https://www.tiktok.com/@thgfulfillment",
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
} as const;

/** Emitted on every home render (parity: Index.tsx `<JsonLdOrganization />`). */
export function HomeOrganizationJsonLd() {
  return <JsonLdScript data={ORGANIZATION} />;
}

/** Emitted only when home-scope FAQs exist (parity: Index.tsx conditional FaqPage). */
export function HomeFaqJsonLd({ faqs }: Readonly<{ faqs: readonly Faq[] }>) {
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
  return <JsonLdScript data={data} />;
}
