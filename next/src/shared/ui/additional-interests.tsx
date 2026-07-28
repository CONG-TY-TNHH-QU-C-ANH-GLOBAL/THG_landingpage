"use client";

// Lightweight secondary-interest capture (WEB-002 land-and-expand). An accessible checkbox group
// for adjacent services beyond the primary — a customer entering via Fulfill can flag Warehouse /
// Express / Dropship interest without a full form per service. Selected services become secondary
// serviceInterests with empty details (no fabricated requirements). Used by both the global dialog
// and the Fulfill inline form; each passes the services to offer + the selected set.
import { useId } from "react";

import { serviceLabel, type LeadServiceKey } from "@/shared/ui/lead-services";
import type { MarketingCopy } from "@/shared/i18n/marketing";

interface Props {
  legend: string;
  /** Services offered as secondary interests (typically all services except the primary). */
  services: readonly LeadServiceKey[];
  selected: readonly LeadServiceKey[];
  onToggle: (service: LeadServiceKey, checked: boolean) => void;
  copy: MarketingCopy;
  disabled?: boolean;
  /** Extra classes for the checkbox label text (e.g. light-on-dark surfaces). */
  labelClassName?: string;
}

export function AdditionalInterests({
  legend,
  services,
  selected,
  onToggle,
  copy,
  disabled,
  labelClassName,
}: Readonly<Props>) {
  const base = useId();
  if (services.length === 0) return null;
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="text-[11px] uppercase tracking-[0.05em] opacity-70 mb-2 font-medium">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {services.map((service) => {
          const id = `${base}-${service}`;
          return (
            <label key={service} htmlFor={id} className={`flex items-center gap-2 text-sm ${labelClassName ?? ""}`}>
              <input
                id={id}
                type="checkbox"
                checked={selected.includes(service)}
                disabled={disabled}
                onChange={(e) => onToggle(service, e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              {serviceLabel(copy, service)}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
