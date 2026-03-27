import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroGlobe from "@/assets/hero-globe.png";

const features = [
  "Tìm kiếm nguồn hàng",
  "Cung cấp sản phẩm POD",
  "Quản lý kho bãi",
  "Vận chuyển toàn cầu US, UK, EU",
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-medium text-muted-foreground tracking-wide uppercase text-xs">
              Ưu đãi 15% cho 50 đơn đầu tiên
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.1] text-navy">
            Đối tác{" "}
            <span className="text-primary italic">Fulfillment</span>
            <br />
            toàn cầu cho
            <br />
            <span className="text-primary italic">eCommerce Seller</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            Hệ sinh thái Fulfillment toàn diện, kết nối liền mạch
            <br />
            từ Việt Nam – Trung Quốc – đến tận kho Mỹ.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground/80">{f}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Button className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-full px-8 py-6 text-base gap-2">
              Đăng ký ngay <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-6 text-base border-foreground/20 hover:bg-secondary">
              Tìm hiểu thêm
            </Button>
          </div>
        </div>

        {/* Right - Globe with floating cards */}
        <div className="relative hidden lg:flex justify-center items-center">
          <img src={heroGlobe} alt="Global fulfillment network" className="w-[550px] h-[550px] object-contain" />

          {/* Floating cards */}
          <div className="absolute top-20 left-10 bg-card rounded-xl shadow-lg px-5 py-3 border border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">🇪🇺 EU</div>
            <p className="text-2xl font-serif font-bold text-navy">5-8</p>
            <p className="text-xs text-muted-foreground">ngày giao hàng</p>
          </div>

          <div className="absolute bottom-32 left-20 bg-card rounded-xl shadow-lg px-5 py-3 border border-border">
            <p className="text-2xl font-serif font-bold text-navy">từ 1$</p>
            <p className="text-xs text-muted-foreground">fulfill nội địa US</p>
          </div>

          <div className="absolute top-40 right-0 bg-card rounded-xl shadow-lg px-5 py-3 border border-border">
            <p className="text-2xl font-serif font-bold text-navy">3</p>
            <p className="text-xs text-muted-foreground">quốc gia sản xuất</p>
          </div>

          <div className="absolute bottom-48 right-10 bg-card rounded-xl shadow-lg px-4 py-2 border border-border flex items-center gap-2">
            <span>🇨🇳</span><span className="text-xs font-medium">China</span>
          </div>

          <div className="absolute bottom-36 right-2 bg-card rounded-xl shadow-lg px-4 py-2 border border-border flex items-center gap-2">
            <span>🇻🇳</span><span className="text-xs font-medium">Vietnam</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
