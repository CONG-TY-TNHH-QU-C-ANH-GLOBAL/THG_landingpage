// Structured data for the fulfill route (WEB-002). Service is always emitted from validated
// landing values; FAQPage is emitted ONLY when published fulfill-scope FAQs exist — never for
// placeholder or empty content. Serialized through the FND-003 safe serializer.
import { JsonLdScript, FaqPageJsonLd } from "@/shared/seo";
import type { FulfillFaq } from "../models/faq";

interface Props {
  name: string;
  description: string;
  /** Canonical page URL for this locale. */
  url: string;
  faqs: readonly FulfillFaq[];
}

export function FulfillServiceJsonLd({ name, description, url }: Readonly<Omit<Props, "faqs">>) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: "Order fulfillment",
    url,
    areaServed: ["VN", "CN", "US"],
    provider: {
      "@type": "Organization",
      name: "THG Fulfill",
      url: "https://thgfulfill.com",
    },
  };
  return <JsonLdScript data={data} />;
}

/** Emitted only when published fulfill-scope FAQs exist. Delegates to the shared FAQPage emitter. */
export function FulfillFaqJsonLd({ faqs }: Readonly<{ faqs: readonly FulfillFaq[] }>) {
  return <FaqPageJsonLd faqs={faqs} />;
}
