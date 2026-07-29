"use client";

// Service-specific lead detail fields (WEB-002). Keyed on the canonical service — currently only
// `fulfill` has a verified detail (product_type, grounded in the approved catalog categories);
// every other service renders nothing (common envelope only, no fabricated fields). Shared by the
// global dialog and the Fulfill inline form so the field group lives in exactly one place. The
// value is owned by the surface and passed to the submission foundation as `details`.
import { useId } from "react";

import { Label } from "@/shared/ui/label";
import type { Locale } from "@/shared/i18n";
import {
  FULFILL_PRODUCT_TYPES,
  fulfillProductTypeLabel,
  type FulfillProductType,
  type LeadServiceKey,
} from "@/shared/ui/lead-services";

interface Props {
  service: LeadServiceKey;
  lang: Locale;
  label: string;
  /** "" = no selection (details omitted). */
  productType: FulfillProductType | "";
  onProductTypeChange: (value: FulfillProductType | "") => void;
  disabled?: boolean;
}

export function LeadServiceDetailFields({
  service,
  lang,
  label,
  productType,
  onProductTypeChange,
  disabled,
}: Readonly<Props>) {
  const id = useId();
  if (service !== "fulfill") return null;
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={productType}
        disabled={disabled}
        onChange={(e) => onProductTypeChange(e.target.value as FulfillProductType | "")}
        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">—</option>
        {FULFILL_PRODUCT_TYPES.map((t) => (
          <option key={t} value={t}>
            {fulfillProductTypeLabel(lang, t)}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Build a single service's validated details object from the surface's local state, or null. */
export function buildServiceDetails(
  service: LeadServiceKey,
  productType: FulfillProductType | "",
): Record<string, unknown> | null {
  if (service === "fulfill" && productType) return { product_type: productType };
  return null;
}

/** Build the multi-intent `service_details` map (keyed by service) from the primary service's
 *  captured detail state. Only the primary currently has a detail form; returns null when empty. */
export function buildDetailsByService(
  primary: LeadServiceKey | null,
  productType: FulfillProductType | "",
): Record<string, Record<string, unknown>> | null {
  if (!primary) return null;
  const details = buildServiceDetails(primary, productType);
  return details ? { [primary]: details } : null;
}
