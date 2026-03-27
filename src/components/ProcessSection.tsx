const steps = [
  { step: "01", title: "Đăng ký & Tư vấn", desc: "Liên hệ đội ngũ THG để được tư vấn giải pháp phù hợp nhất." },
  { step: "02", title: "Gửi hàng về kho", desc: "Gửi sản phẩm đến kho THG tại Việt Nam hoặc Trung Quốc." },
  { step: "03", title: "Xử lý đơn hàng", desc: "Hệ thống tự động xử lý đơn, đóng gói và chuẩn bị giao hàng." },
  { step: "04", title: "Giao hàng toàn cầu", desc: "Sản phẩm được vận chuyển đến tay khách hàng trên toàn thế giới." },
];

const ProcessSection = () => {
  return (
    <section className="py-24 bg-navy text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-gold-light uppercase tracking-widest mb-3">Quy trình</p>
          <h2 className="text-4xl md:text-5xl font-serif">
            Bắt đầu chỉ với <span className="text-gold-light italic">4 bước</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              <span className="text-6xl font-serif font-bold text-gold-light/20">{s.step}</span>
              <h3 className="text-xl font-serif font-semibold mt-2 mb-3">{s.title}</h3>
              <p className="text-sm text-primary-foreground/70 leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 w-8 h-px bg-gold-light/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
