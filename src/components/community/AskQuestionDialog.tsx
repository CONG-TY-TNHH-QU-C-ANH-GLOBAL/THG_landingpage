// Community "Ask a question" modal — clones the LeadFormDialog pattern:
// Turnstile-gated POST to CMS /api/v1/community/questions. Submissions always
// land as pending moderation; the success state says so explicitly.

import { type FormEvent, type ReactNode } from "react";

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
import { rememberOwnerToken } from "@/lib/communityOwner";
import { useCommunityCategories } from "@/hooks/useCmsContent";
import { useFormFields } from "@/hooks/useFormFields";
import { getUtmPayload } from "@/lib/utm";

// Mirror of the server-side zod bounds (community questions endpoint).
const TITLE_MIN = 8;
const BODY_MIN = 20;

interface Props {
  trigger: ReactNode;
}

export function AskQuestionDialog({ trigger }: Readonly<Props>) {
  const { language, t } = useI18n();
  const categories = useCommunityCategories();
  const { fields: form, set, reset } = useFormFields({ name: "", email: "", category: "", title: "", body: "" });
  const { captcha, pending, submit, dialogProps } = useCommunitySubmitDialog(t, reset);

  const onSubmit = (e: FormEvent<HTMLFormElement>) =>
    submit(e, form, { titleMin: TITLE_MIN, bodyMin: BODY_MIN }, async (token) => {
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
    });

  return (
    <CommunitySubmitDialog {...dialogProps} trigger={trigger} copyPrefix="community" onSubmit={onSubmit}>
      <CommunityNameEmailFields
        idPrefix="ask"
        name={form.name}
        email={form.email}
        disabled={pending}
        onName={(v) => set("name", v)}
        onEmail={(v) => set("email", v)}
      />
      <CommunityCategorySelect
        id="ask-category"
        value={form.category}
        disabled={pending}
        onChange={(v) => set("category", v)}
        categories={categories.data?.categories ?? []}
      />
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
      <TextareaField
        id="ask-body"
        label={`${t("community.form_question_body")} *`}
        required
        minLength={BODY_MIN}
        maxLength={5000}
        value={form.body}
        onChange={(v) => set("body", v)}
        placeholder={t("community.form_question_body_ph")}
        rows={5}
        disabled={pending}
      />

      <TurnstileField captcha={captcha} testId="ask-turnstile" />

      <CommunitySubmitButton pending={pending} label={t("community.form_submit")} />
    </CommunitySubmitDialog>
  );
}
