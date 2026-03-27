import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import GlobalCalculator from "@/components/pricing/GlobalCalculator";
import TabNavigation from "@/components/pricing/TabNavigation";
import LineSection from "@/components/pricing/LineSection";
import AlertBadge from "@/components/pricing/AlertBadge";
import TooltipIcon from "@/components/pricing/TooltipIcon";
import HighlightableTable from "@/components/pricing/HighlightableTable";
import BulkTable from "@/components/pricing/BulkTable";
import { usePricingStore, PricingProvider } from "@/stores/usePricingStore";
import {
  vnStandard, vnCosmetics, cnStandard, cnCosmetics,
  tiktokVN_UK, tiktokCN, bulkVN, bulkCN, countryNames,
} from "@/data/pricingData";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const PricingContent = () => {
  const store = usePricingStore();

  const standardData = useMemo(() => {
    const raw = store.origin === "vn" ? vnStandard : cnStandard;
    const keys = Object.keys(raw[0]).filter((k) => k !== "kg");
    const columns = keys.map((k) => ({ key: k, label: countryNames[k] || k.toUpperCase() }));
    return { columns, data: raw };
  }, [store.origin]);

  const cosmeticsData = useMemo(() => {
    const raw = store.origin === "vn" ? vnCosmetics : cnCosmetics;
    const keys = Object.keys(raw[0]).filter((k) => k !== "kg");
    const columns = keys.map((k) => ({ key: k, label: countryNames[k] || k.toUpperCase() }));
    return { columns, data: raw };
  }, [store.origin]);

  const tiktokData = useMemo(() => {
    if (store.origin === "cn") {
      const keys = Object.keys(tiktokCN[0]).filter((k) => k !== "kg");
      return { columns: keys.map((k) => ({ key: k, label: countryNames[k] || k.toUpperCase() })), data: tiktokCN };
    }
    return { columns: [{ key: "uk", label: "Anh (UK)" }], data: tiktokVN_UK };
  }, [store.origin]);

  const bulkData = useMemo(() => {
    return store.origin === "cn" ? bulkCN : bulkVN;
  }, [store.origin]);

  const renderTabContent = () => {
    switch (store.activeMainTab) {
      case "vn":
      case "cn":
        return (
          <>
            <LineSection
              id="hang-thuong"
              title="📦 Hàng Thường (Standard)"
              description="Line vận chuyển phổ biến nhất dành cho các mặt hàng thông thường (quần áo, đồ gia dụng nhỏ). Cước phí cân bằng và tốc độ ổn định."
              badges={
                <>
                  <AlertBadge type="success">Phổ biến nhất</AlertBadge>
                  <AlertBadge type="info">Hàng cơ bản</AlertBadge>
                </>
              }
            >
              <HighlightableTable columns={standardData.columns} data={standardData.data} />
            </LineSection>

            <LineSection
              id="epacket"
              title="✈️ ePacket Premium"
              description="Giải pháp tiết kiệm tối đa dành cho các kiện hàng nhỏ nhẹ (dưới 2kg). Cước phí cực kỳ hợp lý với tracking E2E."
              badges={
                <>
                  <AlertBadge type="warning" icon="⚡">Tối ưu {"<"} 2KG</AlertBadge>
                  <TooltipIcon text="Phù hợp gửi phụ kiện, trang sức nhẹ" />
                </>
              }
            >
              <HighlightableTable columns={cosmeticsData.columns} data={cosmeticsData.data} />
            </LineSection>
          </>
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
            <HighlightableTable columns={tiktokData.columns} data={tiktokData.data} />
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
            <BulkTable data={bulkData} />
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
            <div className="p-12 text-center bg-secondary/30 border-t border-border/30">
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
