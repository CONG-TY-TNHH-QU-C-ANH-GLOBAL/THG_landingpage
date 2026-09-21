import { describe, expect, it } from "vitest";

import { calculateFormalEstimate } from "@/components/pricing/chinhNgachEstimator";

describe("calculateFormalEstimate", () => {
  it("uses the larger of CBM and metric tonnes for LCL and keeps a 1-WM minimum", () => {
    const estimate = calculateFormalEstimate({
      mode: "sea-lcl",
      weightKg: 500,
      volumeCbm: 0.4,
      freightRate: 78,
      customsFee: 62,
    });

    expect(estimate.billableQuantity).toBe(1);
    expect(estimate.billableUnit).toBe("WM");
    expect(estimate.lines.map((line) => line.amount)).toEqual([78, 62, 4.96]);
    expect(estimate.subtotal).toBe(144.96);
  });

  it("prices dense MATSON cargo by metric tonne and adds known shipment surcharges", () => {
    const estimate = calculateFormalEstimate({
      mode: "matson-lcl",
      weightKg: 2_400,
      volumeCbm: 2,
      freightRate: 220,
      customsFee: 86,
      surcharges: [
        { label: "Handling", rate: 84, basis: "shipment" },
        { label: "PierPASS", rate: 4.5, basis: "cbm" },
      ],
    });

    expect(estimate.billableQuantity).toBe(2.4);
    expect(estimate.billableUnit).toBe("MT");
    expect(estimate.lines.map((line) => line.amount)).toEqual([528, 84, 9, 86, 6.88]);
    expect(estimate.subtotal).toBe(713.88);
  });

  it("uses chargeable kilograms for air freight", () => {
    const estimate = calculateFormalEstimate({
      mode: "air",
      weightKg: 750,
      volumeCbm: 3,
      freightRate: 6.05,
      customsFee: 0,
    });

    expect(estimate.billableQuantity).toBe(750);
    expect(estimate.billableUnit).toBe("KG");
    expect(estimate.subtotal).toBe(4537.5);
  });

  it("rejects missing shipment measurements", () => {
    expect(() => calculateFormalEstimate({
      mode: "sea-lcl",
      weightKg: 0,
      volumeCbm: 0,
      freightRate: 78,
      customsFee: 62,
    })).toThrow("shipment measurement");
  });
});
