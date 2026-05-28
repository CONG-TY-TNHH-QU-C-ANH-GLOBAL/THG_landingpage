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

interface JobPostingProps {
  title: string;
  /** Plain-text or simple-HTML description (responsibilities + requirements). */
  description: string;
  url: string;
  /** Display location, e.g. "TP.HCM". */
  location?: string;
  /** CMS employment_type free text, e.g. "Full-time", "Internship 3–6 tháng". */
  employmentType?: string;
  /** ISO 8601 date (YYYY-MM-DD). Omitted if not a valid ISO date. */
  datePosted?: string;
  /** ISO 8601 date the posting expires (from deadline). Omitted if not ISO. */
  validThrough?: string;
}

// Map CMS free-text employment_type → schema.org employmentType enum.
function toEmploymentTypeEnum(s?: string): string | undefined {
  if (!s) return undefined;
  const t = s.toLowerCase();
  if (t.includes("intern") || t.includes("thực tập")) return "INTERN";
  if (t.includes("part")) return "PART_TIME";
  if (t.includes("contract")) return "CONTRACTOR";
  if (t.includes("temp")) return "TEMPORARY";
  return "FULL_TIME";
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** schema.org/JobPosting — required for Google for Jobs eligibility. Emits only
 *  the fields Google accepts; datePosted/validThrough are included only when a
 *  real ISO date is available (a malformed date would invalidate the markup). */
export function JsonLdJobPosting({
  title,
  description,
  url,
  location,
  employmentType,
  datePosted,
  validThrough,
}: JobPostingProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    url,
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: "THG Fulfill",
      sameAs: SITE_BASE,
      logo: `${SITE_BASE}/logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location || "TP.HCM",
        addressCountry: "VN",
      },
    },
  };
  const empEnum = toEmploymentTypeEnum(employmentType);
  if (empEnum) data.employmentType = empEnum;
  if (datePosted && ISO_DATE.test(datePosted)) data.datePosted = datePosted;
  if (validThrough && ISO_DATE.test(validThrough)) data.validThrough = validThrough;

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
