import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import { countryFlag, countryName } from "@/shared/i18n/country";

import type { CatalogCopy } from "../localized-content";
import type { CatalogProduct } from "../models/product";
import { catalogHref } from "../routes";

// The `?productId=` surface: a product's full specification, server-rendered.
//
// The Vite equivalent was a modal with six pieces of client state (active image, series filter,
// selected variant, shipping channel, share-copied, video playing). None of that is state a
// SPECIFICATION needs — it is state a *gallery widget* needs. Here the whole spec is on the
// page at once: every image is rendered in a scroll strip, and every variant is a row in a
// table with both shipping prices side by side. A seller comparing two products can read both
// pages, and both are linkable. The interactive gallery is a deliberate omission, not an
// oversight — it becomes a client island the day someone asks for it.

interface Props {
  product: CatalogProduct;
  lang: Locale;
  copy: CatalogCopy;
}

const isRemote = (src: string) => src.startsWith("http");

function SpecList({ label, items }: Readonly<{ label: string; items: readonly string[] }>) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="m-0 font-mono text-[10px] font-bold uppercase tracking-widest text-thg-textMuted">
        {label}
      </h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-thg-textMain">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Fact({ label, value }: Readonly<{ label: string; value: string }>) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-thg-textMuted">
        {label}
      </dt>
      <dd className="m-0 font-mono text-sm font-bold text-thg-textMain">{value}</dd>
    </div>
  );
}

export default function ProductDetail({ product, lang, copy }: Readonly<Props>) {
  const days = (v: string) => (v ? `${v} ${copy.businessDays}` : "");

  return (
    <article className="rounded-2xl border border-thg-border bg-thg-surface p-6 shadow-sm lg:p-10">
      <Link
        href={catalogHref(lang)}
        className="inline-flex items-center gap-2 text-sm font-medium text-thg-textMuted no-underline transition-colors hover:text-thg-gold"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {copy.detailBack}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl border border-thg-border bg-thg-surfaceSubtle">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={isRemote(product.image)}
                priority
              />
            ) : null}
          </div>

          {product.images.length > 1 ? (
            <ul className="mt-3 flex list-none gap-3 overflow-x-auto p-0">
              {product.images.slice(1).map((src) => (
                <li key={src} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-thg-border bg-thg-surfaceSubtle">
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized={isRemote(src)}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            {product.category ? (
              <p className="m-0 font-mono text-[10px] font-bold uppercase tracking-widest text-thg-gold">
                {product.category}
              </p>
            ) : null}
            {/* h2, not h1: the route already owns the page's single h1 ("Product catalog").
             *  A second h1 would leave the document with two competing top-level headings. */}
            <h2 className="m-0 mt-2 text-pretty text-2xl font-bold leading-tight text-thg-textMain lg:text-3xl">
              {product.name}
            </h2>
            {product.origin ? (
              <p className="m-0 mt-3 text-sm text-thg-textMuted">
                <span aria-hidden="true">{countryFlag(product.origin)}</span>{" "}
                {copy.originLabel}: {countryName(product.origin, lang) || product.origin}
              </p>
            ) : null}
          </div>

          <p className="m-0 font-mono text-2xl font-bold text-thg-gold">
            {product.price || copy.contactPrice}
          </p>

          <dl className="m-0 grid grid-cols-2 gap-5 border-y border-thg-border py-5">
            <Fact label={copy.prodTimeLabel} value={days(product.prodTime)} />
            <Fact label={copy.shipTimeLabel} value={days(product.shipTime)} />
            <Fact label={copy.skuLabel} value={product.thgSku} />
            <Fact label={copy.supplierSkuLabel} value={product.sku} />
            <Fact label={copy.sizeLabel} value={product.sizes.join(", ")} />
            <Fact label={copy.colorLabel} value={product.colors.join(", ")} />
          </dl>

          <Link
            href={`/${lang}/thg-fulfill#consult`}
            className="inline-flex w-fit items-center rounded-full bg-thg-textMain px-7 py-3.5 text-sm font-semibold text-thg-surface no-underline transition-colors hover:bg-thg-gold"
          >
            {copy.consultCta}
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-8 border-t border-thg-border pt-8 md:grid-cols-3">
        <SpecList label={copy.materialLabel} items={product.material} />
        <SpecList label={copy.featuresLabel} items={product.features} />
        <SpecList label={copy.careLabel} items={product.care} />
      </div>

      {product.variants.length > 0 ? (
        <div className="mt-10 border-t border-thg-border pt-8">
          <h3 className="m-0 font-mono text-[10px] font-bold uppercase tracking-widest text-thg-textMuted">
            {copy.variantsLabel}
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-thg-border text-left font-mono text-[10px] uppercase tracking-widest text-thg-textMuted">
                  <th scope="col" className="py-2 pr-4 font-bold">{copy.variantsLabel}</th>
                  <th scope="col" className="py-2 pr-4 font-bold">{copy.skuLabel}</th>
                  <th scope="col" className="py-2 pr-4 font-bold">LBL</th>
                  <th scope="col" className="py-2 font-bold">MER</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((v) => (
                  <tr key={v.id} className="border-b border-thg-border/60">
                    <td className="py-2 pr-4 text-thg-textMain">
                      {v.series ? `${v.series} · ` : ""}
                      {v.variant}
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-thg-textMuted">{v.thgSku || "——"}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-thg-textMain">{v.priceLabel || "——"}</td>
                    <td className="py-2 font-mono text-xs text-thg-textMain">{v.priceMerchant || "——"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </article>
  );
}
