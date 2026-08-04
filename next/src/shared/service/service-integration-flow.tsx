// Integration / ecosystem flow — Server Component.
//
// Presents the systems a service plugs into as an ordered pipeline rather than a logo wall: the
// stages are the flow the work actually travels through, so they read as a sequence and keep the
// operational story going instead of interrupting it with a grid of marks.
//
// Rendered as an ordered list so the sequence is conveyed to assistive technology, not only by
// visual position.
import type { ReactNode } from "react";

import styles from "./service.module.css";

export interface ServiceFlowStage {
  id: string;
  label: string;
  /** Trailing marker, e.g. a status glyph. Defaults to an em dash so the rail stays aligned. */
  marker?: string;
}

interface Props {
  title: string;
  description?: string;
  /** Rail caption above the stages. */
  caption?: string;
  stages: readonly ServiceFlowStage[];
  icon?: ReactNode;
  /** Background for the rail panel — the dark operational surface by default. */
  railStyle?: React.CSSProperties;
}

export function ServiceIntegrationFlow({
  title,
  description,
  caption,
  stages,
  icon,
  railStyle,
}: Readonly<Props>) {
  return (
    <div className={`${styles.glass} h-full rounded-3xl overflow-hidden flex flex-col md:flex-row`}>
      <div className="p-8 flex-1 flex flex-col justify-center gap-4">
        {icon ? <div className={styles.featureIcon}>{icon}</div> : null}
        <div>
          <h3 className="font-bold text-2xl mb-2">{title}</h3>
          {description ? (
            <p className="text-sm max-w-sm" style={{ color: "var(--svc-muted)" }}>
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div
        className={`${styles.mono} w-full md:w-[42%] p-6 text-[11px] leading-loose flex flex-col justify-center gap-2`}
        style={railStyle ?? { background: "var(--svc-ink)" }}
      >
        {caption ? (
          <div
            className="uppercase tracking-widest text-[8px] mb-1"
            style={{ color: "var(--svc-muted)" }}
          >
            {caption}
          </div>
        ) : null}
        <ol className={`${styles.flowRail} list-none p-0 m-0`}>
          {stages.map((stage) => (
            <li key={stage.id} className={styles.flowStage}>
              <span>{stage.label}</span>
              <span className={styles.flowMarker}>{stage.marker ?? "—"}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
