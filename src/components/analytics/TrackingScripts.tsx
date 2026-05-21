// Tracking scripts (GA4, GTM, Meta Pixel, TikTok Pixel) — gated by GDPR consent.
// IDs come from CMS site_settings (operator-editable, no redeploy) with a
// fallback to VITE_* build-time env vars for offline/CMS-down resilience.
//
// Audit P0.5 fix (analytics blackout): scripts only fire after user accepts
// ConsentBanner, satisfying GDPR while restoring measurement.

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { useCmsSiteSettings } from "@/hooks/useCmsContent";

const STORAGE_KEY = "thg-consent-v1";

const ENV_GA4 = import.meta.env.VITE_GA4_ID as string | undefined;
const ENV_GTM = import.meta.env.VITE_GTM_ID as string | undefined;
const ENV_FB = import.meta.env.VITE_FB_PIXEL_ID as string | undefined;
const ENV_TIKTOK = import.meta.env.VITE_TIKTOK_PIXEL_ID as string | undefined;

function pick(cmsValue: string | null | undefined, envValue: string | undefined): string | undefined {
  // CMS wins when non-empty; env is fallback. Empty string is treated as unset.
  const c = cmsValue?.trim();
  if (c) return c;
  const e = envValue?.trim();
  return e || undefined;
}

export function TrackingScripts() {
  const { data: settings, isLoading } = useCmsSiteSettings();
  const [accepted, setAccepted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "accepted";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<{ consent?: string }>).detail;
      if (detail?.consent === "accepted") setAccepted(true);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue === "accepted") setAccepted(true);
    };
    // Poll briefly for first-time accept (banner sets localStorage but stays in same tab — no storage event).
    const interval = window.setInterval(() => {
      try {
        if (localStorage.getItem(STORAGE_KEY) === "accepted") {
          setAccepted(true);
          window.clearInterval(interval);
        }
      } catch {
        /* ignore */
      }
    }, 1000);
    window.addEventListener("thg:consent", onConsent);
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("thg:consent", onConsent);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Don't fire until: (a) user consented AND (b) CMS settings query has resolved.
  // Loading state is brief (<300ms in cache hit, ~1s cold). Without this gate, we'd
  // either render with env-only IDs (missing CMS-set ones) or risk a double-injection
  // when CMS data arrives — both bad for analytics integrity.
  if (!accepted || isLoading) return null;

  const ga4 = pick(settings?.ga4_id, ENV_GA4);
  const gtm = pick(settings?.gtm_id, ENV_GTM);
  const fb = pick(settings?.fb_pixel_id, ENV_FB);
  const tiktok = pick(settings?.tiktok_pixel_id, ENV_TIKTOK);

  const ga4Init = ga4
    ? `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}',{anonymize_ip:true});`
    : "";

  const gtmInit = gtm
    ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`
    : "";

  const fbInit = fb
    ? `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fb}');fbq('track','PageView');`
    : "";

  const tiktokInit = tiktok
    ? `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${tiktok}');ttq.page();}(window,document,'ttq');`
    : "";

  return (
    <Helmet>
      {gtm && <script>{gtmInit}</script>}
      {ga4 && <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} />}
      {ga4 && <script>{ga4Init}</script>}
      {fb && <script>{fbInit}</script>}
      {tiktok && <script>{tiktokInit}</script>}
    </Helmet>
  );
}
