// 00 · Ngưỡng — the threshold. A Server Component: it holds no state and needs no browser, so it
// stays out of the client bundle even though the corridor behind it is interactive.
//
// The single H1 is the art-directed headline, not CMS content — the same ownership rule the Fulfill
// route settled on (WEB-002): operator-editable copy becomes the eyebrow, the H1 stays the design's.
import { localize, type Locale } from "@/shared/i18n";
import { THRESHOLD } from "../content";
import { withEmphasis } from "./emphasis";
import styles from "./corridor.module.css";

interface ThresholdSectionProps {
  readonly lang: Locale;
  /** CMS hero badge when the operator has set one; falls back to the designed eyebrow. */
  readonly eyebrow?: string;
}

export function ThresholdSection({ lang, eyebrow }: ThresholdSectionProps) {
  return (
    <header className={styles.threshold} id="threshold">
      <p className={styles.eyebrow}>{eyebrow?.trim() || localize(lang, THRESHOLD.eyebrow)}</p>

      <h1 className={styles.thresholdTitle}>
        {localize(lang, THRESHOLD.headlineTop)}
        <br />
        <em>{localize(lang, THRESHOLD.headlineAccent)}</em>
      </h1>

      <div className={styles.thresholdBody}>
        <div>
          <p className={styles.thresholdLede}>{withEmphasis(localize(lang, THRESHOLD.lede))}</p>
          <p className={styles.hint}>{localize(lang, THRESHOLD.hint)}</p>
        </div>

        <div className={styles.thresholdActions}>
          {/* Both are plain in-page anchors: no JS needed to enter the corridor or to skip it. */}
          <a className={styles.primaryAction} href="#corridor">
            {localize(lang, THRESHOLD.enterCta)}
            <span aria-hidden="true">→</span>
          </a>
          <a className={styles.ghostAction} href="#waybill">
            {localize(lang, THRESHOLD.skipCta)}
          </a>
        </div>
      </div>
    </header>
  );
}
