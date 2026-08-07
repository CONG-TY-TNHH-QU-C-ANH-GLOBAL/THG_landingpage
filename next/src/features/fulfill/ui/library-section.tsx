// S6b · PROOF, continued — the learning library.
//
// Optional evidence. No seller is ever required to watch anything to understand a recommendation, so
// this movement sits inside the proof act and carries no obligation: every film is titled, typed and
// countable without a single player being mounted.
//
// HONESTY NOTE on the taxonomy: the four types describe what these recordings actually are.
// Deliberately absent is "case study" / "success story" — no current film is verified as a customer
// story, and labelling one as such would invent a claim.
import type { Locale } from "@/shared/i18n";
import LearningLibrary, { type LibraryResource } from "../client/learning-library.client";
import { Heading, Movement } from "./section";
import { MOVEMENT_INDEX, type MovementCopy } from "./movement-copy";

type ResourceType = "intro" | "overview" | "walkthrough" | "clip";

/** Video ids and titles ported verbatim from the published page — content, not presentation. */
const RESOURCES: readonly { id: string; videoId: string; title: string; type: ResourceType }[] = [
  { id: "intro", videoId: "2VEEFotO42I", title: "THG Fulfill Introduction", type: "intro" },
  { id: "overview-1", videoId: "UwaZw5Eh-Yg", title: "THG Fulfill Overview 1", type: "overview" },
  { id: "overview-2", videoId: "ZA37yjN-_x8", title: "THG Fulfill Overview 2", type: "overview" },
  { id: "overview-3", videoId: "6GkUcZhun90", title: "THG Fulfill Overview 3", type: "overview" },
  { id: "walkthrough", videoId: "AzlW2irPANQ", title: "HUB System Seller Portal", type: "walkthrough" },
  { id: "clip-1", videoId: "AveVks7bdMM", title: "THG Fulfill Short 1", type: "clip" },
  { id: "clip-2", videoId: "UrnZpvRVb0U", title: "THG Fulfill Short 2", type: "clip" },
] as const;

const TYPE_LABELS: Readonly<Record<Locale, Record<ResourceType, string>>> = {
  vi: { intro: "Giới thiệu", overview: "Tổng quan", walkthrough: "Hướng dẫn hệ thống", clip: "Clip" },
  en: { intro: "Introduction", overview: "Overview", walkthrough: "System walkthrough", clip: "Clip" },
  zh: { intro: "介绍", overview: "概览", walkthrough: "系统操作指南", clip: "短片" },
};

interface Props {
  lang: Locale;
  movement: MovementCopy;
}

export default function LibrarySection({ lang, movement }: Readonly<Props>) {
  const labels = TYPE_LABELS[lang];
  const resources: LibraryResource[] = RESOURCES.map((r) => ({
    id: r.id,
    videoId: r.videoId,
    title: r.title,
    typeLabel: labels[r.type],
    poster: `/assets/fulfill/video/${r.videoId}.jpg`,
  }));

  return (
    <Movement id="library" aliases={["videos"]}>
      <Heading
        index={MOVEMENT_INDEX.proof}
        eyebrow={movement.proof}
        title={movement.libraryTitle}
        as="h3"
        aside={
          // A count, rendered beside the things it counts. Never a standalone statistic.
          <p className="type-label text-muted-foreground m-0">
            {resources.length} · {labels.intro} · {labels.overview} · {labels.walkthrough} ·{" "}
            {labels.clip}
          </p>
        }
      />

      <LearningLibrary
        resources={resources}
        groupLabel={movement.libraryGroup}
        playLabel={movement.libraryPlay}
      />
    </Movement>
  );
}
