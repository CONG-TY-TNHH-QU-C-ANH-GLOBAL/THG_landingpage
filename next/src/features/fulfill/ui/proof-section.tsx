// S6 · PROOF — "Does this operation physically exist?"
//
// Deliberately AFTER the mechanism. A photograph shown before the process is decoration; shown after
// it, it is evidence for something specific the reader has just been told. That ordering is the
// whole reason this movement sits here and not at the top of the page.
//
// One dominant photograph, not a gallery. A carousel of six facility shots is weaker than one real
// one, and costs six times the bandwidth to be weaker.
import Image from "next/image";

import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";
import styles from "./fulfill.module.css";

/** Served locally. The Vite page hot-linked this from the CMS CDN, which made the proof movement
 *  depend on a third-party origin being up. */
const FACILITY_IMAGE = "/assets/fulfill/operations-floor.jpg";

interface Props {
  copy: FulfillCopy;
  parity: FulfillParityCopy;
  movement: MovementCopy;
}

export default function ProofSection({ copy, parity, movement }: Readonly<Props>) {
  const [ecosystem] = parity.advantages;

  return (
    <Movement id="evidence" aliases={["solution"]}>
      <Heading
        index={MOVEMENT_INDEX.proof}
        eyebrow={parity.solutionEyebrow}
        title={parity.solutionTitle}
        lead={parity.solutionIntro}
      />

      <div className={styles.evidenceGrid}>
        {/* Lazy, deliberately. This is movement 06 and sits far below the fold; the LCP element on
            this route is the qualification headline, which is text. Preloading a photograph nobody
            has scrolled to would compete with the first screen's own resources. */}
        <figure className={styles.figure}>
          <div className={styles.figureFrame}>
            <Image
              src={FACILITY_IMAGE}
              alt={movement.figureAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 700px"
            />
          </div>
          <figcaption className={styles.figureCaption}>{movement.figureLabel}</figcaption>
        </figure>

        <div>
          <h3 className="type-h3">{ecosystem.title}</h3>
          <p className={`${styles.lead} ${styles.spaceTopTight} type-body`}>
            {ecosystem.description}
          </p>
          {/* The production-geography claim, in THG's own published wording. */}
          <p className={`${styles.muted} ${styles.spaceTopTight} type-small`}>
            {copy.capabilities.network.description}
          </p>
        </div>
      </div>
    </Movement>
  );
}
