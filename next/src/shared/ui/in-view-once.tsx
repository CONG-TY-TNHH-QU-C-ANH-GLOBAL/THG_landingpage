"use client";

// useInViewOnce as a thin wrapper element (IMPLEMENTATION_BASELINE.md "PillarEntryMotion /
// EcosystemAtlas — thin client shells"): adds one CSS class the first time the wrapper
// scrolls into view, then unobserves. All actual animation is CSS on server-rendered
// markup, so the server HTML is already the complete static scene (hydration-safe).
// Under prefers-reduced-motion the observer is never created — the class is applied
// immediately and the section CSS's reduced-motion overrides render the final state.
import { useEffect, useRef, type ReactNode } from "react";

interface InViewOnceProps {
  readonly className?: string;
  /** Class added once on first intersection (a CSS-module "inView" class). */
  readonly inViewClassName: string;
  readonly threshold?: number;
  readonly children: ReactNode;
  readonly "data-testid"?: string;
}

export default function InViewOnce({ className, inViewClassName, threshold = 0.35, children, "data-testid": testId }: InViewOnceProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      el.classList.add(inViewClassName);
      return;
    }
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
  }, [inViewClassName, threshold]);

  return (
    <div ref={ref} className={className} data-testid={testId}>
      {children}
    </div>
  );
}
