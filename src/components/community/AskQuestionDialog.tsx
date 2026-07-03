// Community "Ask a question" modal — clones the LeadFormDialog pattern:
// Turnstile-gated POST to CMS /api/v1/community/questions. Submissions always
// land as pending moderation; the success state says so explicitly.

import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubmitSuccess, TextField, TurnstileField } from "@/components/community/communityFormBits";
import { useI18n } from "@/lib/i18n";
import { cmsClient } from "@/lib/cmsClient";
import { rememberOwnerToken } from "@/lib/communityOwner";
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
      const res = await cmsClient.postCommunityQuestion({
        title: form.title.trim(),
        body: form.body.trim(),
        category_slug: form.category || undefined,
        author_name: form.name.trim(),
        author_email: form.email.trim(),
        locale: language,
        utm: Object.keys(utm).length > 0 ? utm : undefined,
        turnstile_token: token,
      });
      // Remember the one-time owner token so this browser can withdraw later
      // (absent only if the CMS predates the ownership feature).
      if (res.owner_token) rememberOwnerToken(res.slug, res.owner_token);
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
          <SubmitSuccess
            title={t("community.form_success_title")}
            desc={t("community.form_success_desc")}
            hint={t("community.withdraw_hint")}
            closeLabel={t("community.form_close")}
            onClose={() => setOpen(false)}
          />
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

            <TurnstileField captcha={captcha} testId="ask-turnstile" />

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
