import type { MarketingCopy } from "@/shared/i18n/marketing";
import { tFrom } from "@/shared/i18n/marketing";

import type { ShippingPageResult } from "../models/shipping";
import {
  DocumentEmptyState,
  DocumentHeader,
  DocumentShell,
  DocumentUnavailableState,
  SectionNav,
} from "./page-chrome";
import { RouteSection } from "./route-section";

// Composed /{lang}/shipping-policy body. Server Component.

export function ShippingDocument({
  result,
  copy,
}: Readonly<{ result: ShippingPageResult; copy: MarketingCopy }>) {
  const t = tFrom(copy);

  return (
    <DocumentShell>
      <DocumentHeader title={t("spolicy.title")} subtitle={t("spolicy.subtitle")} />

      {result.status === "unavailable" && (
        <DocumentUnavailableState message={t("spolicy.unavailable")} />
      )}
      {result.status === "empty" && <DocumentEmptyState message={t("spolicy.empty")} />}

      {result.status === "ready" && (
        <>
          <SectionNav
            label={t("spolicy.nav_label")}
            items={result.routes.map((r) => ({ slug: r.slug, title: r.title }))}
          />
          {result.routes.map((route) => (
            <RouteSection
              key={route.slug}
              route={route}
              copy={{
                tableLabel: t("spolicy.table_label"),
                notesLabel: t("spolicy.notes"),
                noContent: t("spolicy.no_detail"),
              }}
            />
          ))}
        </>
      )}
    </DocumentShell>
  );
}
