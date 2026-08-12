// One in-corridor question. Rendered by the track, which owns whether it is open; this component
// owns only its presentation and its two events.
//
// Accessibility: the options are a toggle-button group (aria-pressed), not a dialog — nothing is
// trapped, nothing is modal, and the seller can always keep scrolling past an unanswered question.
// While closed under `motion` the card is inert (pointer-events + aria-hidden) so its buttons never
// become invisible tab stops.
import { localize, type Locale } from "@/shared/i18n";
import { CORRIDOR } from "../content";
import type { CorridorAsk as CorridorAskModel } from "../model/questions";
import styles from "./corridor.module.css";

interface CorridorAskProps {
  readonly lang: Locale;
  readonly ask: CorridorAskModel;
  readonly selected: string | null;
  readonly open: boolean;
  readonly onChoose: (value: string) => void;
  readonly onSkip: () => void;
}

export function CorridorAsk({ lang, ask, selected, open, onChoose, onSkip }: CorridorAskProps) {
  return (
    <div className={styles.ask} data-open={open} data-field={ask.field}>
      <div className={styles.askHead}>
        <span className={styles.askEyebrow}>{localize(lang, ask.eyebrow)}</span>
        <h3 className={styles.askQuestion}>{localize(lang, ask.question)}</h3>
      </div>

      <div className={styles.askOptions}>
        {ask.options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={styles.askOption}
            aria-pressed={selected === option.value}
            onClick={() => onChoose(option.value)}
          >
            <b>{localize(lang, option.label)}</b>
            <small>{localize(lang, option.hint)}</small>
          </button>
        ))}
      </div>

      <button type="button" className={styles.askSkip} onClick={onSkip}>
        {localize(lang, CORRIDOR.skipQuestion)}
      </button>
    </div>
  );
}
