// Pricing context — backed by the CMS REST API.
//
// Exposes a `cmsOverlay` keyed by pricing-table slug. Pages consume this via
// useLarkPricingContext (legacy name kept to avoid churn across all pricing
// components). Lark Sheets integration was removed 2026-05-11.

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useCmsPricingOverlay } from "@/hooks/useCmsContent";

interface PricingContextType {
  /**
   * Slug → parsed CMS pricing payload. Shape varies: most slugs are
   * row-arrays (weight_grid), but a few are nested objects (e.g.
   * `expressVnUs` = `{ hcm: { saver, expedited }, hn: {...} }`).
   */
  cmsOverlay: Record<string, unknown>;
  loading: boolean;
  lastUpdated: string | null;
  isLive: boolean;
  refetch: () => void;
}

const PricingContext = createContext<PricingContextType>({
  cmsOverlay: {},
  loading: false,
  lastUpdated: null,
  isLive: false,
  refetch: () => {},
});

export function LarkPricingProvider({ children }: { children: ReactNode }) {
  const { overlay, isLoading, isLive, lastUpdated } = useCmsPricingOverlay();
  const qc = useQueryClient();
  const refetch = useCallback(() => {
    // Invalidate the list + every individual pricing-table query so a fresh
    // fetch is triggered. Important when CMS slugs are added/removed (e.g. the
    // bulk-express split) — without this, the page sticks to the 5-minute
    // stale list and never sees new slugs.
    qc.invalidateQueries({ queryKey: ["cms", "pricing"] });
  }, [qc]);
  return (
    <PricingContext.Provider
      value={{
        cmsOverlay: overlay,
        loading: isLoading,
        lastUpdated: lastUpdated ? new Date(lastUpdated).toISOString() : null,
        isLive,
        refetch,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
}

export function useLarkPricingContext() {
  return useContext(PricingContext);
}

export function SyncBadge() {
  const { isLive, loading, lastUpdated } = useLarkPricingContext();

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
        Đang tải bảng giá...
      </span>
    );
  }

  if (isLive && lastUpdated) {
    const time = new Date(lastUpdated).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        Đồng bộ từ CMS · {time}
      </span>
    );
  }

  return null;
}
