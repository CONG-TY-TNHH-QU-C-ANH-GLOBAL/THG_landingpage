// @vitest-environment happy-dom
// Guard: the narrowed copy passed to the shell client islands must still resolve every string
// they render. If a needed key were dropped, tFrom() returns the raw key — so scanning the
// rendered DOM for a `nav.` / `floating.` token is a direct regression tripwire for the
// prefix-based narrowing (Navbar resolves many labels dynamically, the risky case).
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import Navbar from "@/shared/ui/site-shell/navbar";
import { FloatingContact } from "@/shared/ui/site-shell/floating-contact";
import { MARKETING_COPY } from "@/shared/i18n/marketing-copy";
import type { MarketingCopy } from "@/shared/i18n/marketing";
import { pickCopy, NAVBAR_COPY, FLOATING_CONTACT_COPY } from "@/shared/i18n/shell-copy";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/vi",
}));

afterEach(cleanup);

const copyFor = (locale: "vi" | "en" | "zh"): MarketingCopy =>
  Object.fromEntries(Object.entries(MARKETING_COPY).map(([key, entry]) => [key, entry[locale]]));

// Any unresolved key surfaces as its own dotted token in the visible text.
const RAW_KEY = /(?:nav|floating|lead_form)\.[a-z0-9_]+/;

describe("shell islands render fully from narrowed copy (vi/en/zh)", () => {
  it.each(["vi", "en", "zh"] as const)("Navbar resolves every label in %s (incl. dynamic dropdown items)", (locale) => {
    const full = copyFor(locale);
    render(<Navbar lang={locale} copy={pickCopy(full, NAVBAR_COPY)} />);
    // A dynamically-resolved dropdown title and the consult CTA both land as real strings.
    expect(screen.getAllByText(full["nav.thg_fulfill"]).length).toBeGreaterThan(0);
    expect(screen.getAllByText(full["nav.consult"]).length).toBeGreaterThan(0);
    expect(document.body.textContent ?? "").not.toMatch(RAW_KEY);
  });

  it.each(["vi", "en", "zh"] as const)("FloatingContact resolves its labels in %s", (locale) => {
    const full = copyFor(locale);
    render(
      <FloatingContact
        lang={locale}
        copy={pickCopy(full, FLOATING_CONTACT_COPY)}
        links={{ telUrl: "tel:1", zaloUrl: "https://zalo.me/1", messengerUrl: "https://m.me/1" }}
      />,
    );
    expect(screen.getAllByText(full["nav.consult"]).length).toBeGreaterThan(0);
    expect(document.body.textContent ?? "").not.toMatch(RAW_KEY);
  });
});
