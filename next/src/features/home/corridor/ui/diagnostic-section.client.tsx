"use client";

// 03 · Hai câu cuối — the two answers the corridor cannot collect while walking.
//
// Shares the matrix's room; rendered as its own section so the page composition stays legible and
// so this block can move (or go) without touching the matrix.
import { localize } from "@/shared/i18n";
import { DIAGNOSTIC } from "../content";
import { DIAGNOSTICS } from "../model/questions";
import { useCorridor } from "./corridor-provider.client";
import styles from "./corridor.module.css";

export function DiagnosticSection() {
  const { lang, answers, toggleChannel, setPain } = useCorridor();

  function isSelected(field: "channels" | "pain", value: string) {
    return field === "channels" ? answers.channels.includes(value) : answers.pain === value;
  }

  return (
    <section className={`${styles.room} ${styles.roomSunk}`} id="diagnostics">
      <div className={`${styles.roomHead} ${styles.roomHeadTight}`}>
        <p className={styles.roomNumber}>{localize(lang, DIAGNOSTIC.eyebrow)}</p>
        <h2 className={styles.roomTitle}>{localize(lang, DIAGNOSTIC.heading)}</h2>
        <p className={styles.roomLede}>{localize(lang, DIAGNOSTIC.lede)}</p>
      </div>

      <div className={styles.diagnostics}>
        {/* A labelled group rather than a fieldset/legend: the options are toggle buttons, not form
            controls, and `legend` cannot carry the two-column heading layout this design needs. */}
        {DIAGNOSTICS.map((question, index) => (
          <div
            key={question.field}
            className={styles.question}
            role="group"
            aria-labelledby={`corridor-q-${question.field}`}
          >
            <div className={styles.questionHead}>
              <span className={styles.questionNumber}>{String(index + 1).padStart(2, "0")}</span>
              <h3 id={`corridor-q-${question.field}`} className={styles.questionTitle}>
                {localize(lang, question.question)}
              </h3>
              {question.multi && (
                <span className={styles.questionHint}>{localize(lang, DIAGNOSTIC.multiHint)}</span>
              )}
            </div>
            <div className={styles.options}>
              {question.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={styles.option}
                  aria-pressed={isSelected(question.field, option.value)}
                  onClick={() =>
                    question.field === "channels" ? toggleChannel(option.value) : setPain(option.value)
                  }
                >
                  {localize(lang, option.label)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
