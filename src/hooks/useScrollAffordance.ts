// Tracks whether a horizontally scrollable element can scroll further
// left/right, driving the arrow/fade affordances on wide pricing tables.
// Extracted from the identical logic in PriceTable and DomesticPricingPage.

import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollAffordance(scrollStep: number, watch: readonly unknown[] = []) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
    // `watch` lets callers re-measure when their table data/columns change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkScroll, ...watch]);

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * scrollStep, behavior: "smooth" });
  };

  return { scrollRef, canScrollLeft, canScrollRight, scrollBy };
}
