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

import styles from "./fulfill.module.css";

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

/** Tone to surface class. A lookup rather than a chain of conditionals, so adding a surface is one
 *  entry and the set of tones stays readable at a glance. */
const TONE_CLASS: Readonly<Record<NonNullable<MovementProps["tone"]>, string>> = {
  canvas: "",
  surface: styles.surface,
  inverted: styles.inverted,
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
    <section id={id} className={`${styles.section} ${toneClass}`}>
      <div className={`${styles.inner} ${width === "wide" ? styles.innerWide : ""}`}>
        {aliases?.map((alias) => <Alias key={alias} id={alias} />)}
        {children}
      </div>
    </section>
  );
}

export function Alias({ id }: Readonly<{ id: string }>) {
  return <span id={id} className={styles.anchorAlias} aria-hidden="true" />;
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
    <div className={styles.header}>
      <p className={`${styles.eyebrow} type-label`}>
        <span className={styles.eyebrowIndex}>{index}</span>
        {eyebrow}
      </p>
      <Tag className={`${styles.title} type-h2`}>{title}</Tag>
      {lead ? <p className={`${styles.lead} type-lead`}>{lead}</p> : null}
    </div>
  );

  if (!aside) return head;

  return (
    <div className={styles.headerSplit}>
      {head}
      <div>{aside}</div>
    </div>
  );
}
