import { useEffect, useRef, useState } from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  aspectRatio?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  className?: string;
  clickToPlay?: boolean;
}

const YouTubeEmbed = ({
  videoId,
  title = "YouTube Video",
  aspectRatio = "16/9",
  autoplay = false,
  muted = false,
  controls = true,
  loop = false,
  className = "",
  clickToPlay = false,
}: YouTubeEmbedProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (clickToPlay) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [clickToPlay]);

  const params = new URLSearchParams();
  if (autoplay || (clickToPlay && isVisible)) params.set("autoplay", "1");
  if (muted || autoplay) params.set("mute", "1");
  if (!controls) params.set("controls", "0");
  if (loop) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }
  params.set("rel", "0");
  params.set("modestbranding", "1");

  const src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden rounded-2xl bg-secondary/40 ${className}`}
      style={{ aspectRatio }}
    >
      {isVisible ? (
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
        />
      ) : clickToPlay ? (
        <button type="button" aria-label={`Play ${title}`} onClick={() => setIsVisible(true)} className="absolute inset-0 grid w-full place-items-center text-white">
          <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          <span className="relative rounded-full bg-black/70 px-6 py-4 text-2xl" aria-hidden="true">▶</span>
        </button>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeEmbed;
