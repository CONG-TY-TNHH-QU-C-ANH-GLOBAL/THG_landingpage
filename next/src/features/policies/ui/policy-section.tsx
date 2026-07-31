import Image from "next/image";

import type { PolicyDetail, PolicyTextBlock } from "../models/policy";
import { isPolicyContentEmpty } from "../models/policy";
import { MarkdownLines, splitSections } from "./markdown-blocks";

// One policy rendered in full. Server Component — no state, no client island.

const TONE_STYLE: Readonly<Record<PolicyTextBlock["tone"], string>> = {
  normal: "border-border/60 bg-white",
  warn: "border-amber-300 bg-amber-50",
  info: "border-sky-300 bg-sky-50",
};

/** The CMS `icon` column holds an emoji, or the literal sentinel "tiktok" for the one
 *  brand mark that has no emoji [FACT: Vite PolicyPage SectionIcon]. */
export function PolicyIcon({ icon }: Readonly<{ icon: string | null }>) {
  if (icon === "tiktok") {
    return (
      <svg
        className="h-4 w-4"
        viewBox="0 0 448 512"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h.05A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z" />
      </svg>
    );
  }
  return <span aria-hidden="true">{icon ?? "📄"}</span>;
}

function TextBlocks({ blocks }: Readonly<{ blocks: readonly PolicyTextBlock[] }>) {
  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <section key={block.id} className={`rounded-xl border p-4 ${TONE_STYLE[block.tone]}`}>
          <h3 className="mb-2 text-[15px] font-semibold text-navy">{block.heading}</h3>
          {block.paragraphs.map((paragraph) => (
            <p
              key={paragraph.id}
              className="my-1.5 text-[13px] leading-relaxed text-foreground/90"
            >
              {paragraph.text}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}

function PolicyPages({
  images,
  title,
  pagesLabel,
}: Readonly<{ images: readonly string[]; title: string; pagesLabel: string }>) {
  return (
    <>
      <div className="space-y-4">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${title} — ${i + 1}/${images.length}`}
            width={1240}
            height={1754}
            sizes="(max-width: 900px) 100vw, 900px"
            className="h-auto w-full rounded-xl border border-border/60 bg-white"
            // CMS-hosted media on a host with no configured remote pattern — same posture
            // as the Fulfill catalog images.
            unoptimized
            // Only the first page of the first policy is above the fold; the rest of a
            // multi-page scan set must not block the initial render.
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>
      <p className="mt-4 mb-2 text-center text-[12px] text-muted-foreground">
        {title} — {images.length} {pagesLabel}
      </p>
    </>
  );
}

export interface PolicySectionCopy {
  /** Localized "pages" unit for the scan-count caption. */
  pagesLabel: string;
  /** Shown when this policy has no readable content in the requested locale (OQ-P-001). */
  noContent: string;
}

export function PolicySection({
  policy,
  copy,
}: Readonly<{ policy: PolicyDetail; copy: PolicySectionCopy }>) {
  const bodySections = splitSections(policy.bodyMarkdown);

  return (
    // `scroll-mt` keeps the heading clear of the fixed floating navbar when a #fragment
    // link jumps here.
    <section id={policy.slug} className="mb-12 scroll-mt-28">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-navy">
        <PolicyIcon icon={policy.icon} />
        {policy.title}
      </h2>
      {policy.summary && (
        <p className="mb-4 text-[13px] text-muted-foreground">{policy.summary}</p>
      )}

      {isPolicyContentEmpty(policy) ? (
        <p className="rounded-xl border border-border/60 bg-white p-4 text-[13px] text-muted-foreground">
          {copy.noContent}
        </p>
      ) : (
        <>
          {policy.images.length > 0 && (
            <PolicyPages images={policy.images} title={policy.title} pagesLabel={copy.pagesLabel} />
          )}
          {policy.blocks.length > 0 && <TextBlocks blocks={policy.blocks} />}
          {/* body_md renders only when there are no structured blocks — the CMS populates
              one or the other, and showing both would duplicate the same terms. */}
          {policy.blocks.length === 0 &&
            bodySections.map((section) => (
              <div key={section.id} className="text-[13px] leading-relaxed text-foreground/90">
                {section.heading && (
                  <h3 className="mt-4 mb-1 text-[15px] font-semibold text-navy">
                    {section.heading}
                  </h3>
                )}
                {/* base 2: splitSections already consumed the `##` section headings, so the
                    shallowest construct left in these bodies is `###`, which lands at h4 —
                    directly under the h3 section heading above it. lineOffset keeps parsed-node
                    ids unique across sections of the same document. */}
                <MarkdownLines
                  lines={section.lines}
                  baseHeadingLevel={2}
                  lineOffset={section.lineOffset}
                />
              </div>
            ))}
        </>
      )}
    </section>
  );
}
