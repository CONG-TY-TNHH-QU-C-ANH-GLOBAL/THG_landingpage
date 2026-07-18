"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale" | "rotate3d";
}

const INITIAL_TRANSFORM: Record<NonNullable<ScrollRevealProps["direction"]>, string> = {
  up: "translateY(40px) perspective(1200px) rotateX(2deg)",
  left: "translateX(-40px)",
  right: "translateX(40px)",
  scale: "scale(0.92)",
  rotate3d: "perspective(1200px) rotateY(-15deg) translateZ(-50px)",
};

// Reveal `el` after `delay` ms: promote to a GPU layer for the transition, then release
// will-change (transitionend or the 1.2s fallback) to free GPU memory. Module-scope so the
// observer callback stays shallow (Sonar S2004).
function revealAfterDelay(el: HTMLDivElement, delay: number) {
  el.style.willChange = "opacity, transform";
  setTimeout(() => {
    el.style.opacity = "1";
    el.style.transform = "translate(0, 0) scale(1) perspective(1200px) rotateX(0) rotateY(0) translateZ(0)";

    const cleanup = () => {
      el.style.willChange = "auto";
      el.removeEventListener("transitionend", cleanup);
    };
    el.addEventListener("transitionend", cleanup, { once: true });

    setTimeout(() => {
      el.style.willChange = "auto";
    }, 1200);
  }, delay);
}

// Progressive enhancement (WEB-001B): the server markup is fully visible — the
// hidden entry state is applied only AFTER mount, and only when motion is allowed
// and IntersectionObserver exists. No-JS, reduced-motion, or a failed observer can
// never leave content at opacity: 0.
const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    el.style.opacity = "0";
    el.style.transform = INITIAL_TRANSFORM[direction];
    el.style.transition =
      "opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)";
    el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          revealAfterDelay(el, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
