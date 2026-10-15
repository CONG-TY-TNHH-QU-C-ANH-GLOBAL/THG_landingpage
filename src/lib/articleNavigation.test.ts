import { QueryClient } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cmsClient } from "./cmsClient";
import { blogPostQueryOptions, eventQueryOptions, prepareArticle } from "./articleNavigation";

vi.mock("@/pages/BlogDetailPage", () => ({ default: () => null }));
vi.mock("@/pages/events/EventDetailPage", () => ({ default: () => null }));
afterEach(() => vi.restoreAllMocks());

describe("article intent loading", () => {
  it.each(["blog", "event"] as const)("starts %s data immediately and reuses the same pending request on navigation", async kind => {
    const client = new QueryClient();
    const method = kind === "blog" ? "getBlogPost" : "getEvent";
    let complete!: (data: never) => void;
    const fetch = vi.spyOn(cmsClient, method).mockImplementation(() => new Promise<never>(resolve => { complete = resolve; }));
    const options = kind === "blog" ? blogPostQueryOptions : eventQueryOptions;
    prepareArticle(client, kind, "kho-my", "vi");
    expect(fetch).toHaveBeenCalledWith("kho-my", "vi");
    prepareArticle(client, kind, "kho-my", "vi");
    const data = { locale: "vi" } as never;
    complete(data);
    await vi.waitFor(() => expect(client.getQueryData(options("kho-my", "vi").queryKey)).toEqual(data));
    prepareArticle(client, kind, "kho-my", "vi");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(client.getQueryData(options("kho-my", "en").queryKey)).toBeUndefined();
    client.clear();
  });

  it("does not retry failed speculation or fetch an empty slug", async () => {
    const client = new QueryClient();
    const fetch = vi.spyOn(cmsClient, "getBlogPost").mockRejectedValue(new Error("offline"));
    prepareArticle(client, "blog", "", "vi");
    expect(fetch).not.toHaveBeenCalled();
    prepareArticle(client, "blog", "kho-my", "vi");
    await vi.waitFor(() => expect(client.getQueryState(blogPostQueryOptions("kho-my", "vi").queryKey)?.status).toBe("error"));
    expect(fetch).toHaveBeenCalledTimes(1);
    client.clear();
  });
});
