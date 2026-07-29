// Parity source: src/lib/constants.ts — the timing/threshold constants the ported shell and
// homepage consume (LIMITS stays with its owning feature slices).

export const DELAYS = {
  /** Hover-out grace period before closing a navbar mega-menu, so flicking the
   *  pointer across the gap to a child link doesn't slam the dropdown shut. */
  NAVBAR_DROPDOWN_CLOSE_MS: 150,
  /** Time to wait after a mobile menu link click before scroll-into-view fires,
   *  so the Radix close transition completes first. */
  NAVBAR_MOBILE_SCROLL_DELAY_MS: 100,
  /** Modal close animation length — gates a `reset()` of the form state. */
  DIALOG_RESET_AFTER_CLOSE_MS: 200,
  /** Cooldown after a captcha widget is re-rendered before we touch it again
   *  (post-hydration timing buffer). */
  TURNSTILE_REMOUNT_MS: 300,
} as const;

export const SCROLL = {
  /** Pixels scrolled before the floating back-to-top button appears. */
  BACK_TO_TOP_THRESHOLD_PX: 600,
} as const;
