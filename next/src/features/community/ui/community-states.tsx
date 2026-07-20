import { AlertTriangle, type LucideIcon } from "lucide-react";

// Explicit, distinguishable list states. "Empty" and "unavailable" are deliberately
// different components: the Vite list rendered `!isLoading && length === 0`, so a CMS
// outage told visitors "No questions yet" — a confirmed-empty claim the app could not
// actually make. There is no loading state here at all; the list is server-rendered.

export function CommunityEmptyState({
  icon: Icon,
  title,
  description,
}: Readonly<{ icon: LucideIcon; title: string; description?: string }>) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
      </span>
      <p className="font-semibold text-navy">{title}</p>
      {description && (
        <p className="mt-2 max-w-prose text-[length:var(--step-small)] text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

/** Rendered with NO live region, deliberately.
 *
 *  Every call site is a Server Component, so this state is part of the initial SSR HTML —
 *  it is page content the user arrives at, not an update that happens while they are
 *  reading. A live region only announces content that changes after the region exists, so
 *  `role="status"` here announces nothing extra and misdescribes static content as a
 *  running status. `<output>` is wrong for a different reason: it represents the result of
 *  a calculation or form interaction, and a CMS outage is neither. `role="alert"` is
 *  assertive and reserved for errors that interrupt in response to a user action.
 *
 *  The contrast in this codebase is conversion-section.tsx, which announces a genuine
 *  client-side submission result — that one is correctly `role="status" aria-live="polite"`.
 *
 *  Screen readers reach this text through normal reading order; the heading-free paragraph
 *  plus the decorative-only icon is the accessible form for static page content. */
export function CommunityUnavailableState({ message }: Readonly<{ message: string }>) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <AlertTriangle className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </span>
      <p className="max-w-prose text-muted-foreground">{message}</p>
    </div>
  );
}
