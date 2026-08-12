import type { DiscoveryData } from "./discovery-wizard";

interface Props {
  data: DiscoveryData;
  formNode: React.ReactNode;
}

export function SalesBriefSummary({ data, formNode }: Readonly<Props>) {
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Dossier Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-thg-goldBg border border-yellow-300 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-thg-gold rounded-full animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-thg-gold">
            Profile Ready
          </span>
        </div>
        <h2 className="text-3xl font-sans tracking-tight font-bold text-thg-textMain mb-2">
          Kế hoạch vận hành của bạn đã sẵn sàng
        </h2>
        <p className="text-thg-textMuted text-sm">
          Dựa trên thông tin bạn cung cấp, đội ngũ vận hành THG sẽ thiết kế bảng giá và SLA riêng biệt. Vui lòng để lại thông tin liên hệ để nhận kế hoạch.
        </p>
      </div>

      {/* Dossier Data Card */}
      <div className="bg-thg-bg border border-thg-border rounded-xl p-6 mb-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-thg-gold/50 to-transparent opacity-50" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-thg-textMuted/60">
              Quy mô hiện tại
            </span>
            <span className="text-sm font-semibold text-thg-textMain">
              {data.scale}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-thg-textMuted/60">
              Thị trường mục tiêu
            </span>
            <span className="text-sm font-semibold text-thg-textMain">
              {data.route.join(", ")}
            </span>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-thg-textMuted/60">
              Ngành hàng
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {data.category.map((c) => (
                <span key={c} className="px-2 py-0.5 text-[10px] bg-white border border-thg-border rounded text-thg-textMuted shadow-sm">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-thg-textMuted/60">
              Vấn đề cốt lõi cần giải quyết
            </span>
            <ul className="list-disc list-inside text-sm text-thg-gold mt-1 space-y-1">
              {data.pain.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Lead Form Slot */}
      <div className="bg-white border border-thg-border rounded-xl p-6 flex-1 shadow-sm">
        {formNode}
      </div>

    </div>
  );
}
