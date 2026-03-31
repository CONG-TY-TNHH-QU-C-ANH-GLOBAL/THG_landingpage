const fs = require('fs');
const path = require('path');

// --- Patch Domestic Pricing Page ---
const domesticPath = path.join(__dirname, 'src', 'pages', 'DomesticPricingPage.tsx');
let domestic = fs.readFileSync(domesticPath, 'utf8');

// 1. Add imports
if (!domestic.includes('exportToExcel')) {
    domestic = domestic.replace(
        /import { Anchor,(.+?)Zap } from "lucide-react";/,
        `import { Anchor,$1Zap, FileSpreadsheet, FileText, FileIcon } from "lucide-react";\nimport { exportToExcel, exportToPdf, exportToWord } from "@/lib/exportUtils";`
    );

    // 2. Add buttons and ID
    const domesticTarget = `{domesticPricingRows.length} mốc trọng lượng
                                </span>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto" >
                            <table className="w-full text-sm min-w-[500px] whitespace-nowrap">`;

    const domesticReplace = `{domesticPricingRows.length} mốc trọng lượng
                                </span>
                                <div className="flex items-center gap-1.5 ml-2">
                                  <button onClick={() => exportToExcel('domestic-pricing-table', 'THG_Domestic_Pricing')} className="p-1.5 bg-secondary hover:bg-primary/20 rounded-md text-primary transition-colors" title="Export Excel">
                                    <FileSpreadsheet size={16} />
                                  </button>
                                  <button onClick={() => exportToWord('domestic-pricing-table', 'THG_Domestic_Pricing')} className="p-1.5 bg-secondary hover:bg-primary/20 rounded-md text-primary transition-colors" title="Export Word">
                                    <FileText size={16} />
                                  </button>
                                  <button onClick={() => exportToPdf('domestic-pricing-table', 'THG_Domestic_Pricing')} className="p-1.5 bg-secondary hover:bg-primary/20 rounded-md text-primary transition-colors" title="Export PDF">
                                    <FileIcon size={16} />
                                  </button>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto" >
                            <table id="domestic-pricing-table" className="w-full text-sm min-w-[500px] whitespace-nowrap">`;

    domestic = domestic.replace(domesticTarget, domesticReplace);
    fs.writeFileSync(domesticPath, domestic, 'utf8');
    console.log("Patched DomesticPricingPage");
}


// --- Patch International Pricing Page ---
const intlPath = path.join(__dirname, 'src', 'pages', 'InternationalPricingPage.tsx');
let intl = fs.readFileSync(intlPath, 'utf8');

if (!intl.includes('exportToExcel')) {
    // 1. Add imports
    intl = intl.replace(
        `import { ChevronDown, ChevronUp, Search, ExternalLink } from "lucide-react";`,
        `import { ChevronDown, ChevronUp, Search, ExternalLink, FileSpreadsheet, FileText, FileIcon } from "lucide-react";\nimport { exportToExcel, exportToPdf, exportToWord } from "@/lib/exportUtils";`
    );

    // 2. Patch PriceTable
    const ptTarget1 = `const PriceTable = ({ title, badge, note, data, columns }: {
  title: string; badge?: string; note?: string;
  data: any[]; columns: { key: string; label: string }[];
}) => {
  const { tVi } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  if (!data || data.length === 0) return null;`;

    const ptReplace1 = `const PriceTable = ({ title, badge, note, data, columns }: {
  title: string; badge?: string; note?: string;
  data: any[]; columns: { key: string; label: string }[];
}) => {
  const { tVi } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const tableId = useMemo(() => "table-price-" + Math.random().toString(36).substring(2, 9), []);
  if (!data || data.length === 0) return null;`;

    intl = intl.replace(ptTarget1, ptReplace1);

    const ptTarget2 = `        {note && <span className="text-[#9CA3AF] text-[10px]">{note}</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">`;

    const ptReplace2 = `        <div className="flex items-center gap-2 ml-auto">
          {note && <span className="text-[#9CA3AF] text-[10px] mr-2">{note}</span>}
          <button onClick={() => exportToExcel(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Export Excel">
            <FileSpreadsheet size={14} />
          </button>
          <button onClick={() => exportToWord(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Export Word">
            <FileText size={14} />
          </button>
          <button onClick={() => exportToPdf(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Export PDF">
            <FileIcon size={14} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table id={tableId} className="w-full border-collapse text-xs">`;

    intl = intl.replace(ptTarget2, ptReplace2);

    // 3. Patch BulkDataTable
    const bulkTarget1 = `const BulkDataTable = ({ title, badge, data }: { title: string; badge: string; data: any[] }) => {
  const { tVi } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  if (!data || data.length === 0) return null;`;

    const bulkReplace1 = `const BulkDataTable = ({ title, badge, data }: { title: string; badge: string; data: any[] }) => {
  const { tVi } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const tableId = useMemo(() => "table-bulk-" + Math.random().toString(36).substring(2, 9), []);
  if (!data || data.length === 0) return null;`;

    intl = intl.replace(bulkTarget1, bulkReplace1);

    const bulkTarget2 = `          {title}
          <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">`;

    const bulkReplace2 = `          {title}
          <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          <button onClick={() => exportToExcel(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Export Excel">
            <FileSpreadsheet size={14} />
          </button>
          <button onClick={() => exportToWord(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Export Word">
            <FileText size={14} />
          </button>
          <button onClick={() => exportToPdf(tableId, title)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Export PDF">
            <FileIcon size={14} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table id={tableId} className="w-full border-collapse text-xs">`;

    intl = intl.replace(bulkTarget2, bulkReplace2);

    // 4. Patch CompactAccordionTable
    const caTarget1 = `const CompactAccordionTable = ({ headers, data, renderRow }: { headers: string[], data: any[], renderRow: (row: any, i: number) => React.ReactNode }) => {
  const { tVi } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  if (!data || data.length === 0) return null;
  const displayData = isExpanded ? data : data.slice(0, 6);

  return (
    <table className="w-full border-collapse text-xs">`;

    const caReplace1 = `const CompactAccordionTable = ({ headers, data, renderRow, title = "Data Table" }: { headers: string[], data: any[], renderRow: (row: any, i: number) => React.ReactNode, title?: string }) => {
  const { tVi } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const tableId = useMemo(() => "table-compact-" + Math.random().toString(36).substring(2, 9), []);
  if (!data || data.length === 0) return null;
  const displayData = isExpanded ? data : data.slice(0, 6);

  return (
    <div className="relative">
      <div className="absolute top-[-36px] right-0 flex items-center gap-1">
        <button onClick={() => exportToExcel(tableId, title)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Export Excel">
          <FileSpreadsheet size={13} />
        </button>
        <button onClick={() => exportToWord(tableId, title)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Export Word">
          <FileText size={13} />
        </button>
        <button onClick={() => exportToPdf(tableId, title)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Export PDF">
          <FileIcon size={13} />
        </button>
      </div>
      <table id={tableId} className="w-full border-collapse text-xs">`;

    intl = intl.replace(caTarget1, caReplace1);
    // Also append </div> to CompactAccordionTable return
    intl = intl.replace(`    </table>\n  );\n};`, `    </table>\n    </div>\n  );\n};`);

    fs.writeFileSync(intlPath, intl, 'utf8');
    console.log("Patched InternationalPricingPage");
}
