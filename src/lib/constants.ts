// Centralized constants for timings, thresholds, and other magic numbers
// that previously lived inline. Tweaking a value here propagates everywhere
// it's used — much friendlier than git-grepping for `setTimeout(.., 150)`.
//
// Categories:
//   - DELAYS        animation / interaction timings (ms)
//   - SCROLL        scroll-distance thresholds and steps (px)
//   - LIMITS        size caps (px, bytes, items)

export const DELAYS = {
  /** Hover-out grace period before closing a navbar mega-menu, so flicking the
   *  pointer across the gap to a child link doesn't slam the dropdown shut. */
  NAVBAR_DROPDOWN_CLOSE_MS: 150,
  /** Time to wait after a mobile menu link click before scroll-into-view fires,
   *  so the Radix close transition completes first. */
  NAVBAR_MOBILE_SCROLL_DELAY_MS: 100,
  /** Modal close animation length — gates a `reset()` of the form state. */
  DIALOG_RESET_AFTER_CLOSE_MS: 200,
  /** How long a "copied" toast / inline confirmation stays visible. */
  CLIPBOARD_COPIED_FEEDBACK_MS: 2000,
  /** Shorter variant for the inline check icon on share buttons. */
  CLIPBOARD_COPIED_INLINE_MS: 1400,
  /** Cooldown after a captcha widget is re-rendered before we touch it again
   *  (post-hydration timing buffer). */
  TURNSTILE_REMOUNT_MS: 300,
} as const;

export const SCROLL = {
  /** Pixels scrolled before the navbar collapses into its "scrolled" state. */
  NAVBAR_OPAQUE_THRESHOLD_PX: 20,
  /** Pixels scrolled before the floating back-to-top button appears. */
  BACK_TO_TOP_THRESHOLD_PX: 600,
  /** Horizontal scroll step for table chevron buttons (px per click). */
  TABLE_HORIZONTAL_STEP_PX: 120,
} as const;

export const LIMITS = {
  /** Catalog grid items per page request. */
  CATALOG_PAGE_LIMIT: 20,
  /** Max applicant CV upload size — keep in sync with CMS validator. */
  APPLICANT_CV_MAX_BYTES: 10 * 1024 * 1024,
} as const;
