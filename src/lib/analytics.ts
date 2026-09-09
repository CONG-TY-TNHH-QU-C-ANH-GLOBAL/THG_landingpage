const CONSENT_KEY = "thg-consent-v1";

type SeoEvent = "form_start" | "select_service" | "view_pricing" | "generate_lead" | "outbound_click";

export function trackEvent(event: SeoEvent, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(CONSENT_KEY) !== "accepted") return;
  } catch {
    return;
  }
  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  win.dataLayer = win.dataLayer ?? [];
  win.dataLayer.push({ event, ...params });
}
