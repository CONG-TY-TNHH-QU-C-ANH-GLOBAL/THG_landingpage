// S9 · ECOSYSTEM — "Where does Fulfill sit inside THG?"
//
// Navigation, and deliberately placed AFTER the decision it could otherwise distract from. Links to
// sibling services are exits; near the planner they would invite a seller to shop the service menu
// instead of reading the plan produced for them, which inverts the whole argument. Here, a seller
// who has just read a plan naming Express or Warehouse knows exactly why they are clicking.
//
// The seven capabilities are a reference list, never a selectable grid. A capability is an output of
// reasoning, not something a seller is asked to pick.
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";
import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";

/** The three sibling services, with the names and one-line descriptions the shell already
 *  publishes. Nothing new is authored about a service this page does not own. */
const SIBLINGS = [
  { href: "/thg-express", titleKey: "nav.thg_express", descKey: "nav.express_desc" },
  { href: "/thg-warehouse", titleKey: "nav.thg_warehouse", descKey: "nav.warehouse_desc" },
  { href: "/thg-order", titleKey: "nav.thg_order", descKey: "nav.order_desc" },
] as const;

const CAPABILITY_ORDER = [
  "network",
  "qc",
  "pack",
  "hub",
  "intake",
  "print",
  "advisory",
] as const satisfies readonly (keyof FulfillCopy["capabilities"])[];

interface Props {
  lang: Locale;
  marketingCopy: MarketingCopy;
  copy: FulfillCopy;
  parity: FulfillParityCopy;
  movement: MovementCopy;
}

export default function EcosystemSection({
  lang,
  marketingCopy,
  copy,
  parity,
  movement,
}: Readonly<Props>) {
  return (
    <Movement id="capabilities" aliases={["system"]}>
      <Heading
        index={MOVEMENT_INDEX.ecosystem}
        eyebrow={copy.capabilitiesEyebrow}
        title={movement.ecosystemTitle}
        lead={movement.ecosystemIntro}
      />

      {/* Sibling services as text links */}
      <ul className="flex flex-col md:flex-row flex-wrap gap-x-8 gap-y-4 mt-8 m-0 p-0 list-none">
        {SIBLINGS.map((sibling) => (
          <li key={sibling.href}>
            <Link href={`/${lang}${sibling.href}`} className="group flex items-center gap-2 type-body font-medium text-foreground hover:text-primary transition-colors no-underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">
              <span>{marketingCopy[sibling.titleKey]}</span>
              <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      {/* Capability References (3-4 across) */}
      <div className="mt-16 pt-12 border-t border-border">
        <h3 className="type-h3 text-foreground m-0 max-w-[720px]">{copy.capabilitiesTitle}</h3>
        <p className="mt-4 type-body text-muted-foreground m-0 max-w-[720px]">
          {copy.capabilitiesIntro}
        </p>

        <dl className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 lg:gap-x-12 gap-y-12 mt-12">
          {CAPABILITY_ORDER.map((key) => (
            <div key={key} className="flex flex-col gap-2 pb-6 border-b border-border">
              <dt className="type-body font-medium text-foreground m-0">{copy.capabilities[key].title}</dt>
              <dd className="type-small text-muted-foreground m-0">
                {copy.capabilities[key].description}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Platform Integrations */}
      <div className="mt-16">
        <p className="type-label text-muted-foreground m-0">{parity.platformsLabel}</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-3 mt-4 p-0 list-none type-small text-foreground m-0">
          {parity.platforms.map((platform) => (
            <li key={platform}>{platform}</li>
          ))}
        </ul>
      </div>

      {/* 128 (Major Break to S10) */}
      <div className="h-8 lg:h-32" aria-hidden="true" />
    </Movement>
  );
}
