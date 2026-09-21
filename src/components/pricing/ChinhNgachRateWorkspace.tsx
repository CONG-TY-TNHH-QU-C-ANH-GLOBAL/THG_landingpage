import { useState, type ReactNode } from "react";
import { Calculator, FileQuestion, Plane, ReceiptText, Ship } from "lucide-react";

export type FormalRateLane = "matson" | "sea" | "air" | "customs";
type WorkspaceView = "rates" | "guide" | "estimate";

export interface FormalRateWorkspaceCopy {
  rateTab: string;
  guideTab: string;
  estimateTab: string;
  laneLabel: string;
  matson: string;
  matsonHint: string;
  sea: string;
  seaHint: string;
  air: string;
  airHint: string;
  customs: string;
  customsHint: string;
}

const DEFAULT_COPY: FormalRateWorkspaceCopy = {
  rateTab: "Bảng giá",
  guideTab: "Hướng dẫn đọc bảng giá",
  estimateTab: "Dự toán chi phí",
  laneLabel: "Chọn tuyến hoặc loại dịch vụ",
  matson: "MATSON — Line hỏa tốc",
  matsonHint: "17–18 ngày · đi Long Beach",
  sea: "Sea chính ngạch thường",
  seaHint: "LCL và nguyên container",
  air: "Air chính ngạch",
  airHint: "Theo hãng bay và mức cân",
  customs: "Hải quan xuất VN",
  customsHint: "Luồng xanh, vàng và đỏ",
};

const VIEW_ICONS = { rates: Ship, guide: FileQuestion, estimate: Calculator } as const;
const LANE_ICONS = { matson: Ship, sea: Ship, air: Plane, customs: ReceiptText } as const;

export function ChinhNgachRateWorkspace({
  copy: copyOverride,
  rates,
  notice,
  guide,
  estimator,
}: Readonly<{
  copy?: Partial<FormalRateWorkspaceCopy>;
  rates?: Partial<Record<FormalRateLane, ReactNode>>;
  notice?: ReactNode;
  guide?: ReactNode;
  estimator?: ReactNode;
}>) {
  const copy = { ...DEFAULT_COPY, ...copyOverride };
  const [view, setView] = useState<WorkspaceView>("rates");
  const [lane, setLane] = useState<FormalRateLane>("matson");

  const views = [
    { id: "rates" as const, label: copy.rateTab },
    { id: "guide" as const, label: copy.guideTab },
    { id: "estimate" as const, label: copy.estimateTab },
  ];
  const lanes = [
    { id: "matson" as const, label: copy.matson, hint: copy.matsonHint },
    { id: "sea" as const, label: copy.sea, hint: copy.seaHint },
    { id: "air" as const, label: copy.air, hint: copy.airHint },
    { id: "customs" as const, label: copy.customs, hint: copy.customsHint },
  ];

  return (
    <section className="rounded-2xl border border-[var(--pricing-border)] bg-[#F7F4ED] p-3 shadow-sm sm:p-5">
      <div role="tablist" aria-label="Pricing tools" className="flex flex-wrap gap-2 border-b border-navy/10 pb-4">
        {views.map(({ id, label }) => {
          const Icon = VIEW_ICONS[id];
          const active = view === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`formal-panel-${id}`}
              id={`formal-tab-${id}`}
              onClick={() => setView(id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3.5 py-2 text-[13px] font-bold transition-colors sm:px-4 ${
                active
                  ? "border-navy bg-navy text-white shadow-md"
                  : "border-[var(--pricing-border)] bg-white text-foreground/70 hover:border-primary/60 hover:bg-[#FFFBF0] hover:text-navy"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>

      {view === "rates" && (
        <div role="tabpanel" aria-label={copy.rateTab} id="formal-panel-rates" aria-labelledby="formal-tab-rates" className="pt-5">
          {notice}
          <p className="mb-2 mt-5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
            {copy.laneLabel}
          </p>
          <div role="tablist" aria-label={copy.laneLabel} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {lanes.map(({ id, label, hint }) => {
              const Icon = LANE_ICONS[id];
              const active = lane === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setLane(id)}
                  className={`group min-h-[78px] rounded-xl border p-3 text-left transition-all ${
                    active
                      ? "border-navy bg-navy text-white shadow-lg"
                      : "border-[var(--pricing-border)] bg-white text-navy hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md"
                  }`}
                >
                  <span className="flex items-start gap-2.5">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${active ? "bg-primary text-navy" : "bg-primary/10 text-primary"}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[13px] font-extrabold leading-tight">{label}</span>
                      <span className={`mt-1 block text-[11px] leading-snug ${active ? "text-white/65" : "text-muted-foreground"}`}>{hint}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <div role="region" aria-label={lanes.find((item) => item.id === lane)?.label} className="mt-5">
            {rates?.[lane] ?? <p className="rounded-xl bg-white p-5 text-sm text-muted-foreground">{lanes.find((item) => item.id === lane)?.label}</p>}
          </div>
        </div>
      )}

      {view === "guide" && (
        <div role="tabpanel" aria-label={copy.guideTab} id="formal-panel-guide" aria-labelledby="formal-tab-guide" className="pt-5">
          {guide ?? <p className="rounded-xl bg-white p-5 text-sm text-navy">LCL và FCL được giải thích theo từng bước.</p>}
        </div>
      )}

      {view === "estimate" && (
        <div role="tabpanel" aria-label={copy.estimateTab} id="formal-panel-estimate" aria-labelledby="formal-tab-estimate" className="pt-5">
          {estimator ?? <p className="rounded-xl bg-white p-5 text-sm text-navy">Thông tin lô hàng</p>}
        </div>
      )}
    </section>
  );
}
