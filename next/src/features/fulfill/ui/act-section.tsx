// S11 · ACT — "How do I start a conversation?"
//
// The second and last conversion moment, and the only one on the page besides the plan's. It is a
// handoff, not a capture: the consultation continues the experience instead of restarting it, so
// this movement states what the conversation will resolve rather than asking for it in a field.
//
// Capital and monthly volume are deliberately deferred to a human. They are invasive on a public
// page, they change commercial terms rather than the plan, and a person resolves them better than a
// form does. Listing them here is what makes that deferral honest rather than an omission.
import Link from "next/link";
import { DEFERRED_FIELDS } from "@/shared/planning/select";
import type { Locale } from "@/shared/i18n";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { FulfillContent } from "../models/fulfill";
import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";
import { buildPlanLabels } from "./plan-labels";
import { Alias, Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";

interface Props {
  lang: Locale;
  marketingCopy: MarketingCopy;
  copy: FulfillCopy;
  parity: FulfillParityCopy;
  content: FulfillContent;
  movement: MovementCopy;
}

export default function ActSection({
  lang,
  marketingCopy,
  copy,
  parity,
  content,
  movement,
}: Readonly<Props>) {
  const t = tFrom(marketingCopy);
  const labels = buildPlanLabels(lang, copy, parity);
  // Verified operational highlights when the CMS has them; the localized rail otherwise. Repeated
  // here because a seller about to start a conversation is re-checking what they are buying.
  const points = content.points.length > 0 ? content.points : copy.pointsFallback;

  return (
    <Movement id="consult">
      {/* The shell owns the contact directory; the published #contact id resolves on this route
          because a link to it should land at the movement that starts a conversation. */}
      <Alias id="contact" />

      <div className="flex flex-col gap-8 max-w-[720px]">
        <Heading
          index={MOVEMENT_INDEX.act}
          eyebrow={copy.consultEyebrow}
          title={copy.consultTitle}
          lead={copy.consultIntro}
        />

        <ul className="flex flex-col gap-3 m-0 p-0 list-none mt-2">
          {points.map((point) => (
            <li key={point} className="flex gap-4">
              <span className="text-primary font-bold" aria-hidden="true">
                ·
              </span>
              <span className="type-body text-foreground">{point}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-8 border-t border-border/50">
          <p className="type-label text-muted-foreground m-0">
            {movement.deferredTitle}
          </p>
          <ul className="flex flex-wrap gap-x-3 gap-y-2 mt-4 m-0 p-0 list-none type-small font-mono text-muted-foreground">
            {DEFERRED_FIELDS.map((field, idx) => (
              <li key={field} className="flex items-center gap-3">
                <span>{labels(`field.${field}`)}</span>
                {idx < DEFERRED_FIELDS.length - 1 && <span className="text-border" aria-hidden="true">|</span>}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Primary Action */}
        <div className="mt-8">
          <Link
            href={`/${lang}/contact?service=fulfill`}
            className="inline-flex items-center justify-center h-[52px] px-8 bg-primary text-primary-foreground font-bold type-button rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background no-underline w-auto"
          >
            {t("nav.contact")}
          </Link>
        </div>
      </div>
    </Movement>
  );
}
