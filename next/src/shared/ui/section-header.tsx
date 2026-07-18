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

import { cn } from "@/shared/ui/cn";

// WEB-001B typography parity: section titles resolve through the approved fluid
// step scale (IMPLEMENTATION_BASELINE.md "12-step type scale") instead of the
// Tailwind literals the parity port used — the artifact's section H2 is
// --step-h2 (clamp 24→36px) at every section, with --step-h1 as the single
// larger escape hatch. No second type scale.
const SIZE_CLASSES = {
  default: "text-[length:var(--step-h2)]",
  lg: "text-[length:var(--step-h2)]",
  xl: "text-[length:var(--step-h1)]",
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
}: Readonly<SectionHeaderProps>) {
  return (
    <div className={cn(align === "center" && "text-center", "mb-16", className)}>
      {eyebrow && (
        <p className="text-[length:var(--step-label)] font-bold text-accent uppercase tracking-[var(--tracking-wide)] mb-4">
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
        <p
          className={cn(
            "text-muted-foreground text-[length:var(--step-lead)] mt-3 max-w-[52ch] leading-relaxed",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
