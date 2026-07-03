// Shared building blocks for the community submit dialogs (Ask a question /
// Submit a review). Extracted so the two dialogs don't duplicate the field,
// captcha and success-panel markup (keeps Sonar duplication down and the two
// flows visually consistent).

import { type ComponentProps } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
