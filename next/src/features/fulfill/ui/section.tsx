// SECTION CHROME — the route's structural primitives, and the only place its rhythm is decided.
//
// Three components, each doing exactly one job:
//
//   Movement    a page section: its surface, its vertical rhythm, its anchor, its retired aliases
//   Heading     the eyebrow / title / lead group, so eleven movements cannot drift apart
//   Alias       a retired-but-published id, kept resolvable forever
//
// Fusing them would be convenient and wrong: a section that also owned its column structure could
// not be reused at a different width, and a heading that owned its spacing could not sit inside a
// split layout. Space between things belongs to the parent, never to the thing.
import type { ReactNode } from "react";

interface MovementProps {
  /** The published anchor id. Permanent: a movement that is replaced leaves its id behind. */
  id: string;
  /** Retired ids that used to address this content. Never garbage-collected. */
  aliases?: readonly string[];
  /** `canvas` is the default. `surface` lifts onto white; `inverted` is a semantic surface change —
   *  the page changing what it is doing — not an emphasis device. */
  tone?: "canvas" | "surface" | "inverted";
  /** The page keeps ONE column so every movement shares a left edge; `content` narrows it for a
   *  movement that is pure prose. Reading width inside a wide movement is a `.prose` concern. */
  width?: "content" | "wide";
  children: ReactNode;
}

const TONE_CLASS: Readonly<Record<NonNullable<MovementProps["tone"]>, string>> = {
  canvas: "bg-background text-foreground",
  surface: "bg-card text-card-foreground",
  inverted: "bg-navy text-primary-foreground", // Inverted maps to text-on-dark
};

export function Movement({
  id,
  aliases,
  tone = "canvas",
  width = "wide",
  children,
}: Readonly<MovementProps>) {
  const toneClass = TONE_CLASS[tone];

  return (
    <section id={id} className={`w-full pt-16 pb-16 lg:pt-24 lg:pb-24 ${toneClass}`}>
      <div className={`container mx-auto px-4 md:px-8 ${width === "content" ? "max-w-[720px]" : ""}`}>
        {aliases?.map((alias) => <Alias key={alias} id={alias} />)}
        {children}
      </div>
    </section>
  );
}

export function Alias({ id }: Readonly<{ id: string }>) {
  return <span id={id} className="scroll-mt-[100px]" aria-hidden="true" />;
}

interface HeadingProps {
  /** Movement index, e.g. "02". Orientation in a document that is read in order. */
  index: string;
  eyebrow: string;
  title: string;
  lead?: string;
  /** The section's heading level. The page owns exactly one h1, so movements are h2 by default. */
  as?: "h2" | "h3";
  /** Content that sits opposite the title on wide viewports — a scope note, a count, a link. */
  aside?: ReactNode;
}

export function Heading({
  index,
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
  aside,
}: Readonly<HeadingProps>) {
  const head = (
    <div className={`flex flex-col items-start text-left ${aside ? "" : "mb-12 lg:mb-16"}`}>
      <p className="type-label text-muted-foreground mb-4">
        <span className="mr-2 text-primary">{index}</span>
        {eyebrow}
      </p>
      <Tag className={`type-${Tag} text-foreground mb-4`}>
        {title}
      </Tag>
      {lead ? <p className="type-lead max-w-[720px]">{lead}</p> : null}
    </div>
  );

  if (!aside) return head;

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-12 lg:mb-16">
      {head}
      <div className="w-full lg:w-5/12 flex-shrink-0">{aside}</div>
    </div>
  );
}
