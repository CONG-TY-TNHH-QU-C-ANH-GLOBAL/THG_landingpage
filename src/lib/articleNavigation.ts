import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { cmsClient, type Locale } from "./cmsClient";

export const loadBlogDetail = () => import("@/pages/BlogDetailPage");
export const loadEventDetail = () => import("@/pages/events/EventDetailPage");

const cache = { staleTime: 5 * 60_000, gcTime: 30 * 60_000, retry: false } as const;
export const blogPostQueryOptions = (slug: string, locale: Locale) => queryOptions({
  ...cache, queryKey: ["cms", "blog", "post", slug, locale],
  queryFn: () => cmsClient.getBlogPost(slug, locale),
});
export const eventQueryOptions = (slug: string, locale: Locale) => queryOptions({
  ...cache, queryKey: ["cms", "event", slug, locale],
  queryFn: () => cmsClient.getEvent(slug, locale),
});

/** Start code and public content together, only for the card the reader intends to open. */
export function prepareArticle(client: QueryClient, kind: "blog" | "event", slug: string, locale: Locale) {
  if (!slug) return;
  if (kind === "blog") {
    void loadBlogDetail().catch(() => undefined);
    void client.prefetchQuery(blogPostQueryOptions(slug, locale));
  } else {
    void loadEventDetail().catch(() => undefined);
    void client.prefetchQuery(eventQueryOptions(slug, locale));
  }
}
