// THE STATE CHIP — the page's atom, and the only element permitted to carry a status.
//
// Three planes, three treatments, and the distinction between them is the ethical architecture of the
// whole route:
//
//   system     a real reading from the Experience API about THG's operation.  Solid border, live dot.
//   projected  a projection of the VISITOR's hypothetical operation.          Dashed border, diamond.
//   unknown    THG has not published this value.                             Solid border, em dash.
//
// A visitor has no orders with THG. So anything describing *their* operation is a projection and must
// never borrow the treatment of a live reading — that is how an honest page becomes a fake dashboard.
// One consistent visual rule prevents the confusion everywhere it could occur.
//
// The chip never fills with colour. Accent is spent on the live dot and nowhere else inside it.
import type { ReactNode } from "react";

export type StatePlane = "system" | "projected" | "unknown";

/** Freshness of the API reading. Drives the dot, and whether the word LIVE may be shown at all. */
export type SignalFreshness = "live" | "stale" | "offline";

interface Props {
  plane: StatePlane;
  /** The state itself — an operational identifier, not a sentence. Rendered as given. */
  children?: ReactNode;
  /** Only meaningful for `system`. A stale reading loses its animation; an offline one loses its dot. */
  freshness?: SignalFreshness;
  /** Screen-reader prefix, e.g. "Hanoi status". The chip's own text carries only the state. */
  label?: string;
}

const BASE =
  "inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1 " +
  "font-mono text-[length:var(--step-label)] uppercase tracking-[0.1em] whitespace-nowrap";

const PLANE_CLASS: Readonly<Record<StatePlane, string>> = {
  // Observed now. A solid rule is the page's signal for "this is a reading".
  system: "border border-border text-foreground",
  // A projection. The dashed rule is load-bearing and appears on every projected element on the page.
  projected: "border border-dashed border-border text-foreground",
  // Published-nothing. Same weight as a real value so the gap cannot be missed or mistaken for zero.
  unknown: "border border-border text-muted-foreground",
};

export function StateChip({ plane, children, freshness = "live", label }: Readonly<Props>) {
  return (
    <span className={`${BASE} ${PLANE_CLASS[plane]}`}>
      {label ? <span className="sr-only">{label}: </span> : null}

      {plane === "system" && freshness !== "offline" ? (
        <span
          aria-hidden="true"
          className={
            // The ONE continuous animation permitted on this route, and only while the reading is
            // fresh. It stops on `stale` because a pulse that outlives its signal is a lie.
            freshness === "live"
              ? "h-1.5 w-1.5 shrink-0 rounded-full bg-primary motion-safe:animate-pulse"
              : "h-1.5 w-1.5 shrink-0 rounded-full border border-primary"
          }
        />
      ) : null}

      {plane === "projected" ? (
        // A diamond, never a dot. The glyph difference survives greyscale and low vision, so the
        // plane is never carried by colour alone.
        <span aria-hidden="true" className="text-[0.7em] leading-none text-muted-foreground">
          ◇
        </span>
      ) : null}

      {children ?? <span aria-hidden="true">——</span>}
    </span>
  );
}

/** The em-dash render for any unpublished value, outside a chip. Kept here so one file owns the
 *  page's vocabulary of absence. */
export function UnknownValue({ srLabel }: Readonly<{ srLabel: string }>) {
  return (
    <span className="font-mono text-muted-foreground">
      <span className="sr-only">{srLabel}</span>
      <span aria-hidden="true">——</span>
    </span>
  );
}
