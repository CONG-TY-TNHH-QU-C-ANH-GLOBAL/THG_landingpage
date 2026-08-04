// Video chapter (R3 content parity) — Server Component.
//
// Restores the two YouTube blocks the Vite page carries and the Next migration had dropped: the
// vertical Shorts pair and the three landscape overview films. Video ids and their titles are
// ported verbatim from src/pages/THGFulfillPage.tsx — no new videos, no invented captions.
//
// Server-rendered lazy iframes on the privacy-enhanced host (shared ServiceVideo), so restoring
// five embeds adds no client JavaScript and no hydration. Each box reserves its aspect ratio
// before the iframe resolves, so a slow YouTube response cannot shift layout on mobile.
import { ServiceVideo } from "@/shared/service";

 /** The pair the Vite page framed as Shorts — ids and titles verbatim from it.
 *
 *  KNOWN MISMATCH, deliberately left as-is: the oEmbed player reports these as 16:9 and 4:3,
 *  i.e. both are LANDSCAPE, so the 9/16 card letterboxes them exactly as it does on production
 *  today. Changing it was explicitly out of scope for this review; corrected together with the
 *  Vite page so the two do not diverge mid-migration. */
const SHORTS = [
  { id: "AveVks7bdMM", title: "THG Fulfill Short 1" },
  { id: "UrnZpvRVb0U", title: "THG Fulfill Short 2" },
] as const;

/** Overview films — ids and titles verbatim from the Vite page. These are LANDSCAPE recordings
 *  (verified against the YouTube oEmbed player dimensions), so they take ServiceVideo's default
 *  16/9 box; the Vite page framed them 9/16, which pillarboxed them inside a tall card. */
const OVERVIEWS = [
  { id: "UwaZw5Eh-Yg", title: "THG Fulfill Overview 1" },
  { id: "ZA37yjN-_x8", title: "THG Fulfill Overview 2" },
  { id: "6GkUcZhun90", title: "THG Fulfill Overview 3" },
] as const;

export default function VideoSection() {
  return (
    <section
      id="videos"
      className="py-20 border-t"
      style={{ background: "var(--fx-bg)", borderColor: "var(--fx-border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        {/* Shorts: two vertical clips, side by side on tablet up, stacked and centred on phones. */}
        <div className="flex flex-wrap justify-center gap-6">
          {SHORTS.map((v) => (
            <ServiceVideo
              key={v.id}
              videoId={v.id}
              title={v.title}
              aspectRatio="9 / 16"
              className="w-full max-w-[280px] md:max-w-[300px]"
            />
          ))}
        </div>

        {/* Overview films. */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {OVERVIEWS.map((v) => (
            <ServiceVideo key={v.id} videoId={v.id} title={v.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
