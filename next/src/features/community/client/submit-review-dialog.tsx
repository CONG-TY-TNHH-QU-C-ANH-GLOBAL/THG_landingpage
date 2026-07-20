"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";
import { getUtmPayload } from "@/shared/ui/utm";

import type { CommunityCategory } from "../models/category";
import { submitReview } from "./community-api";
import { rememberOwnerToken, reviewOwnerKey } from "./owner-store";
import { CommunitySubmitDialog } from "./community-submit-dialog";

const TITLE_MIN = 8;
const TITLE_MAX = 200;
const BODY_MIN = 20;
const BODY_MAX = 5000;
const NAME_MAX = 80;
const EMAIL_MAX = 254;
const ORDER_REF_MAX = 200;
const EVIDENCE_MAX = 2000;
const RATINGS = [5, 4, 3, 2, 1];

const EMPTY = {
  name: "",
  email: "",
  category: "",
  rating: "",
  title: "",
  body: "",
  orderRef: "",
  evidence: "",
};

export function SubmitReviewDialog({
  lang,
  copy,
  categories,
}: Readonly<{ lang: Locale; copy: MarketingCopy; categories: readonly CommunityCategory[] }>) {
  const t = tFrom(copy);
  const [form, setForm] = useState(EMPTY);
  const [pending, setPending] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  function validate(): string | null {
    const { name, email, title, body } = form;
    if (!name.trim() || !email.trim() || !title.trim() || !body.trim()) {
      return t("community.form_err_required");
    }
    if (title.trim().length < TITLE_MIN || body.trim().length < BODY_MIN) {
      return t("community.form_err_short");
    }
    return null;
  }

  async function submit(turnstileToken: string): Promise<boolean> {
    setPending(true);
    try {
      const utm = getUtmPayload();
      const result = await submitReview({
        title: form.title.trim(),
        body: form.body.trim(),
        category_slug: form.category || undefined,
        rating: form.rating ? Number(form.rating) : undefined,
        reviewer_name: form.name.trim(),
        reviewer_email: form.email.trim(),
        private_order_reference: form.orderRef.trim() || undefined,
        private_evidence_note: form.evidence.trim() || undefined,
        locale: lang,
        utm: Object.keys(utm).length > 0 ? utm : undefined,
        turnstile_token: turnstileToken,
      });
      // Namespaced so a review and a question sharing a slug cannot overwrite each
      // other's token in the single owner map.
      if (result.slug && result.ownerToken) {
        rememberOwnerToken(reviewOwnerKey(result.slug), result.ownerToken);
        return true;
      }
      return false;
    } finally {
      setPending(false);
    }
  }

  return (
    <CommunitySubmitDialog
      copy={copy}
      trigger={
        <Button size="lg" className="gap-2">
          <BadgeCheck className="h-4 w-4" aria-hidden="true" />
          {t("reviews.share_button")}
        </Button>
      }
      title={t("reviews.form_title")}
      description={t("reviews.form_desc")}
      successTitle={t("reviews.form_success_title")}
      successDescription={t("reviews.form_success_desc")}
      withdrawHint={t("reviews.withdraw_hint")}
      submitLabel={t("reviews.form_submit")}
      turnstileTestId="review-turnstile"
      validate={validate}
      submit={submit}
      onReset={() => setForm(EMPTY)}
    >
      <div>
        <Label htmlFor="review-name">{t("community.form_name")} *</Label>
        <Input
          id="review-name"
          required
          maxLength={NAME_MAX}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="review-email">{t("community.form_email")} *</Label>
        <Input
          id="review-email"
          type="email"
          required
          maxLength={EMAIL_MAX}
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          disabled={pending}
          aria-describedby="review-email-hint"
        />
        <p id="review-email-hint" className="mt-1 text-[length:var(--step-label)] text-muted-foreground">
          {t("community.form_email_hint")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="review-category">{t("community.form_category")}</Label>
          <select
            id="review-category"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            disabled={pending}
            className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">{t("community.form_category_none")}</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
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
            className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">{t("reviews.form_rating_none")}</option>
            {RATINGS.map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)} ({n}/5)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="review-title">{t("reviews.form_review_title")} *</Label>
        <Input
          id="review-title"
          required
          minLength={TITLE_MIN}
          maxLength={TITLE_MAX}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder={t("reviews.form_review_title_ph")}
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="review-body">{t("reviews.form_review_body")} *</Label>
        <Textarea
          id="review-body"
          required
          minLength={BODY_MIN}
          maxLength={BODY_MAX}
          rows={5}
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder={t("reviews.form_review_body_ph")}
          disabled={pending}
        />
      </div>

      {/* Moderator-only fields. The CMS strips all three from every public DTO — they
          exist so THG can verify the experience, and they are never rendered anywhere. */}
      <fieldset className="space-y-3 rounded-lg border border-dashed border-border p-3">
        <legend className="px-1 text-[length:var(--step-label)] text-muted-foreground">
          🔒 {t("reviews.form_private_hint")}
        </legend>
        <div>
          <Label htmlFor="review-order">{t("reviews.form_order_ref")}</Label>
          <Input
            id="review-order"
            maxLength={ORDER_REF_MAX}
            value={form.orderRef}
            onChange={(e) => set("orderRef", e.target.value)}
            disabled={pending}
          />
        </div>
        <div>
          <Label htmlFor="review-evidence">{t("reviews.form_evidence")}</Label>
          <Textarea
            id="review-evidence"
            rows={2}
            maxLength={EVIDENCE_MAX}
            value={form.evidence}
            onChange={(e) => set("evidence", e.target.value)}
            placeholder={t("reviews.form_evidence_ph")}
            disabled={pending}
          />
        </div>
      </fieldset>
    </CommunitySubmitDialog>
  );
}
