const fs = require('fs');
const path = require('path');

// 1. Revert CSS
const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/font-family: "Times New Roman", Times, serif !important;/g, '');
css = css.replace(/font-size: 13px !important;/g, '');
css = css.replace(/font-family: "Times New Roman", Times, serif;/g, '');

fs.writeFileSync(cssPath, css, 'utf8');
console.log("Reverted global fonts in index.css");

// 2. Remove font-serif from InternationalPricingPage
const intlPath = path.join(__dirname, 'src', 'pages', 'InternationalPricingPage.tsx');
let intl = fs.readFileSync(intlPath, 'utf8');

intl = intl.replace(/className="w-full border-collapse font-serif/g, 'className="w-full border-collapse');

// Fix the [object Object] bug
// The issue is badge={\`\${ROUTES[tab as EpacketRoute].name} · \${CARGO_LABELS[cargo]}\`}
// It should be badge={<>{ROUTES[tab as EpacketRoute].name} · {CARGO_LABELS[cargo]}</>}
const badgeTarget = 'badge={`${ROUTES[tab as EpacketRoute].name} · ${CARGO_LABELS[cargo]}`}';
const badgeReplace = 'badge={<div className="flex items-center gap-1">{ROUTES[tab as EpacketRoute].name} <span>·</span> <span>{CARGO_LABELS[cargo]}</span></div>}';

intl = intl.replace(badgeTarget, badgeReplace);

// Also change the type of badge string to React.ReactNode in PriceTable, BulkDataTable
const ptType = 'title: string; badge?: string; note?: string;';
const ptTypeRep = 'title: string; badge?: React.ReactNode; note?: React.ReactNode;';
intl = intl.replace(ptType, ptTypeRep);

const blkType = 'const BulkDataTable = ({ title, badge, data }: { title: string; badge: string; data: any[] }) => {';
const blkTypeRep = 'const BulkDataTable = ({ title, badge, data }: { title: string; badge: React.ReactNode; data: any[] }) => {';
intl = intl.replace(blkType, blkTypeRep);

fs.writeFileSync(intlPath, intl, 'utf8');
console.log("Removed font-serif and fixed Object rendering in InternationalPricingPage");

// 3. Remove font-serif from DomesticPricingPage
const domPath = path.join(__dirname, 'src', 'pages', 'DomesticPricingPage.tsx');
let dom = fs.readFileSync(domPath, 'utf8');

dom = dom.replace(/className="w-full text-\[13px\] font-serif/g, 'className="w-full text-[13px]');

fs.writeFileSync(domPath, dom, 'utf8');
console.log("Removed font-serif from DomesticPricingPage");
