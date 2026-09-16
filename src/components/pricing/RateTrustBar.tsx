// Sticky commitment strip that parks under the fixed navbar. A sentinel plus
// IntersectionObserver drives the compact state so no scroll handler runs.

import { useEffect, useRef, useState } from "react";

export interface RateTrustItem {
  label: string;
  value: string;
}

export function RateTrustBar({ items }: Readonly<{ items: readonly RateTrustItem[] }>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const headerHeight =
      getComputedStyle(sentinel).getPropertyValue("--rate-header-h").trim() || "64px";

    const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
      rootMargin: `-${headerHeight} 0px 0px 0px`,
      threshold: 0,
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      <div
        className={`rate-trust-bar border-b border-border/60 bg-card/95 backdrop-blur ${stuck ? "is-stuck shadow-[0_10px_24px_-18px_rgba(0,0,0,0.45)]" : ""}`}
      >
        <div className="mx-auto max-w-[1200px] px-6">
          {/* One scrollable line on phones so the sticky bar never eats the viewport;
              spread across the container once there is room. */}
          <ul className="rate-trust-grid flex items-center gap-x-8 overflow-x-auto sm:flex-wrap sm:justify-between sm:gap-x-10 sm:gap-y-3 sm:overflow-visible">
            {items.map((item) => (
              <li
                key={item.label}
                className="shrink-0 whitespace-nowrap border-l-[3px] border-primary pl-3 sm:whitespace-normal"
              >
                <p className="rate-trust-value font-extrabold leading-none text-navy">
                  {item.value}
                </p>
                <p className="rate-eyebrow mt-1 text-muted-foreground sm:max-w-[220px]">{item.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
