import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { prepareArticle } from "@/lib/articleNavigation";
import { CalendarDays, ArrowRight, PlayCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import { SeoHead } from "@/components/seo/SeoHead";
import { useCmsEvents } from "@/hooks/useCmsContent";
import { formatEventDates } from "@/lib/eventDates";
import { useI18n } from "@/lib/i18n";
import { parseYouTubeId, youtubeThumb } from "@/lib/youtube";
import "@/lib/i18n/translations/blog";

export default function EventsPage() {
  const client = useQueryClient();
  const { language, t } = useI18n();
  const query = useCmsEvents(language);
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Event — TH Group Fulfill"
        description="Sự kiện, webinar và tài liệu từ TH Group Fulfill cùng các đối tác."
        path="/events"
        noindex={language !== "vi"}
      />
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <ScrollReveal>
          <header className="mx-auto max-w-3xl text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[.22em] text-primary">
              TH Group Fulfill
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-navy">Event</h1>
            <p className="mt-4 text-muted-foreground">
              Sự kiện, webinar, tài liệu và recording được TH Group Fulfill tổ chức cùng các đối tác.
            </p>
          </header>
        </ScrollReveal>
        {query.isLoading && (
          <p className="py-16 text-center text-muted-foreground">{t("event.loading")}</p>
        )}
        {query.isError && (
          <div className="py-16 text-center" role="alert">
            <p className="text-muted-foreground">{t("event.load_error")}</p>
            <button type="button" onClick={() => void query.refetch()} disabled={query.isFetching} className="text-primary font-semibold mt-4">
              {t("blog.retry")}
            </button>
          </div>
        )}
        {!query.isLoading && !query.isError && query.data?.events.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">
            {t("event.empty")}
          </p>
        )}
        <section className="grid gap-7 md:grid-cols-2">
          {query.data?.events.map((event) => {
            const videoId = parseYouTubeId(event.video_url);
            const image = event.cover_url ?? youtubeThumb(videoId);
            return (
              <ScrollReveal key={event.id}>
                <Link
                  to={`/${language}/events/${event.slug}`}
                  onPointerDown={() => prepareArticle(client, "event", event.slug, language)}
                  onMouseEnter={() => prepareArticle(client, "event", event.slug, language)}
                  onFocus={() => prepareArticle(client, "event", event.slug, language)}
                  className="group block h-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/8] bg-navy">
                    {image ? (
                      <img
                        src={image}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-4xl font-bold text-white/70">
                        TH Group
                      </div>
                    )}
                    {videoId ? (
                      <span className="absolute inset-0 grid place-items-center">
                        <PlayCircle className="h-14 w-14 text-white drop-shadow-lg" />
                      </span>
                    ) : null}
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap gap-3 text-xs font-medium text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatEventDates(event.event_date, event.end_date)}
                      </span>
                      {event.role && <span>{event.role}</span>}
                    </div>
                    <h2 className="text-xl font-bold text-navy group-hover:text-primary">
                      {event.title}
                    </h2>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {event.summary}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Xem Event{" "}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </section>
      </main>
    </div>
  );
}
