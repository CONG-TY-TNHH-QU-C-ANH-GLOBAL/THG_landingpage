import { useEffect, useRef, ReactNode, useState } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale" | "rotate3d";
}

const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check for reduced-motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    setEnhanced(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Promote to GPU layer only during animation
          el.style.willChange = "opacity, transform";

          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "none";

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
      // threshold 0, not a ratio: a block taller than ten screens (the blog
      // grid) can never show 10% of itself at once and would stay hidden.
      { threshold: 0, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const initialTransform = {
    // 2D only: a perspective tilt gives every revealed block its own 3D layer,
    // which costs more than it shows on a phone.
    up: "translateY(40px)",
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
        // Progressive enhancement: prerendered HTML is visible without JS.
        opacity: enhanced ? 0 : 1,
        transform: enhanced ? initialTransform : "none",
        transition: `opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
