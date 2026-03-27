import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Liên hệ</p>
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6">
              Bắt đầu <span className="text-primary italic">hành trình</span> cùng THG
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Để lại thông tin, đội ngũ THG sẽ liên hệ tư vấn giải pháp fulfillment phù hợp nhất cho bạn trong vòng 24 giờ.
            </p>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>📧 contact@thgfulfill.com</p>
              <p>📞 +84 123 456 789</p>
              <p>📍 TP. Hồ Chí Minh, Việt Nam</p>
            </div>
          </div>

          <form className="bg-card rounded-2xl p-8 border border-border space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Họ và tên" className="rounded-xl bg-background" />
              <Input placeholder="Số điện thoại" className="rounded-xl bg-background" />
            </div>
            <Input placeholder="Email" type="email" className="rounded-xl bg-background" />
            <Input placeholder="Tên shop / Brand" className="rounded-xl bg-background" />
            <Textarea placeholder="Nội dung cần tư vấn..." className="rounded-xl bg-background min-h-[120px]" />
            <Button className="w-full bg-primary hover:bg-gold-dark text-primary-foreground rounded-full py-6 text-base gap-2">
              Gửi yêu cầu tư vấn <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
