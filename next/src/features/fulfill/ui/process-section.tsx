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
    <>
      {/* Enforce the 128px major break (this sits between S3 and S4). 
          Since Movement provides its own padding, this spacer visually ensures the boundary is large.
          (Assuming padding collapsing logic is handled by section spacing rules). */}
      <div className="h-8" aria-hidden="true" />
      <Movement id="process" aliases={["journey", "passport"]}>
        <Heading
          index={MOVEMENT_INDEX.process}
          eyebrow={copy.journeyEyebrow}
          title={copy.journeyTitle}
          lead={copy.journeyIntro}
          aside={
            <div className="mt-4 lg:mt-0">
              <p className="type-label text-muted-foreground mb-2">{parity.podProcess}</p>
              <ol className="flex flex-wrap items-center gap-2 lg:gap-4 m-0 p-0 list-none text-muted-foreground type-small font-mono">
                {podFlow.map((stage, idx) => (
                  <li key={stage} className="flex items-center gap-2 lg:gap-4">
                    <span>{stage}</span>
                    {idx < podFlow.length - 1 && <span aria-hidden="true" className="text-border">→</span>}
                  </li>
                ))}
              </ol>
            </div>
          }
        />

        <ol className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6 mt-12 lg:mt-16">
          {copy.steps.map((step) => (
            <li key={step.index} className="flex flex-col gap-4 border-t border-border pt-6">
              <p className="type-label text-muted-foreground m-0">{step.index}</p>
              <h3 className="type-h3 text-foreground m-0">{step.title}</h3>

              <dl className="grid gap-4 mt-2">
                <div className="grid gap-1">
                  <dt className="type-label text-muted-foreground">{movement.stateTruth}</dt>
                  <dd className="type-small text-foreground m-0">{step.description}</dd>
                </div>
                <div className="grid gap-1">
                  <dt className="type-label text-muted-foreground">{movement.stateFailure}</dt>
                  <dd className="type-small m-0 text-muted-foreground">
                    <span>{movement.notPublished}</span>
                  </dd>
                </div>
                <div className="grid gap-1">
                  <dt className="type-label text-muted-foreground">{movement.stateOwner}</dt>
                  <dd className="type-small m-0 text-muted-foreground">
                    <span>{movement.notPublished}</span>
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>

        {/* The visibility rail: the four states a seller can watch while the above is running. Stated,
            never animated as if live — the Hub reports these, this page does not stream them. */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="type-label text-muted-foreground mb-4">{movement.stateVisibility}</p>
          <ol className="flex flex-wrap items-center gap-2 lg:gap-4 m-0 p-0 list-none text-foreground type-small font-mono mb-4">
            {copy.hubStages.map((stage, idx) => (
              <li key={stage} className="flex items-center gap-2 lg:gap-4">
                <span>{stage}</span>
                {idx < copy.hubStages.length - 1 && <span aria-hidden="true" className="text-border">→</span>}
              </li>
            ))}
          </ol>
          <p className="type-small text-muted-foreground m-0 max-w-[720px]">{copy.hubCaption}</p>
        </div>

        <p className="mt-6 type-small text-muted-foreground m-0 max-w-[720px]">
          {copy.journeyReference}
        </p>
      </Movement>
    </>
  );
}
