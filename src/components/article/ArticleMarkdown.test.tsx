import { fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, describe, expect, it } from "vitest";

import { ArticleMarkdown } from "./ArticleMarkdown";

const ID = "q7NiFssAaRE";

// YouTubeEmbed mounts its iframe once scrolled into view; jsdom has no
// IntersectionObserver, so report every element as visible straight away.
beforeAll(() => {
  class VisibleObserver {
    private readonly cb: IntersectionObserverCallback;
    constructor(cb: IntersectionObserverCallback) {
      this.cb = cb;
    }
    observe(el: Element) {
      const entry = { isIntersecting: true, target: el } as IntersectionObserverEntry;
      this.cb([entry], this as unknown as IntersectionObserver);
    }
    unobserve() {
      // Nothing to release: observe() reports visibility synchronously.
    }
    disconnect() {
      // Same as unobserve().
    }
  }
  Object.defineProperty(globalThis, "IntersectionObserver", {
    writable: true,
    value: VisibleObserver,
  });
});

function renderMd(markdown: string) {
  return render(
    <MemoryRouter>
      <ArticleMarkdown markdown={markdown} />
    </MemoryRouter>,
  ).container;
}

describe("ArticleMarkdown", () => {
  it("builds a collapsible outline from rendered headings, with unique local anchors", () => {
    const html = renderMd("## Kho **Mỹ**\n\n### Chi phí\n\n## Kho Mỹ\n\n## Kho Mỹ 2\n\n```md\n## Fake heading\n```\n\n### 中文");
    const nav = html.querySelector('nav[aria-label="Nội dung chính"]');
    expect(nav?.querySelector('details[open]')).not.toBeNull();
    const links = [...(nav?.querySelectorAll("a") ?? [])];
    expect(links.map(a => a.textContent)).toEqual(["Kho Mỹ", "Chi phí", "Kho Mỹ", "Kho Mỹ 2", "中文"]);
    expect(new Set(links.map(a => a.hash)).size).toBe(5);
    for (const link of links) {
      expect(html.querySelector(`[id="${decodeURIComponent(link.hash.slice(1))}"]`)).not.toBeNull();
      expect(link.getAttribute("target")).toBeNull();
    }
    expect(nav?.querySelector("ol ol")).not.toBeNull();
  });

  it("omits the outline for short articles and lets wide tables scroll inside the article", () => {
    const html = renderMd("## One section\n\n| Loại | Giá |\n| --- | ---: |\n| Kẹp cửa gió | 50.000đ |\n");
    expect(html.querySelector("nav")).toBeNull();
    expect(html.querySelector("th")?.textContent).toBe("Loại");
    expect(html.querySelector("td")?.textContent).toBe("Kẹp cửa gió");
    expect(html.querySelector('div[role="region"][tabindex="0"] > table')).not.toBeNull();
  });

  it("plays a YouTube link that stands alone in its paragraph", () => {
    const html = renderMd(`Mở đầu\n\nhttps://youtu.be/${ID}\n\nKết`);
    expect(html.querySelector("iframe")).toBeNull();
    fireEvent.click(html.querySelector('button[aria-label="Play Video"]')!);
    const iframe = html.querySelector("iframe");
    expect(iframe?.getAttribute("src")).toContain(`youtube.com/embed/${ID}`);
    expect(iframe?.getAttribute("src")).toContain("autoplay=1");
    expect(html.textContent).toContain("Mở đầu");
  });

  it("captions a labelled standalone video link with its label", () => {
    const html = renderMd(`[Recap sự kiện](https://www.youtube.com/watch?v=${ID})`);
    fireEvent.click(html.querySelector('button[aria-label="Play Recap sự kiện"]')!);
    expect(html.querySelector("iframe")).not.toBeNull();
    expect(html.querySelector("figcaption")?.textContent).toBe("Recap sự kiện");
  });

  it("keeps a YouTube link inside a sentence or a list as a link", () => {
    const html = renderMd(
      `Xem [video](https://youtu.be/${ID}) trước.\n\n- [Video recap](https://youtu.be/${ID})`,
    );
    expect(html.querySelector("iframe")).toBeNull();
    expect(html.querySelectorAll(`a[href="https://youtu.be/${ID}"]`)).toHaveLength(2);
  });

  it("opens external links in a new tab and keeps in-site links in the app", () => {
    const html = renderMd("[Slide](https://docs.google.com/x) · [THG Express](/vi/thg-express)");
    const external = html.querySelector('a[href="https://docs.google.com/x"]');
    expect(external?.getAttribute("target")).toBe("_blank");
    const internal = html.querySelector('a[href="/vi/thg-express"]');
    expect(internal?.getAttribute("target")).toBeNull();
  });
});
