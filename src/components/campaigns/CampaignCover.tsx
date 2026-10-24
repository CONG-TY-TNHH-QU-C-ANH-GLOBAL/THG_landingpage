import { cn } from "@/lib/utils";

interface Props {
  src: string | null;
  alt: string;
  className?: string;
  eager?: boolean;
}

/** Campaign cover image, or a festive brand gradient when marketing has not
 *  uploaded one yet (cover_url is null) — never a broken image. */
export function CampaignCover({ src, alt, className, eager }: Readonly<Props>) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#ef4444_0%,transparent_45%),radial-gradient(circle_at_85%_80%,#b45309_0%,transparent_50%),linear-gradient(135deg,#7f1d1d_0%,#b91c1c_55%,#14532d_100%)]",
        className,
      )}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.35)_1px,transparent_1.5px)] [background-size:22px_22px] opacity-40" />
    </div>
  );
}
