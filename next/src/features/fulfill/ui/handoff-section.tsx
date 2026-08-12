// S6 · BOUNDARY — "Where does THG's responsibility stop?"
//
// A BOUNDARY, NOT A WORKFLOW. There are no arrows, no numbered steps and no icon chain, because the
// movement does not describe what happens over time — it states who owns what. The two sides are
// sets; reading them top-to-bottom implies no sequence and none is intended.
//
// The line is the design. It is the only place on the route where the brand gold is used as a SHAPE
// rather than as small text, which makes the most saturated element on the page the point at which
// responsibility changes hands. The two sides are set flush against it — THG's ranged right, the
// partner's ranged left — so the composition presses inward and the eye lands on the division
// rather than on either column.
//
// Per-stage owners are NOT published. Naming which team owns QC would be inventing data, so the
// movement resolves only to the level the route can support: THG, or the carrier.
import type { Locale } from "@/shared/i18n";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX, getHandoffScope, type MovementCopy } from "./movement-copy";

interface Props {
  lang: Locale;
  movement: MovementCopy;
}

export default function HandoffSection({ lang, movement }: Readonly<Props>) {
  const scope = getHandoffScope(lang);

  return (
    <Movement id="handoff">
      <Heading
        index={MOVEMENT_INDEX.handoff}
        eyebrow={movement.handoffEyebrow}
        title={movement.handoffTitle}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 mt-4">
        <div className="flex flex-col gap-6 md:pr-12 lg:pr-20 md:text-right md:items-end">
          <h3 className="type-label text-muted-foreground m-0">{movement.handoffThg}</h3>
          <ul className="flex flex-col gap-3 m-0 p-0 list-none">
            {scope.thg.map((item) => (
              <li key={item} className="type-h3 text-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* The division itself: a 2px gold rule on desktop, the same rule turned horizontal on
            mobile. A border rather than an element, so there is nothing decorative to maintain. */}
        <div className="flex flex-col gap-6 md:pl-12 lg:pl-20 md:border-l-2 md:border-primary max-md:border-t-2 max-md:border-primary max-md:pt-10">
          <h3 className="type-label text-muted-foreground m-0">{movement.handoffPartner}</h3>
          <ul className="flex flex-col gap-3 m-0 p-0 list-none">
            {scope.partner.map((item) => (
              <li key={item} className="type-h3 text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="type-label text-primary mt-12 md:text-center m-0">{movement.handoffMarker}</p>
    </Movement>
  );
}
