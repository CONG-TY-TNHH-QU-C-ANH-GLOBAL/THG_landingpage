import { AlertTriangle, FileText } from "lucide-react";
import type { ReactNode } from "react";

// Shared chrome for the two WEB-007 documents. Server Components only — these pages carry
// no interaction, so nothing here is a client island.

/** Anchor-based in-page navigation.
 *
 *  The Vite pages used `useState` tabs, which meant only the active section existed in the
 *  DOM and none of it was in the server HTML. These are plain `#slug` links over content
 *  that is already fully rendered: deep-linkable, crawlable, and functional with JS off.
 *  Fragment selection is the "approved query/fragment state" WEB-007 §6 permits. */
export function SectionNav({
  items,
  label,
}: Readonly<{ items: readonly { slug: string; title: string; icon?: ReactNode }[]; label: string }>) {
  if (items.length < 2) return null; // one section needs no navigation
  return (
    <nav aria-label={label} className="mb-6 flex flex-wrap gap-2">
      {items.map((item) => (
        <a
          key={item.slug}
          href={`#${item.slug}`}
          className="flex items-center gap-1.5 rounded-lg border-[1.5px] border-[#d4b96a] bg-white px-4 py-2 text-[13px] font-medium text-navy transition-colors hover:bg-[#fdf6e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {item.icon}
          <span>{item.title}</span>
        </a>
      ))}
    </nav>
  );
}

export function DocumentHeader({
  title,
  subtitle,
}: Readonly<{ title: string; subtitle: string }>) {
  return (
    <>
      <h1 className="mb-1 text-xl font-semibold text-navy">{title}</h1>
      <p className="mb-6 text-[13px] text-muted-foreground">{subtitle}</p>
    </>
  );
}

/** Confirmed-empty: the CMS answered and has nothing published for this locale. */
export function DocumentEmptyState({ message }: Readonly<{ message: string }>) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
      </span>
      <p className="max-w-prose text-muted-foreground">{message}</p>
    </div>
  );
}

/** CMS unavailable — deliberately worded as "cannot load", never as "nothing published".
 *  Same reasoning as CommunityUnavailableState: no live region, this is initial SSR content
 *  the visitor arrives at rather than an update announced while they read. */
export function DocumentUnavailableState({ message }: Readonly<{ message: string }>) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <AlertTriangle className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </span>
      <p className="max-w-prose text-muted-foreground">{message}</p>
    </div>
  );
}

/** Page shell: the cream document canvas both routes share. */
export function DocumentShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <main className="mx-auto max-w-[900px] px-4 pt-28 pb-20 sm:px-6">{children}</main>
    </div>
  );
}
