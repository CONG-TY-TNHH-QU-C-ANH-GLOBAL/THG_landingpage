// S7 · COMMITMENT — "What happens when it goes wrong, and how do I pay?"
//
// The only movement about THG accepting risk, and the most consulted content on the page by anyone
// evaluating a fulfillment partner. It used to sit at the bottom, behind a disclosure; both of those
// were defects. Liability and payment are decision-critical, so they are visible without interaction
// and they appear at the point the question arises rather than in an appendix.
//
// FIRST DARK SURFACE. The inversion is semantic: everything before it explains a mechanism,
// everything in it is an undertaking. It is not an emphasis device and it is not decoration.
import Link from "next/link";

import type { Locale } from "@/shared/i18n";
import type { FulfillFaq } from "../models/faq";
import type { FulfillParityCopy } from "../parity-content";
import { FAQ_SLOT, pickFaq } from "./faq-placement";
import { Movement } from "./section";
import type { MovementCopy } from "./movement-copy";

interface Props {
  lang: Locale;
  parity: FulfillParityCopy;
  movement: MovementCopy;
  faqs: readonly FulfillFaq[];
}

export default function CommitmentSection({ lang, parity, movement, faqs }: Readonly<Props>) {
  const compensation = pickFaq(faqs, FAQ_SLOT.compensation);
  const payment = pickFaq(faqs, FAQ_SLOT.payment);
  const [, transparency] = parity.advantages;

  return (
    <Movement id="trust" tone="inverted" width="content">
      <div className="flex flex-col text-left">
        
        {/* Transparency Promise */}
        <div className="flex flex-col gap-4">
          <p className="type-lead text-primary-foreground m-0">
            {transparency.title}
          </p>
          {transparency.description && (
            <p className="type-body text-muted m-0">
              {transparency.description}
            </p>
          )}
        </div>

        {/* 48px inner clearance */}
        <div className="h-12" aria-hidden="true" />

        {/* Liability Statement: dominant strictly by isolation */}
        {compensation ? (
          <div className="flex flex-col gap-4 border-y border-border/20 py-12">
            <h2 className="type-label text-muted m-0">{movement.termCompensation}</h2>
            <p className="type-body text-primary-foreground m-0">
              {compensation.answer}
            </p>
          </div>
        ) : null}

        {/* 48px inner clearance */}
        <div className="h-12" aria-hidden="true" />

        {/* Payment Rails */}
        {payment ? (
          <div className="flex flex-col gap-4 mb-12">
            <h3 className="type-label text-muted m-0">{movement.termPayment}</h3>
            <p className="type-body text-primary-foreground m-0">
              {payment.answer}
            </p>
          </div>
        ) : null}

        {/* Policy Link */}
        <div className="border-t border-border/20 pt-8 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="type-body font-medium text-primary-foreground m-0">{parity.policyTitle}</p>
          <span className="sr-only">{parity.policyDesc}</span>
          <Link 
            href={`/${lang}/policy`} 
            className="type-small font-mono text-muted hover:text-primary-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-navy no-underline"
          >
            {parity.policyCta}
          </Link>
        </div>
      </div>
    </Movement>
  );
}
