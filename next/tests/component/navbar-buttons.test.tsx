// @vitest-environment happy-dom
// Every navbar control is a non-submit button and must say so explicitly.
//
// Without `type`, a <button> defaults to type="submit". None of these sit inside a form
// today, so the current behavior is correct by accident — the moment one is nested in a
// form (a newsletter field, a search box in the shell), the dropdown triggers and the
// mobile toggle would start submitting it. The attribute is the guarantee; this pins it.
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import Navbar from "@/shared/ui/site-shell/navbar";
import { MARKETING_COPY } from "@/shared/i18n/marketing-copy";
import type { MarketingCopy } from "@/shared/i18n/marketing";

// The nested LocaleSwitcher calls useRouter/usePathname; there is no app-router context in
// a unit render.
vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/vi",
}));

afterEach(cleanup);

const copy: MarketingCopy = Object.fromEntries(
  Object.entries(MARKETING_COPY).map(([key, entry]) => [key, entry.vi]),
);

describe("navbar controls", () => {
  it("gives every button an explicit non-submit type", () => {
    render(<Navbar lang="vi" copy={copy} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) {
      expect(button.getAttribute("type"), button.textContent ?? "<icon button>").toBe("button");
    }
  });

  it("keeps the mobile toggle interactive with its aria state intact", () => {
    render(<Navbar lang="vi" copy={copy} />);

    const toggle = screen.getByLabelText("Open menu");
    expect(toggle.getAttribute("type")).toBe("button");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(toggle);

    // The same control now reports the opened state — adding `type` did not disturb the
    // handler or the aria wiring.
    const opened = screen.getByLabelText("Close menu");
    expect(opened.getAttribute("aria-expanded")).toBe("true");
  });

  it("still renders the community destinations the migrated routes serve", () => {
    render(<Navbar lang="vi" copy={copy} />);

    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/vi/community");
    expect(hrefs).toContain("/vi/community/reviews");
  });
});
