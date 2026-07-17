// Parity source: src/lib/utm.ts usage in src/App.tsx (UtmCapture island).
"use client";

import { useEffect } from "react";

import { captureUtmOnce } from "@/shared/ui/utm";

/**
 * Snapshot UTM / click-id params + referrer into sessionStorage on first mount.
 * Lead forms read the snapshot on submit so marketing keeps attribution even
 * when the user wanders across pages before converting.
 */
export function UtmCapture() {
  useEffect(() => { captureUtmOnce(); }, []);
  return null;
}
