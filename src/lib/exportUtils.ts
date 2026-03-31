import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportConfig {
  filename: string;
  headers: string[];
  rows: (string | number)[][];
}

export const exportToExcel = ({ filename, headers, rows }: ExportConfig) => {
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPdf = ({ filename, headers, rows }: ExportConfig) => {
  const doc = new jsPDF("p", "pt", "a4");

  // Add title text
  doc.setFontSize(14);
  doc.text(filename, 40, 40);

  // AutoTable parses the array natively without rendering HTML
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 60,
    theme: "striped",
    headStyles: { fillColor: [24, 34, 61] }, // navy color from THG theme
    styles: { fontSize: 8, cellPadding: 4 },
  });

  doc.save(`${filename}.pdf`);
};

export const exportToWord = ({ filename, headers, rows }: ExportConfig) => {
  // Construct HTML natively from data
  const thead = `<thead><tr>${headers.map(h => `<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #18223D; color: white;">${h}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows.map(row => `<tr>${row.map(cell => `<td style="border: 1px solid #ddd; padding: 8px;">${cell}</td>`).join('')}</tr>`).join('')}</tbody>`;
  const tableHtml = `<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 12px;">${thead}${tbody}</table>`;

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${filename}</title></head>
    <body style="font-family: Arial, sans-serif;">
      <h2>${filename}</h2>
      ${tableHtml}
    </body>
    </html>
  `;

  const blob = new Blob(['\\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
