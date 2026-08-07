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

/** Served locally. The Vite page hot-linked this from the CMS CDN, which made the proof movement
 *  depend on a third-party origin being up. */
const FACILITY_IMAGE = "/assets/fulfill/operations-floor.jpg";

interface Props {
  copy: FulfillCopy;
  parity: FulfillParityCopy;
  movement: MovementCopy;
}

export default function ProofSection({ copy, parity, movement }: Readonly<Props>) {
  return (
    <Movement id="evidence" aliases={["solution"]}>
      <Heading
        index={MOVEMENT_INDEX.proof}
        eyebrow={parity.solutionEyebrow}
        title={parity.solutionTitle}
        lead={parity.solutionIntro}
      />

      {/* Full span (12/12) Full-bleed Facility Image */}
      <div className="mt-6 lg:mt-6 w-full">
        {/* Lazy, deliberately. This is movement 06 and sits far below the fold; the LCP element on
            this route is the qualification headline, which is text. Preloading a photograph nobody
            has scrolled to would compete with the first screen's own resources. */}
        <figure className="flex flex-col gap-3 m-0">
          <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
            <Image
              src={FACILITY_IMAGE}
              alt={movement.figureAlt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            {/* Play Icon Facade off-path (would mount player on click) - Placeholder as per blueprint */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-background/80 flex items-center justify-center shadow-sm backdrop-blur-sm">
                <svg className="w-8 h-8 ml-1 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          <figcaption className="type-small text-muted-foreground m-0">{movement.figureLabel}</figcaption>
        </figure>
      </div>
      
      {/* 128 (Major Break to S7) */}
      <div className="h-[32px] lg:h-[64px]" aria-hidden="true" />
    </Movement>
  );
}
