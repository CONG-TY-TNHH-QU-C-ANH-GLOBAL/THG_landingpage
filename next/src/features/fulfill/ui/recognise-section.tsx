// S2 · RECOGNISE — "Is my problem the problem they solve?"
//
// This is the movement that turns a vendor page into a mirror, and it is why the plan that follows
// reads as a diagnosis rather than a pitch. A seller who recognises nothing here should leave; the
// four constraints are therefore stated plainly, in severity order, with no framing that softens
// them into benefits.
//
// A ledger, not cards: four rows of equal weight read as a list of facts about the seller's
// business. Four boxes read as a feature grid, which is the opposite claim.
import { Ship, DollarSign, PackageX, Activity } from "lucide-react";
import type { FulfillCopy } from "../localized-content";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX } from "./movement-copy";

const PAIN_ICONS = [Ship, DollarSign, PackageX, Activity];

interface Props {
  copy: FulfillCopy;
}

export default function RecogniseSection({ copy }: Readonly<Props>) {
  return (
    <Movement id="challenges">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative">
        
        {/* Left Column: Sticky Title */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-32 flex flex-col items-start text-left">
            <p className="type-label text-muted-foreground mb-4 uppercase tracking-widest">
              <span className="mr-2 text-primary">{MOVEMENT_INDEX.recognise}</span>
              {copy.painEyebrow}
            </p>
            <h2 className="type-h2 text-foreground">
              {copy.painTitle}
            </h2>
          </div>
        </div>

        {/* Right Column: Scrolling Constraints */}
        <div className="lg:col-span-8 flex flex-col">
          {copy.pains.map((pain, index) => {
            const Icon = PAIN_ICONS[index % PAIN_ICONS.length];
            return (
              <div 
                key={pain.num} 
                className={`group flex items-start gap-8 border-t border-border/50 py-16 lg:py-24 ${
                  index === copy.pains.length - 1 ? "border-b" : ""
                }`}
              >
                {/* Icon Column */}
                <div className="hidden sm:flex shrink-0 w-24 h-24 rounded-2xl bg-muted/50 border border-border items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all duration-500">
                  <Icon className="w-10 h-10 stroke-[1.5]" />
                </div>
                
                {/* Content Column */}
                <div className="flex-1 flex flex-col items-start text-left">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="type-label text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded-md">{pain.num}</span>
                    <div className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-muted-foreground">
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>
                  <h3 className="type-h3 text-foreground mb-4 max-w-[24ch]">
                    {pain.title}
                  </h3>
                  <p className="type-lead text-muted-foreground max-w-[60ch] leading-relaxed">
                    {pain.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </Movement>
  );
}
