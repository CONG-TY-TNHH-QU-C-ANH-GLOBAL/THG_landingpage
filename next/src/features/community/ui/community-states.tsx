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

/** `role="status"` so a screen reader announces the outage without stealing focus. */
export function CommunityUnavailableState({ message }: Readonly<{ message: string }>) {
  return (
    <div
      role="status"
      className="flex flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center"
    >
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <AlertTriangle className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </span>
      <p className="max-w-prose text-muted-foreground">{message}</p>
    </div>
  );
}
