// S2 · RECOGNISE — "Is my problem the problem they solve?"
//
// This is the movement that turns a vendor page into a mirror, and it is why the plan that follows
// reads as a diagnosis rather than a pitch. A seller who recognises nothing here should leave; the
// four constraints are therefore stated plainly, in severity order, with no framing that softens
// them into benefits.
//
// A ledger, not cards: four rows of equal weight read as a list of facts about the seller's
// business. Four boxes read as a feature grid, which is the opposite claim.
import type { FulfillCopy } from "../localized-content";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX } from "./movement-copy";

interface Props {
  copy: FulfillCopy;
}

export default function RecogniseSection({ copy }: Readonly<Props>) {
  return (
    <Movement id="challenges">
      <Heading
        index={MOVEMENT_INDEX.recognise}
        eyebrow={copy.painEyebrow}
        title={copy.painTitle}
      />

      {/* 
        // HALT [H-A]
        // Isolation tier and collapse order are missing from authority.
        // We do not invent values to patch this.
      */}

      {/* Severity order — shipping, cost, system, control — is content, not styling. It is the order
          in which these constraints stop a seller from growing, and it is not re-sortable. */}
      <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {copy.pains.map((pain) => (
          <li key={pain.num} className="flex flex-col items-start text-left border-t border-border pt-6">
            <span className="type-label text-muted-foreground mb-4">{pain.num}</span>
            <h3 className="type-h4 text-foreground mb-2">{pain.title}</h3>
            <p className="type-body text-muted-foreground max-w-[78ch]">{pain.description}</p>
          </li>
        ))}
      </ol>
    </Movement>
  );
}
