import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChinhNgachRateWorkspace } from "@/components/pricing/ChinhNgachRateWorkspace";

describe("ChinhNgachRateWorkspace", () => {
  it("opens guidance and estimate as peer views without losing the rate view", () => {
    render(<ChinhNgachRateWorkspace />);

    expect(screen.getByRole("tabpanel", { name: "Bảng giá" })).toBeVisible();

    fireEvent.click(screen.getByRole("tab", { name: "Hướng dẫn đọc bảng giá" }));
    expect(screen.getByRole("tabpanel", { name: "Hướng dẫn đọc bảng giá" })).toHaveTextContent("LCL");

    fireEvent.click(screen.getByRole("tab", { name: "Dự toán chi phí" }));
    expect(screen.getByRole("tabpanel", { name: "Dự toán chi phí" })).toHaveTextContent("Thông tin lô hàng");
  });

  it("shows one transport lane at a time to keep the rate card compact", () => {
    render(<ChinhNgachRateWorkspace />);

    expect(screen.getByRole("region", { name: "MATSON — Line hỏa tốc" })).toBeVisible();
    expect(screen.queryByRole("region", { name: "Sea chính ngạch thường" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Sea chính ngạch thường/i }));
    expect(screen.getByRole("region", { name: "Sea chính ngạch thường" })).toBeVisible();
    expect(screen.queryByRole("region", { name: "MATSON — Line hỏa tốc" })).not.toBeInTheDocument();
  });
});
