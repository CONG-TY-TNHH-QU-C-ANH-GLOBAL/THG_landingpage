import type { CmsServiceBlock, CmsServiceBlocksResponse } from "../schemas/service-blocks";
import {
  JOURNEY_BLOCK_KIND,
  CAPABILITY_BLOCK_KIND,
  SECTION_BLOCK_KIND,
  FULFILL_JOURNEY_KEYS,
  FULFILL_CAPABILITY_KEYS,
  FULFILL_SECTION_KEYS,
  emptyServiceContent,
  type FulfillServiceContent,
  type ResolvedBlockText,
} from "../models/service-content";

// Normalize CMS service_blocks into the landing overlay model, keyed by the code-owned role
// registries. Identity is `payload.key` ONLY — never the row id, array position, CMS sort order,
// or display text. Unknown keys are ignored (they belong to other roles/pages); a duplicate known
// key is poisoned (no arbitrary winner) so the role falls back; a malformed block (no usable text)
// is dropped so the role falls back. Every drop emits a redaction-safe diagnostic.

/** Reason codes for a dropped block — safe to log (carry no content). */
export type ServiceBlockAnomaly = "missing-key" | "duplicate-key" | "malformed";
export type ServiceBlockAnomalyLogger = (
  kind: string,
  reason: ServiceBlockAnomaly,
  keyOrId: string | number,
) => void;

/** The immutable, code-owned role key from `payload.key` (canonical kebab-case), or null. */
function canonicalKey(b: CmsServiceBlock): string | null {
  const k = b.payload["key"];
  return typeof k === "string" && k.trim() ? k.trim() : null;
}

/** A block is usable for a text role only if it carries at least one non-blank field; a block with
 *  neither title nor description is malformed and must never be partially rendered. */
function usableText(b: CmsServiceBlock): ResolvedBlockText | null {
  const title = (b.title ?? "").trim();
  const description = (b.description ?? "").trim();
  if (!title && !description) return null;
  return { title, description };
}

function indexByKey<K extends string>(
  blocks: readonly CmsServiceBlock[],
  kind: string,
  knownKeys: readonly K[],
  onAnomaly?: ServiceBlockAnomalyLogger,
): Map<K, ResolvedBlockText> {
  const known = new Set<string>(knownKeys);
  const out = new Map<K, ResolvedBlockText>();
  const seen = new Set<string>();
  const poisoned = new Set<string>();
  for (const b of blocks) {
    if (b.kind !== kind) continue;
    const key = canonicalKey(b);
    if (!key) {
      onAnomaly?.(kind, "missing-key", b.id);
      continue;
    }
    if (!known.has(key)) continue; // a role this page/kind does not own — ignore silently
    if (seen.has(key)) {
      poisoned.add(key);
      onAnomaly?.(kind, "duplicate-key", key);
      continue;
    }
    seen.add(key);
    const text = usableText(b);
    if (!text) {
      onAnomaly?.(kind, "malformed", key);
      continue;
    }
    out.set(key as K, text);
  }
  for (const key of poisoned) out.delete(key as K);
  return out;
}

/** Resolve a validated /service-blocks response into the Fulfill overlay model. Pure; the optional
 *  logger lets the server loader surface anomalies while unit tests assert them via a spy. */
export function fulfillServiceContentFromDto(
  dto: CmsServiceBlocksResponse,
  onAnomaly?: ServiceBlockAnomalyLogger,
): FulfillServiceContent {
  if (dto.blocks.length === 0) return emptyServiceContent();
  return {
    journey: indexByKey(dto.blocks, JOURNEY_BLOCK_KIND, FULFILL_JOURNEY_KEYS, onAnomaly),
    capabilities: indexByKey(dto.blocks, CAPABILITY_BLOCK_KIND, FULFILL_CAPABILITY_KEYS, onAnomaly),
    sections: indexByKey(dto.blocks, SECTION_BLOCK_KIND, FULFILL_SECTION_KEYS, onAnomaly),
  };
}
