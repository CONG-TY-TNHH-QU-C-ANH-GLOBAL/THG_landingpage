// S8 · OPERATE — "Can I actually run this day to day?"
//
// The depth layer: what survives contact with a sceptical operations person. Two chapters — how an
// order is placed, and what the Hub system shows — and every module is an addressable anchor so a
// returning evaluator can link a colleague straight to the row they are arguing about.
//
// NOT A TAB SET. Six modules behind a tab strip would hide five of them from a crawler, from a
// no-JS visitor, and from anyone who linked to one directly. They are a stacked document instead,
// which costs nothing but scroll and removes an entire client island.
//
// METRIC NAMES, NEVER METRIC VALUES. The Hub is real software with real numbers in it; inventing a
// figure here would set an expectation that onboarding then has to correct. Each module names the
// metrics it exposes and says what each one tells the seller, and stops there.
import { ExternalLink } from "lucide-react";

import type { FulfillFaq } from "../models/faq";
import type { FulfillParityCopy } from "../parity-content";
import { FAQ_SLOT, pickFaq } from "./faq-placement";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";
import styles from "./fulfill.module.css";

/** The approved Hub origin. A link, not a lead surface — the self-serve branch is a way out of the
 *  page, not another form. */
const HUB_ORIGIN = "https://hub.thgfulfill.com";

/** The published SKU reference sheet, carried over verbatim from the live page. */
const SKU_SHEET =
  "https://docs.google.com/spreadsheets/d/1CE_mzKMyfFK93iS1Dm8Sk9-zijjsxdKRO786EweoCUI/edit?gid=0#gid=0";

interface Props {
  parity: FulfillParityCopy;
  movement: MovementCopy;
  faqs: readonly FulfillFaq[];
}

export default function OperateSection({ parity, movement, faqs }: Readonly<Props>) {
  const placement = pickFaq(faqs, FAQ_SLOT.orderPlacement);
  const notification = pickFaq(faqs, FAQ_SLOT.orderNotification);
  // By id, not by index: the Hub chapters are content and an editor may reorder them.
  const orders = parity.hubSections.find((section) => section.id === "orders");

  return (
    <Movement id="handbook">
      <Heading
        index={MOVEMENT_INDEX.operate}
        eyebrow={parity.hubEyebrow}
        title={movement.operateTitle}
        lead={movement.operateIntro}
      />

      {/* ── Chapter 1 · placing an order ─────────────────────────────────────────────────── */}
      <div id="order-guide" className={styles.chapter}>
        <div className={styles.chapterAside}>
          <h3 className="type-h3">{movement.orderGuideTitle}</h3>
          <p className={`${styles.muted} ${styles.spaceTopTight} type-body`}>{parity.ecountIntro}</p>
          <p className={styles.spaceTopTight}>
            <a
              className={styles.linkQuiet}
              href={SKU_SHEET}
              target="_blank"
              rel="noopener noreferrer"
            >
              {parity.ecountSkuLink}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </p>
        </div>

        <ol className={styles.steps}>
          {placement ? (
            <li className={styles.step}>
              <div>
                <h4 className="type-h4">{placement.question}</h4>
                <p className={`${styles.muted} ${styles.spaceTopTight} type-body`}>
                  {placement.answer}
                </p>
              </div>
            </li>
          ) : null}
          {notification ? (
            <li className={styles.step}>
              <div>
                <h4 className="type-h4">{notification.question}</h4>
                <p className={`${styles.muted} ${styles.spaceTopTight} type-body`}>
                  {notification.answer}
                </p>
              </div>
            </li>
          ) : null}
          <li className={styles.step}>
            <div>
              <h4 className="type-h4">{parity.ecountTitle}</h4>
              <p className={`${styles.muted} ${styles.spaceTopTight} type-body`}>{orders?.intro}</p>
            </div>
          </li>
        </ol>
      </div>

      {/* ── Chapter 2 · the Hub, six addressable modules ─────────────────────────────────── */}
      <div id="hub-guide" className={`${styles.chapter} ${styles.spaceTop}`}>
        <div className={styles.chapterAside}>
          <h3 className="type-h3">{parity.hubHeading}</h3>
          <p className={`${styles.muted} ${styles.spaceTopTight} type-body`}>{parity.hubIntro}</p>

          {/* A contents list for a document a returning reader navigates, not a menu that offers to
              skip the argument: it addresses reference material, never the page's reasoning. */}
          <nav aria-label={parity.hubToc} className={styles.spaceTopTight}>
            <ul className={styles.siblings}>
              {parity.hubSections.map((section) => (
                <li key={section.id}>
                  <a href={`#hub-${section.id}`} className={styles.linkQuiet}>
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <ol className={styles.modules}>
            {parity.hubSections.map((section) => (
              <li key={section.id} id={`hub-${section.id}`} className={styles.module}>
                <h4 className={`${styles.moduleTitle} type-h4`}>{section.title}</h4>
                <p className={`${styles.moduleIntro} type-body`}>{section.intro}</p>

                {section.bullets.length > 0 ? (
                  <ul className={`${styles.moduleBullets} type-small`}>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}

                {section.facts.length > 0 ? (
                  <div className={styles.metricNames}>
                    <p className={`${styles.muted} type-label`}>{movement.metricsTitle}</p>
                    {section.facts.map((fact) => (
                      <div key={fact.label} className={styles.metricRow}>
                        <span className={`${styles.metricName} type-small`}>{fact.label}</span>
                        <p className={`${styles.metricMeaning} type-small`}>{fact.description}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ol>

          {/* ── The self-serve branch. An outbound link, never a lead. ─────────────────── */}
          <div id="hub-cta" className={`${styles.commitFoot} ${styles.spaceTop}`}>
            <div>
              <p className="type-h4">{parity.hubCtaTitle}</p>
              <p className={`${styles.muted} ${styles.noteBody} type-small`}>{parity.hubCtaDesc}</p>
            </div>
            <a
              className={styles.linkOut}
              href={HUB_ORIGIN}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="type-h4">{parity.hubCtaLabel}</span>
              <ExternalLink size={16} className={styles.linkOutMark} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </Movement>
  );
}
