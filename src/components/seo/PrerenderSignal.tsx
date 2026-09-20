// Publishes React Query's in-flight count on `window` so the prerender script
// knows when CMS-backed content has actually landed.
//
// The prerender used to treat "an <h1> exists" as ready. That holds for static
// pages but not for list pages: the <h1> is plain JSX and paints immediately
// while the list is still in flight, so the snapshot captured the loading state
// and shipped a /blog listing with zero article links in its HTML.

import { useIsFetching } from "@tanstack/react-query";
import { useEffect } from "react";

declare global {
  interface Window {
    __cmsFetching?: number;
  }
}

export function PrerenderSignal() {
  const fetching = useIsFetching();

  useEffect(() => {
    window.__cmsFetching = fetching;
  }, [fetching]);

  return null;
}
