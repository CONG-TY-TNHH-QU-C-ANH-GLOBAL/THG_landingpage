// S5 · SCOPE — "Can you make what I sell?"
//
// Product-level qualification, and the most common correct exit on the page. The boundary is
// therefore given the same weight as the catalogue: what THG will not source disqualifies as
// usefully as what it will produce, and burying it would move that discovery to a sales call.
//
// The catalogue is CMS-backed and currently empty, so the localized product-category set renders
// instead. Price and in-house time are unpublished; each renders as a labelled gap rather than
// being dropped, so the row upgrades in place the day the CMS carries a figure.
import Image from "next/image";

import type { FulfillContent } from "../models/fulfill";
import type { FulfillFaq } from "../models/faq";
import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";
import { FAQ_SLOT, pickFaq } from "./faq-placement";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";

interface Props {
  content: FulfillContent;
  copy: FulfillCopy;
  parity: FulfillParityCopy;
  movement: MovementCopy;
  faqs: readonly FulfillFaq[];
}

/** A published value, or the labelled gap. Never a dash, never an omitted row: the reader has to be
 *  able to tell "THG has not published this" from "this product has no basecost". */
function Fact({
  term,
  value,
  absentLabel,
}: Readonly<{ term: string; value: string; absentLabel: string }>) {
  return (
    <div className="flex flex-row justify-between items-baseline gap-4 py-1.5 border-b border-border last:border-b-0">
      <dt className="type-label text-muted-foreground">{term}</dt>
      <dd className="type-small text-foreground text-right font-mono">{value || <span className="text-muted-foreground font-sans">{absentLabel}</span>}</dd>
    </div>
  );
}

/** One product row, from whichever source supplied it. Normalising first means the two sources
 *  render through one path: a fallback product is the same product with nothing published, not a
 *  product with fewer fields, and neither branch can drift from the other. */
interface ProductRow {
  key: string;
  name: string;
  image: string;
  alt: string;
  price: string;
  leadTime: string;
  origin: string;
  /** CMS media is remote and not yet covered by an image-optimizer allowlist. */
  remote: boolean;
}

export default function ScopeSection({ content, copy, parity, movement, faqs }: Readonly<Props>) {
  const templates = pickFaq(faqs, FAQ_SLOT.templates);
  const limit = pickFaq(faqs, FAQ_SLOT.sourcingLimit);
  const fromCms = content.catalog.length > 0;

  // Keyed by asset path: it is the one field that identifies a product across a re-render, and two
  // catalogue rows may legitimately share a name.
  const products: readonly ProductRow[] = fromCms
    ? content.catalog.map((item) => ({
        key: item.image || item.name,
        name: item.name,
        image: item.image,
        alt: "",
        price: item.price,
        leadTime: item.leadTime,
        origin: item.origin,
        remote: true,
      }))
    : copy.catalogFallback.map((item) => ({
        key: item.image,
        name: item.name,
        image: item.image,
        alt: item.alt,
        price: "",
        leadTime: "",
        origin: "",
        remote: false,
      }));

  return (
    <Movement id="catalog">
      <Heading
        index={MOVEMENT_INDEX.scope}
        eyebrow={copy.catalogEyebrow}
        title={copy.catalogTitle}
        lead={copy.catalogIntro}
      />

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 m-0 p-0 list-none">
        {products.map((item) => (
          <li key={item.key} className="flex flex-col gap-4 bg-card border border-border rounded-lg p-4 transition-colors hover:border-primary">
            {item.image ? (
              // TODO: HALT [H-D]
              // Image crop/aspect ratio is missing from authority.
              <div className="relative w-full aspect-square bg-muted rounded-md overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  unoptimized={item.remote}
                />
              </div>
            ) : null}
            <div className="flex flex-col">
              <h3 className="type-h4 text-foreground m-0 mb-3">{item.name}</h3>
              {/* Three rows always. A missing figure is a labelled gap, never an omitted row. */}
              <dl className="flex flex-col m-0 border-t border-border pt-1">
                <Fact
                  term={parity.basecostLabel}
                  value={item.price}
                  absentLabel={movement.notPublished}
                />
                <Fact
                  term={parity.leadTimeLabel}
                  value={item.leadTime}
                  absentLabel={movement.notPublished}
                />
                <Fact
                  term={movement.originLabel}
                  value={item.origin}
                  absentLabel={movement.notPublished}
                />
              </dl>
            </div>
          </li>
        ))}
      </ul>

      {!fromCms ? (
        <p className="mt-8 type-small text-muted-foreground p-4 bg-muted/30 rounded-md max-w-[720px]">{copy.catalogEmpty}</p>
      ) : null}

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mt-16 pt-12 border-t border-border">
        {/* Templates: the artwork obligation, answered where the seller first meets it. */}
        {templates ? (
          <div className="flex-1 flex flex-col gap-3 bg-card border border-border p-6 rounded-lg [&_a]:text-primary [&_a:hover]:underline [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-ring [&_a:focus-visible]:outline-none">
            <p className="type-label text-muted-foreground m-0">{movement.templatesTitle}</p>
            <p className="type-body text-foreground m-0">{templates.answer}</p>
          </div>
        ) : null}

        {/* The stated limit. This is an exit, and it is placed to be found rather than to be
            avoided — a seller who leaves on this row saves both parties a month. */}
        {limit ? (
          <div className="flex-1 flex flex-col gap-3 bg-card border border-border p-6 rounded-lg [&_a]:text-primary [&_a:hover]:underline [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-ring [&_a:focus-visible]:outline-none">
            <p className="type-label text-muted-foreground m-0">{movement.boundaryTitle}</p>
            <p className="type-body text-foreground m-0">{limit.answer}</p>
          </div>
        ) : null}
      </div>
    </Movement>
  );
}
