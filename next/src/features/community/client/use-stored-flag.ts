"use client";

import { useSyncExternalStore } from "react";

// Browser-local storage is an external store, so it is read through the external-store
// primitive rather than a mount effect. That gives a defined SERVER snapshot, which is
// what makes these affordances hydration-safe: the server always renders "off", and the
// client swaps in the real value without a render-time localStorage access.
//
// Subscribing to `storage` is a small bonus: withdrawing in one tab hides the button in
// the others. Same-tab writes do not raise the event, so callers that mutate storage
// themselves also track the change in their own state.

function subscribe(onChange: () => void): () => void {
  globalThis.addEventListener?.("storage", onChange);
  return () => globalThis.removeEventListener?.("storage", onChange);
}

/** `read` must return a primitive — a fresh object each call would re-render forever. */
export function useStoredFlag(read: () => boolean): boolean {
  return useSyncExternalStore(subscribe, read, () => false);
}
