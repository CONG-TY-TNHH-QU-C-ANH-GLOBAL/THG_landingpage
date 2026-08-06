// S11 · ACT — "How do I start a conversation?"
//
// The second and last conversion moment, and the only one on the page besides the plan's. It is a
// handoff, not a capture: the consultation continues the experience instead of restarting it, so
// this movement states what the conversation will resolve rather than asking for it in a field.
//
// Capital and monthly volume are deliberately deferred to a human. They are invasive on a public
// page, they change commercial terms rather than the plan, and a person resolves them better than a
// form does. Listing them here is what makes that deferral honest rather than an omission.
import { DEFERRED_FIELDS } from "@/shared/planning/select";
import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";
import type { FulfillContent } from "../models/fulfill";
import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";
import FulfillConsultationForm from "./fulfill-consultation-form";
import { buildPlanLabels } from "./plan-labels";
import { Alias, Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";
import styles from "./fulfill.module.css";

interface Props {
  lang: Locale;
  marketingCopy: MarketingCopy;
  copy: FulfillCopy;
  parity: FulfillParityCopy;
  content: FulfillContent;
  movement: MovementCopy;
}

export default function ActSection({
  lang,
  marketingCopy,
  copy,
  parity,
  content,
  movement,
}: Readonly<Props>) {
  const labels = buildPlanLabels(lang, copy, parity);
  // Verified operational highlights when the CMS has them; the localized rail otherwise. Repeated
  // here because a seller about to start a conversation is re-checking what they are buying.
  const points = content.points.length > 0 ? content.points : copy.pointsFallback;

  return (
    <Movement id="consult" tone="inverted">
      {/* The shell owns the contact directory; the published #contact id resolves on this route
          because a link to it should land at the movement that starts a conversation. */}
      <Alias id="contact" />

      <div className={styles.closeGrid}>
        <div>
          <Heading
            index={MOVEMENT_INDEX.act}
            eyebrow={copy.consultEyebrow}
            title={copy.consultTitle}
            lead={copy.consultIntro}
          />

          <ul className={styles.closeList}>
            {points.map((point) => (
              <li key={point}>
                <span className={styles.closeMark} aria-hidden="true">
                  ·
                </span>
                <span className="type-body">{point}</span>
              </li>
            ))}
          </ul>

          <p className={`${styles.muted} type-label ${styles.spaceTopTight}`}>
            {movement.deferredTitle}
          </p>
          <ul className={styles.deferred}>
            {DEFERRED_FIELDS.map((field) => (
              <li key={field}>{labels(`field.${field}`)}</li>
            ))}
          </ul>
        </div>

        <FulfillConsultationForm lang={lang} copy={marketingCopy} />
      </div>
    </Movement>
  );
}
