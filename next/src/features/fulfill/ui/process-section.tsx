// S4 · PROCESS — "What physically happens to my unit?"
//
// The plan states a claim; this movement turns it into an operation. Four states, each with what
// happens, how it can fail, and who owns that failure.
//
// FAILURE MODE AND OWNER ARE NOT INVENTED. THG operations has not signed either off, so both render
// as a labelled absence rather than as a plausible sentence. That is the whole mechanism: a gap is
// displayed, never filled, and the day operations supplies the text these two fields gain content
// with no structural change. A page that quietly omitted the fields would look finished and be
// dishonest; a page that guessed them would be worse.
//
// Static by construction. This is where scroll-driven choreography used to live, and it explained
// nothing that the four sentences do not.
import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";
import styles from "./fulfill.module.css";

interface Props {
  copy: FulfillCopy;
  parity: FulfillParityCopy;
  movement: MovementCopy;
}

export default function ProcessSection({ copy, parity, movement }: Readonly<Props>) {
  // What "print on demand" physically means, in four words. A first-time seller reading the four
  // states below needs it; an operator skims past it. Published copy, not a new claim.
  const podFlow = [parity.blankTshirt, parity.dtgPrint, parity.yourBrand, parity.brandedProduct];

  return (
    <Movement id="process" aliases={["journey", "passport"]}>
      <Heading
        index={MOVEMENT_INDEX.process}
        eyebrow={copy.journeyEyebrow}
        title={copy.journeyTitle}
        lead={copy.journeyIntro}
        aside={
          <div>
            <p className={`${styles.muted} type-label`}>{parity.podProcess}</p>
            <ol className={`${styles.visibilityRail} ${styles.railBare} ${styles.spaceTopTight}`}>
              {podFlow.map((stage) => (
                <li key={stage}>{stage}</li>
              ))}
            </ol>
          </div>
        }
      />

      <ol className={styles.states}>
        {copy.steps.map((step) => (
          <li key={step.index} className={styles.state}>
            <p className={`${styles.stateIndex} type-label`}>{step.index}</p>
            <h3 className={`${styles.stateTitle} type-h3`}>{step.title}</h3>

            <dl className={styles.stateFacts}>
              <div>
                <dt className={`${styles.stateFactTerm} type-label`}>{movement.stateTruth}</dt>
                <dd className={`${styles.stateFactValue} type-small`}>{step.description}</dd>
              </div>
              <div>
                <dt className={`${styles.stateFactTerm} type-label`}>{movement.stateFailure}</dt>
                <dd className={`${styles.stateFactValue} type-small`}>
                  <span className={styles.absent}>{movement.notPublished}</span>
                </dd>
              </div>
              <div>
                <dt className={`${styles.stateFactTerm} type-label`}>{movement.stateOwner}</dt>
                <dd className={`${styles.stateFactValue} type-small`}>
                  <span className={styles.absent}>{movement.notPublished}</span>
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>

      {/* The visibility rail: the four states a seller can watch while the above is running. Stated,
          never animated as if live — the Hub reports these, this page does not stream them. */}
      <div className={styles.spaceTop}>
        <p className={`${styles.stateFactTerm} type-label`}>{movement.stateVisibility}</p>
        <ol className={styles.visibilityRail}>
          {copy.hubStages.map((stage) => (
            <li key={stage}>{stage}</li>
          ))}
        </ol>
        <p className={`${styles.noteBody} ${styles.muted} type-small`}>{copy.hubCaption}</p>
      </div>

      <p className={`${styles.noteBody} ${styles.muted} type-small ${styles.spaceTopTight}`}>
        {copy.journeyReference}
      </p>
    </Movement>
  );
}
