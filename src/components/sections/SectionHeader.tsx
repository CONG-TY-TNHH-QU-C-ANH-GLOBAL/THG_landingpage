// SectionHeader — the small uppercase eyebrow + h2 with optional gold-gradient
// highlight that opens every major page section (services, advantages,
// process, FAQ, contact, pricing, etc.). Pulled out of 27 hand-written
// callsites across pages + sections so style tweaks (font size, tracking)
// only happen in one place.
//
// ScrollReveal is intentionally left to the caller — most call sites already
// wrap their section in <ScrollReveal>, and leaving it out keeps this
// component decoupled from animation library choices.

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  // 90% of existing call sites use this size.
  default: "text-3xl md:text-4xl",
  // Contact section.
  lg: "text-4xl md:text-5xl",
  // Advantages section (largest).
  xl: "text-4xl md:text-5xl lg:text-[3.5rem]",
} as const;

interface SectionHeaderProps {
  /** Small uppercase tag above the title (CMS calls this `subtitle`). */
  eyebrow?: ReactNode;
  /** Plain title text before any highlighted span. */
  title: ReactNode;
  /** Gold-gradient highlighted segment, rendered inline after the title. */
  titleHighlight?: ReactNode;
  /** Plain text after the highlight (used by ContactSection for 3-part titles). */
  titleSuffix?: ReactNode;
  /** Optional paragraph rendered below the title (max-w-2xl, muted). */
  description?: ReactNode;
  /** h2 size preset — `default` covers ~90% of sites, `lg`/`xl` are escape hatches. */
  size?: keyof typeof SIZE_CLASSES;
  /** Defaults to centered to match all existing callsites; opt-out via `"left"`. */
  align?: "center" | "left";
  /** Extra classes on the wrapper div (margin, max-width, etc.). */
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  titleSuffix,
  description,
  size = "default",
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(align === "center" && "text-center", "mb-16", className)}>
      {eyebrow && (
        <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className={cn(SIZE_CLASSES[size], "font-bold text-navy tracking-tight")}>
        {title}
        {titleHighlight && (
          <>
            {" "}
            <span className="text-gradient-gold">{titleHighlight}</span>
          </>
        )}
        {titleSuffix && (
          <>
            {" "}
            {titleSuffix}
          </>
        )}
      </h2>
      {description && (
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
