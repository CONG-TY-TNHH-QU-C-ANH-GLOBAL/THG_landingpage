// Catalog section (WEB-002) — Server Component. Renders the CMS product ecosystem when the
// `thg-fulfill` service exposes products; otherwise the approved product-category showcase
// (real brand photography, no fabricated SKU / price). The prototype's "[DEMO] SKU" tags are
// intentionally never rendered.
import Image from "next/image";

import { ServiceSectionHeader } from "@/shared/service";
import type { FulfillContent } from "../models/fulfill";
import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";
import styles from "./fulfill.module.css";

function CatalogCard({
  name,
  image,
  note,
  price,
  leadTime,
  origin,
  basecostLabel,
  leadTimeLabel,
  alt,
  unoptimized,
}: Readonly<{
  name: string;
  image: string;
  note?: string;
  price?: string;
  leadTime?: string;
  origin?: string;
  basecostLabel: string;
  leadTimeLabel: string;
  alt: string;
  unoptimized?: boolean;
}>) {
  // R3 parity: the Vite card labels basecost and in-house time as separate facts and badges the
  // production origin. Each renders only when the CMS supplied it — never a fabricated figure.
  //
  // `note` is the collapsed "price · time · origin" line and is a FALLBACK for products whose CMS
  // record carries none of the three structured fields. Origin counts here: a product with only an
  // origin would otherwise show it twice — once as the badge and once as an identical note.
  const hasStructuredMetadata = Boolean(price || leadTime || origin);
  return (
    <div
      className="border rounded-2xl p-6 flex flex-col items-center transition-transform duration-300 hover:-translate-y-1"
      style={{ background: "var(--fx-bg)", borderColor: "var(--fx-border)" }}
    >
      <div className="relative w-full aspect-square rounded-xl flex items-center justify-center mb-6 overflow-hidden bg-white">
        {origin ? (
          <span
            className={`${styles.mono} absolute top-2 right-2 z-10 rounded-full border bg-white/90 px-2 py-1 text-[10px] font-bold`}
            style={{ borderColor: "var(--fx-border)" }}
          >
            {origin}
          </span>
        ) : null}
        {image ? (
          <Image
            src={image}
            alt={alt}
            width={400}
            height={400}
            sizes="(max-width: 768px) 90vw, 30vw"
            className="w-2/3 h-auto"
            style={{ mixBlendMode: "multiply" }}
            unoptimized={unoptimized}
          />
        ) : null}
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center gap-3">
          <span className="font-bold">{name}</span>
          {!hasStructuredMetadata && note ? (
            <span
              className={`${styles.mono} text-xs border px-2 py-1 rounded`}
              style={{ color: "var(--fx-gray)", borderColor: "var(--fx-border)" }}
            >
              {note}
            </span>
          ) : null}
        </div>
        {price || leadTime ? (
          <dl
            className="mt-4 space-y-2 border-t border-dashed pt-4 text-sm"
            style={{ borderColor: "var(--fx-border)" }}
          >
            {price ? (
              <div className="flex justify-between items-center gap-3">
                <dt style={{ color: "var(--fx-gray)" }}>{basecostLabel}</dt>
                <dd className="font-bold" style={{ color: "var(--fx-blue)" }}>
                  {price}
                </dd>
              </div>
            ) : null}
            {leadTime ? (
              <div className="flex justify-between items-center gap-3">
                <dt style={{ color: "var(--fx-gray)" }}>{leadTimeLabel}</dt>
                <dd className="font-semibold">{leadTime}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </div>
    </div>
  );
}

export default function CatalogSection({
  content,
  copy,
  parity,
}: Readonly<{ content: FulfillContent; copy: FulfillCopy; parity: FulfillParityCopy }>) {
  const hasCmsCatalog = content.catalog.length > 0;

  return (
    <section
      className="py-24 bg-white border-t relative"
      style={{ borderColor: "var(--fx-border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <ServiceSectionHeader
          eyebrow={copy.catalogEyebrow}
          title={copy.catalogTitle}
          intro={hasCmsCatalog ? copy.catalogIntro : copy.catalogEmpty}
          introClassName="max-w-2xl text-sm"
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hasCmsCatalog
            ? content.catalog.map((item) => (
                <CatalogCard
                  key={item.name}
                  name={item.name}
                  image={item.image}
                  note={item.note || undefined}
                  price={item.price || undefined}
                  leadTime={item.leadTime || undefined}
                  origin={item.origin || undefined}
                  basecostLabel={parity.basecostLabel}
                  leadTimeLabel={parity.leadTimeLabel}
                  alt={item.name}
                  // CMS media are remote URLs; served unoptimized until image remotePatterns are
                  // approved (next.config change flagged, not made in this task).
                  unoptimized
                />
              ))
            : copy.catalogFallback.map((item) => (
                <CatalogCard
                  key={item.name}
                  name={item.name}
                  image={item.image}
                  alt={item.alt}
                  basecostLabel={parity.basecostLabel}
                  leadTimeLabel={parity.leadTimeLabel}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
