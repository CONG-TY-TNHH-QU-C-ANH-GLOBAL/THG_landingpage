// Community "Submit a review" modal — mirrors AskQuestionDialog: Turnstile-gated
// POST to CMS /api/v1/community/reviews. Reviews always land as pending
// moderation and only go public once an operator publishes AND verifies them;
// the success state says so explicitly (never implies instant publication).

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
import { rememberOwnerToken, reviewOwnerKey } from "@/lib/communityOwner";
import { useCommunityCategories } from "@/hooks/useCmsContent";
import { useTurnstile } from "@/lib/useTurnstile";
import { getUtmPayload } from "@/lib/utm";
import { DELAYS } from "@/lib/constants";

// Mirror of the server-side zod bounds (community reviews endpoint).
const TITLE_MIN = 8;
const BODY_MIN = 20;
const RATINGS = [5, 4, 3, 2, 1] as const;

interface Props {
  trigger: ReactNode;
}

export function SubmitReviewDialog({ trigger }: Readonly<Props>) {
  const { language, t } = useI18n();
  const categories = useCommunityCategories();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    rating: "",
    title: "",
    body: "",
    evidence: "",
    orderRef: "",
  });
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
      const res = await cmsClient.postCommunityReview({
        title: form.title.trim(),
        body: form.body.trim(),
        category_slug: form.category || undefined,
        reviewer_name: form.name.trim(),
        reviewer_email: form.email.trim(),
        rating: form.rating ? Number(form.rating) : undefined,
        locale: language,
        private_evidence_note: form.evidence.trim() || undefined,
        private_order_reference: form.orderRef.trim() || undefined,
        utm: Object.keys(utm).length > 0 ? utm : undefined,
        turnstile_token: token,
      });
      // Remember the one-time owner token (namespaced) so this browser can
      // withdraw later; absent only if the CMS predates the ownership feature.
      if (res.owner_token) rememberOwnerToken(reviewOwnerKey(res.slug), res.owner_token);
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("community.form_err_generic"));
      captcha.resetForRetry();
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setForm({ name: "", email: "", category: "", rating: "", title: "", body: "", evidence: "", orderRef: "" });
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
          <DialogTitle>{t("reviews.form_title")}</DialogTitle>
          <DialogDescription>{t("reviews.form_desc")}</DialogDescription>
        </DialogHeader>

        {done ? (
          <SubmitSuccess
            title={t("reviews.form_success_title")}
            desc={t("reviews.form_success_desc")}
            hint={t("reviews.withdraw_hint")}
            closeLabel={t("community.form_close")}
            onClose={() => setOpen(false)}
          />
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <TextField
                id="review-name"
                label={`${t("community.form_name")} *`}
                required
                value={form.name}
                onChange={(v) => set("name", v)}
                disabled={pending}
              />
              <TextField
                id="review-email"
                type="email"
                label={`${t("community.form_email")} *`}
                required
                value={form.email}
                onChange={(v) => set("email", v)}
                disabled={pending}
                hint={t("community.form_email_hint")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="review-category">{t("community.form_category")}</Label>
                <select
                  id="review-category"
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
              <div>
                <Label htmlFor="review-rating">{t("reviews.form_rating")}</Label>
                <select
                  id="review-rating"
                  value={form.rating}
                  onChange={(e) => set("rating", e.target.value)}
                  disabled={pending}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">{t("reviews.form_rating_none")}</option>
                  {RATINGS.map((n) => (
                    <option key={n} value={n}>{"★".repeat(n)} ({n}/5)</option>
                  ))}
                </select>
              </div>
            </div>
            <TextField
              id="review-title"
              label={`${t("reviews.form_review_title")} *`}
              required
              minLength={TITLE_MIN}
              maxLength={200}
              value={form.title}
              onChange={(v) => set("title", v)}
              placeholder={t("reviews.form_review_title_ph")}
              disabled={pending}
            />
            <div>
              <Label htmlFor="review-body">{t("reviews.form_review_body")} *</Label>
              <Textarea
                id="review-body"
                required
                minLength={BODY_MIN}
                maxLength={5000}
                value={form.body}
                onChange={(e) => set("body", e.target.value)}
                placeholder={t("reviews.form_review_body_ph")}
                rows={5}
                disabled={pending}
              />
            </div>

            {/* Private moderation context — clearly labeled, never shown publicly. */}
            <div className="rounded-md border border-dashed border-border p-3 space-y-3">
              <p className="text-[11px] font-medium text-muted-foreground">
                🔒 {t("reviews.form_private_hint")}
              </p>
              <TextField
                id="review-order"
                label={t("reviews.form_order_ref")}
                value={form.orderRef}
                onChange={(v) => set("orderRef", v)}
                maxLength={200}
                disabled={pending}
              />
              <div>
                <Label htmlFor="review-evidence">{t("reviews.form_evidence")}</Label>
                <Textarea
                  id="review-evidence"
                  maxLength={2000}
                  value={form.evidence}
                  onChange={(e) => set("evidence", e.target.value)}
                  placeholder={t("reviews.form_evidence_ph")}
                  rows={2}
                  disabled={pending}
                />
              </div>
            </div>

            <TurnstileField captcha={captcha} testId="review-turnstile" />

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  {t("community.form_submitting")}
                </>
              ) : (
                t("reviews.form_submit")
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
