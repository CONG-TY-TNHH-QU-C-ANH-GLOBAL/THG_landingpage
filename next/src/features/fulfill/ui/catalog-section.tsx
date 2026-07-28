// Catalog section (WEB-002) — Server Component. Renders the CMS product ecosystem when the
// `thg-fulfill` service exposes products; otherwise the approved product-category showcase
// (real brand photography, no fabricated SKU / price). The prototype's "[DEMO] SKU" tags are
// intentionally never rendered.
import Image from "next/image";

import type { FulfillContent } from "../models/fulfill";
import type { FulfillCopy } from "../copy";
import styles from "./fulfill.module.css";

function CatalogCard({
  name,
  image,
  note,
  alt,
  unoptimized,
}: Readonly<{ name: string; image: string; note?: string; alt: string; unoptimized?: boolean }>) {
  return (
    <div
      className="border rounded-2xl p-6 flex flex-col items-center transition-transform duration-300 hover:-translate-y-1"
      style={{ background: "var(--fx-bg)", borderColor: "var(--fx-border)" }}
    >
      <div className="w-full aspect-square rounded-xl flex items-center justify-center mb-6 overflow-hidden bg-white">
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
      <div className="w-full flex justify-between items-center gap-3">
        <span className="font-bold">{name}</span>
        {note ? (
          <span
            className={`${styles.mono} text-xs border px-2 py-1 rounded`}
            style={{ color: "var(--fx-gray)", borderColor: "var(--fx-border)" }}
          >
            {note}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function CatalogSection({
  content,
  copy,
}: Readonly<{ content: FulfillContent; copy: FulfillCopy }>) {
  const hasCmsCatalog = content.catalog.length > 0;

  return (
    <section
      className="py-24 bg-white border-t relative"
      style={{ borderColor: "var(--fx-border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12">
          <span className={styles.sectionIndex}>{copy.catalogEyebrow}</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-2">{copy.catalogTitle}</h2>
          <p className="text-sm" style={{ color: "var(--fx-gray)" }}>
            {hasCmsCatalog ? copy.catalogIntro : copy.catalogEmpty}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hasCmsCatalog
            ? content.catalog.map((item) => (
                <CatalogCard
                  key={item.name}
                  name={item.name}
                  image={item.image}
                  note={item.note || undefined}
                  alt={item.name}
                  // CMS media are remote URLs; served unoptimized until image remotePatterns are
                  // approved (next.config change flagged, not made in this task).
                  unoptimized
                />
              ))
            : copy.catalogFallback.map((item) => (
                <CatalogCard key={item.name} name={item.name} image={item.image} alt={item.alt} />
              ))}
        </div>
      </div>
    </section>
  );
}
