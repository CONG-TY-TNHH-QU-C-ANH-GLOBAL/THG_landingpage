import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight, PlayCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import { SeoHead } from "@/components/seo/SeoHead";
import { useCmsEvents } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";

const thumbnail = (url: string | null) => {
  const id = url?.match(/(?:youtu\.be\/|v=)([\w-]{11})/)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
};

export default function EventsPage() {
  const { language } = useI18n();
  const query = useCmsEvents(language);
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Event — THG Fulfill"
        description="Sự kiện, webinar và tài liệu từ THG Fulfill cùng các đối tác."
        path="/events"
        noindex={language !== "vi"}
      />
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <ScrollReveal>
          <header className="mx-auto max-w-3xl text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[.22em] text-primary">
              THG Fulfill
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-navy">Event</h1>
            <p className="mt-4 text-muted-foreground">
              Sự kiện, webinar, tài liệu và recording được THG Fulfill tổ chức cùng các đối tác.
            </p>
          </header>
        </ScrollReveal>
        {query.isLoading && (
          <p className="py-16 text-center text-muted-foreground">Đang tải sự kiện…</p>
        )}
        {query.isError && (
          <p className="py-16 text-center text-muted-foreground">
            Chưa thể tải danh sách Event. Vui lòng thử lại sau.
          </p>
        )}
        {!query.isLoading && !query.isError && query.data?.events.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">
            Chưa có Event được xuất bản cho ngôn ngữ này.
          </p>
        )}
        <section className="grid gap-7 md:grid-cols-2">
          {query.data?.events.map((event, index) => {
            const image = event.cover_url ?? thumbnail(event.video_url);
            return (
              <ScrollReveal key={event.id} delay={index * 80}>
                <Link
                  to={`/${language}/events/${event.slug}`}
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
                        THG
                      </div>
                    )}
                    {event.video_url && (
                      <span className="absolute inset-0 grid place-items-center">
                        <PlayCircle className="h-14 w-14 text-white drop-shadow-lg" />
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap gap-3 text-xs font-medium text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {event.event_date}
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
