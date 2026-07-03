// Community "Submit a review" modal — mirrors AskQuestionDialog: Turnstile-gated
// POST to CMS /api/v1/community/reviews. Reviews always land as pending
// moderation and only go public once an operator publishes AND verifies them;
// the success state says so explicitly (never implies instant publication).

import { type FormEvent, type ReactNode } from "react";

import { Label } from "@/components/ui/label";
import {
  CommunityCategorySelect,
  CommunityNameEmailFields,
  CommunitySubmitButton,
  CommunitySubmitDialog,
  TextareaField,
  TextField,
  TurnstileField,
} from "@/components/community/communityFormBits";
import { useCommunitySubmitDialog } from "@/components/community/communitySubmit";
import { useI18n } from "@/lib/i18n";
import { cmsClient } from "@/lib/cmsClient";
import { rememberOwnerToken, reviewOwnerKey } from "@/lib/communityOwner";
import { useCommunityCategories } from "@/hooks/useCmsContent";
import { useFormFields } from "@/hooks/useFormFields";
import { getUtmPayload } from "@/lib/utm";

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
  const { fields: form, set, reset } = useFormFields({
    name: "",
    email: "",
    category: "",
    rating: "",
    title: "",
    body: "",
    evidence: "",
    orderRef: "",
  });
  const { captcha, pending, submit, dialogProps } = useCommunitySubmitDialog(t, reset);

  const onSubmit = (e: FormEvent<HTMLFormElement>) =>
    submit(e, form, { titleMin: TITLE_MIN, bodyMin: BODY_MIN }, async (token) => {
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
    });

  return (
    <CommunitySubmitDialog {...dialogProps} trigger={trigger} copyPrefix="reviews" onSubmit={onSubmit}>
      <CommunityNameEmailFields
        idPrefix="review"
        name={form.name}
        email={form.email}
        disabled={pending}
        onName={(v) => set("name", v)}
        onEmail={(v) => set("email", v)}
      />
      <div className="grid grid-cols-2 gap-3">
        <CommunityCategorySelect
          id="review-category"
          value={form.category}
          disabled={pending}
          onChange={(v) => set("category", v)}
          categories={categories.data?.categories ?? []}
        />
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
      <TextareaField
        id="review-body"
        label={`${t("reviews.form_review_body")} *`}
        required
        minLength={BODY_MIN}
        maxLength={5000}
        value={form.body}
        onChange={(v) => set("body", v)}
        placeholder={t("reviews.form_review_body_ph")}
        rows={5}
        disabled={pending}
      />

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
        <TextareaField
          id="review-evidence"
          label={t("reviews.form_evidence")}
          maxLength={2000}
          value={form.evidence}
          onChange={(v) => set("evidence", v)}
          placeholder={t("reviews.form_evidence_ph")}
          rows={2}
          disabled={pending}
        />
      </div>

      <TurnstileField captcha={captcha} testId="review-turnstile" />

      <CommunitySubmitButton pending={pending} label={t("reviews.form_submit")} />
    </CommunitySubmitDialog>
  );
}
