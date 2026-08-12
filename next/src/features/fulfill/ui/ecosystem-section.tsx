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
import { ArrowUpRight, Globe2, CheckCircle2, PackageCheck, LayoutDashboard, UserPlus, Printer, MessageSquareText } from "lucide-react";

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
    // `solution` joins the alias set: the "Our Solution" movement was replaced by this
    // capability reference, so links to it resolve here rather than scrolling nowhere.
    <Movement id="capabilities" aliases={["system", "solution"]}>
      <Heading
        index={MOVEMENT_INDEX.ecosystem}
        eyebrow={copy.capabilitiesEyebrow}
        title={movement.ecosystemTitle}
        lead={movement.ecosystemIntro}
      />

      {/* Sibling services as text links */}
      <ul className="flex flex-col md:flex-row flex-wrap gap-x-12 gap-y-6 mt-12 m-0 p-0 list-none">
        {SIBLINGS.map((sibling) => (
          <li key={sibling.href}>
            <Link href={`/${lang}${sibling.href}`} className="group flex items-center gap-3 type-body font-medium text-foreground hover:text-primary transition-colors no-underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">
              <span className="border-b border-transparent group-hover:border-primary pb-0.5 transition-colors">{marketingCopy[sibling.titleKey]}</span>
              <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 -translate-y-px group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      {/* Capability References (3-4 across) */}
      <div className="mt-24 pt-16 border-t border-border/30">
        <h3 className="type-h3 text-foreground m-0 max-w-[720px]">{copy.capabilitiesTitle}</h3>
        <p className="mt-6 type-lead text-muted-foreground m-0 max-w-[720px] leading-relaxed">
          {copy.capabilitiesIntro}
        </p>

        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-16">
          {CAPABILITY_ORDER.map((key, idx) => {
            const isAdvisory = key === "advisory";
            const Icon = {
              network: Globe2,
              qc: CheckCircle2,
              pack: PackageCheck,
              hub: LayoutDashboard,
              intake: UserPlus,
              print: Printer,
              advisory: MessageSquareText
            }[key];
            // Branch on the element instead of on a polymorphic `Wrapper` variable: a
            // `Link | "div"` union cannot be typed with an optional href (Link requires one),
            // which is why this needed a cast to compile. Two explicit branches need none.
            const cardClass = `group relative flex flex-col p-6 rounded-2xl border shadow-sm transition-all duration-500 overflow-hidden ${
              isAdvisory
                ? "bg-thg-textMain border-thg-textMain text-white hover:shadow-xl hover:-translate-y-2 cursor-pointer block no-underline"
                : "bg-white border-thg-border hover:shadow-md hover:-translate-y-1"
            }`;

            const body = (
              <>
                {/* Background Decor */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full transition-transform duration-700 ${
                  isAdvisory 
                    ? "bg-thg-gold/20 group-hover:scale-150" 
                    : "bg-thg-gold/5 group-hover:scale-110"
                }`} />
                
                {/* Ping animation for CTA */}
                {isAdvisory && (
                  <div className="absolute top-6 right-6 w-3 h-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-thg-gold opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-thg-gold"></span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-12 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    isAdvisory
                      ? "bg-white/10 border-white/20 group-hover:bg-thg-gold group-hover:border-thg-gold"
                      : "bg-thg-bg border-thg-border group-hover:border-thg-gold/30 group-hover:bg-thg-gold/10"
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors ${
                      isAdvisory ? "text-white" : "text-thg-textMain group-hover:text-thg-gold"
                    }`} />
                  </div>
                  {!isAdvisory && (
                    <span className="font-mono text-xs font-medium text-thg-textSubtle">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                  )}
                </div>
                
                <div className="relative z-10 mt-auto">
                  <dt className={`text-lg font-semibold mb-2 ${isAdvisory ? "text-white" : "text-thg-textMain"}`}>
                    {copy.capabilities[key].title}
                  </dt>
                  <dd className={`text-sm leading-relaxed ${isAdvisory ? "text-slate-300" : "text-thg-textMuted"}`}>
                    {copy.capabilities[key].description}
                  </dd>
                </div>
                
                {/* CTA Arrow */}
                {isAdvisory && (
                  <div className="absolute bottom-6 right-6 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 text-thg-gold" />
                  </div>
                )}
              </>
            );

            return isAdvisory ? (
              <Link key={key} href={`/${lang}/thg-fulfill#consult`} className={cardClass}>
                {body}
              </Link>
            ) : (
              <div key={key} className={cardClass}>
                {body}
              </div>
            );
          })}
        </dl>
      </div>

      {/* Platform Integrations */}
      <div className="mt-24 flex flex-col items-center text-center gap-8 border-t border-thg-border pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-thg-textSubtle m-0 font-bold">
          {parity.platformsLabel}
        </p>
        <div className="flex flex-wrap justify-center gap-4 m-0 p-0">
          {parity.platforms.map((platform) => {
            const p = platform.toLowerCase();
            let style = "bg-thg-bg text-thg-textMuted border-thg-border hover:border-thg-borderHover";
            if (p.includes("shopify")) style = "bg-[#95BF47]/10 text-[#7AB55C] border-[#95BF47]/20 hover:border-[#95BF47]/50 hover:bg-[#95BF47]/20";
            if (p.includes("etsy")) style = "bg-[#F16521]/10 text-[#F16521] border-[#F16521]/20 hover:border-[#F16521]/50 hover:bg-[#F16521]/20";
            if (p.includes("woo")) style = "bg-[#96588A]/10 text-[#96588A] border-[#96588A]/20 hover:border-[#96588A]/50 hover:bg-[#96588A]/20";
            if (p.includes("amazon")) style = "bg-[#FF9900]/10 text-[#D97D00] border-[#FF9900]/20 hover:border-[#FF9900]/50 hover:bg-[#FF9900]/20";
            if (p.includes("tiktok")) style = "bg-black/5 text-black border-black/10 hover:border-black/30 hover:bg-black/10";

            return (
              <div 
                key={platform} 
                className={`px-5 py-2.5 rounded-full border shadow-sm font-semibold text-sm transition-all duration-300 cursor-default flex items-center gap-2 ${style}`}
              >
                {platform}
              </div>
            );
          })}
        </div>
      </div>

      {/* 128 (Major Break to S10) */}
      <div className="h-12 lg:h-32" aria-hidden="true" />
    </Movement>
  );
}
