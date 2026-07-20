import type { ReactNode } from "react";

import type { MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";
import { CommunityTabs } from "./community-tabs";

// Shared page shell for all four community routes. Server Component: the header, tabs and
// filter bar are all static markup, so the entire above-the-fold experience is in the SSR
// payload. `action` is the slot the Ask/Share client island plugs into — the only
// interactive element in the header.

export function CommunityShell({
  lang,
  copy,
  active,
  eyebrow,
  title,
  subtitle,
  action,
  children,
}: Readonly<{
  lang: Locale;
  copy: MarketingCopy;
  active: "qa" | "reviews";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-20">
        <div className="container relative z-10 mx-auto max-w-4xl px-4">
          {/* Deliberately not SectionHeader: that primitive always renders an <h2>, and a
              page needs its title to be the <h1>. Token classes are copied from it so the
              two stay visually identical. */}
          <div className="text-center">
            {eyebrow && (
              <p className="mb-4 text-[length:var(--step-label)] font-bold uppercase tracking-[var(--tracking-wide)] text-accent">
                {eyebrow}
              </p>
            )}
            <h1 className="text-[length:var(--step-h2)] font-bold tracking-tight text-navy">{title}</h1>
            {subtitle && (
              <p className="mx-auto mt-3 max-w-[52ch] text-[length:var(--step-lead)] leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {action && <div className="mt-8 flex justify-center">{action}</div>}

          <div className="mt-10">
            <CommunityTabs lang={lang} copy={copy} active={active} />
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto max-w-4xl px-4">{children}</div>
      </section>
    </div>
  );
}

/** Detail pages reuse the container width and spacing but not the tabbed header. */
export function CommunityDetailShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-16">{children}</div>
    </div>
  );
}
