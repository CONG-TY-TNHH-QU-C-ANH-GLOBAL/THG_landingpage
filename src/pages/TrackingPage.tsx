import { FormEvent, useMemo, useState } from "react";

import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { useI18n } from "@/lib/i18n";
import { useCmsSiteSettings } from "@/hooks/useCmsContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; payload: unknown };

const TRACKING_LOOKUP_URL = (import.meta.env.VITE_TRACKING_LOOKUP_URL as string | undefined)?.trim();

const TrackingPage = () => {
  const { t } = useI18n();
  const { data: settings } = useCmsSiteSettings();
  const [orderId, setOrderId] = useState("");
  const [state, setState] = useState<LookupState>({ status: "idle" });

  const supportPhoneHref = useMemo(() => {
    const raw = settings?.contact_phone?.trim();
    if (!raw) return null;
    const digits = raw.replace(/\D+/g, "");
    return digits ? `tel:${digits}` : null;
  }, [settings?.contact_phone]);

  const supportEmailHref = useMemo(() => {
    const email = settings?.contact_email?.trim();
    if (!email) return null;
    return `mailto:${email}`;
  }, [settings?.contact_email]);

  const fireTrackingEvent = (id: string) => {
    const payload = { event: "tracking_lookup", order_id: id };

    const w = window as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
      fbq?: (...args: unknown[]) => void;
      ttq?: { track?: (...args: unknown[]) => void };
    };

    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push(payload);

    if (typeof w.gtag === "function") {
      w.gtag("event", "tracking_lookup", { order_id: id });
    }
    if (typeof w.fbq === "function") {
      w.fbq("trackCustom", "tracking_lookup", { order_id: id });
    }
    if (w.ttq?.track) {
      w.ttq.track("tracking_lookup", { order_id: id });
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const id = orderId.trim();

    if (!id) {
      setState({ status: "error", message: t("tracking.invalid_order_id") });
      return;
    }

    fireTrackingEvent(id);

    if (!TRACKING_LOOKUP_URL) {
      setState({ status: "error", message: t("tracking.lookup_unavailable") });
      return;
    }

    setState({ status: "loading" });

    try {
      const url = new URL(TRACKING_LOOKUP_URL);
      url.searchParams.set("id", id);

      const res = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error(t("tracking.request_failed"));
      }

      const body: unknown = await res.json();
      if (!body) {
        setState({ status: "error", message: t("tracking.no_data") });
        return;
      }

      setState({ status: "success", payload: body });
    } catch {
      setState({ status: "error", message: t("tracking.request_failed") });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={`${t("tracking.title")} | THG Fulfill`}
        description={t("tracking.subtitle")}
        path="/tracking"
      />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://thgfulfill.com/" },
          { name: t("tracking.title"), url: "https://thgfulfill.com/tracking" },
        ]}
      />
      <Navbar />

      <main className="container mx-auto px-4 pt-28 pb-12">
        <section className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl md:text-4xl font-bold text-navy tracking-tight">{t("tracking.title")}</h1>
          <p className="mt-3 text-muted-foreground">{t("tracking.subtitle")}</p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 md:flex-row">
            <label htmlFor="tracking-order-id" className="sr-only">
              {t("tracking.input_label")}
            </label>
            <Input
              id="tracking-order-id"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder={t("tracking.input_placeholder")}
              className="h-12"
            />
            <Button type="submit" className="h-12 px-6" disabled={state.status === "loading"}>
              {state.status === "loading" ? t("tracking.submitting") : t("tracking.submit")}
            </Button>
          </form>

          {state.status === "error" && (
            <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-800">
              <p className="font-medium">{state.message}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {supportPhoneHref && settings?.contact_phone && (
                  <a className="underline hover:no-underline" href={supportPhoneHref}>
                    {settings.contact_phone}
                  </a>
                )}
                {supportEmailHref && settings?.contact_email && (
                  <a className="underline hover:no-underline" href={supportEmailHref}>
                    {settings.contact_email}
                  </a>
                )}
                {!supportPhoneHref && !supportEmailHref && (
                  <span>{t("tracking.contact_support")}</span>
                )}
              </div>
            </div>
          )}

          {state.status === "success" && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="mb-2 font-semibold text-emerald-900">{t("tracking.result_title")}</p>
              <pre className="max-h-[360px] overflow-auto rounded-lg bg-white p-3 text-xs leading-relaxed text-emerald-900 border border-emerald-100">
                {JSON.stringify(state.payload, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </main>

      <ContactSection />
    </div>
  );
};

export default TrackingPage;
