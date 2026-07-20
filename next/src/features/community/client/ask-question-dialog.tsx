"use client";

import { useState } from "react";
import { MessageCircleQuestion } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";
import { getUtmPayload } from "@/shared/ui/utm";

import type { CommunityCategory } from "../models/category";
import { submitQuestion } from "./community-api";
import { rememberOwnerToken } from "./owner-store";
import { CommunitySubmitDialog } from "./community-submit-dialog";

// Mirrors of the server-side Zod bounds (CMS submitSchema). Client-side checks exist to
// give immediate feedback: the server returns only its first error message, with no field
// name, so it cannot drive per-field errors.
const TITLE_MIN = 8;
const TITLE_MAX = 200;
const BODY_MIN = 20;
const BODY_MAX = 5000;
const NAME_MAX = 80;
const EMAIL_MAX = 254;

const EMPTY = { name: "", email: "", category: "", title: "", body: "" };

export function AskQuestionDialog({
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
      const result = await submitQuestion({
        title: form.title.trim(),
        body: form.body.trim(),
        category_slug: form.category || undefined,
        author_name: form.name.trim(),
        author_email: form.email.trim(),
        locale: lang,
        utm: Object.keys(utm).length > 0 ? utm : undefined,
        turnstile_token: turnstileToken,
      });
      // The owner token is optional on the wire so the landing can run against a CMS
      // that lacks it — withdrawal is then simply never offered.
      if (result.slug && result.ownerToken) {
        rememberOwnerToken(result.slug, result.ownerToken);
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
          <MessageCircleQuestion className="h-4 w-4" aria-hidden="true" />
          {t("community.ask_button")}
        </Button>
      }
      title={t("community.form_title")}
      description={t("community.form_desc")}
      successTitle={t("community.form_success_title")}
      successDescription={t("community.form_success_desc")}
      withdrawHint={t("community.withdraw_hint")}
      submitLabel={t("community.form_submit")}
      turnstileTestId="ask-turnstile"
      validate={validate}
      submit={submit}
      onReset={() => setForm(EMPTY)}
    >
      <div>
        <Label htmlFor="ask-name">{t("community.form_name")} *</Label>
        <Input
          id="ask-name"
          required
          maxLength={NAME_MAX}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="ask-email">{t("community.form_email")} *</Label>
        <Input
          id="ask-email"
          type="email"
          required
          maxLength={EMAIL_MAX}
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          disabled={pending}
          aria-describedby="ask-email-hint"
        />
        <p id="ask-email-hint" className="mt-1 text-[length:var(--step-label)] text-muted-foreground">
          {t("community.form_email_hint")}
        </p>
      </div>

      <div>
        <Label htmlFor="ask-category">{t("community.form_category")}</Label>
        <select
          id="ask-category"
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
        <Label htmlFor="ask-title">{t("community.form_question_title")} *</Label>
        <Input
          id="ask-title"
          required
          minLength={TITLE_MIN}
          maxLength={TITLE_MAX}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder={t("community.form_question_title_ph")}
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="ask-body">{t("community.form_question_body")} *</Label>
        <Textarea
          id="ask-body"
          required
          minLength={BODY_MIN}
          maxLength={BODY_MAX}
          rows={5}
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder={t("community.form_question_body_ph")}
          disabled={pending}
        />
      </div>
    </CommunitySubmitDialog>
  );
}
