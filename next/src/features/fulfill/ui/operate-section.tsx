// S8 · OPERATE — "Can I actually run this day to day?"
//
// The depth layer: what survives contact with a sceptical operations person. Two chapters — how an
// order is placed, and what the Hub system shows — and every module is an addressable anchor so a
// returning evaluator can link a colleague straight to the row they are arguing about.
//
// NOT A TAB SET. Six modules behind a tab strip would hide five of them from a crawler, from a
// no-JS visitor, and from anyone who linked to one directly. They are a stacked document instead,
// which costs nothing but scroll and removes an entire client island.
//
// METRIC NAMES, NEVER METRIC VALUES. The Hub is real software with real numbers in it; inventing a
// figure here would set an expectation that onboarding then has to correct. Each module names the
// metrics it exposes and says what each one tells the seller, and stops there.
import { ExternalLink } from "lucide-react";

import type { FulfillFaq } from "../models/faq";
import type { FulfillParityCopy } from "../parity-content";
import { FAQ_SLOT, pickFaq } from "./faq-placement";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/shared/ui/accordion";

/** The approved Hub origin. A link, not a lead surface — the self-serve branch is a way out of the
 *  page, not another form. */
const HUB_ORIGIN = "https://hub.thgfulfill.com";

/** The published SKU reference sheet, carried over verbatim from the live page. */
const SKU_SHEET =
  "https://docs.google.com/spreadsheets/d/1CE_mzKMyfFK93iS1Dm8Sk9-zijjsxdKRO786EweoCUI/edit?gid=0#gid=0";

interface Props {
  parity: FulfillParityCopy;
  movement: MovementCopy;
  faqs: readonly FulfillFaq[];
}

export default function OperateSection({ parity, movement, faqs }: Readonly<Props>) {
  const placement = pickFaq(faqs, FAQ_SLOT.orderPlacement);
  const notification = pickFaq(faqs, FAQ_SLOT.orderNotification);
  // By id, not by index: the Hub chapters are content and an editor may reorder them.
  const orders = parity.hubSections.find((section) => section.id === "orders");

  return (
    <Movement id="handbook">
      <Heading
        index={MOVEMENT_INDEX.operate}
        eyebrow={parity.hubEyebrow}
        title={movement.operateTitle}
        lead={movement.operateIntro}
      />

      {/* ── Chapter 1 · placing an order ─────────────────────────────────────────────────── */}
      <div id="order-guide" className="mt-12 lg:mt-16">
        <h3 className="type-h3 text-foreground m-0 mb-6">{movement.orderGuideTitle}</h3>
        
        <Accordion type="single" collapsible className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placement ? (
            <AccordionItem value="placement" className="bg-card border border-border rounded-lg px-6 overflow-hidden [&[data-state=open]]:border-primary transition-colors">
              <AccordionTrigger className="hover:no-underline text-left py-6">
                <div className="flex flex-col gap-2">
                  <span className="type-label text-muted-foreground">01</span>
                  <span className="type-body font-medium text-foreground">{placement.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="type-body text-muted-foreground pb-6">
                {placement.answer}
              </AccordionContent>
            </AccordionItem>
          ) : null}

          {notification ? (
            <AccordionItem value="notification" className="bg-card border border-border rounded-lg px-6 overflow-hidden [&[data-state=open]]:border-primary transition-colors">
              <AccordionTrigger className="hover:no-underline text-left py-6">
                <div className="flex flex-col gap-2">
                  <span className="type-label text-muted-foreground">02</span>
                  <span className="type-body font-medium text-foreground">{notification.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="type-body text-muted-foreground pb-6">
                {notification.answer}
              </AccordionContent>
            </AccordionItem>
          ) : null}

          <AccordionItem value="ecount" className="bg-card border border-border rounded-lg px-6 overflow-hidden [&[data-state=open]]:border-primary transition-colors">
            <AccordionTrigger className="hover:no-underline text-left py-6">
              <div className="flex flex-col gap-2">
                <span className="type-label text-muted-foreground">03</span>
                <span className="type-body font-medium text-foreground">{parity.ecountTitle}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="type-body text-muted-foreground pb-6">
              <p className="m-0 mb-4">{parity.ecountIntro}</p>
              {orders?.intro && <p className="m-0 mb-4">{orders.intro}</p>}
              <a
                className="inline-flex items-center gap-2 type-small font-mono text-foreground hover:text-primary transition-colors no-underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                href={SKU_SHEET}
                target="_blank"
                rel="noopener noreferrer"
              >
                {parity.ecountSkuLink}
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ── Chapter 2 · the Hub, addressable modules ─────────────────────────────────── */}
      <div id="hub-guide" className="mt-16 pt-16 border-t border-border">
        <h3 className="type-h3 text-foreground m-0 mb-4">{parity.hubHeading}</h3>
        <p className="type-body text-muted-foreground m-0 max-w-[720px] mb-8">{parity.hubIntro}</p>
        
        <span className="sr-only">{parity.hubToc}</span>
        <Accordion type="single" collapsible className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parity.hubSections.map((section, index) => (
            <AccordionItem key={section.id} value={section.id} id={`hub-${section.id}`} className="bg-card border border-border rounded-lg px-6 overflow-hidden [&[data-state=open]]:border-primary transition-colors">
              <AccordionTrigger className="hover:no-underline text-left py-6">
                <div className="flex flex-col gap-2">
                  <span className="type-label text-muted-foreground">{(index + 1).toString().padStart(2, '0')}</span>
                  <span className="type-body font-medium text-foreground">{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <p className="type-body text-muted-foreground m-0">{section.intro}</p>

                {section.bullets.length > 0 ? (
                  <ul className="flex flex-col gap-2 mt-4 ml-4.5 p-0 list-disc marker:text-primary type-body text-muted-foreground">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}

                {section.facts.length > 0 ? (
                  <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-border/50">
                    <p className="type-label text-muted-foreground m-0">{movement.metricsTitle}</p>
                    <div className="flex flex-col gap-3">
                      {section.facts.map((fact) => (
                        <div key={fact.label} className="grid grid-cols-[10rem_1fr] items-baseline gap-4 pt-3 border-t border-border/50 first:pt-0 first:border-0">
                          <span className="type-small font-mono text-foreground">{fact.label}</span>
                          <p className="type-small text-muted-foreground m-0">{fact.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* ── The self-serve branch. An outbound link, never a lead. ─────────────────── */}
        <div id="hub-cta" className="flex flex-wrap justify-between items-center gap-6 mt-16 pt-8 border-t border-border">
          <div className="flex flex-col gap-2">
            <p className="type-body font-medium text-foreground m-0">{parity.hubCtaTitle}</p>
            <p className="type-small text-muted-foreground max-w-[720px] m-0">{parity.hubCtaDesc}</p>
          </div>
          <a
            className="inline-flex items-center gap-3 px-5 py-3 border border-border rounded-md bg-card hover:border-primary transition-colors no-underline group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            href={HUB_ORIGIN}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="type-body font-medium text-foreground group-hover:text-primary transition-colors">{parity.hubCtaLabel}</span>
            <ExternalLink size={16} className="text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
          </a>
        </div>
      </div>
    </Movement>
  );
}
