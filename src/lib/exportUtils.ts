import * as XLSX from "xlsx";

export interface ExportConfig {
  filename: string;
  headers: string[];
  rows: (string | number)[][];
}

export const exportToExcel = ({ filename, headers, rows }: ExportConfig) => {
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Auto-fit column widths based on content
  const allRows = [headers, ...rows];
  const colWidths = headers.map((_, colIdx) => {
    let maxLen = 0;
    for (const row of allRows) {
      const cell = row[colIdx];
      const len = cell != null ? String(cell).length : 0;
      if (len > maxLen) maxLen = len;
    }
    return { wch: Math.min(Math.max(maxLen + 2, 8), 30) };
  });
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

/**
 * Export a rendered table element to PDF (audit Gap 8 — "Generate PDF for boss").
 *
 * We rasterize the live DOM with html2canvas rather than drawing text with
 * jsPDF's built-in fonts: those fonts (Helvetica) cannot render Vietnamese
 * diacritics or Chinese characters, and the pricing tables contain both.
 * Capturing the rendered <table> preserves every glyph faithfully across vi/en/zh.
 *
 * The caller should fully expand the table before calling so every row is captured.
 */
export const exportElementToPdf = async ({ element, filename }: { element: HTMLElement; filename: string }) => {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const margin = 24;
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const usableW = pageW - margin * 2;
  const usableH = pageH - margin * 2;
  const imgW = usableW;
  const imgH = (canvas.height / canvas.width) * imgW;

  // Single page when it fits, otherwise slice the tall image across pages.
  let heightLeft = imgH;
  let position = margin;
  pdf.addImage(imgData, "PNG", margin, position, imgW, imgH);
  heightLeft -= usableH;
  while (heightLeft > 0) {
    position -= usableH;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, position, imgW, imgH);
    heightLeft -= usableH;
  }

  pdf.save(`${filename}.pdf`);
};
