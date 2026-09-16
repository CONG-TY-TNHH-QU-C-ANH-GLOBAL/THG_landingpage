import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, ExternalLink, PlayCircle, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/seo/SeoHead";
import { useCmsEvent } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";

const thumbnail = (url: string | null) => {
  const id = url?.match(/(?:youtu\.be\/|v=)([\w-]{11})/)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : null;
};
export default function EventDetailPage() {
  const { slug = "" } = useParams();
  const { language } = useI18n();
  const query = useCmsEvent(slug, language);
  const event = query.data?.event;
  const photos = event?.photos ?? [];
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Arrow keys and Escape while the lightbox is open, matching the blog gallery.
  // Bound on every render but only listening while open, so nothing leaks.
  useEffect(() => {
    if (lightboxIdx === null || photos.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft")
        setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : photos.length - 1));
      if (e.key === "ArrowRight")
        setLightboxIdx((i) => (i !== null && i < photos.length - 1 ? i + 1 : 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, photos.length]);
  if (query.isLoading)
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-40 text-center text-muted-foreground">Đang tải Event…</div>
      </div>
    );
  if (!event)
    return (
      <div className="min-h-screen">
        <SeoHead
          title="Event not found — THG Fulfill"
          description=""
          path={`/events/${slug}`}
          noindex
        />
        <Navbar />
        <div className="pt-40 text-center">
          <Link className="text-primary" to={`/${language}/events`}>
            Quay lại Event
          </Link>
        </div>
      </div>
    );
  const image = event.cover_url ?? thumbnail(event.video_url);
  const shareImage = event.og_image_url ?? image ?? undefined;
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={event.seo_title ?? `${event.title} — THG Fulfill`}
        description={event.seo_description ?? event.summary ?? ""}
        path={`/events/${event.slug}`}
        noindex={language !== "vi"}
        ogImage={shareImage}
        ogImageAlt={event.title}
      />
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 pt-28 pb-20">
        <Link
          to={`/${language}/events`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Tất cả Event
        </Link>
        <header className="mt-8">
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {event.event_date}
            </span>
            {event.role && <span>{event.role}</span>}
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-navy md:text-5xl">
            {event.title}
          </h1>
          {event.summary && (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{event.summary}</p>
          )}
        </header>
        {image && (
          <div className="relative mt-8 overflow-hidden rounded-3xl bg-navy">
            <img src={image} alt={event.title} className="aspect-video w-full object-cover" />
            {event.video_url && (
              <a
                href={event.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 grid place-items-center"
              >
                <PlayCircle className="h-16 w-16 text-white drop-shadow-lg" />
                <span className="sr-only">Mở video</span>
              </a>
            )}
          </div>
        )}
        <article className="prose prose-slate mt-10 max-w-none prose-headings:text-navy prose-a:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.body_md ?? ""}</ReactMarkdown>
        </article>
        {photos.length > 0 && (
          <section className="mt-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hình ảnh sự kiện ({photos.length})
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {photos.map((photo, i) => (
                <button
                  key={photo.src}
                  onClick={() => setLightboxIdx(i)}
                  className="aspect-video overflow-hidden rounded-lg border border-border transition-opacity hover:opacity-90"
                >
                  <img
                    src={photo.src}
                    alt={photo.caption ?? `${event.title} — ảnh ${i + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          {event.video_url && (
            <a
              href={event.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              Xem recording <PlayCircle className="h-4 w-4" />
            </a>
          )}
          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-bold text-foreground"
            >
              Tài liệu / thông tin Event <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </main>

      {lightboxIdx !== null && photos[lightboxIdx] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxIdx(null)}
          role="dialog"
          aria-modal="true"
          aria-label={photos[lightboxIdx].caption ?? "Ảnh sự kiện"}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            aria-label="Đóng"
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <figure
            className="max-h-full w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightboxIdx].src}
              alt={photos[lightboxIdx].caption ?? event.title}
              className="max-h-[80vh] w-full rounded-xl object-contain"
            />
            {photos[lightboxIdx].caption && (
              <figcaption className="mt-3 text-center text-sm text-white/80">
                {photos[lightboxIdx].caption}
              </figcaption>
            )}
            {photos.length > 1 && (
              <p className="mt-2 text-center text-xs text-white/50">
                {lightboxIdx + 1} / {photos.length} — dùng phím ← → để xem tiếp
              </p>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}
