// Service page hero — Server Component.
//
// Generic across service pages: an eyebrow badge, the page H1, a supporting line, a rail of
// numbered trust indicators, a CTA slot and a media slot. The media is a SLOT rather than a prop
// shape because each service's hero art is genuinely different (a product stage, a lane map, a
// dashboard); generalising the art would be abstraction with one shape and many exceptions.
import type { ReactNode } from "react";

import styles from "./service.module.css";

export interface ServiceTrustPoint {
  /** Stable key — the caller owns identity; text is not assumed unique. */
  id: string;
  label: string;
}

interface Props {
  /** Small badge above the headline. "" renders no badge. */
  eyebrow?: string;
  /** The page's single H1. */
  headline: string;
  subtitle?: string;
  /** Numbered supporting indicators. [] renders no rail. */
  points?: readonly ServiceTrustPoint[];
  /** Primary call to action (usually a client island). */
  cta?: ReactNode;
  /** Hero artwork. Rendered in the second column, decorative by convention. */
  media?: ReactNode;
  /** Decorative background layer rendered behind the grid (feature-owned art). */
  backdrop?: ReactNode;
  id?: string;
}

export function ServiceHero({
  eyebrow,
  headline,
  subtitle,
  points = [],
  cta,
  media,
  backdrop,
  id = "top",
}: Readonly<Props>) {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden" id={id}>
      {backdrop}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center lg:min-h-[68vh] relative z-10">
        <div>
          {eyebrow ? (
            <div
              className={`${styles.mono} inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-white shadow-sm mb-8 text-[10px] uppercase tracking-widest`}
              style={{ borderColor: "var(--svc-border)", color: "var(--svc-muted)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "var(--svc-accent)" }}
              />
              {eyebrow}
            </div>
          ) : null}

          {/* Mobile-first ramp: small enough not to overflow at 320px, scaling to the approved
              display scale on large screens. */}
          <h1
            className="text-[2.4rem] sm:text-[3.4rem] lg:text-[5.3rem] font-bold leading-[0.95] mb-6 text-balance"
            style={{ letterSpacing: "-0.04em" }}
          >
            {headline}
          </h1>

          {subtitle ? (
            <p
              className="text-lg max-w-md leading-relaxed mb-10 font-medium"
              style={{ color: "var(--svc-muted)" }}
            >
              {subtitle}
            </p>
          ) : null}

          {points.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10 list-none p-0">
              {points.map((point, i) => (
                <li
                  key={point.id}
                  className={`${styles.mono} flex items-center gap-2 text-xs font-semibold pl-3`}
                  style={{ borderLeft: "2px solid var(--svc-accent)" }}
                >
                  <span style={{ color: "var(--svc-muted)" }}>{String(i + 1).padStart(2, "0")}</span>
                  {point.label}
                </li>
              ))}
            </ul>
          ) : null}

          {cta}
        </div>

        {media}
      </div>
    </section>
  );
}
