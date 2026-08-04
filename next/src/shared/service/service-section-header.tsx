// The recurring section opener of a service page: eyebrow → heading → intro. Server Component.
//
// Every section repeated this markup with slightly different spacing, which is how heading levels
// and eyebrow styling drift apart over time. One component keeps the chapter rhythm identical
// across sections and across service pages, and keeps the heading level explicit rather than
// implied by where the markup happens to sit.
import styles from "./service.module.css";

export interface ServiceSectionHeading {
  /** Short uppercase chapter marker, e.g. "01 — Workflow". "" renders nothing. */
  eyebrow?: string;
  title: string;
  /** Supporting paragraph. "" renders nothing. */
  intro?: string;
}

interface Props extends ServiceSectionHeading {
  align?: "start" | "center";
  /** Heading level. The page owns its outline; this component never guesses it. */
  as?: "h2" | "h3";
  /** Visual weight. "lg" is a chapter opener, "md" a regular section — the level and the size are
   *  separate on purpose, so emphasis never forces a wrong heading level. */
  size?: "lg" | "md";
  /** Width cap for the intro paragraph. */
  introClassName?: string;
  className?: string;
}

const TITLE_SIZE: Readonly<Record<"lg" | "md", string>> = {
  lg: "text-3xl md:text-4xl font-bold tracking-tight mt-4 mb-4",
  md: "text-2xl md:text-3xl font-bold tracking-tight mt-4 mb-3",
};

export function ServiceSectionHeader({
  eyebrow,
  title,
  intro,
  align = "start",
  as: Heading = "h2",
  size = "md",
  introClassName = "max-w-xl",
  className = "",
}: Readonly<Props>) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      {eyebrow ? (
        <span className={`${styles.eyebrow} ${centered ? styles.eyebrowCentered : ""}`}>{eyebrow}</span>
      ) : null}
      <Heading className={TITLE_SIZE[size]}>{title}</Heading>
      {intro ? (
        <p
          className={`font-medium ${introClassName} ${centered ? "mx-auto" : ""}`}
          style={{ color: "var(--svc-muted)" }}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
