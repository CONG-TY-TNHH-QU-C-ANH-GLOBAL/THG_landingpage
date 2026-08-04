// Service capability / feature grid — Server Component.
//
// Richer than a title+description card: a feature may also carry the business value it delivers,
// a classification tag and a headline metric. Every one of those is optional and renders nothing
// when absent, so a service with plain features looks exactly as it does today and a service with
// richer content gets the richer card without a second component.
//
// Layout is a bento: a feature may claim a wide cell. Which features are wide is the caller's
// editorial decision, not something this layer infers.
import type { ReactNode } from "react";

import styles from "./service.module.css";

export interface ServiceFeature {
  id: string;
  title: string;
  description: string;
  /** Already-rendered glyph — keeps this layer independent of any icon library. */
  icon?: ReactNode;
  /** Accent for the icon chip, e.g. "#0891b2". Falls back to --svc-accent. */
  tone?: string;
  /** The business outcome, e.g. "Fewer returns". "" renders nothing. */
  value?: string;
  /** Short classification chip. */
  tag?: string;
  /** Headline figure for this feature, e.g. "99.2%". */
  metric?: string;
  /** Bento span. Default "single". */
  span?: "single" | "wide";
  /** Renders this element as the whole cell instead of the standard card — the escape hatch for a
   *  panel that genuinely is not a feature card (an integration rail, an embedded flow). The grid
   *  still owns placement and span, so the bento rhythm holds. */
  node?: ReactNode;
}

interface Props {
  features: readonly ServiceFeature[];
  /** Fixed row height for the bento rhythm. Pass "" to let rows size to content. */
  rowClassName?: string;
  className?: string;
}

function FeatureCard({ feature }: Readonly<{ feature: ServiceFeature }>) {
  const wide = feature.span === "wide";
  return (
    <div
      className={`${styles.glass} ${styles.featureCard} ${wide ? "md:col-span-2" : ""}`}
      style={feature.tone ? ({ "--svc-icon-tone": feature.tone } as React.CSSProperties) : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        {feature.icon ? <div className={styles.featureIcon}>{feature.icon}</div> : <span />}
        {feature.tag ? <span className={styles.featureTag}>{feature.tag}</span> : null}
      </div>

      <div>
        {feature.metric ? (
          <div className="text-3xl font-bold tracking-tight mb-1">{feature.metric}</div>
        ) : null}
        <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
        <p className="text-sm" style={{ color: "var(--svc-muted)" }}>
          {feature.description}
        </p>
        {feature.value ? <p className={styles.featureValue}>{feature.value}</p> : null}
      </div>
    </div>
  );
}

export function ServiceFeatureGrid({
  features,
  rowClassName = "md:auto-rows-[220px]",
  className = "",
}: Readonly<Props>) {
  if (features.length === 0) return null;
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 ${rowClassName} ${className}`}>
      {features.map((feature) =>
        feature.node ? (
          <div key={feature.id} className={feature.span === "wide" ? "md:col-span-2" : ""}>
            {feature.node}
          </div>
        ) : (
          <FeatureCard key={feature.id} feature={feature} />
        ),
      )}
    </div>
  );
}
