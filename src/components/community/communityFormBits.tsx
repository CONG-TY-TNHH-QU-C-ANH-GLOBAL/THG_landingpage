// Shared building blocks for the community submit dialogs (Ask a question /
// Submit a review). Extracted so the two dialogs don't duplicate the field,
// captcha and success-panel markup (keeps Sonar duplication down and the two
// flows visually consistent).

import { type ComponentProps, type FormEvent, type ReactNode } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import type { useTurnstile } from "@/lib/useTurnstile";

// Label + input in one call — collapses the repeated `<div><Label/><Input/></div>`
// markup. All extra input attributes (type, required, minLength, placeholder,
// disabled…) pass through.
type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
} & Omit<ComponentProps<typeof Input>, "id" | "value" | "onChange">;

export function TextField({ id, label, value, onChange, hint, ...input }: Readonly<TextFieldProps>) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} {...input} />
      {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

/** Label + textarea in one call (textarea sibling of TextField). */
type TextareaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<ComponentProps<typeof Textarea>, "id" | "value" | "onChange">;

export function TextareaField({ id, label, value, onChange, ...textarea }: Readonly<TextareaFieldProps>) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} {...textarea} />
    </div>
  );
}

type CategoryRef = { slug: string; name: string };

/** Name + email two-column grid shared by both submit dialogs. */
export function CommunityNameEmailFields({
  idPrefix,
  name,
  email,
  disabled,
  onName,
  onEmail,
}: Readonly<{
  idPrefix: string;
  name: string;
  email: string;
  disabled?: boolean;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
}>) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-2 gap-3">
      <TextField
        id={`${idPrefix}-name`}
        label={`${t("community.form_name")} *`}
        required
        value={name}
        onChange={onName}
        disabled={disabled}
      />
      <TextField
        id={`${idPrefix}-email`}
        type="email"
        label={`${t("community.form_email")} *`}
        required
        value={email}
        onChange={onEmail}
        disabled={disabled}
        hint={t("community.form_email_hint")}
      />
    </div>
  );
}

/** Optional category dropdown (topic) shared by both submit dialogs. */
export function CommunityCategorySelect({
  id,
  value,
  disabled,
  onChange,
  categories,
}: Readonly<{
  id: string;
  value: string;
  disabled?: boolean;
  onChange: (v: string) => void;
  categories: CategoryRef[];
}>) {
  const { t } = useI18n();
  return (
    <div>
      <Label htmlFor={id}>{t("community.form_category")}</Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
      >
        <option value="">{t("community.form_category_none")}</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}

/** Submit button with the shared "Submitting…" spinner state. */
export function CommunitySubmitButton({ pending, label }: Readonly<{ pending: boolean; label: string }>) {
  const { t } = useI18n();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
          {t("community.form_submitting")}
        </>
      ) : (
        label
      )}
    </Button>
  );
}

/** Shared modal shell for both submit dialogs: trigger + dialog chrome, and the
 *  done→success / else→form switch. The form fields (children) stay per-dialog.
 *  Header + success copy are looked up from `copyPrefix` (`community` / `reviews`)
 *  — the two dialogs use parallel i18n keys (`<prefix>.form_title`, `.form_desc`,
 *  `.form_success_title`, `.form_success_desc`, `.withdraw_hint`); the close
 *  label is shared. */
export function CommunitySubmitDialog({
  trigger,
  open,
  onOpenChange,
  copyPrefix,
  done,
  onSuccessClose,
  onSubmit,
  children,
}: Readonly<{
  trigger: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  copyPrefix: "community" | "reviews";
  done: boolean;
  onSuccessClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}>) {
  const { t } = useI18n();
  const c = (key: string) => t(`${copyPrefix}.${key}`);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{c("form_title")}</DialogTitle>
          <DialogDescription>{c("form_desc")}</DialogDescription>
        </DialogHeader>
        {done ? (
          <SubmitSuccess
            title={c("form_success_title")}
            desc={c("form_success_desc")}
            hint={c("withdraw_hint")}
            closeLabel={t("community.form_close")}
            onClose={onSuccessClose}
          />
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            {children}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Cloudflare Turnstile widget, only rendered when the site key is configured. */
export function TurnstileField({
  captcha,
  testId,
}: Readonly<{ captcha: ReturnType<typeof useTurnstile>; testId: string }>) {
  if (!captcha.enabled) return null;
  return (
    <div className="flex justify-center" data-testid={testId}>
      <Turnstile
        ref={captcha.widgetRef}
        siteKey={captcha.siteKey}
        onSuccess={captcha.onSuccess}
        onError={captcha.onError}
        onExpire={captcha.onExpire}
        options={{ theme: "light", size: "normal" }}
      />
    </div>
  );
}

/** Post-submit "pending moderation" panel shared by both dialogs. */
export function SubmitSuccess({
  title,
  desc,
  hint,
  closeLabel,
  onClose,
}: Readonly<{ title: string; desc: string; hint: string; closeLabel: string; onClose: () => void }>) {
  return (
    <div className="py-6 text-center space-y-3">
      <div className="text-3xl">✅</div>
      <div className="font-semibold text-base">{title}</div>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <Button onClick={onClose} className="mt-2 w-full">
        {closeLabel}
      </Button>
    </div>
  );
}
