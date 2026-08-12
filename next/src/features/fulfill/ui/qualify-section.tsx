import Image from "next/image";
import type { ReactNode } from "react";
import type { FulfillContent } from "../models/fulfill";
import type { FulfillFaq } from "../models/faq";
import type { FulfillCopy } from "../localized-content";
import { FAQ_SLOT, pickFaq } from "./faq-placement";
import { SceneSurface, PhysicalSpecimen, MetadataRail } from "./primitives";
import type { MovementCopy } from "./movement-copy";
import { MOVEMENT_INDEX } from "./movement-copy";
import { StateChip } from "./state-chip";
import type { ProductionNode, ChannelLink } from "./signal-bar";

/** Invariant scope tokens. Market and country codes are not translated.
 *
 *  Cased exactly as published. These read as uppercase identifiers in the mono value column, but
 *  that is done with `text-transform` in `SpecRow` — rewriting the token itself would have edited
 *  published content to obtain a visual effect, which also silently broke the scope assertion in
 *  `fulfill-qualify.test.tsx`. Presentation belongs in CSS; the string stays the string. */
const SCOPE = {
  services: "POD · Dropship",
  origins: "VN · CN · US",
  destinations: "US · UK · WW",
} as const;

/** Sourcing THG declines. Published in `parity-content` as an answer; restated here as a ROW of the
 *  specification, because a boundary buried in an FAQ is a boundary nobody reads in time. */
const NOT_ACCEPTED = "ALIEXPRESS · SHEIN";

interface Props {
  copy: FulfillCopy;
  content: FulfillContent;
  movement: MovementCopy;
  faqs: readonly FulfillFaq[];
  /** Live readings. Absent on the server and until the client transport connects — every row then
   *  renders its labelled absence at full footprint, so nothing reflows when data arrives. */
  nodes?: readonly ProductionNode[];
  channels?: readonly ChannelLink[];
}

export default function QualifySection({
  copy,
  content,
  movement,
  faqs,
  nodes = [],
  channels = [],
}: Readonly<Props>) {
  // An editor-set hero eyebrow wins over the service identity, which wins over the localized
  // default. The CMS supplies the label above the headline and never the headline itself.
  const serviceLabel = content.heroEyebrow || content.serviceLabel || copy.heroBadge;
  const subtitle = content.heroSubtitle || copy.heroSubtitleFallback;
  const points = content.points.length > 0 ? content.points : copy.pointsFallback;
  const scopeAnswer = pickFaq(faqs, FAQ_SLOT.serviceScope);

  return (
    <>
      <SceneSurface id="top" tone="studio" overflow="hidden" className="relative min-h-[85vh] flex items-center">
        
        {/* ── Typography Field ────────────────────────────────────────── */}
        <div className="w-full max-w-7xl mx-auto relative z-10 flex flex-col justify-center h-full pt-32 pb-12 md:py-0 px-4 md:px-8">
          <div className="w-full max-w-3xl flex flex-col items-center text-center mx-auto mb-16">
            <p className="type-label font-mono uppercase tracking-[0.1em] text-primary mb-6">
              {MOVEMENT_INDEX.qualify} {movement.qualify}
            </p>
            
            <h1 className="type-display text-foreground mb-6 tracking-tight">
              {copy.heroHeadline}
            </h1>
            
            <p className="type-lead text-muted-foreground max-w-[600px] leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* ── Interactive Pipeline UI Showcase ─────────────────────────────── */}
          <div className="w-full bg-white rounded-2xl shadow-sm border border-border p-6 md:p-12 mt-4 relative overflow-hidden group">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
              
              {/* Node 1 */}
              <div className="flex flex-col items-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center relative overflow-hidden group-hover:bg-primary/10 transition-colors duration-500">
                  <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-700 ease-out" />
                  <span className="font-mono text-xl font-bold text-foreground group-hover:text-primary z-10">01</span>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground m-0 uppercase tracking-wide">Produce</p>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{SCOPE.origins}</p>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="hidden md:block w-32 h-px bg-border relative overflow-hidden">
                <div className="absolute inset-0 bg-primary -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out repeat-infinite delay-100" />
              </div>

              {/* Node 2 */}
              <div className="flex flex-col items-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center relative overflow-hidden group-hover:bg-primary/10 transition-colors duration-500 delay-150">
                  <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-700 ease-out" />
                  <span className="font-mono text-xl font-bold text-foreground group-hover:text-primary z-10">02</span>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground m-0 uppercase tracking-wide">Fulfill</p>
                  <p className="text-sm text-muted-foreground font-mono mt-1">Item-level QC</p>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="hidden md:block w-32 h-px bg-border relative overflow-hidden">
                <div className="absolute inset-0 bg-primary -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out repeat-infinite delay-300" />
              </div>

              {/* Node 3 */}
              <div className="flex flex-col items-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center relative overflow-hidden group-hover:bg-primary/10 transition-colors duration-500 delay-300">
                  <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-700 ease-out" />
                  <span className="font-mono text-xl font-bold text-foreground group-hover:text-primary z-10">03</span>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground m-0 uppercase tracking-wide">Deliver</p>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{SCOPE.destinations}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </SceneSurface>

      {/* ── Operational Specification ─────────────────────────────────────────── */}
      <SceneSurface id="qualify-data" tone="operational">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ── Operational Specification ─────────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            
            <div className="border-t-2 border-white/20 pt-6">
              <ul className="m-0 flex list-none flex-col p-0 gap-6">
                {points.map((point, i) => (
                  <li
                    key={point}
                    className="flex gap-4 items-start"
                  >
                    <span className="type-small font-mono text-muted-foreground">0{i + 1}</span>
                    <span className="type-body text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-10">
              <p className="type-h4 text-foreground font-medium uppercase tracking-tight m-0">
                {movement.intakeTitle}
              </p>

              <dl className="m-0 flex flex-col">
                <SpecRow term={movement.scopeServices} value={SCOPE.services} />
                <div className="w-full h-px bg-border my-6" />
                <SpecRow term={movement.scopeOrigins} value={SCOPE.origins} />
                <div className="w-full h-px bg-border my-6" />
                <SpecRow term={movement.scopeDestinations} value={SCOPE.destinations} />
                <div className="w-full h-px bg-border my-6" />

                {/* Channel rows */}
                <div className="flex flex-col gap-3">
                  <dt className="type-small font-medium text-muted-foreground uppercase tracking-[0.02em]">
                    {movement.intakeChannels}
                  </dt>
                  <dd className="m-0 flex flex-wrap justify-start gap-2">
                    {channels.length > 0 ? (
                      channels.map((channel) => (
                        <StateChip
                          key={channel.id}
                          plane={channel.connected === null ? "unknown" : "system"}
                          label={channel.label}
                        >
                          {channel.connected === null
                            ? undefined
                            : `${channel.label} ${channel.connected ? "CONNECTED" : "OFFLINE"}`}
                        </StateChip>
                      ))
                    ) : (
                      <StateChip plane="unknown" label={movement.intakeChannels} />
                    )}
                  </dd>
                </div>

                <div className="w-full h-px bg-border my-6" />

                {/* Refusal */}
                <div className="flex flex-col gap-1">
                  <dt className="type-small font-medium text-muted-foreground uppercase tracking-[0.02em]">
                    {movement.intakeNotAccepted}
                  </dt>
                  <dd className="type-h4 text-foreground m-0 font-mono tracking-tight uppercase">{NOT_ACCEPTED}</dd>
                </div>
              </dl>
            </div>

            {scopeAnswer ? (
              <p className="type-small text-muted-foreground mt-4 max-w-[600px]">
                {scopeAnswer.answer}
              </p>
            ) : null}
          </div>
        </div>

        {/* ── Production nodes ──────────────────────────────────────────────
            Where THG produces, and whether each location is taking work. The availability chip is the
            page's first live reading, and the row holds its footprint before one arrives. */}
        <div className="mt-16 lg:mt-24">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-3">
            <p className="type-label text-foreground m-0 font-medium uppercase tracking-[0.05em]">
              {movement.nodesTitle}
            </p>
            <p className="type-label text-muted-foreground m-0 font-medium uppercase tracking-[0.05em]">
              {movement.nodeCapabilities}
            </p>
          </div>

          <ul className="m-0 list-none p-0">
            {nodes.length > 0 ? (
              nodes.map((node) => (
                <li
                  key={node.id}
                  className="flex flex-col gap-3 border-b border-border py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="type-h4 text-foreground font-mono uppercase tracking-[0.06em]">
                      {node.label}
                    </span>
                    <StateChip
                      plane={node.availability === null ? "unknown" : "system"}
                      label={node.label}
                    >
                      {node.availability ?? undefined}
                    </StateChip>
                  </div>
                  <span className="type-small text-muted-foreground font-mono">
                    {SCOPE.services}
                  </span>
                </li>
              ))
            ) : (
              // No reading yet. The row keeps its footprint and says so — never a spinner, because
              // this content is server-rendered and a spinner here would be theatre.
              <li className="flex items-center justify-between border-b border-border py-4">
                <StateChip plane="unknown" label={movement.nodesTitle} />
                <span className="type-small text-muted-foreground font-mono">{SCOPE.origins}</span>
              </li>
            )}
          </ul>
        </div>

        {/* ── Exit ─────────────────────────────────────────────────────────
            The page's first exit ramp. A hairline and a heading, never an enclosed card: a seller
            being told "this may not be for you" should not read it inside a decorated box. */}
        <div className="mt-12 border-t border-border pt-6 lg:mt-16">
          <p className="type-label text-foreground mb-3 font-medium uppercase tracking-[0.05em]">
            {movement.exitTitle}
          </p>
          <p className="type-small text-muted-foreground m-0 max-w-[720px]">{movement.exitText}</p>
        </div>

        <p className="type-label text-muted-foreground mt-10 font-medium uppercase tracking-[0.05em]">
          {serviceLabel}
        </p>
      </SceneSurface>
    </>
  );
}

/** One label/value row of the intake specification. */
function SpecRow({
  term,
  value,
}: Readonly<{ term: string; value: string }>) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="type-small font-medium text-muted-foreground uppercase tracking-[0.02em]">
        {term}
      </dt>
      <dd className="type-h4 text-foreground m-0 font-mono tracking-tight uppercase">{value}</dd>
    </div>
  );
}
