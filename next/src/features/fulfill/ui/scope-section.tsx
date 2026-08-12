// S5 · PRODUCTION INDEX — "Can you make what I sell?"
//
// The answer has to be a product, not a category. A card reading "Apparel & drinkware" tells a
// seller that THG does print-on-demand in the abstract; a card reading the exact SKU, with its
// real origin, lead time and base cost, tells them THG can make the thing they already sell.
// So every card here IS a live Hub catalog product, resolved by id at render time, and its CTA
// deep-links to that product's specification — `products` comes from the Hub, and the section
// authors nothing about them.
//
// The cards are the shared `ProductCard` from features/catalog, not a local copy: a product
// seen here and the same product seen in the catalog must be one visual object.
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { catalogHref, ProductCard, type CatalogCopy, type CatalogProduct } from "@/features/catalog";
import type { Locale } from "@/shared/i18n";

import type { FulfillContent } from "../models/fulfill";
import type { FulfillCopy } from "../localized-content";
import { MOVEMENT_INDEX } from "./movement-copy";

interface Props {
  content: FulfillContent;
  copy: FulfillCopy;
  catalogCopy: CatalogCopy;
  /** Live Hub products; [] when the Hub is unreachable → the static illustrative cards. */
  products: readonly CatalogProduct[];
  lang: Locale;
}

/** The degraded card: product photography with no product identity and no deep link. Kept
 *  visually consistent with ProductCard but deliberately NOT the same component — it has no
 *  product to link to, and a card that looks clickable but is not is worse than a plain one. */
function IllustrativeCard({ name, image, alt }: Readonly<{ name: string; image: string; alt: string }>) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-thg-border bg-thg-surface shadow-sm">
      <div className="relative aspect-square overflow-hidden bg-thg-surfaceSubtle">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="m-0 text-pretty text-[15px] font-bold leading-snug text-thg-textMain md:text-[16px]">
          {name}
        </h3>
      </div>
    </article>
  );
}

export default function ScopeSection({ content, copy, catalogCopy, products, lang }: Readonly<Props>) {
  const live = products.length > 0;

  return (
    <section id="catalog" className="w-full border-t border-thg-border bg-thg-bg py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 flex max-w-2xl flex-col gap-4">
          <p className="m-0 font-mono text-xs font-bold uppercase tracking-widest text-thg-textMuted">
            <span className="mr-3 text-thg-gold">{MOVEMENT_INDEX.scope}</span>
            {copy.catalogEyebrow}
          </p>
          <h2 className="m-0 font-sans text-3xl font-bold leading-snug tracking-tight text-thg-textMain md:text-5xl">
            {copy.catalogTitle}
          </h2>
          <p className="m-0 max-w-xl text-base leading-relaxed text-thg-textMuted">
            {copy.catalogIntro}
          </p>
        </div>

        {/* A list, not a bare div: the count and the item boundaries are what let a screen
         *  reader user know how many products this is. The previous markup hid the grid behind
         *  aria-hidden and offered an sr-only table instead — which also hid every product
         *  link from the keyboard tab order once the cards became interactive. */}
        {live ? (
          <ul className="grid list-none grid-cols-2 gap-6 p-0 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} lang={lang} copy={catalogCopy} />
              </li>
            ))}
          </ul>
        ) : content.catalog.length > 0 ? (
          <ul className="grid list-none grid-cols-2 gap-6 p-0 lg:grid-cols-3 xl:grid-cols-4">
            {content.catalog.map((item) => (
              <li key={item.image || item.name}>
                <IllustrativeCard name={item.name} image={item.image} alt={item.name} />
              </li>
            ))}
          </ul>
        ) : (
          <>
            {/* Said out loud rather than implied: these cards are illustrative because the live
             *  catalog could not be read, so the page does not let a seller mistake three photos
             *  for the full product range. */}
            <p className="mb-8 max-w-[720px] text-sm text-thg-textMuted">{copy.catalogEmpty}</p>
            <ul className="grid list-none grid-cols-2 gap-6 p-0 lg:grid-cols-3 xl:grid-cols-4">
              {copy.catalogFallback.map((item) => (
                <li key={item.image}>
                  <IllustrativeCard name={item.name} image={item.image} alt={item.alt} />
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-12 flex w-full justify-center">
          <Link
            href={catalogHref(lang)}
            className="inline-flex items-center gap-2 rounded-full bg-thg-textMain px-8 py-4 text-sm font-semibold text-thg-surface no-underline shadow-md transition-colors duration-300 hover:bg-thg-gold hover:shadow-lg"
          >
            {copy.catalogExploreAll}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
