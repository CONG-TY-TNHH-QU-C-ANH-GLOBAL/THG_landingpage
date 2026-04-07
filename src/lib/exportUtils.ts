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
