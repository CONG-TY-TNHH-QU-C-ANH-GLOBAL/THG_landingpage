import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale" | "rotate3d";
}

const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check for reduced-motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Promote to GPU layer only during animation
          el.style.willChange = "opacity, transform";

          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translate(0, 0) scale(1) perspective(1200px) rotateX(0) rotateY(0) translateZ(0)";

            // Remove will-change after animation completes to free GPU memory
            const cleanup = () => {
              el.style.willChange = "auto";
              el.removeEventListener("transitionend", cleanup);
            };
            el.addEventListener("transitionend", cleanup, { once: true });

            // Fallback: clear will-change after 1.2s even if transitionend doesn't fire
            setTimeout(() => {
              el.style.willChange = "auto";
            }, 1200);
          }, delay);

          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const initialTransform = {
    up: "translateY(40px) perspective(1200px) rotateX(2deg)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
    scale: "scale(0.92)",
    rotate3d: "perspective(1200px) rotateY(-15deg) translateZ(-50px)",
  }[direction];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: initialTransform,
        transition: `opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
