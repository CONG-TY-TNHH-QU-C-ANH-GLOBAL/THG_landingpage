// Owner tokens for community questions submitted from THIS browser. The CMS
// returns a one-time token in the submit response; we keep it (keyed by slug)
// so the submitter — and only they, from this browser — can later withdraw
// their own question. No account, no email-based deletion.

const KEY = "thg_community_owner_v1";
type Store = Record<string, string>;

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function write(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* storage blocked (private mode / quota) — withdrawal just won't be offered */
  }
}

export function rememberOwnerToken(slug: string, token: string): void {
  write({ ...read(), [slug]: token });
}

export function getOwnerToken(slug: string): string | null {
  return read()[slug] ?? null;
}

export function forgetOwnerToken(slug: string): void {
  const store = read();
  delete store[slug];
  write(store);
}
