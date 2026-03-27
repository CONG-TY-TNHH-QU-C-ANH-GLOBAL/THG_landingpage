import { Shield, Clock, DollarSign, Headphones, Globe, Zap } from "lucide-react";

const advantages = [
  { icon: DollarSign, title: "Chi phí tối ưu", desc: "Giá cả cạnh tranh nhất thị trường với fulfill nội địa US từ 1$." },
  { icon: Clock, title: "Giao hàng nhanh", desc: "Thời gian giao hàng 5-8 ngày đến EU, 3-5 ngày nội địa US." },
  { icon: Globe, title: "Phủ sóng toàn cầu", desc: "Kho bãi tại 3 quốc gia: Việt Nam, Trung Quốc, Mỹ." },
  { icon: Shield, title: "An toàn & Tin cậy", desc: "Bảo hiểm hàng hóa, đền bù 100% nếu thất lạc." },
  { icon: Zap, title: "Công nghệ hiện đại", desc: "Hệ thống quản lý đơn hàng tự động, realtime tracking." },
  { icon: Headphones, title: "Hỗ trợ 24/7", desc: "Đội ngũ tư vấn viên hỗ trợ bằng tiếng Việt mọi lúc." },
];

const AdvantagesSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Tại sao chọn THG</p>
          <h2 className="text-4xl md:text-5xl font-serif text-navy">
            Lợi thế <span className="text-primary italic">vượt trội</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((a) => (
            <div key={a.title} className="flex gap-5">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <a.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-navy mb-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
