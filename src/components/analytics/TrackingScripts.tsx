// Tracking scripts (GA4, GTM, Meta Pixel, TikTok Pixel) — gated by GDPR consent.
// IDs come from VITE_* env vars (or future CMS site_settings). Without an ID, that script is skipped.
//
// Audit P0.5 fix (analytics blackout): scripts only fire after user accepts ConsentBanner,
// satisfying GDPR while restoring measurement for organic + paid traffic attribution.

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const STORAGE_KEY = "thg-consent-v1";

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const GTM_ID = import.meta.env.VITE_GTM_ID as string | undefined;
const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID as string | undefined;
const TIKTOK_PIXEL_ID = import.meta.env.VITE_TIKTOK_PIXEL_ID as string | undefined;

export function TrackingScripts() {
  const [accepted, setAccepted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "accepted";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Re-check when consent banner persists a decision (writes localStorage + dataLayer event).
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

  if (!accepted) return null;

  const ga4Init = GA4_ID
    ? `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}',{anonymize_ip:true});`
    : "";

  const gtmInit = GTM_ID
    ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`
    : "";

  const fbInit = FB_PIXEL_ID
    ? `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${FB_PIXEL_ID}');fbq('track','PageView');`
    : "";

  const tiktokInit = TIKTOK_PIXEL_ID
    ? `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${TIKTOK_PIXEL_ID}');ttq.page();}(window,document,'ttq');`
    : "";

  return (
    <Helmet>
      {GTM_ID && <script>{gtmInit}</script>}
      {GA4_ID && <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} />}
      {GA4_ID && <script>{ga4Init}</script>}
      {FB_PIXEL_ID && <script>{fbInit}</script>}
      {TIKTOK_PIXEL_ID && <script>{tiktokInit}</script>}
    </Helmet>
  );
}
