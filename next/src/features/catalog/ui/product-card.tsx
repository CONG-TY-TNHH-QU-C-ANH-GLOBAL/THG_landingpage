import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import { countryFlag, countryName } from "@/shared/i18n/country";

import type { CatalogCopy } from "../localized-content";
import type { CatalogProduct } from "../models/product";
import { productHref } from "../routes";

// THE product card for the whole site. The catalog grid and the Fulfill capability grid render
// the same component, so a seller who sees a product on the landing page and then opens the
// catalog is looking at one visual object, not two that drifted.
//
// Accessibility, and why the markup is shaped this way: the card carries exactly ONE link, on
// the product name, stretched over the whole card via `after:absolute after:inset-0`. The
// obvious alternatives are both worse — a second link inside the hover overlay gives every
// product two identical tab stops and two identical announcements, and hiding the grid behind
// `aria-hidden` (what this surface did before) removes the links from the accessibility tree
// and the tab order entirely, which is why the overlay button was unreachable by keyboard.
// The overlay is therefore decorative, and reacts to `group-focus-within` as well as hover so
// a keyboard user sees the same affordance a mouse user does.

interface Props {
  product: CatalogProduct;
  lang: Locale;
  copy: CatalogCopy;
  /** Above-the-fold cards opt into eager loading; everything else stays lazy. */
  priority?: boolean;
  /** Show production lead time on the card foot. Off for dense browse grids. */
  showLeadTime?: boolean;
}

function Tag({ label }: Readonly<{ label: string }>) {
  return (
    <span className="inline-flex items-center rounded border border-thg-border bg-thg-bg px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-thg-textMuted">
      {label}
    </span>
  );
}

/** Hub media lives on the CDN, which is not in next.config `remotePatterns`; those URLs must
 *  bypass the optimizer. Local `/assets/...` paths still go through it. (Follow-up WEB-002-FU:
 *  add the CDN to remotePatterns and drop this.) */
const isRemote = (src: string) => src.startsWith("http");

export default function ProductCard({
  product,
  lang,
  copy,
  priority = false,
  showLeadTime = true,
}: Readonly<Props>) {
  const originName = product.origin ? countryName(product.origin, lang) : "";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-thg-border bg-thg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-thg-borderHover hover:shadow-md focus-within:border-thg-gold focus-within:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-thg-surfaceSubtle">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized={isRemote(product.image)}
            priority={priority}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right,rgba(194,155,56,0.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(194,155,56,0.05) 1px,transparent 1px)",
              backgroundSize: "20px 20px",
            }}
            aria-hidden="true"
          />
        )}

        {product.origin ? (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded border border-thg-border bg-thg-surface/90 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-thg-textMain shadow-sm backdrop-blur-md">
            <span aria-hidden="true">{countryFlag(product.origin)}</span>
            <span className="sr-only">{copy.originLabel}: </span>
            {originName || product.origin}
          </span>
        ) : null}

        {/* Decorative affordance only — the real link is the product name below. */}
        <div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-thg-textMain/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
          aria-hidden="true"
        >
          <span className="flex translate-y-4 items-center gap-2 rounded-lg bg-thg-surface px-4 py-2 text-sm font-semibold text-thg-textMain shadow-xl transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0">
            {copy.viewSpecs}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 bg-thg-surface p-5">
        {product.category ? (
          <div className="flex flex-wrap gap-1.5">
            <Tag label={product.category} />
          </div>
        ) : null}

        {/* text-balance, not line-clamp: a full product name IS the product identity — a seller
         *  needs to know which SKU this is. Balancing lets the browser break it across 2–3 lines
         *  at sensible points instead of truncating it. */}
        <h3 className="m-0 mt-1 text-pretty text-[15px] font-bold leading-snug text-thg-textMain transition-colors group-hover:text-thg-gold md:text-[16px]">
          <Link
            href={productHref(lang, product.id)}
            className="no-underline after:absolute after:inset-0 after:z-30 after:content-[''] focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto flex w-full items-end justify-between gap-3 border-t border-thg-border pt-3">
          {showLeadTime && product.prodTime ? (
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-thg-textMuted/60">
                {copy.prodTimeLabel}
              </span>
              <span className="font-mono text-[12px] font-bold text-thg-textMain">
                {product.prodTime}
              </span>
            </div>
          ) : null}

          {product.price ? (
            <div className="flex flex-col gap-1 text-right">
              <span className="font-mono text-[9px] uppercase tracking-widest text-thg-textMuted/60">
                {copy.basecostLabel}
              </span>
              <span className="font-mono text-[12px] font-bold text-thg-gold">{product.price}</span>
            </div>
          ) : (
            <span className="ml-auto font-mono text-[10px] text-thg-textMuted/60">
              {copy.contactPrice}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
