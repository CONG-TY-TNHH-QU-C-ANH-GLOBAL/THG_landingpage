// @vitest-environment happy-dom
// WEB-001 regression: the architecture test (tests/architecture/lead-form-dialog-boundary.test.ts)
// guards the RSC boundary that caused the hydration mismatch (a Server Component building the
// Button trigger and crossing it into LeadFormDialog as a lazy reference). This test proves the
// other half — that the client-owned trigger these fixes produced actually renders as a real
// button and opens/closes a working Radix dialog. Exercises the real exported components, no
// test-only replicas.
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor, within } from "@testing-library/react";

import { HeroPrimaryCta } from "@/features/home/ui/hero-primary-cta";
import { ContactCtaTrigger } from "@/shared/ui/site-shell/contact-cta-trigger";
import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";

afterEach(cleanup);

const CONTACT_COPY: Record<Locale, MarketingCopy> = {
  vi: { "contact.leave_info": "Để lại thông tin liên hệ" },
  en: { "contact.leave_info": "Leave your contact info" },
  zh: { "contact.leave_info": "留下您的联系方式" },
};

/** Asserts trigger + dialog semantics, opens the dialog, and returns it. */
async function openDialog(trigger: HTMLElement) {
  expect(trigger.tagName).toBe("BUTTON");
  expect(trigger.getAttribute("type")).toBe("button");
  expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
  expect(trigger.getAttribute("aria-expanded")).toBe("false");

  fireEvent.click(trigger);

  const dialog = await screen.findByRole("dialog");
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  return dialog;
}

/** Escape closes the dialog and Radix returns focus to the trigger that opened it. */
async function closeWithEscapeAndExpectFocusReturn(trigger: HTMLElement) {
  fireEvent.keyDown(document, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  await waitFor(() => expect(document.activeElement).toBe(trigger));
}

describe("HeroPrimaryCta (WEB-001)", () => {
  it("renders a real button that opens, closes on Escape, and returns focus", async () => {
    render(<HeroPrimaryCta lang="vi" copy={CONTACT_COPY.vi} cta="Tham khảo catalog" />);
    const trigger = screen.getByRole("button", { name: /Tham khảo catalog/i });
    trigger.focus();

    const dialog = await openDialog(trigger);
    expect(within(dialog).getByRole("heading")).toBeTruthy();

    await closeWithEscapeAndExpectFocusReturn(trigger);

    // reopening must still work — Radix state isn't left half-closed
    fireEvent.click(trigger);
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });
});

describe("ContactCtaTrigger (WEB-001)", () => {
  it.each(Object.keys(CONTACT_COPY) as Locale[])("renders a real button that opens for locale=%s", async (locale) => {
    render(<ContactCtaTrigger lang={locale} copy={CONTACT_COPY[locale]} />);
    const trigger = screen.getByRole("button", { name: new RegExp(CONTACT_COPY[locale]["contact.leave_info"]) });
    await openDialog(trigger);
  });

  it("closes on Escape and returns focus to the trigger (vi)", async () => {
    render(<ContactCtaTrigger lang="vi" copy={CONTACT_COPY.vi} />);
    const trigger = screen.getByRole("button", { name: new RegExp(CONTACT_COPY.vi["contact.leave_info"]) });
    trigger.focus();

    await openDialog(trigger);
    await closeWithEscapeAndExpectFocusReturn(trigger);
  });
});
