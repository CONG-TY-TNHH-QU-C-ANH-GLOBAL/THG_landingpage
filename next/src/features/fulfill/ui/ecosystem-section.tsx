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
import styles from "./fulfill.module.css";

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
    <Movement id="capabilities" aliases={["system"]} tone="surface">
      <Heading
        index={MOVEMENT_INDEX.ecosystem}
        eyebrow={copy.capabilitiesEyebrow}
        title={movement.ecosystemTitle}
        lead={movement.ecosystemIntro}
      />

      <ul className={styles.siblings}>
        {SIBLINGS.map((sibling) => (
          <li key={sibling.href}>
            <Link href={`/${lang}${sibling.href}`} className={styles.linkOut}>
              <span>
                <span className="type-h4">{marketingCopy[sibling.titleKey]}</span>
                <span className={`${styles.muted} type-small`}>
                  {marketingCopy[sibling.descKey]}
                </span>
              </span>
              <ArrowUpRight size={18} className={styles.linkOutMark} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.spaceTop}>
        <h3 className="type-h3">{copy.capabilitiesTitle}</h3>
        <p className={`${styles.lead} ${styles.spaceTopTight} type-body`}>
          {copy.capabilitiesIntro}
        </p>

        <dl className={`${styles.capabilities} ${styles.spaceTopTight}`}>
          {CAPABILITY_ORDER.map((key) => (
            <div key={key} className={styles.capability}>
              <dt className={`${styles.capabilityTerm} type-h4`}>{copy.capabilities[key].title}</dt>
              <dd className={`${styles.capabilityText} type-small`}>
                {copy.capabilities[key].description}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={styles.spaceTop}>
        <p className={`${styles.muted} type-label`}>{parity.platformsLabel}</p>
        <ul className={`${styles.platforms} ${styles.spaceTopTight}`}>
          {parity.platforms.map((platform) => (
            <li key={platform}>{platform}</li>
          ))}
        </ul>
      </div>
    </Movement>
  );
}
