const fs = require('fs');
const path = require('path');

const intlPath = path.join(__dirname, 'src', 'pages', 'InternationalPricingPage.tsx');
let intl = fs.readFileSync(intlPath, 'utf8');

// Normalize to LF
intl = intl.replace(/\r\n/g, '\n');

if (!intl.includes('exportToExcel(tableId, title)')) {
    // 1. Add imports (these were already added, but let's be sure)
    if (!intl.includes('exportToPdf')) {
        intl = intl.replace(
            `import { ChevronDown, ChevronUp, Search, ExternalLink } from "lucide-react";`,
            `import { ChevronDown, ChevronUp, Search, ExternalLink, FileSpreadsheet, FileText, FileIcon } from "lucide-react";\nimport { exportToExcel, exportToPdf, exportToWord } from "@/lib/exportUtils";`
        );
    }

    // 2. Patch PriceTable
    const ptTarget1 = `const PriceTable = ({ title, badge, note, data, columns }: {\n  title: string; badge?: string; note?: string;\n  data: any[]; columns: { key: string; label: string }[];\n}) => {\n  const { tVi } = useI18n();\n  const [isExpanded, setIsExpanded] = useState(false);\n  if (!data || data.length === 0) return null;`;

    const ptReplace1 = `const PriceTable = ({ title, badge, note, data, columns }: {\n  title: string; badge?: string; note?: string;\n  data: any[]; columns: { key: string; label: string }[];\n}) => {\n  const { tVi } = useI18n();\n  const [isExpanded, setIsExpanded] = useState(false);\n  const tableId = useMemo(() => "table-price-" + Math.random().toString(36).substring(2, 9), []);\n  if (!data || data.length === 0) return null;`;

    intl = intl.replace(ptTarget1, ptReplace1);

    const ptTarget2 = `        </div>\n        {note && <span className="text-[#9CA3AF] text-[10px]">{note}</span>}\n      </div>\n      <div className="overflow-x-auto">\n        <table className="w-full border-collapse text-xs">`;

    const ptReplace2 = `        </div>\n        <div className="flex items-center gap-2 ml-auto">\n          {note && <span className="text-[#9CA3AF] text-[10px] mr-2">{note}</span>}\n          <button onClick={() => exportToExcel(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Excel">\n            <FileSpreadsheet size={14} />\n          </button>\n          <button onClick={() => exportToWord(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Word">\n            <FileText size={14} />\n          </button>\n          <button onClick={() => exportToPdf(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất PDF">\n            <FileIcon size={14} />\n          </button>\n        </div>\n      </div>\n      <div className="overflow-x-auto">\n        <table id={tableId} className="w-full border-collapse text-xs">`;

    intl = intl.replace(ptTarget2, ptReplace2);

    // 3. Patch BulkDataTable
    const bulkTarget1 = `const BulkDataTable = ({ title, badge, data }: { title: string; badge: string; data: any[] }) => {\n  const { tVi } = useI18n();\n  const [isExpanded, setIsExpanded] = useState(false);\n  if (!data || data.length === 0) return null;`;

    const bulkReplace1 = `const BulkDataTable = ({ title, badge, data }: { title: string; badge: string; data: any[] }) => {\n  const { tVi } = useI18n();\n  const [isExpanded, setIsExpanded] = useState(false);\n  const tableId = useMemo(() => "table-bulk-" + Math.random().toString(36).substring(2, 9), []);\n  if (!data || data.length === 0) return null;`;

    intl = intl.replace(bulkTarget1, bulkReplace1);

    const bulkTarget2 = `        <span className="text-white font-bold text-xs flex items-center gap-2">\n          {title}\n          <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>\n        </span>\n      </div>\n      <div className="overflow-x-auto">\n        <table className="w-full border-collapse text-xs">`;

    const bulkReplace2 = `        <span className="text-white font-bold text-xs flex items-center gap-2">\n          {title}\n          <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>\n        </span>\n        <div className="flex items-center gap-1.5 ml-auto">\n          <button onClick={() => exportToExcel(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Excel">\n            <FileSpreadsheet size={14} />\n          </button>\n          <button onClick={() => exportToWord(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Word">\n            <FileText size={14} />\n          </button>\n          <button onClick={() => exportToPdf(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất PDF">\n            <FileIcon size={14} />\n          </button>\n        </div>\n      </div>\n      <div className="overflow-x-auto">\n        <table id={tableId} className="w-full border-collapse text-xs">`;

    intl = intl.replace(bulkTarget2, bulkReplace2);

    // 4. Patch CompactAccordionTable
    const caTarget1 = `const CompactAccordionTable = ({ headers, data, renderRow }: { headers: string[], data: any[], renderRow: (row: any, i: number) => React.ReactNode }) => {\n  const { tVi } = useI18n();\n  const [isExpanded, setIsExpanded] = useState(false);\n  if (!data || data.length === 0) return null;\n  const displayData = isExpanded ? data : data.slice(0, 6);\n\n  return (\n    <table className="w-full border-collapse text-xs">`;

    const caReplace1 = `const CompactAccordionTable = ({ headers, data, renderRow, title = "Data Table" }: { headers: string[], data: any[], renderRow: (row: any, i: number) => React.ReactNode, title?: string }) => {\n  const { tVi } = useI18n();\n  const [isExpanded, setIsExpanded] = useState(false);\n  const tableId = useMemo(() => "table-compact-" + Math.random().toString(36).substring(2, 9), []);\n  if (!data || data.length === 0) return null;\n  const displayData = isExpanded ? data : data.slice(0, 6);\n\n  return (\n    <div className="relative">\n      <div className="absolute top-[-36px] right-0 flex items-center gap-1">\n        <button onClick={() => exportToExcel(tableId, title)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Xuất Excel">\n          <FileSpreadsheet size={13} />\n        </button>\n        <button onClick={() => exportToWord(tableId, title)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Xuất Word">\n          <FileText size={13} />\n        </button>\n        <button onClick={() => exportToPdf(tableId, title)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Xuất PDF">\n          <FileIcon size={13} />\n        </button>\n      </div>\n      <table id={tableId} className="w-full border-collapse text-xs">`;

    intl = intl.replace(caTarget1, caReplace1);
    // Also append </div> to CompactAccordionTable return block
    // The simplest way to reliably add </div> is to match the exact closing of that component
    const caTarget2 = `          </tr>\n        )}\n      </tbody>\n    </table>\n  );\n};`;
    const caReplace2 = `          </tr>\n        )}\n      </tbody>\n    </table>\n    </div>\n  );\n};`;
    intl = intl.replace(caTarget2, caReplace2);

    fs.writeFileSync(intlPath, intl, 'utf8');
    console.log("Patched InternationalPricingPage successfully with CRLF awareness!");
} else {
    console.log("InternationalPricingPage is already patched!");
}
