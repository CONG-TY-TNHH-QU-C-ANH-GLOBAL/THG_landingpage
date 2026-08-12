"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Turnstile } from "@marsidev/react-turnstile";

import { DiscoveryWizard, type DiscoveryData } from "./discovery-wizard";
import { SalesBriefSummary } from "./sales-brief-summary";
import { useLeadSubmission, LEAD_ERROR_COPY_KEY } from "@/shared/ui/use-lead-submission";
import type { Locale } from "@/shared/i18n";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";

interface Props {
  lang: Locale;
  copy: MarketingCopy;
  consultLabel: string;
  triggerLabel: string;
  triggerContext: string;
}

export function ConsultOverlay({
  lang,
  copy,
  consultLabel,
  triggerLabel,
  triggerContext,
}: Readonly<Props>) {
  const t = tFrom(copy);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [wizardData, setWizardData] = useState<DiscoveryData | null>(null);

  // Form engine
  const lead = useLeadSubmission({ lang, sourcePage: "/thg-fulfill" });
  const { form, setField, markTouched, nameInvalid, emailInvalid, pending, done, turnstile } = lead;
  const { widgetRef, siteKey, enabled: captchaEnabled, onSuccess, onError, onExpire } = turnstile;

  function open() {
    setIsOpen(true);
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  }

  function close() {
    setIsOpen(false);
    dialogRef.current?.close();
    document.body.style.overflow = "";
    
    // Clean up URL without triggering popstate
    const url = new URL(window.location.href);
    url.searchParams.delete("consult");
    window.history.replaceState({}, "", url.toString());

    // Delay reset to avoid visual flash while closing
    setTimeout(() => {
      setWizardData(null);
      lead.reset();
    }, 300);
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("consult") === "open") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      open();
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href);
      if (url.searchParams.get("consult") === "open") {
        setIsOpen(true);
        dialogRef.current?.showModal();
        document.body.style.overflow = "hidden";
      } else {
        setIsOpen(false);
        dialogRef.current?.close();
        document.body.style.overflow = "";
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Auto-inject diagnostic message
    const messageLines = [
      `[THG Fulfill — Dossier Data]`,
      `Scale: ${wizardData?.scale}`,
      `Markets: ${wizardData?.route.join(", ")}`,
      `Categories: ${wizardData?.category.join(", ")}`,
      `Pains: ${wizardData?.pain.join("; ")}`,
      `Timeline: ${wizardData?.timeline}`,
      ``,
      `User Message: ${form.message}`
    ].join("\n");
    
    // Temporarily set the message field before submit so it gets captured
    lead.setField("message", messageLines);

    const result = await lead.submit({
      primaryService: "fulfill",
      serviceInterests: ["fulfill"],
      surface: "fulfill-inline",
      detailsByService: {}, // Not using the old ProductType detail field since we have full dossier
    });
    
    if (result.ok) toast.success(t("lead_form.success_toast"));
    else if (result.error) {
      toast.error(t(LEAD_ERROR_COPY_KEY[result.error]));
      // Restore user message if failed
      lead.setField("message", form.message);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="m-0 p-0 w-full h-full max-w-full max-h-full border-0 bg-transparent outline-none backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm"
      aria-label="Fulfillment Consultation"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4 md:p-8 pointer-events-none">
        <div
          className="relative w-full max-w-4xl h-full max-h-[90vh] bg-white rounded-2xl border border-thg-border shadow-2xl pointer-events-auto flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-thg-border bg-white/90 backdrop-blur-md z-20">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-thg-gold animate-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-thg-gold">
                Discovery Session
              </span>
            </div>
            <button
              type="button"
              onClick={close}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-thg-border text-slate-400 hover:text-thg-textMain hover:border-thg-borderHover hover:bg-slate-50 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
            {!wizardData ? (
              <DiscoveryWizard lang={lang} onComplete={setWizardData} />
            ) : (
              <SalesBriefSummary
                data={wizardData}
                formNode={
                  done ? (
                    <div className="py-12 text-center flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-xl mb-4">
                        ✓
                      </div>
                      <div className="font-semibold text-lg text-thg-textMain mb-2">Đã nhận thông tin</div>
                      <p className="text-sm text-thg-textMuted max-w-sm mb-6">
                        Chuyên viên vận hành THG sẽ liên hệ với bạn qua email <strong>{form.email}</strong> trong thời gian sớm nhất.
                      </p>
                      <Button onClick={close} className="w-full bg-thg-gold text-white hover:bg-thg-gold/90 shadow-sm">
                        Đóng
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                      <h3 className="text-lg font-sans tracking-tight font-semibold text-thg-textMain mb-2">
                        Thông tin liên hệ
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="lead-name" className="text-thg-textMuted text-xs uppercase tracking-widest font-mono">Tên / Doanh nghiệp *</Label>
                          <Input
                            id="lead-name"
                            required
                            value={form.name}
                            onChange={(e) => setField("name", e.target.value)}
                            onBlur={() => markTouched("name")}
                            className={`bg-thg-bg border-thg-border text-thg-textMain focus:bg-white ${nameInvalid ? "border-red-500" : ""}`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="lead-email" className="text-thg-textMuted text-xs uppercase tracking-widest font-mono">Email *</Label>
                          <Input
                            id="lead-email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setField("email", e.target.value)}
                            onBlur={() => markTouched("email")}
                            className={`bg-thg-bg border-thg-border text-thg-textMain focus:bg-white ${emailInvalid ? "border-red-500" : ""}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="lead-phone" className="text-thg-textMuted text-xs uppercase tracking-widest font-mono">Số điện thoại</Label>
                        <Input
                          id="lead-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setField("phone", e.target.value)}
                          className="bg-thg-bg border-thg-border text-thg-textMain focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="lead-message" className="text-thg-textMuted text-xs uppercase tracking-widest font-mono">Ghi chú thêm (Tùy chọn)</Label>
                        <Input
                          id="lead-message"
                          value={form.message}
                          onChange={(e) => setField("message", e.target.value)}
                          className="bg-thg-bg border-thg-border text-thg-textMain focus:bg-white"
                          placeholder="Link store hiện tại, yêu cầu riêng..."
                        />
                      </div>

                      {captchaEnabled && (
                        <div className="mt-2">
                          <Turnstile
                            ref={widgetRef}
                            siteKey={siteKey}
                            onSuccess={onSuccess}
                            onError={onError}
                            onExpire={onExpire}
                            options={{ theme: "light", size: "flexible" }}
                          />
                        </div>
                      )}

                      <Button 
                        type="submit" 
                        disabled={pending}
                        className="w-full mt-4 bg-thg-gold text-white hover:bg-thg-gold/90 hover:shadow-md shadow-sm font-semibold py-6 text-base rounded-xl transition-all"
                      >
                        {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Gửi yêu cầu & Nhận kế hoạch"}
                      </Button>
                    </form>
                  )
                }
              />
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
