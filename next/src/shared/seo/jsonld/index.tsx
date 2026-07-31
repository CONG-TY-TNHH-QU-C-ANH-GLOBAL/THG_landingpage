// Safe JSON-LD emission (FND-003 CONTRACTS §Security, AC-06): the serializer escapes every
// character that could break out of a <script> context, so model-provided strings can never
// inject markup. Typed builders (Organization/Service/Article/…) arrive with their consuming
// slices — they accept landing models only (FND-005), and no such consumer exists in next/ yet.

/** JSON.stringify with <, >, & and the JS line separators escaped — safe inside <script>. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(
    /[<>&\u2028\u2029]/g,
    (c) => String.raw`\u${c.codePointAt(0)!.toString(16).padStart(4, "0")}`,
  );
}

/** Server Component emitting one JSON-LD script tag. `data` must be a landing-owned model
 *  or literal — never a raw DTO (CONTRACTS §"Input and output"). */
export function JsonLdScript({ data }: Readonly<{ data: unknown }>) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
  );
}

/** schema.org BreadcrumbList emitter — the single owner of the breadcrumb shape for every
 *  editorial route (parity: src/components/seo/JsonLd.tsx#JsonLdBreadcrumb). `url` values must
 *  already be absolute locale URLs from shared/seo/site — this builder does not construct URLs.
 *  A single-item trail is not a breadcrumb, so it emits nothing. */
export function BreadcrumbJsonLd({
  items,
}: Readonly<{ items: readonly { name: string; url: string }[] }>) {
  if (items.length < 2) return null;
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

/** schema.org FAQPage emitter — the single owner of the FAQ JSON-LD shape shared by every scope
 *  (home, fulfill, …). Emits nothing for an empty list (no eligible FAQ → no FAQPage). Accepts any
 *  landing FAQ model with question/answer strings. */
export function FaqPageJsonLd({
  faqs,
}: Readonly<{ faqs: readonly { question: string; answer: string }[] }>) {
  if (faqs.length === 0) return null;
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }}
    />
  );
}
