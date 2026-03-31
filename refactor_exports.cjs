const fs = require('fs');
const path = require('path');

const intlPath = path.join(__dirname, 'src', 'pages', 'InternationalPricingPage.tsx');
let intl = fs.readFileSync(intlPath, 'utf8').replace(/\r\n/g, '\n');

// 1. PriceTable
const ptTarget1 = `  const [isExpanded, setIsExpanded] = useState(false);
  const tableId = useMemo(() => "table-price-" + Math.random().toString(36).substring(2, 9), []);
  if (!data || data.length === 0) return null;`;

const ptReplace1 = `  const [isExpanded, setIsExpanded] = useState(false);
  const tableId = useMemo(() => "table-price-" + Math.random().toString(36).substring(2, 9), []);
  if (!data || data.length === 0) return null;

  const exportConfig = useMemo(() => {
    const headers = ["Cân Nặng (KG)", ...columns.map(c => c.label)];
    const rows = data.map((row: any) => {
      return [
        row.kg ?? row.weight ?? "—",
        ...columns.map(c => {
          const val = row[c.key];
          if (val === null || val === undefined) return "—";
          if (typeof val === "number") return "$" + val.toFixed(2);
          return val;
        })
      ];
    });
    return { filename: title, headers, rows };
  }, [data, columns, title]);`;
intl = intl.replace(ptTarget1, ptReplace1);

const ptExportBtns = `        <div className="flex items-center gap-2 ml-auto">
          {note && <span className="text-[#9CA3AF] text-[10px] mr-2">{note}</span>}
          <button onClick={() => exportToExcel(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Excel">
            <FileSpreadsheet size={14} />
          </button>
          <button onClick={() => exportToWord(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Word">
            <FileText size={14} />
          </button>
          <button onClick={() => exportToPdf(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất PDF">
            <FileIcon size={14} />
          </button>
        </div>`;
const ptExportBtnsReplace = `        <div className="flex items-center gap-2 ml-auto">
          {note && <span className="text-[#9CA3AF] text-[10px] mr-2">{note}</span>}
          <button onClick={() => exportToExcel(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Excel">
            <FileSpreadsheet size={14} />
          </button>
          <button onClick={() => exportToWord(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Word">
            <FileText size={14} />
          </button>
          <button onClick={() => exportToPdf(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất PDF">
            <FileIcon size={14} />
          </button>
        </div>`;
intl = intl.replace(ptExportBtns, ptExportBtnsReplace);

// 2. BulkDataTable
const bulkTarget1 = `  const [isExpanded, setIsExpanded] = useState(false);
  const tableId = useMemo(() => "table-bulk-" + Math.random().toString(36).substring(2, 9), []);
  if (!data || data.length === 0) return null;

  // The Bulk data structure is: { name: "Zone 1", prices: { "12": 10.5, "21": 9.5 ... }, sla: "3-5 jours" }
  // We need to extract the weight keys from the 'prices' object of the first row
  const weightKeys = data[0]?.prices ? Object.keys(data[0].prices).sort((a, b) => Number(a) - Number(b)) : [];`;

const bulkReplace1 = `  const [isExpanded, setIsExpanded] = useState(false);
  const tableId = useMemo(() => "table-bulk-" + Math.random().toString(36).substring(2, 9), []);
  if (!data || data.length === 0) return null;

  const weightKeys = data[0]?.prices ? Object.keys(data[0].prices).sort((a, b) => Number(a) - Number(b)) : [];

  const exportConfig = useMemo(() => {
    const headers = ["Vùng (Zone)", ...weightKeys.map(k => k + " kg"), "Thời gian (SLA)"];
    const rows = data.map((row: any) => {
      return [
        row.name,
        ...weightKeys.map(k => {
          const val = row.prices[k];
          return (val === null || val === undefined) ? "—" : "$" + val.toFixed(2);
        }),
        row.sla || "—"
      ];
    });
    return { filename: title, headers, rows };
  }, [data, weightKeys, title]);`;
intl = intl.replace(bulkTarget1, bulkReplace1);

const bulkExportBtns = `        <div className="flex items-center gap-1.5 ml-auto">
          <button onClick={() => exportToExcel(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Excel">
            <FileSpreadsheet size={14} />
          </button>
          <button onClick={() => exportToWord(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Word">
            <FileText size={14} />
          </button>
          <button onClick={() => exportToPdf(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất PDF">
            <FileIcon size={14} />
          </button>
        </div>`;
const bulkExportBtnsReplace = `        <div className="flex items-center gap-1.5 ml-auto">
          <button onClick={() => exportToExcel(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Excel">
            <FileSpreadsheet size={14} />
          </button>
          <button onClick={() => exportToWord(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Word">
            <FileText size={14} />
          </button>
          <button onClick={() => exportToPdf(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất PDF">
            <FileIcon size={14} />
          </button>
        </div>`;
intl = intl.replace(bulkExportBtns, bulkExportBtnsReplace);

// 3. CompactAccordionTable
const catDef = `const CompactAccordionTable = ({ headers, data, renderRow, title = "Data Table" }: { headers: string[], data: any[], renderRow: (row: any, i: number) => React.ReactNode, title?: string }) => {`;
const catDefReplace = `const CompactAccordionTable = ({ headers, data, renderRow, title = "Data Table", extractRowData }: { headers: string[], data: any[], renderRow: (row: any, i: number) => React.ReactNode, title?: string, extractRowData?: (row: any) => (string | number)[] }) => {`;
intl = intl.replace(catDef, catDefReplace);

const catTarget1 = `  const [isExpanded, setIsExpanded] = useState(false);
  const tableId = useMemo(() => "table-compact-" + Math.random().toString(36).substring(2, 9), []);
  if (!data || data.length === 0) return null;`;

const catReplace1 = `  const [isExpanded, setIsExpanded] = useState(false);
  const tableId = useMemo(() => "table-compact-" + Math.random().toString(36).substring(2, 9), []);
  if (!data || data.length === 0) return null;

  const exportConfig = useMemo(() => {
    const rows = extractRowData ? data.map(extractRowData) : data.map((r: any) => Object.values(r) as string[]);
    return { filename: title, headers, rows };
  }, [data, headers, title, extractRowData]);`;
intl = intl.replace(catTarget1, catReplace1);

const catExportBtns = `      <div className="absolute top-[-36px] right-0 flex items-center gap-1">
        <button onClick={() => exportToExcel(tableId, title)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Xuất Excel">
          <FileSpreadsheet size={13} />
        </button>
        <button onClick={() => exportToWord(tableId, title)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Xuất Word">
          <FileText size={13} />
        </button>
        <button onClick={() => exportToPdf(tableId, title)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Xuất PDF">
          <FileIcon size={13} />
        </button>
      </div>`;
const catExportBtnsReplace = `      <div className="absolute top-[-36px] right-0 flex items-center gap-1">
        <button onClick={() => exportToExcel(exportConfig)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Xuất Excel">
          <FileSpreadsheet size={13} />
        </button>
        <button onClick={() => exportToWord(exportConfig)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Xuất Word">
          <FileText size={13} />
        </button>
        <button onClick={() => exportToPdf(exportConfig)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Xuất PDF">
          <FileIcon size={13} />
        </button>
      </div>`;
intl = intl.replace(catExportBtns, catExportBtnsReplace);

// Provide extractRowData to Surcharges Table
const surchargesUsage = `<CompactAccordionTable
        title="Các khoản phụ phí (Surcharges)"
        headers={["Khu vực/Loại", "Phí", "Thông tin chi tiết"]}
        data={surchargesData}`;
const surchargesUsageReplace = `<CompactAccordionTable
        title="Các khoản phụ phí (Surcharges)"
        headers={["Khu vực/Loại", "Phí", "Thông tin chi tiết"]}
        data={surchargesData}
        extractRowData={(row) => [row.area, "$" + row.fee.toFixed(2), row.desc]}`;
intl = intl.replace(surchargesUsage, surchargesUsageReplace);

fs.writeFileSync(intlPath, intl, 'utf8');
console.log("Patched InternationalPricingPage for ExportConfig");

// --- Domestic Pricing Page ---
const domesticPath = path.join(__dirname, 'src', 'pages', 'DomesticPricingPage.tsx');
let dom = fs.readFileSync(domesticPath, 'utf8').replace(/\r\n/g, '\n');

const domTarget1 = `const DomesticPricingContent = () => {
    const [selectedZone, setSelectedZone] = useState<number>(5);
    const [showAll, setShowAll] = useState(false);
    const displayRows = showAll ? domesticPricingRows : domesticPricingRows.slice(0, INITIAL_ROWS);
    const hasMore = domesticPricingRows.length > INITIAL_ROWS;`;

const domReplace1 = `const DomesticPricingContent = () => {
    const [selectedZone, setSelectedZone] = useState<number>(5);
    const [showAll, setShowAll] = useState(false);
    const displayRows = showAll ? domesticPricingRows : domesticPricingRows.slice(0, INITIAL_ROWS);
    const hasMore = domesticPricingRows.length > INITIAL_ROWS;
    
    // Export Data Mapping
    const exportConfig = React.useMemo(() => {
        const headers = ["STT", "Cân nặng (oz)", "Cân nặng (gram)", \`Cước phí (Zone \${selectedZone})\`];
        const rows = domesticPricingRows.map(row => [
            row.STT, row.weight, row.gram, row.zones[selectedZone]
        ]);
        return { filename: 'THG_Domestic_Pricing_Zone_' + selectedZone, headers, rows };
    }, [selectedZone]);`;
dom = dom.replace(domTarget1, domReplace1);

// Add missing React import if needed
if (!dom.includes(`import React, { useState } from "react";`)) {
    dom = dom.replace(`import { useState } from "react";`, `import React, { useState } from "react";`);
}

const domExportBtns = `                                <div className="flex items-center gap-1.5 ml-2">
                                  <button onClick={() => exportToExcel('table-domestic', 'THG_Domestic_Pricing')} className="p-1.5 bg-secondary hover:bg-primary/20 rounded-md text-primary transition-colors" title="Xuất Excel">
                                    <FileSpreadsheet size={16} />
                                  </button>
                                  <button onClick={() => exportToWord('table-domestic', 'THG_Domestic_Pricing')} className="p-1.5 bg-secondary hover:bg-primary/20 rounded-md text-primary transition-colors" title="Xuất Word">
                                    <FileText size={16} />
                                  </button>
                                  <button onClick={() => exportToPdf('table-domestic', 'THG_Domestic_Pricing')} className="p-1.5 bg-secondary hover:bg-primary/20 rounded-md text-primary transition-colors" title="Xuất PDF">
                                    <FileIcon size={16} />
                                  </button>
                                </div>`;
const domExportBtnsReplace = `                                <div className="flex items-center gap-1.5 ml-2">
                                  <button onClick={() => exportToExcel(exportConfig)} className="p-1.5 bg-secondary hover:bg-primary/20 rounded-md text-primary transition-colors" title="Xuất Excel">
                                    <FileSpreadsheet size={16} />
                                  </button>
                                  <button onClick={() => exportToWord(exportConfig)} className="p-1.5 bg-secondary hover:bg-primary/20 rounded-md text-primary transition-colors" title="Xuất Word">
                                    <FileText size={16} />
                                  </button>
                                  <button onClick={() => exportToPdf(exportConfig)} className="p-1.5 bg-secondary hover:bg-primary/20 rounded-md text-primary transition-colors" title="Xuất PDF">
                                    <FileIcon size={16} />
                                  </button>
                                </div>`;
dom = dom.replace(domExportBtns, domExportBtnsReplace);

fs.writeFileSync(domesticPath, dom, 'utf8');
console.log("Patched DomesticPricingPage for ExportConfig");
