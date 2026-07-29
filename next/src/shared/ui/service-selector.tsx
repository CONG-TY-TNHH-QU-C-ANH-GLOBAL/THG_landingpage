"use client";

// Accessible service selector for the global lead dialog (WEB-002). A native <select> — keyboard
// and screen-reader support come for free, labels are localized from the existing nav dictionary,
// and the option values are the code-owned canonical service keys (never CMS slugs). Inline forms
// with a fixed identity do NOT render this.
import { useId } from "react";

import { Label } from "@/shared/ui/label";
import type { MarketingCopy } from "@/shared/i18n/marketing";
import {
  LEAD_SERVICE_KEYS,
  serviceLabel,
  type LeadServiceKey,
} from "@/shared/ui/lead-services";

interface Props {
  /** "" = not yet selected / "need guidance" (see placeholder vs noneLabel). */
  value: LeadServiceKey | "";
  onChange: (service: LeadServiceKey | "") => void;
  copy: MarketingCopy;
  label: string;
  /** Disabled placeholder option shown when value is "". Omit to hide it (preselected case). */
  placeholder?: string;
  /** SELECTABLE "no specific service / need guidance" option (value ""). Mutually exclusive intent
   *  with `placeholder`: use `noneLabel` when "" is a valid generic choice, `placeholder` when a
   *  service must be chosen before submit. */
  noneLabel?: string;
  disabled?: boolean;
}

export function ServiceSelector({
  value,
  onChange,
  copy,
  label,
  placeholder,
  noneLabel,
  disabled,
}: Readonly<Props>) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as LeadServiceKey | "")}
        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {placeholder !== undefined && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {noneLabel !== undefined && <option value="">{noneLabel}</option>}
        {LEAD_SERVICE_KEYS.map((service) => (
          <option key={service} value={service}>
            {serviceLabel(copy, service)}
          </option>
        ))}
      </select>
    </div>
  );
}
