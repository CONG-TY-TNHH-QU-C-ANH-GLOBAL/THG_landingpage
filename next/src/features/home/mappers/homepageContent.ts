import type { CmsHomepageBlock, CmsHomepageResponse } from "../schemas/homepage";
import type {
  AboutVideoContent,
  HomeHeroContent,
  HomepageContent,
  ProcessContent,
} from "../models/homepageContent";

// Pure homepage-blocks mapper (FND-005 §6 rule 3). One locale's response in, one localized
// model out — the EN-video-wins rule is loader/component composition, never a locale merge
// here (§11/P9). Missing block or missing key → "" (dictionary fallback renders), parity
// with `useHomepageBlock(...)?.payload ?? {}` + `payload.x || tVi(...)`
// [FACT: src/hooks/useCmsContent.ts:46-52].

function payloadOf(blocks: readonly CmsHomepageBlock[], kind: CmsHomepageBlock["kind"]) {
  return blocks.find((b) => b.kind === kind)?.payload ?? {};
}

function heroFromPayload(p: Record<string, string>): HomeHeroContent {
  return {
    title: p.title ?? "",
    badge: p.eyebrow ?? "",
    subtitle: p.sub ?? "",
    primaryCta: p.cta1 ?? "",
    secondaryCta: p.cta2 ?? "",
  };
}

function aboutVideoFromPayload(p: Record<string, string>): AboutVideoContent {
  return {
    videoUrl: p.video_url ?? "",
    highlights: [p.highlight1 ?? "", p.highlight2 ?? "", p.highlight3 ?? "", p.highlight4 ?? ""],
  };
}

function processFromPayload(p: Record<string, string>): ProcessContent {
  return { stepTitles: [p.step1 ?? "", p.step2 ?? "", p.step3 ?? "", p.step4 ?? ""] };
}

export function homepageContentFromDto(dto: CmsHomepageResponse): HomepageContent {
  return {
    hero: heroFromPayload(payloadOf(dto.blocks, "hero")),
    aboutVideo: aboutVideoFromPayload(payloadOf(dto.blocks, "about_video")),
    process: processFromPayload(payloadOf(dto.blocks, "process")),
  };
}

/** The deterministic no-CMS fallback: every field "" → dictionary copy renders. */
export function emptyHomepageContent(): HomepageContent {
  return homepageContentFromDto({ locale: "vi", blocks: [] });
}
