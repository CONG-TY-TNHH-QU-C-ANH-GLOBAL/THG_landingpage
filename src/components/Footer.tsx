import { useI18n } from "@/lib/i18n";
import { Link } from "react-router-dom";
import thgLogo from "@/assets/thg-logo.png";

const Footer = () => {
  const { t, tVi } = useI18n();

  return (
    <footer className="bg-gradient-to-b from-[hsl(36_30%_96%)] to-[hsl(36_25%_92%)] py-20 relative overflow-hidden border-t border-border/40">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-5 gap-10 mb-14">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center overflow-hidden p-1.5">
                <img src={thgLogo} alt="THG" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <div>
                <p className="font-bold tracking-tight text-navy" >THG Fulfill</p>
                <p className="text-[9px] tracking-[0.12em] text-muted-foreground uppercase" >Transport Happiness Group</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-5 tracking-tight text-navy">{t("footer.services")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/thg-fulfill" className="hover:text-primary transition-colors duration-300" >THG Fulfill</Link></li>
              <li><Link to="/thg-express" className="hover:text-primary transition-colors duration-300" >THG Express</Link></li>
              <li><Link to="/thg-warehouse" className="hover:text-primary transition-colors duration-300" >THG Warehouse</Link></li>
              <li><Link to="/thg-order" className="hover:text-primary transition-colors duration-300" >THG Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-5 tracking-tight text-navy">{t("footer.support")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/#faq" className="hover:text-primary transition-colors duration-300">{t("footer.faq_link")}</Link></li>
              <li><Link to="/chinh-sach" className="hover:text-primary transition-colors duration-300">{t("footer.privacy")}</Link></li>
              <li><Link to="/chinh-sach" className="hover:text-primary transition-colors duration-300">{t("footer.terms")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-5 tracking-tight text-navy">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>📧 info@thgfulfill.com</li>
              <li  >📞 0335.124.089</li>
              <li>🇻🇳 121/5 Đ. Kênh 19/5, Sơn Kỳ, Tân Phú, TP.HCM</li>
              <li  >🇺🇸 108 Almond CT, Milford, PA 18337</li>
              <li style={{ fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>🇨🇳 广东省东莞市常平镇霞坑新宅二区三街101</li>
              <li  >🌐 www.thgfulfill.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-5 tracking-tight text-navy">{t("footer.social")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="https://www.facebook.com/THGFulfill" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@thgfulfillment" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" /><polygon fill="white" points="9.545 15.568 15.818 12 9.545 8.432" /></svg>
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground/60">
          <span>{t("footer.copyright")}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
