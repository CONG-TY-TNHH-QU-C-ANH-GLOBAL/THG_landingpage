// Framed YouTube embed for service pages — Server Component, zero client JS.
//
// Reuses the house pattern already proven on the homepage (features/home/ui/about-video-section):
// a fixed aspect-ratio box that reserves layout before the iframe resolves, plus a native
// `loading="lazy"` iframe on the privacy-enhanced youtube-nocookie host. That is stricter than the
// Vite original this restores (which used the tracking host) and costs no hydration, so bringing
// the videos back does not regress the RSC/streaming posture.
//
// The aspect ratio is a prop because the restored sections genuinely differ: Shorts are vertical
// (9/16) and the overview/guide videos are landscape (16/9). Reserving the right box per video is
// what keeps CLS at zero on mobile.

interface Props {
  /** YouTube video id. */
  videoId: string;
  /** Accessible name for the embed — required: an unlabelled iframe is unusable by screen reader
   *  and keyboard users, and every caller here has a real title. */
  title: string;
  /** CSS aspect-ratio, e.g. "16 / 9" (default) or "9 / 16" for Shorts. */
  aspectRatio?: string;
  className?: string;
}

export function ServiceVideo({
  videoId,
  title,
  aspectRatio = "16 / 9",
  className = "",
}: Readonly<Props>) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-black shadow-xl ${className}`}
      style={{ aspectRatio, borderColor: "var(--svc-border)" }}
    >
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
