import { useMemo, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import GlobalCalculator from "@/components/pricing/GlobalCalculator";
import TabNavigation from "@/components/pricing/TabNavigation";
import LineSection from "@/components/pricing/LineSection";
import AlertBadge from "@/components/pricing/AlertBadge";
import HighlightableTable from "@/components/pricing/HighlightableTable";
import BulkTable from "@/components/pricing/BulkTable";
import ExtrasSection from "@/components/pricing/ExtrasSection";
import { usePricingStore, PricingProvider } from "@/stores/usePricingStore";
import { generateTableData } from "@/data/pricingHelpers";
import { pricingData } from "@/data/pricingData";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const PricingContent = () => {
  const store = usePricingStore();
  const [subTab, setSubTab] = useState<string>("standard");

  // Force reset sub-tab when user switches main tabs 
  useEffect(() => {
    if (store.activeMainTab === "tiktok") setSubTab("ttCnUsNormal");
    else if (store.activeMainTab === "usps") setSubTab("uspsCn");
    else setSubTab("standard");
  }, [store.origin, store.activeMainTab]);

  const effectiveSubTab = subTab;

  const tableData = useMemo(
    () => generateTableData(store.origin, effectiveSubTab as "standard" | "cosmetics" | "battery"),
    [store.origin, effectiveSubTab]
  );

  const originLabel = store.origin === "vn" ? "VIỆT NAM" : "CHINA";
  const tableTitle = (() => {
    const prefix = store.origin.toUpperCase();
    switch (effectiveSubTab) {
      case "standard":
        return `HÀNG THƯỜNG + TM ${prefix} → TOÀN CẦU`;
      case "cosmetics":
        return `MỸ PHẨM (EXPRESS) ${prefix} → TOÀN CẦU`;
      case "battery":
        return `PIN ĐIỆN (LUỒN) ${prefix} → TOÀN CẦU`;
      default:
        return "";
    }
  })();

  const subTabClass = (isActive: boolean) =>
    `px-5 py-2.5 rounded-lg text-sm font-bold transition-all border ${isActive
      ? "bg-primary text-primary-foreground border-primary shadow-md"
      : "bg-secondary text-muted-foreground border-border hover:border-primary/50"
    }`;

  const renderTabContent = () => {
    switch (store.activeMainTab) {
      case "vn":
      case "cn":
        return (
          <div>
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight mb-3">
                {store.origin.toUpperCase()} VẬN CHUYỂN TỪ {originLabel}
              </h2>
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary border border-border text-muted-foreground">
                  ⏱ 5-12 bsd
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
                  🚀 Yun Express
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 border border-destructive/20 text-destructive">
                  📋 Phí xử lý: $0.7/đơn
                </span>
              </div>

              {/* Sub-tab toggle buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setSubTab("cosmetics")}
                  className={subTabClass(effectiveSubTab === "cosmetics")}
                >
                  🧴 Mỹ Phẩm (Express)
                </button>
                <button
                  onClick={() => setSubTab("standard")}
                  className={subTabClass(effectiveSubTab === "standard")}
                >
                  📦 Hàng Thường + TM
                </button>
                {/* Battery sub-tab only for CN */}
                {store.origin === "cn" && (
                  <button
                    onClick={() => setSubTab("battery")}
                    className={subTabClass(effectiveSubTab === "battery")}
                  >
                    🔋 Pin Điện (Luồn)
                  </button>
                )}
              </div>
            </div>

            {/* Table Section */}
            <LineSection
              id={effectiveSubTab === "standard" ? "hang-thuong" : effectiveSubTab === "cosmetics" ? "epacket" : "pin-dien"}
              title={tableTitle}
              badges={
                effectiveSubTab === "standard" ? (
                  <>
                    <AlertBadge type="success">Phổ biến nhất</AlertBadge>
                    <AlertBadge type="info">Hàng cơ bản</AlertBadge>
                  </>
                ) : effectiveSubTab === "cosmetics" ? (
                  <AlertBadge type="warning" icon="⚡">Tối ưu {"<"} 2KG</AlertBadge>
                ) : (
                  <>
                    <AlertBadge type="error" icon="🔋">Sản phẩm chứa Pin</AlertBadge>
                    <AlertBadge type="info">Chỉ CN</AlertBadge>
                  </>
                )
              }
            >
              <HighlightableTable
                columns={tableData.columns}
                data={tableData.data}
              />
            </LineSection>
          </div>
        );

      case "tiktok":
        return (
          <LineSection
            id="tiktok"
            title="🎵 Line TikTok Shop Dedicated"
            description="Hỗ trợ xử lý chuẩn Policy TikTok US/UK/DE. Cam kết Active Tracking trong 48h, đồng bộ API trực tiếp bảo vệ cấp độ Shop."
            badges={
              <>
                <AlertBadge type="error">Bảo vệ Shop</AlertBadge>
                <AlertBadge type="info">API Real-time</AlertBadge>
              </>
            }
          >
            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={() => setSubTab("ttCnUsNormal")} className={subTabClass(subTab === "ttCnUsNormal")}>🇺🇸 CN → US (Thường)</button>
              <button onClick={() => setSubTab("ttCnUsSpecial")} className={subTabClass(subTab === "ttCnUsSpecial")}>🇺🇸 CN → US (Đặc Biệt)</button>
              <button onClick={() => setSubTab("ttCnUk")} className={subTabClass(subTab === "ttCnUk")}>🇬🇧 CN → UK</button>
              <button onClick={() => setSubTab("ttCnDe")} className={subTabClass(subTab === "ttCnDe")}>🇩🇪 CN → DE</button>
              <button onClick={() => setSubTab("ttVnUs_seller")} className={subTabClass(subTab === "ttVnUs_seller")}>🇻🇳 VN → US (Seller)</button>
              <button onClick={() => setSubTab("ttVnUs_tiktok")} className={subTabClass(subTab === "ttVnUs_tiktok")}>🇻🇳 VN → US (TikTok)</button>
            </div>

            {subTab === "ttCnUsNormal" && <HighlightableTable columns={[{ key: 'rate', label: 'Cước CN → US (Thường)' }]} data={(pricingData as any).tiktokCnUsNormal} />}
            {subTab === "ttCnUsSpecial" && <HighlightableTable columns={[{ key: 'rate', label: 'Cước CN → US (Đặc Biệt)' }]} data={(pricingData as any).tiktokCnUsSpecial} />}
            {subTab === "ttCnUk" && <HighlightableTable columns={[{ key: 'rate', label: 'Cước CN → UK' }]} data={(pricingData as any).tiktokCnUk} />}
            {subTab === "ttCnDe" && <HighlightableTable columns={[{ key: 'rate', label: 'Cước CN → DE' }]} data={(pricingData as any).tiktokCnDe} />}
            {subTab === "ttVnUs_seller" && <HighlightableTable columns={[{ key: 'rate', label: 'Cước VN → US (Ship by Seller)' }]} data={(pricingData as any).tiktokVnSeller} />}
            {subTab === "ttVnUs_tiktok" && <HighlightableTable columns={[{ key: 'rate', label: 'Cước VN → US (Ship by TikTok)' }]} data={(pricingData as any).tiktokVnTiktok} />}
          </LineSection>
        );

      case "lo":
        return (
          <LineSection
            id="hang-lo"
            title="🏭 Hàng Lô & Sỉ (Bulk)"
            description="Dành cho các lô hàng lớn gửi FBA hoặc sỉ (> 21kg). Có thể đi Sea siêu tiết kiệm hoặc Air tốc hành."
            badges={
              <>
                <AlertBadge type="gold">Tối ưu cước / KG</AlertBadge>
                <AlertBadge type="warning">Yêu cầu {">"} 12KG</AlertBadge>
              </>
            }
          >
            <div className="space-y-6">
              <BulkTable title="🛒 Hàng Lô Sản Phẩm Thường" data={(pricingData as any).loThuong} />
              <BulkTable title="🔋 Hàng Lô Sản Phẩm Pin Điện" data={(pricingData as any).loPin} />
              <BulkTable title="💧 Hàng Lô Dung Dịch & Mỹ Phẩm" data={(pricingData as any).loMypham} />
            </div>
          </LineSection>
        );

      case "usps":
        return (
          <LineSection
            id="usps"
            title="✉️ Priority USPS Active"
            description="Tuyến ưu tiên Mỹ sử dụng hạ tầng bưu điện Hoa Kỳ (USPS). Nhận diện nội địa, bao thuế nhập khẩu."
            badges={
              <AlertBadge type="info" icon="🇺🇸">US Only - Bao Thuế 100%</AlertBadge>
            }
          >
            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={() => setSubTab("uspsCn")} className={subTabClass(subTab === "uspsCn")}>🇨🇳 China → US</button>
              <button onClick={() => setSubTab("uspsVn")} className={subTabClass(subTab === "uspsVn")}>🇻🇳 Vietnam → US</button>
            </div>

            {subTab === "uspsCn" || subTab === "standard" ? (
              <HighlightableTable columns={[{ key: 'rate', label: 'Cước CN → US' }]} data={(pricingData as any).uspsCn} />
            ) : (
              <HighlightableTable columns={[{ key: 'rate', label: 'Cước VN → US' }]} data={(pricingData as any).uspsVn} />
            )}

            <div className="mt-8 p-12 text-center bg-secondary/30 border-t border-border/30 rounded-xl">
              <div className="text-5xl mb-4">🦅</div>
              <p className="text-lg font-bold text-foreground mb-2">
                Tuyến USPS Priority thay đổi cước liên tục theo ngày.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Vui lòng tra cứu trực tiếp bằng Tool Báo Giá Tự Động trong App Quản Lý Đơn THG.
              </p>
              <Button className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-xl shadow-lg font-bold px-8 py-3">
                <ExternalLink className="w-4 h-4 mr-2" />
                Truy Cập App
              </Button>
            </div>
          </LineSection>
        );

      case "extras":
        return <ExtrasSection />;

      default:
        return null;
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              Bảng Giá Quốc Tế
            </span>
            <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              Tra cứu cước{" "}
              <span className="text-gradient-gold">vận chuyển quốc tế</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Bảng giá minh bạch, cập nhật real-time cho tất cả tuyến vận chuyển từ Việt Nam & Trung Quốc.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Calculator */}
      <div className="container mx-auto px-4">
        <GlobalCalculator />
      </div>

      {/* Tabs + Content */}
      <div className="container mx-auto px-4 mt-8">
        <TabNavigation />
        <div className="space-y-6 py-6">{renderTabContent()}</div>
      </div>
    </>
  );
};

const InternationalPricingPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <PricingProvider>
      <PricingContent />
    </PricingProvider>
    <Footer />
  </div>
);

export default InternationalPricingPage;
