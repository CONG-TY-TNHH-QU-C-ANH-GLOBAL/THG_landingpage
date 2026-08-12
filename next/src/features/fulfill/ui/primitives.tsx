import type { ReactNode } from "react";
import Image from "next/image";

/* ── 1. SCENE SURFACE ────────────────────────────────────────────────────────
 *  The structural wrapper for the route's art-directed scenes. It overlaps
 *  `./section`'s `Movement` and is kept for the one thing Movement cannot do:
 *  the studio/operational tone pair and the overflow control the scene layouts
 *  depend on. `SectionManifest` was NOT kept — it was a second spelling of
 *  `Heading` with no consumer outside a scratch page, so it is gone; use
 *  `Heading` from ./section for section typography.
 */
interface SceneSurfaceProps {
  id: string;
  tone?: "studio" | "operational" | "default";
  width?: "content" | "wide" | "full";
  overflow?: "hidden" | "visible" | "clip";
  className?: string;
  children: ReactNode;
}

const TONE_CLASS = {
  default: "bg-background text-foreground",
  studio: "bg-[#F9F8F6] text-foreground", // Warm off-white for RGB product blending
  operational: "bg-[#111111] text-[#F9F8F6]", // Deep ink for industrial/warehouse context
} as const;

// Tailwind's compiler finds class names by scanning source text, so it only ever generates
// classes that appear LITERALLY. `overflow-${overflow}` produced no class at all — the utility
// was silently absent in the stylesheet and the prop did nothing. A lookup table keeps every
// possible value in the source where the scanner can see it.
const OVERFLOW_CLASS = {
  hidden: "overflow-hidden",
  visible: "overflow-visible",
  clip: "overflow-clip",
} as const;

const WIDTH_CLASS = {
  content: "max-w-[720px]",
  wide: "container",
  full: "w-full px-0 md:px-0",
} as const;

export function SceneSurface({
  id,
  tone = "default",
  width = "wide",
  overflow = "hidden",
  className = "",
  children,
}: Readonly<SceneSurfaceProps>) {
  return (
    <section
      id={id}
      className={`relative w-full pt-16 pb-16 lg:pt-24 lg:pb-32 ${OVERFLOW_CLASS[overflow]} ${TONE_CLASS[tone]} ${className}`}
    >
      <div className={`relative mx-auto px-4 md:px-8 ${WIDTH_CLASS[width]}`}>{children}</div>
    </section>
  );
}

/* ── 2. METADATA RAIL ────────────────────────────────────────────────────────
 *  A reusable key-value list for displaying factual domain data.
 *  Designed as an industrial label/shipping manifest, not a specification table.
 */
interface MetadataRailProps {
  items: ReadonlyArray<{ 
    term: string; 
    value: ReactNode; 
    isMono?: boolean;
    divider?: boolean;
  }>;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function MetadataRail({ items, orientation = "vertical", className = "" }: Readonly<MetadataRailProps>) {
  return (
    <dl
      className={`m-0 p-0 flex ${
        orientation === "horizontal"
          ? "flex-row flex-wrap items-center gap-x-8 gap-y-6 lg:gap-x-12"
          : "flex-col gap-y-6"
      } ${className}`}
    >
      {items.map((item) => (
        <div key={item.term} className="flex items-center">
          <div className="flex flex-col gap-1">
            <dt className="type-small font-medium text-muted-foreground uppercase tracking-[0.02em] leading-none">
              {item.term}
            </dt>
            <dd className={`text-base text-foreground m-0 leading-none tracking-tight ${item.isMono ? 'font-mono uppercase tracking-[0.05em]' : 'font-sans'}`}>
              {item.value}
            </dd>
          </div>
          {item.divider && (
            <div className={`bg-border/40 ${orientation === "horizontal" ? "w-px h-8 ml-8 lg:ml-12" : "w-full h-px mt-6"}`} />
          )}
        </div>
      ))}
    </dl>
  );
}

/* ── 4. PHYSICAL SPECIMEN ────────────────────────────────────────────────────
 *  Wrapper for the RGB matte product images. Enforces the correct blend mode
 *  and provides a standard API for interaction states (used in Scope and Process).
 *  Responsibility: Render a physical asset according to visual state. Does not encode domain logic.
 */
interface PhysicalSpecimenProps {
  src: string;
  alt: string;
  prominence?: "dominant" | "peripheral" | "hidden" | "default";
  className?: string;
  priority?: boolean;
}

export function PhysicalSpecimen({
  src,
  alt,
  prominence = "default",
  className = "",
  priority = false,
}: Readonly<PhysicalSpecimenProps>) {
  // Base transform classes based on prominence.
  const stateClasses = {
    default: "opacity-100 scale-100",
    dominant: "opacity-100 scale-100 z-10",
    peripheral: "opacity-40 scale-75 blur-[2px] -z-10",
    hidden: "opacity-0 scale-50 pointer-events-none -z-20",
  };

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${stateClasses[prominence]} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain mix-blend-multiply" // mix-blend-multiply ensures perfect edge blending on off-white
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={priority}
      />
    </div>
  );
}
