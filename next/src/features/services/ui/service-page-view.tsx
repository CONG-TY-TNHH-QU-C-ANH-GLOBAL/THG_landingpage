import Image from "next/image";

import type { MarketingCopy } from "@/shared/i18n/marketing";
import { tFrom } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";
import { MarkdownLines, splitSections } from "@/shared/ui/markdown";
import { ServiceLeadCta } from "./service-lead-cta";

import type {
  ServiceBlock,
  ServicePageContent,
  ServicePageResult,
  ServicePageSlug,
} from "../models/service-page";
import type { LeadServiceKey } from "@/shared/ui/lead-services";

/** CMS page slug → canonical lead service key. These are different vocabularies on purpose:
 *  `thg-order` is the CMS page for the service whose lead key is `dropship`, and the CMS lead
 *  contract states plainly that display labels are not canonical keys. */
const LEAD_SERVICE_BY_SLUG: Readonly<Record<ServicePageSlug, LeadServiceKey>> = {
  "thg-express": "express",
  "thg-warehouse": "warehouse",
  "thg-order": "dropship",
};

// Composed generic service page (THG Express / Warehouse / Order). Server Component; the only
// client island is the shared lead dialog, which already exists and posts to the canonical
// /leads endpoint.
//
// Every section renders ONLY from CMS content. There is no filler copy, no invented statistic
// and no placeholder card: a section whose CMS group is empty is simply absent, and a page with
// nothing published shows an honest empty state rather than a plausible-looking template.

function BlockCard({ block }: Readonly<{ block: ServiceBlock }>) {
  return (
    <article className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="mb-2 flex items-center gap-2">
        {block.extras.num && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[13px] font-semibold text-primary">
            {block.extras.num}
          </span>
        )}
        {block.icon && <span aria-hidden="true">{block.icon}</span>}
        {block.extras.tag && (
          <span className="rounded-full border border-[#d4b96a] px-2 py-0.5 text-[12px] text-navy">
            {block.extras.tag}
          </span>
        )}
        {block.extras.time && (
          <span className="text-[12px] text-muted-foreground">{block.extras.time}</span>
        )}
      </div>
      {block.title && <h3 className="mb-1 text-[15px] font-semibold text-navy">{block.title}</h3>}
      {block.description && (
        <p className="text-[13px] leading-relaxed text-muted-foreground">{block.description}</p>
      )}
      {block.extras.items.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-foreground/90">
          {block.extras.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {block.extras.note && (
        <p className="mt-2 text-[12px] text-muted-foreground">{block.extras.note}</p>
      )}
    </article>
  );
}

function StatCard({ block }: Readonly<{ block: ServiceBlock }>) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 text-center">
      {block.extras.value && (
        <p className="text-2xl font-semibold text-primary">{block.extras.value}</p>
      )}
      {block.title && <p className="mt-1 text-[13px] text-muted-foreground">{block.title}</p>}
    </div>
  );
}

function BlockSection({
  heading,
  blocks,
  columns,
}: Readonly<{ heading: string; blocks: readonly ServiceBlock[]; columns: string }>) {
  if (blocks.length === 0) return null;
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-lg font-semibold text-navy">{heading}</h2>
      <div className={`grid gap-4 ${columns}`}>
        {blocks.map((block) => (
          <BlockCard key={block.id} block={block} />
        ))}
      </div>
    </section>
  );
}

function ServiceBody({ content, copy }: Readonly<{ content: ServicePageContent; copy: MarketingCopy }>) {
  const t = tFrom(copy);
  const b = content.blocksByKind;

  return (
    <>
      {b.stat && b.stat.length > 0 && (
        <section className="mb-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {b.stat.map((block) => (
              <StatCard key={block.id} block={block} />
            ))}
          </div>
        </section>
      )}

      <BlockSection
        heading={t("service.pain_points")}
        blocks={b.pain_point ?? []}
        columns="sm:grid-cols-2 lg:grid-cols-3"
      />
      <BlockSection
        heading={t("service.solutions")}
        blocks={b.solution ?? []}
        columns="sm:grid-cols-2 lg:grid-cols-3"
      />
      <BlockSection
        heading={t("service.process")}
        blocks={b.process_step ?? []}
        columns="sm:grid-cols-2 lg:grid-cols-4"
      />
      <BlockSection
        heading={t("service.lanes")}
        blocks={b.shipping_lane ?? []}
        columns="sm:grid-cols-2"
      />
      <BlockSection
        heading={t("service.policies")}
        blocks={b.policy ?? []}
        columns="sm:grid-cols-2"
      />
    </>
  );
}

export function ServicePageView({
  result,
  copy,
  lang,
}: Readonly<{ result: ServicePageResult; copy: MarketingCopy; lang: Locale }>) {
  const t = tFrom(copy);

  if (result.status === "unavailable") {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6">
          <p className="rounded-2xl border border-border/60 bg-card px-6 py-16 text-center text-muted-foreground">
            {t("service.unavailable")}
          </p>
        </main>
      </div>
    );
  }

  const { content } = result;
  const service = content.service;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6">
        <header className="mb-10">
          {service?.heroEyebrow && (
            <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-primary">
              {service.heroEyebrow}
            </p>
          )}
          <h1 className="mb-2 text-2xl font-semibold text-navy sm:text-3xl">
            {service?.heroTitle ?? service?.name ?? t(`service.${content.slug}.fallback_title`)}
          </h1>
          {service?.heroSub && (
            <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {service.heroSub}
            </p>
          )}
          {service?.tagline && !service.heroSub && (
            <p className="max-w-2xl text-[15px] text-muted-foreground">{service.tagline}</p>
          )}

          {service && service.bullets.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {service.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="rounded-full border border-[#d4b96a] bg-white px-3 py-1 text-[13px] text-navy"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            {/* Always the canonical multi-intent lead dialog — never a page-local form and
                never a direct post to any other system. */}
            <ServiceLeadCta
              lang={lang}
              copy={copy}
              label={t("nav.consult")}
              sourcePage={`/${content.slug}`}
              service={LEAD_SERVICE_BY_SLUG[content.slug]}
            />
          </div>
        </header>

        {result.status === "empty" ? (
          // The CMS answered and has nothing published for this locale. Say that, rather than
          // rendering a template that implies content exists.
          <p className="rounded-2xl border border-border/60 bg-card px-6 py-16 text-center text-muted-foreground">
            {t("service.empty")}
          </p>
        ) : (
          <>
            {service?.bodyMarkdown && service.bodyMarkdown.trim().length > 0 && (
              <section className="mb-12 text-[15px] leading-relaxed text-foreground/90">
                {splitSections(service.bodyMarkdown).map((section, i) => (
                  <div key={i}>
                    {section.heading && (
                      <h2 className="mt-6 mb-2 text-lg font-semibold text-navy">
                        {section.heading}
                      </h2>
                    )}
                    <MarkdownLines lines={section.lines} baseHeadingLevel={3} />
                  </div>
                ))}
              </section>
            )}

            <ServiceBody content={content} copy={copy} />

            {service && service.products.length > 0 && (
              <section className="mb-12">
                <h2 className="mb-4 text-lg font-semibold text-navy">{t("service.catalog")}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {service.products.map((product) => (
                    <article
                      key={product.name}
                      className="overflow-hidden rounded-2xl border border-border/60 bg-card"
                    >
                      {product.image && (
                        <Image
                          src={product.image}
                          alt=""
                          width={400}
                          height={400}
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="h-40 w-full object-contain p-3"
                          unoptimized
                          loading="lazy"
                        />
                      )}
                      <div className="p-4">
                        <p className="text-[14px] font-semibold text-navy">{product.name}</p>
                        {/* Price, lead time and origin come from the CMS record verbatim. The
                            landing formats nothing and infers nothing. */}
                        {product.price && (
                          <p className="mt-1 text-[13px] text-primary">{product.price}</p>
                        )}
                        {product.time && (
                          <p className="text-[12px] text-muted-foreground">{product.time}</p>
                        )}
                        {product.origin && (
                          <p className="text-[12px] text-muted-foreground">{product.origin}</p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {service && service.gallery.length > 0 && (
              <section className="mb-12">
                <h2 className="mb-4 text-lg font-semibold text-navy">{t("service.gallery")}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {service.gallery.map((image) => (
                    <Image
                      key={image.url}
                      src={image.url}
                      alt={image.alt}
                      width={640}
                      height={420}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="h-48 w-full rounded-xl border border-border/60 object-cover"
                      unoptimized
                      loading="lazy"
                    />
                  ))}
                </div>
              </section>
            )}

            {content.faqs.length > 0 && (
              <section className="mb-12">
                <h2 className="mb-4 text-lg font-semibold text-navy">{t("nav.faq")}</h2>
                <div className="space-y-3">
                  {content.faqs.map((faq) => (
                    <details
                      key={faq.id}
                      className="rounded-xl border border-border/60 bg-card p-4"
                    >
                      {/* <details> is the native disclosure — keyboard-operable and open to a
                          crawler with no JavaScript and no ARIA of our own. */}
                      <summary className="cursor-pointer text-[14px] font-semibold text-navy">
                        {faq.question}
                      </summary>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
