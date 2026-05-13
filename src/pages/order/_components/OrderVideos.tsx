import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { useCmsServices } from "@/hooks/useCmsContent";

/** CMS-driven video grid on the navy band of /thg-order. Lazy-mounts the
 *  YouTube iframe on first click — keeps initial paint cheap and avoids
 *  third-party connection burn for users who don't watch. */
export function OrderVideos() {
  const { t, language } = useI18n();
  const { data: servicesData } = useCmsServices(language);
  const service = servicesData?.services.find((s) => s.id === "thg-order");

  // Map CMS video schema { youtube_id, caption_key, caption } → legacy
  // { id, capKey } shape that the renderer expects. caption_key takes
  // precedence so existing i18n keys keep working.
  const videos = (service?.videos ?? []).map((v) => ({
    id: v.youtube_id,
    capKey: v.caption_key ?? "",
  }));

  const [playingVideo, setPlayingVideo] = useState<Record<number, boolean>>({});

  return (
    <section className="py-24 bg-navy text-white">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[hsl(var(--gold))] uppercase tracking-[0.2em] mb-3">{t("op.vid_eye")}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t("op.vid_title")}</h2>
            <p className="text-white/50 mt-3 max-w-xl mx-auto">{t("op.vid_sub")}</p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {videos.map((v, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                <div className="aspect-video relative bg-navy">
                  {playingVideo[i] ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
                      className="absolute inset-0 w-full h-full"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      className="absolute inset-0 bg-navy/80 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group hover:bg-navy/60"
                      onClick={() => setPlayingVideo((p) => ({ ...p, [i]: true }))}
                    >
                      <img
                        loading="lazy"
                        src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`}
                        onError={(e) => {
                          e.currentTarget.src = `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
                        }}
                        alt="Video Thumbnail"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:opacity-80 transition-opacity duration-500"
                      />
                      <div className="relative z-10 w-16 h-16 rounded-full bg-red-600/90 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-red-600 transition-all shadow-[0_4px_12px_rgba(220,38,38,0.4)]">
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      </div>
                      <span className="relative z-10 text-white font-bold text-xs uppercase tracking-wider">{t("op.vid_tap")}</span>
                    </div>
                  )}
                </div>
                <p className="px-4 py-3 text-white/70 text-sm font-medium">{t(v.capKey)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="https://www.youtube.com/@thgfulfillment"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/30 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all hover:bg-red-600/30"
          >
            ▶️ {t("op.vid_more")} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
