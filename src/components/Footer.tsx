import { useI18n } from "@/lib/i18n";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-gradient-dark text-primary-foreground py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-light/20 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">THG</span>
              </div>
              <div>
                <p className="font-bold tracking-tight">THG Fulfill</p>
                <p className="text-[9px] tracking-[0.12em] text-primary-foreground/50 uppercase">Transport Happiness Group</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/50 leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-5 tracking-tight">{t("footer.services")}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/50">
              <li><a href="#services" className="hover:text-gold-light transition-colors duration-300">THG Fulfill</a></li>
              <li><a href="#services" className="hover:text-gold-light transition-colors duration-300">THG Express</a></li>
              <li><a href="#services" className="hover:text-gold-light transition-colors duration-300">THG Warehouse</a></li>
              <li><a href="#services" className="hover:text-gold-light transition-colors duration-300">THG Order</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-5 tracking-tight">{t("footer.support")}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/50">
              <li><Link to="/#faq" className="hover:text-gold-light transition-colors duration-300">{t("footer.faq_link")}</Link></li>
              <li><Link to="/chinh-sach" className="hover:text-gold-light transition-colors duration-300">{t("footer.privacy")}</Link></li>
              <li><Link to="/chinh-sach" className="hover:text-gold-light transition-colors duration-300">{t("footer.terms")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-5 tracking-tight">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/50">
              <li>📧 info@thgfulfill.com</li>
              <li>📞 0335.124.089</li>
              <li>📍 121/5 Đ. Kênh 19/5, Sơn Kỳ, Tân Phú, TP.HCM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/30">
          © 2026 THG Fulfill. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
