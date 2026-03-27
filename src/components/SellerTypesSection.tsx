import { Store, TrendingUp, Users, Rocket } from "lucide-react";

const types = [
  { icon: Store, title: "Seller mới bắt đầu", desc: "Hỗ trợ từ A-Z cho những người mới bước vào thương mại điện tử xuyên biên giới." },
  { icon: TrendingUp, title: "Seller đang scale", desc: "Tối ưu chi phí và quy trình để mở rộng quy mô kinh doanh nhanh chóng." },
  { icon: Users, title: "Seller đội nhóm", desc: "Giải pháp quản lý kho và fulfillment cho các team bán hàng chuyên nghiệp." },
  { icon: Rocket, title: "Brand & DTC", desc: "Xây dựng thương hiệu riêng với dịch vụ fulfillment cao cấp và chuyên biệt." },
];

const SellerTypesSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Đối tượng khách hàng</p>
          <h2 className="text-4xl md:text-5xl font-serif text-navy">
            Phù hợp với <span className="text-primary italic">mọi Seller</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {types.map((t) => (
            <div key={t.title} className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center">
                <t.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-navy mb-3">{t.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SellerTypesSection;
