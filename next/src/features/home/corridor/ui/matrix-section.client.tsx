"use client";

// 02 · Bạn vừa đi qua — the seller's own choices, read back to them as a position in THG's model.
//
// The axis labels are NOT written here: they are resolved from the corridor questions, so a
// re-wording of "Kho Mỹ" in the corridor cannot leave this table saying something else.
import { Fragment } from "react";

import { localize } from "@/shared/i18n";
import { MATRIX } from "../content";
import { askOptionLabel, comboId, isCompleteRecommendation } from "../model/corridor-state";
import { LANE_EXPRESS, LANE_WAREHOUSE, SOURCE_DROP, SOURCE_POD } from "../model/questions";
import { useCorridor } from "./corridor-provider.client";
import styles from "./corridor.module.css";

const LANES = [LANE_EXPRESS, LANE_WAREHOUSE] as const;
const SOURCES = [SOURCE_POD, SOURCE_DROP] as const;

export function MatrixSection() {
  const { lang, recommendation } = useCorridor();
  const here = isCompleteRecommendation(recommendation)
    ? comboId(recommendation.source, recommendation.lane)
    : null;

  return (
    <section className={`${styles.room} ${styles.roomSunk}`} id="matrix">
      <div className={styles.roomHead}>
        <p className={styles.roomNumber}>{localize(lang, MATRIX.eyebrow)}</p>
        <h2 className={styles.roomTitle}>{localize(lang, MATRIX.heading)}</h2>
        <p className={styles.roomLede}>{localize(lang, MATRIX.lede)}</p>
      </div>

      <div className={styles.matrixWrap}>
        <div className={styles.matrix}>
          <div className={styles.matrixCorner} />
          {LANES.map((lane) => (
            <div key={lane} className={`${styles.matrixAxis} ${styles.matrixColumnAxis}`}>
              <b>{askOptionLabel(lang, "lane", lane)}</b>
              {localize(lang, MATRIX.laneCaptions[lane])}
            </div>
          ))}

          {SOURCES.map((source) => (
            <Fragment key={source}>
              <div className={`${styles.matrixAxis} ${styles.matrixRowAxis}`}>
                <b>{askOptionLabel(lang, "source", source)}</b>
                {localize(lang, MATRIX.sourceCaptions[source])}
              </div>
              {LANES.map((lane) => {
                const id = comboId(source, lane);
                return (
                  <div key={id} className={styles.matrixCell} data-you={here === id}>
                    <b>
                      {askOptionLabel(lang, "source", source)} + {askOptionLabel(lang, "lane", lane)}
                    </b>
                    <small>{localize(lang, MATRIX.cells[id as keyof typeof MATRIX.cells])}</small>
                    {here === id && (
                      <span className={styles.matrixYouMark}>● {localize(lang, MATRIX.youAreHere)}</span>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
