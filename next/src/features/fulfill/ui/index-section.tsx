// S10 · INDEX — "The specific thing I still want to look up."
//
// The canonical, addressable list of the seven answers, and the single source the FAQPage structured
// data is generated from. Visible content and structured data therefore cannot describe different
// things, which is the failure this movement exists to make impossible.
//
// NOT AN ACCORDION. Every answer is in the DOM, unfolded. Six of the seven have already appeared at
// their point of doubt earlier in the page; this is the lookup path for a reader who came back for
// one of them, and a lookup path that hides its content is a search box with extra clicks.
import Link from "next/link";

import type { Locale } from "@/shared/i18n";
import type { FulfillFaq } from "../models/faq";
import type { FulfillCopy } from "../localized-content";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";
import styles from "./fulfill.module.css";

interface Props {
  lang: Locale;
  copy: FulfillCopy;
  movement: MovementCopy;
  faqs: readonly FulfillFaq[];
}

export default function IndexSection({ lang, copy, movement, faqs }: Readonly<Props>) {
  return (
    <Movement id="qa">
      <Heading
        index={MOVEMENT_INDEX.index}
        eyebrow={copy.faqEyebrow}
        title={copy.faqTitle}
        lead={copy.faqIntro}
        aside={
          // The path for a question this page does not answer. Moderation-first: it goes to the
          // community, not to a form that implies an immediate reply.
          <Link href={`/${lang}/community`} className={styles.linkQuiet}>
            {copy.faqAskCommunity}
          </Link>
        }
      />

      {faqs.length > 0 ? (
        <dl className={styles.qa}>
          {faqs.map((faq) => (
            <div key={faq.id} id={`qa-${faq.id}`} className={styles.qaItem}>
              <dt className={`${styles.qaQuestion} type-h4`}>{faq.question}</dt>
              <dd className={`${styles.qaAnswer} type-body`}>{faq.answer}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className={`${styles.note} type-small`}>{copy.faqEmpty}</p>
      )}
    </Movement>
  );
}
