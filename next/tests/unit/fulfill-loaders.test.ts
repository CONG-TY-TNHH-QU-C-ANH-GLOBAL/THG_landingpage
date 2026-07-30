import { describe, it, expect, vi, beforeEach } from "vitest";

// Loader-level provenance guarantees for the Fulfill route: a CMS transport failure and an
// empty-but-valid CMS collection both render "no data", but they must reach that state by
// DIFFERENT paths — failure degrades to the feature-local fallback (present:false), while an
// empty collection is real CMS content (present:true, empty list). The mapper is covered in
// fulfill-content.test; here we pin what the loader does with cmsFetch success/failure.
const { cmsFetch } = vi.hoisted(() => ({ cmsFetch: vi.fn() }));
vi.mock("@/shared/cms", () => ({ cmsFetch }));

import { loadFulfillContent, loadFulfillFaqs, loadFulfillServiceBlocks } from "@/features/fulfill/server/loaders";
import { CmsNetworkError } from "@/shared/cms/errors";

/** A schema-valid `/services` response with a live, fully-populated fulfill service. */
function populatedServices(overrides: Record<string, unknown> = {}) {
  return {
    locale: "vi",
    services: [
      {
        id: "thg-fulfill",
        position: 1,
        icon: "📦",
        status: "live",
        name: "THG Fulfill",
        tagline: "Hệ sinh thái Fulfill A-Z",
        hero_eyebrow: null,
        hero_title: "THG Fulfill",
        hero_sub: "In ấn POD tại Việt Nam, Trung Quốc và Mỹ.",
        cta_text: "Tìm hiểu thêm",
        cta_url: "/thg-fulfill",
        body_md: "In ấn POD…",
        bullets: ["Hỗ trợ dropship", "Chi phí gốc cạnh tranh"],
        gallery: [],
        videos: [],
        products: [{ name: "Áo thun", price: "$3.2", time: "48h", origin: "VN", image: "https://cdn/x.png" }],
        ...overrides,
      },
    ],
  };
}

beforeEach(() => cmsFetch.mockReset());

describe("loadFulfillContent — CMS source vs fallback provenance", () => {
  it("renders live CMS values (present=true) when the service loads — not the feature-local fallback", async () => {
    cmsFetch.mockResolvedValue(populatedServices());
    const content = await loadFulfillContent("vi");
    expect(cmsFetch).toHaveBeenCalledTimes(1);
    expect(cmsFetch.mock.calls[0][0]).toBe("/services?lang=vi"); // correct endpoint + locale param
    expect(content.present).toBe(true); // CMS was the source, not degradation
    expect(content.serviceLabel).toBe("THG Fulfill");
    expect(content.heroSubtitle).toBe("In ấn POD tại Việt Nam, Trung Quốc và Mỹ.");
    expect(content.points).toEqual(["Hỗ trợ dropship", "Chi phí gốc cạnh tranh"]);
    expect(content.catalog).toEqual([{ name: "Áo thun", image: "https://cdn/x.png", note: "$3.2 · 48h · VN" }]);
  });

  it("distinguishes an EMPTY collection (present=true, empty catalog) from a transport failure", async () => {
    cmsFetch.mockResolvedValue(populatedServices({ products: [], bullets: [] }));
    const content = await loadFulfillContent("vi");
    expect(content.present).toBe(true); // the service loaded — this is real CMS content, just empty
    expect(content.catalog).toEqual([]);
    expect(content.points).toEqual([]);
    expect(content.serviceLabel).toBe("THG Fulfill"); // scalar CMS fields still present
  });

  it("degrades to the feature-local fallback (present=false) on a CMS transport failure — never partial CMS", async () => {
    cmsFetch.mockRejectedValueOnce(new CmsNetworkError("/services?lang=vi", "timeout"));
    const content = await loadFulfillContent("vi");
    expect(cmsFetch).toHaveBeenCalledTimes(1); // no retry
    expect(content.present).toBe(false); // failure ≠ empty: the route runs on localized chrome
    expect(content.serviceLabel).toBe("");
    expect(content.heroSubtitle).toBe("");
    expect(content.catalog).toEqual([]);
    expect(content.points).toEqual([]);
  });
});

describe("loadFulfillFaqs — empty vs populated vs failure", () => {
  it("returns the published FAQ list (sorted) when present", async () => {
    cmsFetch.mockResolvedValue({
      locale: "vi",
      scope: "fulfill",
      faqs: [
        { id: 2, position: 2, question: "B?", answer: "b" },
        { id: 1, position: 1, question: "A?", answer: "a" },
      ],
    });
    const faqs = await loadFulfillFaqs("vi");
    expect(cmsFetch.mock.calls[0][0]).toBe("/faqs?lang=vi&scope=fulfill");
    expect(faqs.map((f) => f.id)).toEqual([1, 2]);
  });

  it("returns [] for an empty published set and for a transport failure alike (both suppress the section + JSON-LD)", async () => {
    cmsFetch.mockResolvedValueOnce({ locale: "vi", scope: "fulfill", faqs: [] });
    expect(await loadFulfillFaqs("vi")).toEqual([]);
    cmsFetch.mockRejectedValueOnce(new CmsNetworkError("/faqs?lang=vi&scope=fulfill", "timeout"));
    expect(await loadFulfillFaqs("vi")).toEqual([]);
  });
});

describe("loadFulfillServiceBlocks — CMS overlay vs empty vs failure", () => {
  it("reads the correct page_slug + locale and resolves published blocks by role key", async () => {
    cmsFetch.mockResolvedValueOnce({
      locale: "vi",
      page_slug: "thg-fulfill",
      kind: null,
      blocks: [{ id: 1, kind: "journey_step", position: 0, icon: null, title: "D1", description: "d1", payload: { key: "design-input" } }],
    });
    const content = await loadFulfillServiceBlocks("vi");
    expect(cmsFetch.mock.calls[0][0]).toBe("/service-blocks?page_slug=thg-fulfill&lang=vi");
    expect(content.journey.get("design-input")).toEqual({ title: "D1", description: "d1" });
  });

  it("returns the empty model for an empty block set (all roles fall back)", async () => {
    cmsFetch.mockResolvedValueOnce({ locale: "vi", page_slug: "thg-fulfill", kind: null, blocks: [] });
    const content = await loadFulfillServiceBlocks("vi");
    expect(content.journey.size + content.capabilities.size + content.sections.size).toBe(0);
  });

  it("degrades to the empty model on a CMS transport failure (never partial CMS)", async () => {
    cmsFetch.mockRejectedValueOnce(new CmsNetworkError("/service-blocks?page_slug=thg-fulfill&lang=vi", "timeout"));
    const content = await loadFulfillServiceBlocks("vi");
    expect(content.journey.size + content.capabilities.size + content.sections.size).toBe(0);
  });
});
