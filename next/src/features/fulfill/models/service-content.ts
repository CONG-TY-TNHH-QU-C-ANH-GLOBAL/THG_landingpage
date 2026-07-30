// Landing-owned overlay model (WEB-002): CMS service_blocks supply localized business content for
// code-owned Fulfill roles, merged onto the feature-local FulfillCopy fallback. The landing owns
// the stable role keys, their order, and page composition; CMS supplies only the localized text,
// resolved by payload.key — CMS can never reorder a registry or choose components.
import type { FulfillCopy, FulfillStepCopy } from "../localized-content";

/** Landing route slug used as the CMS `page_slug` filter. */
export const FULFILL_PAGE_SLUG = "thg-fulfill";

/** CMS `kind`s that carry Fulfill business text. Code-owned; CMS supplies values keyed to these. */
export const JOURNEY_BLOCK_KIND = "journey_step";
export const CAPABILITY_BLOCK_KIND = "capability";
export const SECTION_BLOCK_KIND = "section_copy";

// Stable, ordered journey registry. Index alignment with FulfillCopy.steps (design-input first) is
// a code invariant pinned by a test — CMS content is resolved ONTO these positions by payload.key.
export const FULFILL_JOURNEY_KEYS = ["design-input", "processing", "quality-assurance", "dispatch-ready"] as const;
export type FulfillJourneyKey = (typeof FULFILL_JOURNEY_KEYS)[number];

// Capability registry keys — derived from the current FulfillCopy.capabilities shape, not invented.
export const FULFILL_CAPABILITY_KEYS = ["network", "qc", "pack", "hub", "intake", "print", "advisory"] as const;
export type FulfillCapabilityKey = (typeof FULFILL_CAPABILITY_KEYS)[number];

// Scalar section-copy roles (single localized value each).
export const FULFILL_SECTION_KEYS = ["consult-heading", "consult-intro", "hub-caption"] as const;
export type FulfillSectionKey = (typeof FULFILL_SECTION_KEYS)[number];

/** Localized text a CMS block carries for a known role (title + body; either may be ""). */
export interface ResolvedBlockText {
  title: string;
  description: string;
}

/** CMS-supplied Fulfill business content, indexed by code-owned role key. A key is PRESENT only
 *  when exactly one valid, published block supplied it; absence means "use the feature fallback".
 *  The maps ARE the provenance — in-map ⇒ CMS source, absent ⇒ fallback. */
export interface FulfillServiceContent {
  journey: ReadonlyMap<FulfillJourneyKey, ResolvedBlockText>;
  capabilities: ReadonlyMap<FulfillCapabilityKey, ResolvedBlockText>;
  sections: ReadonlyMap<FulfillSectionKey, ResolvedBlockText>;
}

/** The deterministic empty model — CMS unavailable or no blocks ⇒ every role falls back. */
export function emptyServiceContent(): FulfillServiceContent {
  return { journey: new Map(), capabilities: new Map(), sections: new Map() };
}

/** Prefer a CMS value only when non-empty, else keep the localized fallback (never blank a field). */
const pick = (cms: string, fallback: string): string => cms || fallback;

/** Scalar section copy: the body role lives in `description`, falling back to `title`. */
const sectionText = (t: ResolvedBlockText | undefined): string => (t ? t.description || t.title : "");

function mergeStep(base: FulfillStepCopy, cms: ResolvedBlockText | undefined): FulfillStepCopy {
  if (!cms) return base;
  return { ...base, title: pick(cms.title, base.title), description: pick(cms.description, base.description) };
}

/** Overlay published CMS block content onto the feature-local FulfillCopy fallback. Order and
 *  identity stay code-owned (registries are iterated, never the CMS order); a missing/again-fallback
 *  key keeps the localized default, so an empty model yields value-identical copy (no visual change
 *  until content is seeded). Only journey/capability/consult/hub text is overlaid — H1, state labels,
 *  a11y copy, catalog and FAQ remain untouched. */
export function applyServiceBlocks(copy: FulfillCopy, content: FulfillServiceContent): FulfillCopy {
  const j = content.journey;
  const steps: FulfillCopy["steps"] = [
    mergeStep(copy.steps[0], j.get("design-input")),
    mergeStep(copy.steps[1], j.get("processing")),
    mergeStep(copy.steps[2], j.get("quality-assurance")),
    mergeStep(copy.steps[3], j.get("dispatch-ready")),
  ];

  const capabilities = { ...copy.capabilities };
  for (const key of FULFILL_CAPABILITY_KEYS) {
    const cms = content.capabilities.get(key);
    if (cms) {
      capabilities[key] = {
        title: pick(cms.title, copy.capabilities[key].title),
        description: pick(cms.description, copy.capabilities[key].description),
      };
    }
  }

  const consultHeading = content.sections.get("consult-heading");
  return {
    ...copy,
    steps,
    capabilities,
    consultTitle: pick(consultHeading?.title ?? "", copy.consultTitle),
    consultIntro: pick(sectionText(content.sections.get("consult-intro")), copy.consultIntro),
    hubCaption: pick(sectionText(content.sections.get("hub-caption")), copy.hubCaption),
  };
}
