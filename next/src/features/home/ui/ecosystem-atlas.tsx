"use client";

// Thin client shell around server-provided stage strings (IMPLEMENTATION_BASELINE.md
// "EcosystemAtlas — same pattern, plus one SMIL trigger"): useInViewOnce-style observer
// toggles one CSS class; the single imperative call is beginElement() on the shipment
// signal's <animateMotion>, fired once when the atlas first scrolls into view. No data
// fetching, no CMS import (enforced by tests/architecture/home-content-boundaries).
// Under prefers-reduced-motion the observer never runs and CSS shows the complete
// static network (signal hidden).
import { useEffect, useRef } from "react";

import styles from "./ecosystem-atlas.module.css";

export interface EcosystemStage {
  /** Owning pillar micro-label (real service name, or "Customer" for delivery). */
  readonly owner: string;
  readonly title: string;
  /** Larger "anchor" hub node (Warehouse / Fulfillment — the two infrastructure hubs). */
  readonly anchor: boolean;
}

// Static design assets — route geometry and node coordinates from the approved artifact.
const ROUTE = "M60,180 C150,140 190,100 240,100 C320,100 360,160 420,200 C520,220 560,120 600,80 C680,40 720,150 780,190 C860,220 880,140 940,110";
const NODES = [
  { cx: 60, cy: 180, delay: 0.1, labelLeft: "6%", labelTop: "60%", below: true },
  { cx: 240, cy: 100, delay: 0.25, labelLeft: "24%", labelTop: "33.3%", below: false },
  { cx: 420, cy: 200, delay: 0.4, labelLeft: "42%", labelTop: "66.7%", below: true },
  { cx: 600, cy: 80, delay: 0.55, labelLeft: "60%", labelTop: "26.7%", below: false },
  { cx: 780, cy: 190, delay: 0.7, labelLeft: "78%", labelTop: "63.3%", below: true },
  { cx: 940, cy: 110, delay: 0.85, labelLeft: "94%", labelTop: "36.7%", below: false },
] as const;

export function EcosystemAtlas({ stages }: Readonly<{ stages: readonly EcosystemStage[] }>) {
  const atlasRef = useRef<HTMLDivElement>(null);
  const signalMotionRef = useRef<SVGElement>(null);

  useEffect(() => {
    const el = atlasRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Default markup is the complete static network — without motion, add nothing.
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    el.classList.add(styles.motion);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add(styles.inView);
        // One-shot shipment signal along the route — never repeated.
        const motion = signalMotionRef.current as unknown as { beginElement?: () => void } | null;
        try {
          motion?.beginElement?.();
        } catch {
          // SMIL unsupported (e.g. test DOM) — the static network is already complete.
        }
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={atlasRef} className={styles.atlas} data-testid="ecosystem-atlas">
        <svg className={styles.svg} viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <pattern id="ecoGrid" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="hsl(var(--navy))" opacity=".16" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="1000" height="300" fill="url(#ecoGrid)" />
          <path className={styles.path} pathLength={100} d={ROUTE} />
          <circle className={styles.signal} r="6" fill="hsl(var(--gold))">
            <animateMotion ref={signalMotionRef} dur="2.8s" fill="freeze" begin="indefinite" path={ROUTE} />
          </circle>
          {NODES.map((n, i) => (
            <g key={n.cx} className={styles.node} style={{ transitionDelay: `${n.delay}s` }}>
              <circle
                className={stages[i]?.anchor ? styles.nodeAnchor : styles.nodeTransition}
                cx={n.cx}
                cy={n.cy}
                r={stages[i]?.anchor ? 11 : 7}
              />
            </g>
          ))}
        </svg>
        <div className={styles.labels}>
          {NODES.map((n, i) => {
            const stage = stages[i];
            if (!stage) return null;
            return (
              <div
                key={n.cx}
                className={`${styles.label} ${stage.anchor ? styles.labelAnchor : ""} ${n.below ? styles.posBelow : styles.posAbove}`}
                style={{ left: n.labelLeft, top: n.labelTop }}
              >
                <span className={styles.owner}>{stage.owner}</span>
                <h4>{stage.title}</h4>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical route, same owner/anchor visual language — a deliberate
          composition, not the desktop atlas compressed. */}
      <ol className={styles.mobile} data-testid="ecosystem-atlas-mobile">
        {stages.map((stage) => (
          <li key={`${stage.owner}-${stage.title}`} className={`${styles.mStep} ${stage.anchor ? styles.mStepAnchor : ""}`}>
            <div className={styles.mNode} aria-hidden="true" />
            <div className={styles.mBody}>
              <span className={styles.owner}>{stage.owner}</span>
              <h4>{stage.title}</h4>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
