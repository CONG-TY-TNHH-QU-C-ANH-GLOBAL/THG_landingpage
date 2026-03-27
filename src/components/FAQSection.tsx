import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "THG Fulfill phù hợp với ai?", a: "THG Fulfill phù hợp với tất cả các seller eCommerce, từ người mới bắt đầu đến các brand lớn muốn mở rộng thị trường quốc tế." },
  { q: "Chi phí fulfillment như thế nào?", a: "Chi phí fulfill nội địa US bắt đầu từ 1$/đơn. Giá cụ thể phụ thuộc vào kích thước, trọng lượng sản phẩm và khối lượng đơn hàng." },
  { q: "Thời gian giao hàng bao lâu?", a: "Nội địa US: 3-5 ngày làm việc. Giao hàng đến EU: 5-8 ngày làm việc. UK: 5-7 ngày làm việc." },
  { q: "THG có hỗ trợ Print on Demand không?", a: "Có, THG cung cấp dịch vụ POD với đa dạng sản phẩm và chất lượng in ấn cao cấp." },
  { q: "Làm thế nào để bắt đầu?", a: "Bạn chỉ cần đăng ký tài khoản, gửi hàng về kho THG và bắt đầu bán hàng. Đội ngũ THG sẽ hỗ trợ bạn từ A-Z." },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-card">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Câu hỏi thường gặp</p>
          <h2 className="text-4xl md:text-5xl font-serif text-navy">
            Q&A
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-xl px-6 bg-background">
              <AccordionTrigger className="text-left font-serif text-navy hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
