import { describe, expect, it } from "vitest";

import { catalogPath, routeIdentity } from "@/lib/catalogRoutes";

describe("catalogPath", () => {
  it("builds the bare catalog path without a collection", () => {
    expect(catalogPath("vi")).toBe("/vi/catalog");
    expect(catalogPath("en", null)).toBe("/en/catalog");
  });

  it("appends the collection slug", () => {
    expect(catalogPath("vi", "christmas")).toBe("/vi/catalog/christmas");
  });

  it("encodes slugs that are not URL-safe", () => {
    expect(catalogPath("vi", "back to school")).toBe("/vi/catalog/back%20to%20school");
  });
});

describe("routeIdentity", () => {
  it("collapses collection paths onto the catalog", () => {
    expect(routeIdentity("/vi/catalog/christmas")).toBe("/vi/catalog");
    expect(routeIdentity("/en/catalog/halloween/")).toBe("/en/catalog");
  });

  it("leaves every other path unchanged", () => {
    expect(routeIdentity("/vi/catalog")).toBe("/vi/catalog");
    expect(routeIdentity("/vi/blog/christmas")).toBe("/vi/blog/christmas");
    expect(routeIdentity("/vi/catalog/christmas/extra")).toBe("/vi/catalog/christmas/extra");
  });
});
