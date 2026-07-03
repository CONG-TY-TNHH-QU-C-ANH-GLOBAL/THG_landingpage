// Framed lazy YouTube embed shared by the service pages: rounded card with
// the white border + shadow treatment every video on Express/Fulfill/
// Warehouse uses. Pages own grid wrappers, video ids, and titles.
// YouTubeEmbed handles lazy-loading and its own aspect-ratio box.

import YouTubeEmbed from "@/components/YouTubeEmbed";
import { cn } from "@/lib/utils";

export function ServiceVideoCard({
  videoId,
  title,
  aspectRatio = "16/9",
  className,
}: Readonly<{
  videoId: string;
  title?: string;
  /** CSS aspect-ratio of the embed, e.g. "16/9" or "9/16". */
  aspectRatio?: string;
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-black",
        className,
      )}
    >
      <YouTubeEmbed videoId={videoId} title={title} aspectRatio={aspectRatio} />
    </div>
  );
}
