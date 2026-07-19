// @vitest-environment happy-dom
// WEB-001B homepage redesign — section content ownership and public-UI hygiene.
// Exercises the real exported Server Components (rendered client-side here; the
// only client behavior is the InViewOnce class toggle, inert in this DOM).
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";

import PillarAtlasSection from "@/features/home/ui/pillar-atlas-section";
import AboutVideoSection from "@/features/home/ui/about-video-section";
import { ContactSection } from "@/shared/ui/site-shell/contact-section";
import { FALLBACK_CONTACT_LOCATIONS } from "@/features/home/server/contact-fallback";
import EcosystemAtlasSection from "@/features/home/ui/ecosystem-atlas-section";
import CoverageSection from "@/features/home/ui/coverage-section";
import WhoWeServeSection from "@/features/home/ui/who-we-serve-section";
import WhyThgSection from "@/features/home/ui/why-thg-section";
import ProofStripSection from "@/features/home/ui/proof-strip-section";
import { MARKETING_COPY } from "@/shared/i18n/marketing-copy";
import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";
import type { Service } from "@/features/home/models/service";

afterEach(cleanup);

const LOCALES: readonly Locale[] = ["vi", "en", "zh"];

function copyFor(locale: Locale): MarketingCopy {
  return Object.fromEntries(Object.entries(MARKETING_COPY).map(([k, v]) => [k, v[locale]]));
}

function service(id: string, overrides: Partial<Service> = {}): Service {
  return {
    id,
    name: `Name ${id}`,
    tagline: `Tagline ${id}`,
    icon: "📦",
    heroEyebrow: `Eyebrow ${id}`,
    body: `Body ${id}`,
    bullets: [`${id} cap one`, `${id} cap two`],
    ctaText: `Explore ${id}`,
    ctaUrl: `/${id}`,
    ...overrides,
  };
}

const FOUR_SERVICES: readonly Service[] = [
  service("thg-fulfill"),
  service("thg-express"),
  service("thg-warehouse"),
  service("thg-order"),
];

// Prototype/annotation strings that must never reach the public UI
// (IMPLEMENTATION_BASELINE.md "Anti-patterns": no debug chrome, no approval
// ribbons, no placeholder trust content).
const FORBIDDEN_PUBLIC_STRINGS = [
  "APPROVED BY OWNER",
  "IMPLEMENTATION BASELINE",
  "PROPOSED FIELD",
  "CONTRACT REVIEW",
  "Trustpilot",
  "pending publication",
  "Design notes",
];

function expectNoAnnotationChrome(container: HTMLElement) {
  const text = container.textContent ?? "";
  for (const s of FORBIDDEN_PUBLIC_STRINGS) {
    expect(text).not.toContain(s);
  }
}

describe("PillarAtlasSection (WEB-001B)", () => {
  it.each(LOCALES)("renders all four pillars from CMS services with real CTAs — %s", (locale) => {
    const { container } = render(<PillarAtlasSection lang={locale} copy={copyFor(locale)} services={FOUR_SERVICES} />);

    for (const variant of ["fulfill", "express", "warehouse", "dropship"]) {
      expect(screen.getByTestId(`pillar-${variant}`)).toBeTruthy();
    }
    for (const s of FOUR_SERVICES) {
      const card = screen.getByRole("heading", { level: 3, name: s.name }).closest("div");
      expect(card).toBeTruthy();
      // capability manifest lines come from the CMS bullets, indexed 01/02
      const list = within(screen.getByTestId(`pillar-${s.id === "thg-order" ? "dropship" : s.id.replace("thg-", "")}`));
      expect(list.getByText(s.bullets[0])).toBeTruthy();
      const cta = list.getByRole("link");
      expect(cta.getAttribute("href")).toBe(s.ctaUrl);
    }
    expectNoAnnotationChrome(container);
  });

  it("maps CMS service ids onto their atlas slots (fulfill = anchor panel)", () => {
    render(<PillarAtlasSection lang="en" copy={copyFor("en")} services={FOUR_SERVICES} />);
    expect(within(screen.getByTestId("pillar-fulfill")).getByText("Name thg-fulfill")).toBeTruthy();
    expect(within(screen.getByTestId("pillar-dropship")).getByText("Name thg-order")).toBeTruthy();
  });

  it("falls back to position order for unknown service ids", () => {
    const unknown = [service("svc-a"), service("svc-b"), service("svc-c"), service("svc-d")];
    render(<PillarAtlasSection lang="en" copy={copyFor("en")} services={unknown} />);
    expect(within(screen.getByTestId("pillar-fulfill")).getByText("Name svc-a")).toBeTruthy();
    expect(within(screen.getByTestId("pillar-dropship")).getByText("Name svc-d")).toBeTruthy();
  });

  // Owner-reported release blocker: the CMS returned a single live service (thg-order)
  // and the section rendered ONE corner card. The four-pillar portfolio is structural:
  // every slot without a CMS entry must degrade to the production nav copy + real route.
  it.each(LOCALES)("always renders all four pillars when CMS has one live service — %s", (locale) => {
    const copy = copyFor(locale);
    render(<PillarAtlasSection lang={locale} copy={copy} services={[service("thg-order")]} />);

    for (const variant of ["fulfill", "express", "warehouse", "dropship"]) {
      expect(screen.getByTestId(`pillar-${variant}`)).toBeTruthy();
    }
    // the one CMS service keeps its slot and content
    expect(within(screen.getByTestId("pillar-dropship")).getByText("Name thg-order")).toBeTruthy();
    // the other three carry production-owned names + locale-aware real routes
    expect(within(screen.getByTestId("pillar-fulfill")).getByText(copy["nav.thg_fulfill"])).toBeTruthy();
    expect(within(screen.getByTestId("pillar-express")).getByText(copy["nav.thg_express"])).toBeTruthy();
    expect(within(screen.getByTestId("pillar-warehouse")).getByText(copy["nav.thg_warehouse"])).toBeTruthy();
    expect(
      within(screen.getByTestId("pillar-fulfill")).getByRole("link").getAttribute("href"),
    ).toBe(`/${locale}/thg-fulfill`);
  });

  it.each(LOCALES)("renders all four pillars from production copy when CMS is empty — %s", (locale) => {
    const copy = copyFor(locale);
    render(<PillarAtlasSection lang={locale} copy={copy} services={[]} />);
    for (const key of ["nav.thg_fulfill", "nav.thg_express", "nav.thg_warehouse", "nav.thg_order"]) {
      expect(screen.getByText(copy[key])).toBeTruthy();
    }
  });

  it("carries the always-visible service-code plates and renders the FULL capability manifest", () => {
    const many = service("thg-fulfill", {
      bullets: ["cap 1", "cap 2", "cap 3", "cap 4", "cap 5", "cap 6"],
    });
    const { container } = render(
      <PillarAtlasSection lang="en" copy={copyFor("en")} services={[many]} />,
    );
    for (const code of ["FUL‑01", "EXP‑02", "WHS‑03", "DRP‑04"]) {
      expect(container.textContent).toContain(code);
    }
    // no shortening of verified content: all six manifest rows render
    const rows = within(screen.getByTestId("pillar-fulfill")).getAllByRole("listitem");
    expect(rows).toHaveLength(6);
  });

  it("essential copy is never line-clamped or truncated (component architecture)", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const root = join(__dirname, "..", "..");
    for (const file of [
      "src/features/home/ui/pillar-atlas-section.tsx",
      "src/features/home/ui/about-video-section.tsx",
      "src/features/home/ui/pillar-atlas.module.css",
    ]) {
      const code = readFileSync(join(root, file), "utf8");
      expect(code, file).not.toMatch(/line-clamp|truncate|text-ellipsis|-webkit-line-clamp/);
    }
  });
});

describe("AboutVideoSection — restored Why-THG video (WEB-001B addendum)", () => {
  const ABOUT = { videoUrl: "", highlights: ["", "", "", ""] as const };

  it.each(LOCALES)("renders the production narrative + video with a localized iframe title — %s", (locale) => {
    const copy = copyFor(locale);
    const { container } = render(<AboutVideoSection copy={copy} about={ABOUT} videoUrl="" />);

    expect(container.textContent).toContain(copy["about.subtitle"]);
    expect(container.textContent).toContain(copy["about.title"]);
    expect(container.textContent).toContain(copy["about.video_title"]);
    for (const i of [1, 2, 3, 4]) {
      expect(container.textContent).toContain(copy[`about.highlight${i}`]);
    }

    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
    // production fallback video id, privacy-enhanced host, no autoplay/mute/loop
    expect(iframe?.getAttribute("src")).toBe("https://www.youtube-nocookie.com/embed/AzlW2irPANQ");
    expect(iframe?.getAttribute("src")).not.toContain("autoplay");
    expect(iframe?.getAttribute("loading")).toBe("lazy");
    expect(iframe?.getAttribute("title")).toBe(copy["about.video_iframe_title"]);
    // stable aspect ratio reserved by the wrapper — no CLS while YouTube loads
    expect(iframe?.parentElement?.className).toContain("aspect-video");
    expectNoAnnotationChrome(container);
  });

  it.each([
    ["https://www.youtube.com/watch?v=abcDEF12345", "abcDEF12345"],
    ["https://youtu.be/xyzXYZ12345", "xyzXYZ12345"],
    // findLast keeps the LAST matching path segment, trailing slash included —
    // identical selection to the previous filter(Boolean).at(-1)
    ["https://www.youtube.com/embed/lastID123-_/", "lastID123-_"],
  ])("extracts the operator-entered video id from %s", (videoUrl, id) => {
    const { container } = render(<AboutVideoSection copy={copyFor("en")} about={ABOUT} videoUrl={videoUrl} />);
    expect(container.querySelector("iframe")?.getAttribute("src")).toBe(
      `https://www.youtube-nocookie.com/embed/${id}`,
    );
  });
});

describe("ContactSection endcap (WEB-001B addendum)", () => {
  it.each(LOCALES)("renders only verified social channels — real URLs, no placeholders — %s", (locale) => {
    const copy = copyFor(locale);
    const { container } = render(<ContactSection lang={locale} copy={copy} directory={{ status: "empty", rows: [] }} />);
    const socials = [...container.querySelectorAll('a[target="_blank"]')].filter((a) =>
      a.getAttribute("rel")?.includes("noopener"),
    );
    const hrefs = socials.map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("https://www.facebook.com/THGFulfill");
    expect(hrefs).toContain("https://www.youtube.com/@thgfulfillment");
    expect(hrefs).toContain("https://www.tiktok.com/@thgfulfillment");
    for (const href of hrefs) {
      expect(href).not.toBe("#");
      expect(href).toMatch(/^https:\/\//);
    }
  });

  it("collapses the offices column when the CMS has no location records", () => {
    const copy = copyFor("vi");
    const { container } = render(<ContactSection lang="vi" copy={copy} directory={{ status: "empty", rows: [] }} />);
    // no orphan heading over an empty area
    expect(container.textContent).not.toContain(copy["contact.offices_title"]);
    // the essential consultation CTA is present in the SSR markup with no hidden inline style
    const cta = screen.getByRole("button", { name: new RegExp(copy["contact.leave_info"]) });
    expect((cta as HTMLElement).style.opacity).not.toBe("0");
  });

  it.each(LOCALES)("keeps the owner-approved offer and response copy verbatim — %s", (locale) => {
    const copy = copyFor(locale);
    const { container } = render(<ContactSection lang={locale} copy={copy} directory={{ status: "empty", rows: [] }} />);
    // content-owner decision: exact production strings, never neutralized
    expect(container.textContent).toContain(copy["contact.cta_title"]);
    expect(container.textContent).toContain(copy["contact.cta_desc"]);
  });

  it("keeps the offices column when location records exist", () => {
    const copy = copyFor("vi");
    const { container } = render(
      <ContactSection
        lang="vi"
        copy={copy}
        directory={{
          status: "ready",
          rows: [{ id: 1, kind: "office", label: "HCMC", address: "123 Test", phone: null, url: null, langClass: null }],
        }}
      />,
    );
    expect(container.textContent).toContain(copy["contact.offices_title"]);
    expect(container.textContent).toContain("123 Test");
  });

  // Full CMS directory: every record kind renders its real data — address + phone
  // sub-line + map action for physical locations, tel/mailto/web links for contact
  // kinds. Rendered count must equal the prop count (no silent row loss).
  it.each(LOCALES)("renders the full CMS location directory — %s", (locale) => {
    const copy = copyFor(locale);
    const locations = [
      { id: 1, kind: "office", label: "Office HCM", address: "12 Nguyen Hue, Q1", phone: "0901 234 567", url: "https://maps.example.com/office", langClass: null },
      { id: 2, kind: "warehouse", label: "US Warehouse", address: "100 Warehouse Rd, PA", phone: null, url: null, langClass: null },
      { id: 3, kind: "phone", label: "Hotline", address: null, phone: "0335 124 089", url: null, langClass: null },
      { id: 4, kind: "email", label: "Email", address: null, phone: null, url: "mailto:ops@example.com", langClass: null },
      { id: 5, kind: "website", label: "Website", address: null, phone: null, url: "https://thgfulfill.com", langClass: "font-cn" },
    ] as const;
    const { container } = render(<ContactSection lang={locale} copy={copy} directory={{ status: "ready", rows: [...locations] }} />);

    // Semantic grouping by CMS kind (PR #75 owner review): physical rows form the
    // directory; phone/email/website render as direct channels under the endcap card.
    const physical = locations.filter((l) => l.kind === "office" || l.kind === "warehouse");
    const channels = locations.filter((l) => l.kind !== "office" && l.kind !== "warehouse");
    const dirRows = screen.getByTestId("contact-directory").querySelectorAll("li");
    expect(dirRows).toHaveLength(physical.length);
    const channelRows = screen.getByTestId("contact-channels").querySelectorAll("li");
    expect(channelRows).toHaveLength(channels.length);
    for (const l of locations) {
      expect(container.textContent).toContain(l.label);
    }
    // physical location: address shown, phone sub-line, real map action
    expect(container.textContent).toContain("12 Nguyen Hue, Q1");
    expect(container.textContent).toContain("0901 234 567");
    const mapLink = [...container.querySelectorAll("a")].find((a) => a.getAttribute("href") === "https://maps.example.com/office");
    expect(mapLink?.textContent).toContain(copy["contact.view_map"]);
    // contact kinds: display line IS the link
    expect([...container.querySelectorAll("a")].some((a) => a.getAttribute("href") === "mailto:ops@example.com")).toBe(true);
    // never a placeholder href anywhere in the footer
    for (const a of container.querySelectorAll("a")) {
      expect(a.getAttribute("href")).not.toBe("#");
    }
  });

  it("contains no hardcoded address — every directory value flows from CMS props", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const code = readFileSync(
      join(__dirname, "..", "..", "src/shared/ui/site-shell/contact-section.tsx"),
      "utf8",
    );
    // street/district-looking literals must never appear in the component source
    expect(code).not.toMatch(/\d+\s+[A-ZĐ][a-zà-ỹ]+\s+(Street|Road|Ave|Đường|District)|Quận\s*\d|District\s*\d/);
  });
});

describe("ScrollReveal progressive enhancement (WEB-001B)", () => {
  it("server markup carries no hidden inline style — the entry state is client-applied only", async () => {
    // Contract: the JSX must not render a style attribute (the old version SSR'd
    // opacity:0, leaving the whole page invisible without JS). The hidden state
    // may only be applied inside the effect, after the motion checks.
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const code = readFileSync(join(__dirname, "..", "..", "src/shared/ui/scroll-reveal.tsx"), "utf8");
    expect(code).not.toMatch(/<div[^>]*style=/);
    expect(code).toMatch(/prefers-reduced-motion/);
    expect(code).toMatch(/IntersectionObserver" in window/);
  });
});

describe("default visibility contract (WEB-001B progressive enhancement)", () => {
  // Essential/animated content must be visible by default: every initial-hidden
  // animation state in the section CSS modules must be scoped under the `.motion`
  // class that client shells add only when motion is allowed. Exemptions: `.detail`
  // (hover/focus-revealed supplementary microcopy, never essential per
  // IMPLEMENTATION_BASELINE.md) and `.signal` (decorative traveling dot that only
  // exists in the enhanced experience, hidden via display gating).
  const CSS_FILES = [
    "src/features/home/ui/pillar-atlas.module.css",
    "src/features/home/ui/ecosystem-atlas.module.css",
    "src/features/home/ui/conversion.module.css",
  ];
  // opacity fully 0, undrawn dash routes, and collapse-scale hidden states.
  const HIDDEN_DECL = /opacity:\s*0\s*(?:;|$)|stroke-dashoffset:\s*100|scaleX\(0\)|scale\(0\.[0-9]+\)/m;
  // .detail — hover/focus supplementary microcopy; .signal — decorative traveling
  // dot of the enhanced experience; .opRoute/.opSignal — the blueprint ACTIVITY
  // layer (structure/nodes/labels stay visible at rest; hover:none and
  // reduced-motion CSS force the fully-resolved state, per artifact callout 16).
  const EXEMPT_SELECTOR = /\.detail\b|\.signal\b|\.opRoute\b|\.opSignal\b/;

  /** Tiny deterministic CSS walker (not a general parser): tracks nesting with a
   *  selector stack so rules inside @media/at-rules are seen, and checks EVERY
   *  selector in a comma-separated list individually — a safe selector can never
   *  shadow an unsafe one in the same group. */
  function hiddenRuleViolations(css: string): string[] {
    const src = css.replaceAll(/\/\*[\s\S]*?\*\//g, "");
    const stack: string[] = [];
    const violations: string[] = [];
    let buf = "";
    for (const ch of src) {
      if (ch === "{") {
        stack.push(buf.trim());
        buf = "";
      } else if (ch === "}") {
        const selector = stack.pop() ?? "";
        if (!selector.startsWith("@") && selector !== "" && HIDDEN_DECL.test(buf)) {
          for (const part of selector.split(",")) {
            const single = part.trim().replaceAll(/\s+/g, " ");
            if (!single.includes(".motion") && !EXEMPT_SELECTOR.test(single)) {
              violations.push(single);
            }
          }
        }
        buf = "";
      } else {
        buf += ch;
      }
    }
    return violations;
  }

  it("hides animatable states only under the .motion class — per selector, at any nesting", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const root = join(__dirname, "..", "..");
    const violations: string[] = [];
    for (const file of CSS_FILES) {
      for (const v of hiddenRuleViolations(readFileSync(join(root, file), "utf8"))) {
        violations.push(`${file}: "${v}"`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("the walker itself catches unsafe selectors in groups and inside @media", () => {
    const sample = `
      .safe.motion .a, .unsafe .a { opacity: 0; }
      @media (max-width: 600px) { .nested { opacity: 0; } }
      .resolved { opacity: 1; }
    `;
    expect(hiddenRuleViolations(sample)).toEqual([".unsafe .a", ".nested"]);
  });
});

describe("EcosystemAtlasSection (WEB-001B)", () => {
  it.each(LOCALES)("renders the six-stage flow owned by real pillars — %s", (locale) => {
    const copy = copyFor(locale);
    const { container } = render(<EcosystemAtlasSection copy={copy} />);

    // Mobile variant: same six stages, same owner language.
    const mobile = screen.getByTestId("ecosystem-atlas-mobile");
    expect(mobile.querySelectorAll("li")).toHaveLength(6);

    // Owner micro-labels are the real service names (never invented pillar labels).
    const text = container.textContent ?? "";
    for (const key of ["nav.thg_order", "nav.thg_fulfill", "nav.thg_warehouse", "nav.thg_express"]) {
      expect(text).toContain(copy[key]);
    }
    // Stage titles are existing verified production terms.
    for (const key of ["hero.feature1", "about.img2_title", "hero.feature3", "hero.feature4", "process.s3_title", "process.s4_title"]) {
      expect(text).toContain(copy[key]);
    }
    expectNoAnnotationChrome(container);
  });

  it("marks exactly two anchor hubs (Warehouse + Fulfillment)", () => {
    render(<EcosystemAtlasSection copy={copyFor("en")} />);
    const mobile = screen.getByTestId("ecosystem-atlas-mobile");
    const anchors = [...mobile.querySelectorAll("li")].filter((li) => li.className.includes("mStepAnchor"));
    expect(anchors).toHaveLength(2);
  });
});

describe("supporting sections (WEB-001B)", () => {
  it.each(LOCALES)("proof strip renders only the three factual lines — %s", (locale) => {
    const copy = copyFor(locale);
    const { container } = render(<ProofStripSection copy={copy} />);
    for (const key of ["proof.item1", "proof.item2", "proof.item3"]) {
      expect(container.textContent).toContain(copy[key]);
    }
    expectNoAnnotationChrome(container);
  });

  it.each(LOCALES)("coverage lists the five verified regions — %s", (locale) => {
    const copy = copyFor(locale);
    const { container } = render(<CoverageSection copy={copy} />);
    for (const i of [1, 2, 3, 4, 5]) {
      expect(container.textContent).toContain(copy[`coverage.r${i}_name`]);
    }
    expectNoAnnotationChrome(container);
  });

  it.each(LOCALES)("who-we-serve renders the four verified production seller groups — %s", (locale) => {
    const copy = copyFor(locale);
    const { container } = render(<WhoWeServeSection copy={copy} />);
    for (const i of [1, 2, 3, 4]) {
      expect(container.textContent).toContain(copy[`sellers.t${i}_title`]);
    }
    // the prototype's invented personas never ship
    expect(container.textContent).not.toContain("International partners evaluating THG");
    expectNoAnnotationChrome(container);
  });

  it.each(LOCALES)("why-THG renders all six production advantages — %s", (locale) => {
    const copy = copyFor(locale);
    const { container } = render(<WhyThgSection copy={copy} />);
    for (const i of [1, 2, 3, 4, 5, 6]) {
      expect(container.textContent).toContain(copy[`adv.a${i}_title`]);
    }
    expectNoAnnotationChrome(container);
  });
});

describe("ContactSection directory states (CMS runtime contract)", () => {
  const fallbackVi = FALLBACK_CONTACT_LOCATIONS.vi;

  it.each(LOCALES)("unavailable + verified fallback renders the full directory, no error copy — %s", (locale) => {
    const rows = FALLBACK_CONTACT_LOCATIONS[locale];
    const { container } = render(
      <ContactSection lang={locale} copy={copyFor(locale)} directory={{ status: "unavailable", rows }} />,
    );
    const physical = rows.filter((r) => r.kind === "office" || r.kind === "warehouse");
    const dirItems = container.querySelectorAll('[data-testid="contact-directory"] li');
    expect(dirItems).toHaveLength(physical.length);
    const channelItems = container.querySelectorAll('[data-testid="contact-channels"] li');
    expect(channelItems).toHaveLength(rows.length - physical.length);
    const text = container.textContent ?? "";
    for (const r of rows) expect(text).toContain(r.label);
    // no technical wording in the public DOM
    for (const term of ["CmsNetworkError", "CMS", "fetch", "500", "network error", "Error:"]) {
      expect(text).not.toContain(term);
    }
  });

  it("unavailable is NOT treated as empty: distinct composition markers", () => {
    const un = render(
      <ContactSection lang="vi" copy={copyFor("vi")} directory={{ status: "unavailable", rows: fallbackVi }} />,
    );
    expect(un.container.querySelector("section")?.getAttribute("data-directory-status")).toBe("unavailable");
    expect(un.container.querySelector('[data-testid="contact-directory"]')).not.toBeNull();
    un.unmount();
    const empty = render(
      <ContactSection lang="vi" copy={copyFor("vi")} directory={{ status: "empty", rows: [] }} />,
    );
    expect(empty.container.querySelector("section")?.getAttribute("data-directory-status")).toBe("empty");
    expect(empty.container.querySelector('[data-testid="contact-directory"]')).toBeNull();
    expect(empty.container.querySelector('[data-testid="contact-unavailable"]')).toBeNull();
  });

  it.each(LOCALES)("unavailable WITHOUT fallback shows the restrained localized notice — %s", (locale) => {
    const { container } = render(
      <ContactSection lang={locale} copy={copyFor(locale)} directory={{ status: "unavailable", rows: [] }} />,
    );
    const note = container.querySelector('[data-testid="contact-unavailable"]');
    expect(note).not.toBeNull();
    expect(note?.textContent?.trim().length).toBeGreaterThan(10);
    // never claims THG has no offices; never technical
    expect(note?.textContent).not.toMatch(/CMS|error|Error|500|fetch/);
    // consultation card still present
    expect(container.textContent).toContain(copyFor(locale)["contact.cta_title"]);
  });

  it("renders every verified fallback record without clipping styles", () => {
    const { container } = render(
      <ContactSection lang="vi" copy={copyFor("vi")} directory={{ status: "unavailable", rows: fallbackVi }} />,
    );
    const list = container.querySelector('[data-testid="contact-directory"]');
    expect(list?.className ?? "").not.toMatch(/line-clamp|max-h-|h-\[/);
    expect(container.textContent).toContain("121/5");
  });
});
