// Community "Ask a question" modal — clones the LeadFormDialog pattern:
// Turnstile-gated POST to CMS /api/v1/community/questions. Submissions always
// land as pending moderation; the success state says so explicitly.

import { useState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { cmsClient } from "@/lib/cmsClient";
import { useCommunityCategories } from "@/hooks/useCmsContent";
import { useTurnstile } from "@/lib/useTurnstile";
import { getUtmPayload } from "@/lib/utm";
import { DELAYS } from "@/lib/constants";

// Mirror of the server-side zod bounds (community questions endpoint).
const TITLE_MIN = 8;
const BODY_MIN = 20;

interface Props {
  trigger: ReactNode;
}

// Local label+input field — collapses the repeated `<div><Label/><Input/></div>`
// markup shared by the name/email/title fields into one call. All extra input
// attributes (type, required, minLength, placeholder, disabled…) pass through.
type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
} & Omit<ComponentProps<typeof Input>, "id" | "value" | "onChange">;

function TextField({ id, label, value, onChange, hint, ...input }: Readonly<TextFieldProps>) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} {...input} />
      {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

export function AskQuestionDialog({ trigger }: Readonly<Props>) {
  const { language, t } = useI18n();
  const categories = useCommunityCategories();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", category: "", title: "", body: "" });
  const captcha = useTurnstile();

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.title.trim() || !form.body.trim()) {
      toast.error(t("community.form_err_required"));
      return;
    }
    if (form.title.trim().length < TITLE_MIN || form.body.trim().length < BODY_MIN) {
      toast.error(t("community.form_err_short"));
      return;
    }
    const token = captcha.resolveSubmitToken();
    if (!token) {
      toast.error(t("community.form_err_captcha"));
      return;
    }
    setPending(true);
    try {
      const utm = getUtmPayload();
      await cmsClient.postCommunityQuestion({
        title: form.title.trim(),
        body: form.body.trim(),
        category_slug: form.category || undefined,
        author_name: form.name.trim(),
        author_email: form.email.trim(),
        locale: language,
        utm: Object.keys(utm).length > 0 ? utm : undefined,
        turnstile_token: token,
      });
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("community.form_err_generic"));
      captcha.resetForRetry();
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setForm({ name: "", email: "", category: "", title: "", body: "" });
    setDone(false);
    captcha.resetForRetry();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setTimeout(reset, DELAYS.DIALOG_RESET_AFTER_CLOSE_MS);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("community.form_title")}</DialogTitle>
          <DialogDescription>{t("community.form_desc")}</DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center space-y-3">
            <div className="text-3xl">✅</div>
            <div className="font-semibold text-base">{t("community.form_success_title")}</div>
            <p className="text-sm text-muted-foreground">{t("community.form_success_desc")}</p>
            <Button onClick={() => setOpen(false)} className="mt-2 w-full">
              {t("community.form_close")}
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <TextField
                id="ask-name"
                label={`${t("community.form_name")} *`}
                required
                value={form.name}
                onChange={(v) => set("name", v)}
                disabled={pending}
              />
              <TextField
                id="ask-email"
                type="email"
                label={`${t("community.form_email")} *`}
                required
                value={form.email}
                onChange={(v) => set("email", v)}
                disabled={pending}
                hint={t("community.form_email_hint")}
              />
            </div>
            <div>
              <Label htmlFor="ask-category">{t("community.form_category")}</Label>
              <select
                id="ask-category"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                disabled={pending}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">{t("community.form_category_none")}</option>
                {(categories.data?.categories ?? []).map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <TextField
              id="ask-title"
              label={`${t("community.form_question_title")} *`}
              required
              minLength={TITLE_MIN}
              maxLength={200}
              value={form.title}
              onChange={(v) => set("title", v)}
              placeholder={t("community.form_question_title_ph")}
              disabled={pending}
            />
            <div>
              <Label htmlFor="ask-body">{t("community.form_question_body")} *</Label>
              <Textarea
                id="ask-body"
                required
                minLength={BODY_MIN}
                maxLength={5000}
                value={form.body}
                onChange={(e) => set("body", e.target.value)}
                placeholder={t("community.form_question_body_ph")}
                rows={5}
                disabled={pending}
              />
            </div>

            {captcha.enabled && (
              <div className="flex justify-center" data-testid="ask-turnstile">
                <Turnstile
                  ref={captcha.widgetRef}
                  siteKey={captcha.siteKey}
                  onSuccess={captcha.onSuccess}
                  onError={captcha.onError}
                  onExpire={captcha.onExpire}
                  options={{ theme: "light", size: "normal" }}
                />
              </div>
            )}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  {t("community.form_submitting")}
                </>
              ) : (
                t("community.form_submit")
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
