// S7 · COMMITMENT — "What happens when it goes wrong, and how do I pay?"
//
// The only movement about THG accepting risk, and the most consulted content on the page by anyone
// evaluating a fulfillment partner. It used to sit at the bottom, behind a disclosure; both of those
// were defects. Liability and payment are decision-critical, so they are visible without interaction
// and they appear at the point the question arises rather than in an appendix.
//
// FIRST DARK SURFACE. The inversion is semantic: everything before it explains a mechanism,
// everything in it is an undertaking. It is not an emphasis device and it is not decoration.
import Link from "next/link";

import type { Locale } from "@/shared/i18n";
import type { FulfillFaq } from "../models/faq";
import type { FulfillParityCopy } from "../parity-content";
import { FAQ_SLOT, pickFaq } from "./faq-placement";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";
import styles from "./fulfill.module.css";

interface Props {
  lang: Locale;
  parity: FulfillParityCopy;
  movement: MovementCopy;
  faqs: readonly FulfillFaq[];
}

/** One published undertaking. `detail` names the concrete things the statement promises, where the
 *  published wording promises some. */
interface Commitment {
  term: string;
  value: string;
  detail?: readonly string[];
}

export default function CommitmentSection({ lang, parity, movement, faqs }: Readonly<Props>) {
  const compensation = pickFaq(faqs, FAQ_SLOT.compensation);
  const payment = pickFaq(faqs, FAQ_SLOT.payment);
  const support = parity.hubSections.find((section) => section.id === "support");
  const [, transparency] = parity.advantages;

  // Only commitments THG has actually published. A row is present because there is something to say
  // in it, never because the grid looked unbalanced with three. The support row names its two
  // channels because its published intro ends by promising them — a sentence that stops at the
  // colon reads as content that went missing.
  const commitments: Commitment[] = [];
  if (compensation) {
    commitments.push({ term: movement.termCompensation, value: compensation.answer });
  }
  if (payment) commitments.push({ term: movement.termPayment, value: payment.answer });
  if (support) {
    commitments.push({
      term: movement.termSupport,
      value: support.intro,
      detail: support.facts.map((fact) => fact.label),
    });
  }
  commitments.push({ term: movement.termPolicy, value: parity.policyDesc });

  return (
    <Movement id="trust" tone="inverted">
      <Heading
        index={MOVEMENT_INDEX.commitment}
        eyebrow={movement.commitment}
        title={movement.commitmentTitle}
        lead={movement.commitmentIntro}
        aside={
          <div>
            <p className="type-h4">{transparency.title}</p>
            <p className={`${styles.muted} ${styles.spaceTopTight} type-small`}>
              {transparency.description}
            </p>
          </div>
        }
      />

      <dl className={styles.commitGrid}>
        {commitments.map((entry) => (
          <div key={entry.term} className={styles.commit}>
            <dt className={`${styles.commitTerm} type-label`}>{entry.term}</dt>
            <dd className={`${styles.commitValue} type-body`}>
              {entry.value}
              {entry.detail?.length ? (
                <span className={`${styles.commitDetail} type-small`}>
                  {entry.detail.join(" · ")}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>

      <div className={styles.commitFoot}>
        <p className="type-h4">{parity.policyTitle}</p>
        <Link href={`/${lang}/policy`} className={styles.linkQuiet}>
          {parity.policyCta}
        </Link>
      </div>
    </Movement>
  );
}
