import { useEffect, useState } from "react";

import { CHRISTMAS, getCountdown, type Countdown } from "./christmasData";

const TARGET = new Date(CHRISTMAS.countdownTarget);

/** Headless browsers (the prerender) keep the placeholder, so the static HTML
 *  never freezes a build-time number; real visitors tick from mount. */
function shouldTick(): boolean {
    return typeof navigator === "undefined" || !navigator.webdriver;
}

/** null until mounted: the first paint is a stable "--" placeholder. */
export function useCountdown(): Countdown | null {
    const [value, setValue] = useState<Countdown | null>(null);
    useEffect(() => {
        if (!shouldTick()) return;
        const tick = () => setValue(getCountdown(new Date(), TARGET));
        tick();
        const timer = window.setInterval(tick, 1000);
        return () => window.clearInterval(timer);
    }, []);
    return value;
}
