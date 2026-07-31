import type { MarketingCopy } from "@/shared/i18n/marketing";
import { tFrom } from "@/shared/i18n/marketing";

import type { PolicyPageResult } from "../models/policy";
import {
  DocumentEmptyState,
  DocumentHeader,
  DocumentShell,
  DocumentUnavailableState,
  SectionNav,
} from "./page-chrome";
import { PolicyIcon, PolicySection } from "./policy-section";

// Composed /{lang}/policy body. Server Component: the route file stays thin and this owns
// the state fan-out (ready / empty / unavailable) so all three are visible in one place.

export function PolicyDocument({
  result,
  copy,
}: Readonly<{ result: PolicyPageResult; copy: MarketingCopy }>) {
  const t = tFrom(copy);

  return (
    <DocumentShell>
      <DocumentHeader title={t("policy.title")} subtitle={t("policy.subtitle")} />

      {result.status === "unavailable" && (
        <DocumentUnavailableState message={t("policy.unavailable")} />
      )}
      {result.status === "empty" && <DocumentEmptyState message={t("policy.empty")} />}

      {result.status === "ready" && (
        <>
          <SectionNav
            label={t("policy.nav_label")}
            items={result.policies.map((p) => ({
              slug: p.slug,
              title: p.title,
              icon: <PolicyIcon icon={p.icon} />,
            }))}
          />
          {result.policies.map((policy) => (
            <PolicySection
              key={policy.slug}
              policy={policy}
              copy={{ pagesLabel: t("policy.pages"), noContent: t("policy.no_content") }}
            />
          ))}
        </>
      )}
    </DocumentShell>
  );
}
