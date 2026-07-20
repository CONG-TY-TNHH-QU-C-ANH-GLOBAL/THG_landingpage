// Browser-local community state. Both stores are best-effort: every read and write is
// swallowed on failure (private mode, disabled storage, quota) because neither is an
// authority — losing them only costs an affordance, never correctness.
//
// Storage keys are the established production keys and must not change: an existing
// visitor's withdraw capability lives under them.

const OWNER_STORE = "thg_community_owner_v1";
const SAME_ISSUE_STORE = "thg_community_same_issue_v1";

/** Reviews share the owner map with questions, so review slugs are namespaced to stop
 *  a question and a review with the same slug from overwriting each other's token. */
export const reviewOwnerKey = (slug: string): string => `review:${slug}`;

function readOwnerMap(): Record<string, string> {
  try {
    const raw = globalThis.localStorage?.getItem(OWNER_STORE);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

/** Returns null when no token is held — the signal that the withdraw button stays hidden. */
export function getOwnerToken(key: string): string | null {
  const token = readOwnerMap()[key];
  return typeof token === "string" && token.length > 0 ? token : null;
}

export function rememberOwnerToken(key: string, token: string): void {
  try {
    globalThis.localStorage?.setItem(OWNER_STORE, JSON.stringify({ ...readOwnerMap(), [key]: token }));
  } catch {
    // Withdrawal just won't be offered on a later visit.
  }
}

export function forgetOwnerToken(key: string): void {
  try {
    const map = readOwnerMap();
    delete map[key];
    globalThis.localStorage?.setItem(OWNER_STORE, JSON.stringify(map));
  } catch {
    // Nothing to recover — the token is already unusable server-side after a withdraw.
  }
}

function readReacted(): string[] {
  try {
    const raw = globalThis.localStorage?.getItem(SAME_ISSUE_STORE);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

/** UX only. The server dedupes by hashed IP and is the real authority — this just stops
 *  the button re-offering itself on a revisit. */
export function hasReacted(slug: string): boolean {
  return readReacted().includes(slug);
}

export function rememberReacted(slug: string): void {
  try {
    const slugs = readReacted();
    if (slugs.includes(slug)) return;
    globalThis.localStorage?.setItem(SAME_ISSUE_STORE, JSON.stringify([...slugs, slug]));
  } catch {
    // The server still dedupes; at worst the button is offered again.
  }
}
