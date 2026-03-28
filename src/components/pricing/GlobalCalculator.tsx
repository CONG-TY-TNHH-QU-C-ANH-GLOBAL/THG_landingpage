import { useState } from "react";
import { usePricingStore } from "@/stores/usePricingStore";
import { Search, Plane, Scale } from "lucide-react";
import { countryNames } from "@/data/PricingDatabase";
import { generateTableData } from "@/data/pricingHelpers";
import { Button } from "@/components/ui/button";

const destinations = [
  { value: "all", label: "🌍 Tất Cả Quốc Gia" },
  { value: "us", label: "🇺🇸 Mỹ (US)" },
  { value: "uk", label: "🇬🇧 Anh (UK)" },
  { value: "de", label: "🇩🇪 Đức (DE)" },
  { value: "fr", label: "🇫🇷 Pháp (FR)" },
  { value: "ca", label: "🇨🇦 Canada (CA)" },
  { value: "au", label: "🇦🇺 Úc (AU)" },
  { value: "hk", label: "🇭🇰 Hồng Kông (HK)" },
  { value: "sg", label: "🇸🇬 Singapore (SG)" },
  { value: "br", label: "🇧🇷 Brazil (BR)" },
  { value: "mx", label: "🇲🇽 Mexico (MX)" },
  { value: "ae", label: "🇦🇪 UAE (AE)" },
];

const GlobalCalculator = () => {
  const store = usePricingStore();
  const [localOrigin, setLocalOrigin] = useState(store.origin);
  const [localDest, setLocalDest] = useState(store.destination);
  const [localItemType, setLocalItemType] = useState(store.itemType);
  const [localWeight, setLocalWeight] = useState<number | null>(null);
  const [quoteResult, setQuoteResult] = useState<{
    mappedWeight?: number;
    price?: number;
    type?: string;
    error?: boolean;
  } | null>(null);

  const triggerSearch = () => {
    store.updateGlobalQuery(localWeight, localOrigin, localDest, localItemType);

    if (!localWeight || localDest === "all") {
      setQuoteResult(null);
      return;
    }

    // Map itemType to category
    const category = localItemType === "cosmetic" ? "cosmetics" : localItemType === "battery" ? "battery" : "standard";
    const typeStr = localItemType === "cosmetic" ? "Mỹ Phẩm" : localItemType === "battery" ? "Pin Điện" : "Thường";

    const { data } = generateTableData(localOrigin, category as "standard" | "cosmetics" | "battery");
    const destKey = localDest.toLowerCase();

    // Find closest weight match
    let matchRow = null;
    for (const row of data) {
      if (row.kg >= localWeight) {
        matchRow = row;
        break;
      }
    }

    if (matchRow && matchRow[destKey] != null) {
      setQuoteResult({ mappedWeight: matchRow.kg, price: matchRow[destKey], type: typeStr });
    } else {
      setQuoteResult({ error: true });
    }
  };

  const originName = localOrigin === "vn" ? "Việt Nam" : "Trung Quốc";
  const destName = (countryNames as Record<string, string>)[localDest.toUpperCase()] || "Quốc Tế";

  return (
    <div>
      <div className="glass-card rounded-2xl p-5 lg:p-6 flex flex-wrap gap-4 items-end relative z-10 -mt-8 mx-4 lg:mx-0">
        <div className="flex-1 min-w-[130px]">
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Gửi Từ</label>
          <select
            value={localOrigin}
            onChange={(e) => {
              setLocalOrigin(e.target.value as "vn" | "cn");
              if (e.target.value === "vn" && localItemType === "battery") setLocalItemType("normal");
            }}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 outline-none focus:border-primary text-foreground text-sm"
          >
            <option value="vn">Việt Nam 🇻🇳</option>
            <option value="cn">Trung Quốc 🇨🇳</option>
          </select>
        </div>

        <div className="flex-1 min-w-[130px]">
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Giao Đến</label>
          <select
            value={localDest}
            onChange={(e) => setLocalDest(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 outline-none focus:border-primary text-foreground text-sm"
          >
            {destinations.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[130px]">
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Loại Hàng</label>
          <select
            value={localItemType}
            onChange={(e) => setLocalItemType(e.target.value as "normal" | "cosmetic" | "battery")}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 outline-none focus:border-primary text-foreground text-sm"
          >
            <option value="normal">📦 Hàng Thường</option>
            <option value="cosmetic">💄 Mỹ Phẩm</option>
            {localOrigin === "cn" && <option value="battery">🔋 Pin Điện</option>}
          </select>
        </div>

        <div className="flex-1 min-w-[110px]">
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Tiền Tệ</label>
          <select
            value={store.currency}
            onChange={(e) => store.setCurrency(e.target.value as "USD" | "VND" | "CNY")}
            className="w-full bg-gold/10 border border-gold text-foreground font-bold rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-gold text-sm notranslate"
            translate="no"
          >
            <option value="USD">🇺🇸 USD – Đô la Mỹ</option>
            <option value="VND">🇻🇳 VND – Việt Nam Đồng</option>
            <option value="CNY">🇨🇳 CNY – Nhân Dân Tệ</option>
          </select>
        </div>

        <div className="flex-1 min-w-[110px]">
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Cân nặng (KG)</label>
          <input
            type="number"
            value={localWeight ?? ""}
            onChange={(e) => setLocalWeight(e.target.value ? Number(e.target.value) : null)}
            step={0.1}
            placeholder="Vd: 1.5"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 outline-none focus:border-primary text-foreground text-sm"
          />
        </div>

        <Button
          onClick={triggerSearch}
          className="bg-primary hover:bg-gold-dark text-primary-foreground font-extrabold px-6 lg:px-8 py-2.5 rounded-lg uppercase tracking-wide h-[42px]"
        >
          <Search className="w-4 h-4 mr-2" />
          Tra Cứu
        </Button>
      </div>

      {quoteResult && (
        <div className="px-4 lg:px-0 mt-4 mb-8 relative z-0 animate-fade-in">
          {quoteResult.error ? (
            <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-xl text-destructive text-center">
              <span className="font-bold">⚠️ Tuyến đường này không hỗ trợ mức cân nặng {localWeight} KG.</span>
            </div>
          ) : (
            <div className="bg-gradient-dark rounded-2xl p-6 lg:p-8 text-primary-foreground border border-primary/20 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                    Kết Quả Ước Tính
                  </span>
                  <span className="text-primary-foreground/60 text-sm">Hàng {quoteResult.type}</span>
                </div>
                <h3 className="text-3xl font-extrabold tracking-wide flex items-center gap-2">
                  {originName}
                  <Plane className="w-6 h-6 text-primary" />
                  {destName}
                </h3>
                <p className="text-primary/70 mt-2 flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Trọng lượng tính cước: <strong>{quoteResult.mappedWeight} KG</strong>
                </p>
              </div>
              <div className="md:text-right flex flex-col items-center md:items-end bg-primary-foreground/10 px-8 py-5 rounded-xl border border-primary-foreground/20">
                <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-widest mb-1">Cước Cơ Bản</p>
                <p className="text-4xl lg:text-5xl font-black text-primary drop-shadow-md notranslate" translate="no">
                  {store.formatPrice(quoteResult.price!)}
                </p>
                <p className="text-xs text-primary-foreground/50 mt-2 italic">*Chưa tính phụ phí vùng sâu & VAT (nếu có)</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalCalculator;
