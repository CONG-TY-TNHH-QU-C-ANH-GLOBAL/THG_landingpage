import { Package, Truck, Warehouse, ShoppingCart, Globe, BarChart3 } from "lucide-react";

const services = [
  { icon: Package, title: "THG Fulfill", desc: "Dịch vụ fulfillment toàn diện từ nhận hàng, đóng gói đến giao hàng tận nơi." },
  { icon: Truck, title: "THG Express", desc: "Vận chuyển nhanh quốc tế với thời gian giao hàng tối ưu nhất." },
  { icon: Warehouse, title: "THG Warehouse", desc: "Hệ thống kho bãi hiện đại tại Việt Nam, Trung Quốc và Mỹ." },
  { icon: ShoppingCart, title: "THG Order", desc: "Quản lý đơn hàng thông minh, tự động hóa quy trình xử lý." },
  { icon: Globe, title: "Vận chuyển quốc tế", desc: "Kết nối vận chuyển toàn cầu đến US, UK, EU và nhiều thị trường khác." },
  { icon: BarChart3, title: "Sourcing & POD", desc: "Tìm kiếm nguồn hàng và cung cấp dịch vụ Print on Demand chất lượng." },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Dịch vụ của chúng tôi</p>
          <h2 className="text-4xl md:text-5xl font-serif text-navy">
            Giải pháp <span className="text-primary italic">Fulfillment</span> trọn gói
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="group p-8 rounded-2xl border border-border bg-background hover:bg-primary hover:border-primary transition-all duration-300 cursor-pointer"
            >
              <s.icon className="w-10 h-10 text-primary group-hover:text-primary-foreground mb-5 transition-colors" />
              <h3 className="text-xl font-serif font-semibold text-navy group-hover:text-primary-foreground mb-3 transition-colors">
                {s.title}
              </h3>
              <p className="text-muted-foreground group-hover:text-primary-foreground/80 transition-colors leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
