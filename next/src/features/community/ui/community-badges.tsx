import { BadgeCheck, Star, Tag } from "lucide-react";

// Presentational badges driven purely by CMS boolean/numeric fields — the landing never
// derives verification, expertise or indexability of its own.

export function VerifiedBadge({ label }: Readonly<{ label: string }>) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-olive/20 bg-olive/10 px-2 py-0.5 text-[length:var(--step-label)] font-semibold uppercase tracking-[var(--tracking-wide)] text-olive">
      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

export function ExpertBadge({ label }: Readonly<{ label: string }>) {
  return (
    <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[length:var(--step-label)] font-semibold uppercase tracking-[var(--tracking-wide)] text-primary">
      {label}
    </span>
  );
}

export function CategoryChip({ name }: Readonly<{ name: string }>) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-secondary px-2 py-0.5 text-[length:var(--step-small)] text-muted-foreground">
      <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {/* Long CMS-managed category names truncate rather than widening the card. */}
      <span className="truncate">{name}</span>
    </span>
  );
}

/** Renders nothing for a null rating — a 0 would otherwise draw five empty stars. */
export function RatingStars({ rating }: Readonly<{ rating: number | null }>) {
  if (rating === null) return null;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating}/5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={
            i < rating
              ? "h-4 w-4 fill-gold text-gold"
              : "h-4 w-4 fill-none text-muted-foreground/40"
          }
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
