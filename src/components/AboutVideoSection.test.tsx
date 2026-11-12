import { cleanup, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Which video the home page shows is decided by AboutVideoSection alone: the CMS keeps the operator's edit
// on the Vietnamese about_video block, and EN has no block unless one is edited on purpose.
let blocks: Record<string, Record<string, string>> = {};
let settings: { about_video_url: string | null } | undefined;

vi.mock("@/hooks/useCmsContent", () => ({
  useHomepageBlock: (locale: string) => blocks[locale] ?? {},
  useCmsSiteSettings: () => ({ data: settings }),
}));
vi.mock("@/lib/i18n", () => ({ useI18n: () => ({ tVi: (key: string) => key, language: "en" }) }));
vi.mock("@/lib/i18n/translations/homepage", () => ({}));
vi.mock("@/components/ScrollReveal", () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

import AboutVideoSection from "./AboutVideoSection";

const FALLBACK = "AzlW2irPANQ";

function shownVideoId(): string | null {
  const { container } = render(<AboutVideoSection />);
  const src = container.querySelector("iframe")?.getAttribute("src") ?? "";
  return /\/embed\/([A-Za-z0-9_-]{11})/.exec(src)?.[1] ?? null;
}

beforeEach(() => {
  blocks = {};
  settings = undefined;
});
afterEach(cleanup);

describe("AboutVideoSection: which video is shown", () => {
  it("uses the Vietnamese block when there is no English block (the CMS case that was ignored)", () => {
    blocks = { vi: { video_url: "https://www.youtube.com/watch?v=3pYc7uehIJE" } };
    expect(shownVideoId()).toBe("3pYc7uehIJE");
  });

  it("an English block still wins over the Vietnamese one", () => {
    blocks = {
      en: { video_url: "https://youtu.be/q7NiFssAaRE" },
      vi: { video_url: "https://www.youtube.com/watch?v=3pYc7uehIJE" },
    };
    expect(shownVideoId()).toBe("q7NiFssAaRE");
  });

  it("falls back to the global setting, then to the built-in default", () => {
    settings = { about_video_url: "ftJGaS19lXw" };
    expect(shownVideoId()).toBe("ftJGaS19lXw");
    cleanup();
    settings = { about_video_url: null };
    expect(shownVideoId()).toBe(FALLBACK);
  });

  it("an unusable URL in the Vietnamese block does not break the page", () => {
    blocks = { vi: { video_url: "not a video link" } };
    expect(shownVideoId()).toBe(FALLBACK);
  });
});
