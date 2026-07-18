"use client";

// useInViewOnce as a thin wrapper element (IMPLEMENTATION_BASELINE.md "PillarEntryMotion /
// EcosystemAtlas — thin client shells"). Progressive enhancement contract: the server
// markup is the COMPLETE visible scene. Only when motion is allowed does this shell add
// `motionClassName` on mount (CSS scopes every initial-hidden animation state under that
// class) and then `inViewClassName` on first intersection. Under prefers-reduced-motion,
// no JS, or a missing/failed IntersectionObserver, neither class is added and the default
// fully-visible markup stands — essential content never depends on JS succeeding.
import { useEffect, useRef, type ReactNode } from "react";

interface InViewOnceProps {
  readonly className?: string;
  /** Added on mount only when motion is allowed; CSS hides animatable parts only under this class. */
  readonly motionClassName?: string;
  /** Added once on first intersection (a CSS-module "inView" class). */
  readonly inViewClassName: string;
  readonly threshold?: number;
  readonly children: ReactNode;
  readonly "data-testid"?: string;
}

export default function InViewOnce({
  className,
  motionClassName,
  inViewClassName,
  threshold = 0.35,
  children,
  "data-testid": testId,
}: InViewOnceProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    if (motionClassName) el.classList.add(motionClassName);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(inViewClassName);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inViewClassName, motionClassName, threshold]);

  return (
    <div ref={ref} className={className} data-testid={testId}>
      {children}
    </div>
  );
}
