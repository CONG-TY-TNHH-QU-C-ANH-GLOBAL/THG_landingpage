// Operator-editable homepage block content (FND-005). Field names mirror what today's
// components read from the block payloads; "" means "no CMS override" and the component
// falls back to its dictionary copy, exactly like the current `payload.x || tVi(...)`
// pattern [FACT: HeroSection.tsx:31-35, AboutVideoSection.tsx:36-46, ProcessSection.tsx:13-17].

export interface HomeHeroContent {
  /** May carry `**word**` gold-highlight markers — parsed by the hero component. */
  title: string;
  badge: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface AboutVideoContent {
  /** Raw operator-entered video URL/id for THIS locale; the EN value wins site-wide
   *  (composition happens in the WEB-001 loader, never by merging locales in a mapper). */
  videoUrl: string;
  /** Four highlight labels, "" where the dictionary copy should show. */
  highlights: readonly [string, string, string, string];
}

export interface ProcessContent {
  /** Four step titles, "" where the dictionary copy should show. */
  stepTitles: readonly [string, string, string, string];
}

export interface HomepageContent {
  hero: HomeHeroContent;
  aboutVideo: AboutVideoContent;
  process: ProcessContent;
}
