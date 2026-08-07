// S1 · QUALIFY
//
// The decision this movement serves is the cheapest one on the page and the most valuable: whether
// to keep reading at all. So it carries the scope panel and the page's first exit, and it carries
// NO call to action. A seller who has not yet learned what the service covers cannot meaningfully
// ask for a consultation, and an ask placed here converts the wrong people.
//
// The <h1> is the art-directed headline owned by this feature. A CMS-supplied service label renders
// as the eyebrow above it — the CMS never supplies the page's single heading.
import type { FulfillContent } from "../models/fulfill";
import type { FulfillFaq } from "../models/faq";
import type { FulfillCopy } from "../localized-content";
import { FAQ_SLOT, pickFaq } from "./faq-placement";
import type { MovementCopy } from "./movement-copy";
import { MOVEMENT_INDEX } from "./movement-copy";

/** Invariant scope tokens. Market and country codes are not translated, and rendering them as a
 *  structured row is a restatement of the published scope answer shown directly beneath — not a
 *  second, competing claim. */
const SCOPE = {
  services: "POD · Dropship",
  origins: "VN · CN · US",
  destinations: "US · UK · WW",
} as const;

interface Props {
  copy: FulfillCopy;
  content: FulfillContent;
  movement: MovementCopy;
  faqs: readonly FulfillFaq[];
}

export default function QualifySection({ copy, content, movement, faqs }: Readonly<Props>) {
  // An editor-set hero eyebrow wins over the service identity, which wins over the localized
  // default. The CMS supplies the label above the headline and never the headline itself.
  const serviceLabel = content.heroEyebrow || content.serviceLabel || copy.heroBadge;
  const subtitle = content.heroSubtitle || copy.heroSubtitleFallback;
  const points = content.points.length > 0 ? content.points : copy.pointsFallback;
  const scopeAnswer = pickFaq(faqs, FAQ_SLOT.serviceScope);

  return (
    <section id="top" className="w-full bg-background pt-16 pb-16 lg:pt-24 lg:pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-6">
          {/* Primary region: 7/12 on desktop */}
          <div className="col-span-4 md:col-span-8 lg:col-span-7 flex flex-col justify-start items-start text-left">
            
            <p className="type-label text-muted-foreground mb-4">
              <span className="mr-2 text-primary">{MOVEMENT_INDEX.qualify}</span>
              {movement.qualify}
            </p>

            <h1 className="type-display text-foreground mb-12">
              {copy.heroHeadline}
            </h1>
            
            <p className="type-lead text-foreground max-w-[720px] mb-12">
              {subtitle}
            </p>

            <ul className="flex flex-col gap-2 type-small text-muted-foreground mb-12">
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            
            {/* Resting Space */}
            <div className="h-8 lg:h-12 w-full" aria-hidden="true" />

            {/* Note: The exit and scope list were originally rendered side-by-side in a grid.
                The visual blueprint strictly dictates that S1 has NO supporting content on the right (5/12 empty),
                so the scope panel and exit gate remain sequentially in the 7/12 column stack. */}
            <div className="flex flex-col mt-8 border-t border-border pt-8 w-full max-w-[720px]">
              <p className="type-label text-muted-foreground mb-4">{serviceLabel}</p>
              <h2 className="type-h2 text-foreground mb-6">{movement.scopeTitle}</h2>

              <dl className="flex flex-col gap-4 mb-6">
                <div className="flex flex-row justify-between items-baseline border-b border-border/50 pb-2">
                  <dt className="type-label text-muted-foreground">{movement.scopeServices}</dt>
                  <dd className="type-body text-foreground">{SCOPE.services}</dd>
                </div>
                <div className="flex flex-row justify-between items-baseline border-b border-border/50 pb-2">
                  <dt className="type-label text-muted-foreground">{movement.scopeOrigins}</dt>
                  <dd className="type-body text-foreground">{SCOPE.origins}</dd>
                </div>
                <div className="flex flex-row justify-between items-baseline border-b border-border/50 pb-2">
                  <dt className="type-label text-muted-foreground">{movement.scopeDestinations}</dt>
                  <dd className="type-body text-foreground">{SCOPE.destinations}</dd>
                </div>
              </dl>

              {scopeAnswer ? (
                <p className="type-small text-muted-foreground mb-8 max-w-[720px]">{scopeAnswer.answer}</p>
              ) : null}

              <div className="bg-muted/30 p-6 rounded-md">
                <p className="type-label text-muted-foreground mb-2">{movement.exitTitle}</p>
                <p className="type-small text-foreground max-w-[720px]">{movement.exitText}</p>
              </div>
            </div>

          </div>

          {/* Supporting region: 5/12 on desktop. EMPTY intentionally for isolation. */}
          <div className="hidden lg:block lg:col-span-5" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
