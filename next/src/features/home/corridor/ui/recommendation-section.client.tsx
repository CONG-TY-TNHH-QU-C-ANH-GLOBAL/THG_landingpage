"use client";

// 04 · Hệ thống đọc được gì — the recommendation, restated in the seller's own reasons.
//
// Three states, all rendered from the same pure `inferRecommendation` output: nothing answered,
// half answered, and a complete pairing. The prep list changes with the lane because that is what
// the seller would actually be asked to bring to the call.
import { localize, type LocalizedText } from "@/shared/i18n";
import { RECOMMENDATION } from "../content";
import { askOptionLabel, isCompleteRecommendation } from "../model/corridor-state";
import { LANE_EXPRESS } from "../model/questions";
import { useCorridor } from "./corridor-provider.client";
import { withEmphasis } from "./emphasis";
import styles from "./corridor.module.css";

export function RecommendationSection() {
  const { lang, recommendation } = useCorridor();
  const complete = isCompleteRecommendation(recommendation);

  let heading = RECOMMENDATION.emptyHeading;
  let lede = RECOMMENDATION.emptyLede;
  if (complete) {
    heading = RECOMMENDATION.readyHeading;
    lede = RECOMMENDATION.readyLede;
  } else if (recommendation) {
    heading = RECOMMENDATION.partialHeading;
    lede = RECOMMENDATION.partialLede;
  }

  const reasons = (recommendation?.reasons ?? []).map((reason) => localize(lang, reason));
  let why = localize(lang, RECOMMENDATION.whyEmpty);
  if (complete) {
    why = `${localize(lang, RECOMMENDATION.whyPrefix)}${reasons.join(localize(lang, RECOMMENDATION.whyJoin))}.`;
  } else if (reasons.length > 0) {
    why = `${localize(lang, RECOMMENDATION.whyPartialPrefix)}${reasons.join("; ")}.`;
  }

  // Lane-specific preparation once a lane is known; the neutral third line until then.
  let laneSpecific: readonly LocalizedText[] = RECOMMENDATION.prepUnknownLane;
  if (recommendation?.lane) {
    laneSpecific =
      recommendation.lane === LANE_EXPRESS ? RECOMMENDATION.prepExpress : RECOMMENDATION.prepWarehouse;
  }
  const prep = [...RECOMMENDATION.prepBase, ...laneSpecific];

  return (
    <section className={styles.room} id="recommendation">
      <div className={styles.roomHead}>
        <p className={styles.roomNumber}>{localize(lang, RECOMMENDATION.eyebrow)}</p>
        {/* aria-live: the heading and the combination below rewrite themselves as answers change,
            so a screen-reader user hears the update instead of silently missing it. */}
        <h2 className={styles.roomTitle} aria-live="polite">
          {localize(lang, heading)}
        </h2>
        <p className={styles.roomLede}>{localize(lang, lede)}</p>
      </div>

      <div className={styles.result}>
        <div className={styles.resultGrid}>
          <div className={styles.resultPrimary}>
            <span className={styles.resultLabel}>{localize(lang, RECOMMENDATION.comboLabel)}</span>
            <p className={styles.combo}>
              {recommendation?.source ? askOptionLabel(lang, "source", recommendation.source) : "—"}{" "}
              <span className={styles.comboJoin}>+</span>{" "}
              {recommendation?.lane ? askOptionLabel(lang, "lane", recommendation.lane) : "—"}
            </p>
            <p className={styles.why}>{withEmphasis(why)}</p>
            <p className={styles.caveat}>{localize(lang, RECOMMENDATION.caveat)}</p>
          </div>

          <div>
            <span className={styles.resultLabel}>{localize(lang, RECOMMENDATION.prepLabel)}</span>
            <ul className={styles.prep}>
              {prep.map((item) => (
                <li key={localize("en", item)}>{localize(lang, item)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
