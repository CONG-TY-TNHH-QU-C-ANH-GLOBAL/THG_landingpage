import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";

const ContactSection = () => {
  const { t } = useI18n();

  return (
    <section id="contact" className="py-28 relative overflow-hidden">
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/60 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div>
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{t("contact.subtitle")}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 tracking-tight leading-tight">
                {t("contact.title")}{" "}
                <span className="text-gradient-gold">{t("contact.title_highlight")}</span>{" "}
                {t("contact.title2")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                {t("contact.desc")}
              </p>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p className="flex items-center gap-3">📧 info@thgfulfill.com</p>
                <p className="flex items-center gap-3">📞 0335.124.089</p>
                <p className="flex items-center gap-3">📍 121/5 Đ. Kênh 19/5, Sơn Kỳ, Tân Phú, TP.HCM</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={200}>
            <form className="glass-card rounded-3xl p-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder={t("contact.name")} className="rounded-xl bg-background/80 border-border/50 h-12" />
                <Input placeholder={t("contact.phone")} className="rounded-xl bg-background/80 border-border/50 h-12" />
              </div>
              <Input placeholder={t("contact.email")} type="email" className="rounded-xl bg-background/80 border-border/50 h-12" />
              <Input placeholder={t("contact.shop")} className="rounded-xl bg-background/80 border-border/50 h-12" />
              <Textarea placeholder={t("contact.message")} className="rounded-xl bg-background/80 border-border/50 min-h-[120px]" />
              <Button className="w-full bg-primary hover:bg-gold-dark text-primary-foreground rounded-full py-6 text-base gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                {t("contact.submit")} <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
