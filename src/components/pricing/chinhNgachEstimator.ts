export type FormalEstimateMode = "matson-lcl" | "sea-lcl" | "air";

export interface EstimateSurcharge {
  label: string;
  rate: number;
  basis: "shipment" | "cbm";
}

export interface FormalEstimateInput {
  mode: FormalEstimateMode;
  weightKg: number;
  volumeCbm: number;
  freightRate: number;
  customsFee: number;
  surcharges?: readonly EstimateSurcharge[];
}

export interface EstimateLine {
  label: string;
  formula: string;
  amount: number;
}

export interface FormalEstimate {
  billableQuantity: number;
  billableUnit: "WM" | "CBM" | "MT" | "KG";
  lines: EstimateLine[];
  subtotal: number;
}

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

/**
 * Calculates the part of a formal-shipping quote that can be supported by the
 * live public rate cards. Unknown destination fees remain outside the subtotal
 * instead of being guessed.
 */
export function calculateFormalEstimate(input: FormalEstimateInput): FormalEstimate {
  const { mode, weightKg, volumeCbm, freightRate, customsFee, surcharges = [] } = input;
  if (weightKg <= 0 && volumeCbm <= 0) {
    throw new Error("A positive shipment measurement is required");
  }

  let billableQuantity: number;
  let billableUnit: FormalEstimate["billableUnit"];

  if (mode === "air") {
    billableQuantity = weightKg;
    billableUnit = "KG";
  } else if (mode === "matson-lcl" && volumeCbm > 0 && weightKg / volumeCbm > 1_000) {
    billableQuantity = Math.max(weightKg / 1_000, 1);
    billableUnit = "MT";
  } else if (mode === "matson-lcl") {
    billableQuantity = Math.max(volumeCbm, 1);
    billableUnit = "CBM";
  } else {
    billableQuantity = Math.max(volumeCbm, weightKg / 1_000, 1);
    billableUnit = "WM";
  }

  const lines: EstimateLine[] = [{
    label: "Cước vận chuyển cơ bản",
    formula: `${billableQuantity.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} ${billableUnit} × $${freightRate}`,
    amount: roundMoney(billableQuantity * freightRate),
  }];

  for (const surcharge of surcharges) {
    const multiplier = surcharge.basis === "cbm" ? Math.max(volumeCbm, 1) : 1;
    lines.push({
      label: surcharge.label,
      formula: surcharge.basis === "cbm" ? `${multiplier.toLocaleString("vi-VN")} CBM × $${surcharge.rate}` : "Theo lô",
      amount: roundMoney(surcharge.rate * multiplier),
    });
  }

  if (customsFee > 0) {
    lines.push({ label: "Khai báo hải quan xuất VN", formula: "Theo luồng chọn", amount: roundMoney(customsFee) });
    lines.push({ label: "VAT phí khai báo", formula: "8%", amount: roundMoney(customsFee * 0.08) });
  }

  return {
    billableQuantity: roundMoney(billableQuantity),
    billableUnit,
    lines,
    subtotal: roundMoney(lines.reduce((total, line) => total + line.amount, 0)),
  };
}
