import { render } from "@testing-library/react";
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
  it("plays a YouTube link that stands alone in its paragraph", () => {
    const html = renderMd(`Mở đầu\n\nhttps://youtu.be/${ID}\n\nKết`);
    const iframe = html.querySelector("iframe");
    expect(iframe?.getAttribute("src")).toContain(`youtube.com/embed/${ID}`);
    expect(html.textContent).toContain("Mở đầu");
  });

  it("captions a labelled standalone video link with its label", () => {
    const html = renderMd(`[Recap sự kiện](https://www.youtube.com/watch?v=${ID})`);
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
