// JSON-LD structured data injection. Validates with Google Rich Results Test.

import { Helmet } from "react-helmet-async";

import { useI18n } from "@/lib/i18n";

const SITE_BASE = "https://thgfulfill.com";

// Rewrite an absolute thgfulfill URL to include the active language segment so
// breadcrumb items match the lang-prefixed canonical/hreflang URLs. Idempotent:
// strips any existing lang segment first to avoid /vi/vi/... duplication.
function withLang(url: string, language: string): string {
  if (!url.startsWith(SITE_BASE)) return url;
  const path = url.slice(SITE_BASE.length).replace(/^\/(en|vi|zh)(?=\/|$)/, "");
  if (path === "" || path === "/") return `${SITE_BASE}/${language}`;
  return `${SITE_BASE}/${language}${path}`;
}

const ISO_DATE_PREFIX = /^\d{4}-\d{2}-\d{2}/;

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

interface QaPageProps {
  /** The question title (schema.org Question.name). */
  question: string;
  /** The question body text. */
  text: string;
  /** Canonical, lang-prefixed page URL. */
  url: string;
  /** Display name of the asker. */
  authorName?: string;
  /** THG expert answer text — the acceptedAnswer. Required for QA rich results. */
  expertAnswer: string;
  /** Unix seconds the question was published (emitted as ISO when present). */
  publishedAt?: number | null;
  /** "Same issue" count — mapped to Question.upvoteCount. */
  upvoteCount?: number;
}

/** schema.org/QAPage for community questions (SEO Loop, Business Plan §2).
 *  Only render when an expert answer exists — Google requires at least one
 *  answer for QAPage rich results, and the moderation rules only allow
 *  indexing answered/verified content anyway. */
export function JsonLdQaPage({
  question,
  text,
  url,
  authorName,
  expertAnswer,
  publishedAt,
  upvoteCount,
}: Readonly<QaPageProps>) {
  if (!expertAnswer.trim()) return null;
  const mainEntity: Record<string, unknown> = {
    "@type": "Question",
    name: question,
    text,
    answerCount: 1,
    acceptedAnswer: {
      "@type": "Answer",
      text: expertAnswer,
      url,
      author: { "@type": "Organization", name: "THG Fulfill", url: SITE_BASE },
    },
  };
  if (authorName) mainEntity.author = { "@type": "Person", name: authorName };
  if (publishedAt) mainEntity.datePublished = new Date(publishedAt * 1000).toISOString();
  if (upvoteCount !== undefined) mainEntity.upvoteCount = upvoteCount;

  const data = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity,
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

interface ReviewProps {
  /** Review title (schema.org Review.name). */
  name: string;
  /** Review body text. */
  body: string;
  /** Canonical, lang-prefixed page URL. */
  url: string;
  /** Reviewer display name. */
  authorName: string;
  /** Star rating 1–5. Required — Review markup is only emitted when present so
   *  reviewRating is always valid (a Review without a rating is incomplete). */
  rating: number;
  /** Unix seconds the review was published (emitted as ISO when present). */
  publishedAt?: number | null;
}

/** schema.org/Review of the THG Fulfill service. Only rendered for verified,
 *  indexable reviews that carry a numeric rating, so the emitted markup is
 *  always complete and valid (itemReviewed + reviewRating + author + body).
 *  Reviews without a rating fall back to no markup rather than invalid JSON-LD. */
export function JsonLdReview({ name, body, url, authorName, rating, publishedAt }: Readonly<ReviewProps>) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Review",
    name,
    reviewBody: body,
    url,
    author: { "@type": "Person", name: authorName },
    itemReviewed: {
      "@type": "Organization",
      name: "THG Fulfill",
      url: SITE_BASE,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: rating,
      bestRating: 5,
      worstRating: 1,
    },
  };
  if (publishedAt) data.datePublished = new Date(publishedAt * 1000).toISOString();
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
  // Read the active language so breadcrumb URLs match the lang-prefixed
  // canonical/hreflang (call sites still pass plain absolute URLs).
  const { language } = useI18n();
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: withLang(item.url, language),
    })),
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

interface ArticleProps {
  headline: string;
  description?: string;
  /** Absolute image URL (og image / first slide). */
  image?: string;
  /** Publish date — emitted only when it looks like an ISO date (YYYY-MM-DD…). */
  datePublished?: string;
  /** Canonical, lang-prefixed page URL. */
  url: string;
}

/** schema.org/Article for blog posts — enables article rich results. Publisher
 *  and author default to the THG Fulfill Organization. */
export function JsonLdArticle({ headline, description, image, datePublished, url }: ArticleProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "THG Fulfill", url: SITE_BASE },
    publisher: {
      "@type": "Organization",
      name: "THG Fulfill",
      logo: { "@type": "ImageObject", url: `${SITE_BASE}/logo.png` },
    },
  };
  if (description) data.description = description;
  if (image) data.image = image;
  if (datePublished && ISO_DATE_PREFIX.test(datePublished)) data.datePublished = datePublished;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}
