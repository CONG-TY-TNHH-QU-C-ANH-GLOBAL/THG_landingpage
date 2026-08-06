// S1 · QUALIFY — "What is this, and is it for my operation?"
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
import styles from "./fulfill.module.css";

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
    <section id="top" className={`${styles.section} ${styles.hero}`}>
      <div className={`${styles.inner} ${styles.innerWide}`}>
        <div className={styles.heroGrid}>
          <div>
            {/* The same eyebrow the other ten movements use, so the page numbers itself
                consistently from the first line onward. */}
            <p className={`${styles.eyebrow} type-label`}>
              <span className={styles.eyebrowIndex}>{MOVEMENT_INDEX.qualify}</span>
              {movement.qualify}
            </p>

            <h1 className={`${styles.heroTitle} type-display`}>{copy.heroHeadline}</h1>
            <p className={`${styles.heroLead} type-lead`}>{subtitle}</p>

            <ul className={styles.heroRail}>
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          {/* The scope panel. Gate G0: everything downstream is wasted on a seller outside these
              three rows, so the rows come before the argument rather than after it. */}
          <div className={styles.scope}>
            <p className="type-label">{serviceLabel}</p>
            <h2 className="type-h3">{movement.scopeTitle}</h2>

            <dl className={styles.scopeList}>
              <div className={styles.scopeRow}>
                <dt className={`${styles.scopeTerm} type-label`}>{movement.scopeServices}</dt>
                <dd className={`${styles.scopeValue} type-h4`}>{SCOPE.services}</dd>
              </div>
              <div className={styles.scopeRow}>
                <dt className={`${styles.scopeTerm} type-label`}>{movement.scopeOrigins}</dt>
                <dd className={`${styles.scopeValue} type-h4`}>{SCOPE.origins}</dd>
              </div>
              <div className={styles.scopeRow}>
                <dt className={`${styles.scopeTerm} type-label`}>{movement.scopeDestinations}</dt>
                <dd className={`${styles.scopeValue} type-h4`}>{SCOPE.destinations}</dd>
              </div>
            </dl>

            {/* The published scope answer, verbatim, at the point the question is asked. It also
                appears in the canonical index; that duplication is the design. */}
            {scopeAnswer ? (
              <p className={`${styles.scopeNote} type-small`}>{scopeAnswer.answer}</p>
            ) : null}
          </div>
        </div>

        {/* The first exit. A seller who leaves here has been served correctly. */}
        <div className={`${styles.note} ${styles.spaceTop}`}>
          <p className="type-label">{movement.exitTitle}</p>
          <p className={`${styles.noteBody} type-small`}>{movement.exitText}</p>
        </div>
      </div>
    </section>
  );
}
