const Footer = () => {
  return (
    <footer className="bg-navy text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-sm">THG</span>
              </div>
              <div>
                <p className="font-serif font-bold">THG Fulfill</p>
                <p className="text-[9px] tracking-[0.15em] text-primary-foreground/60 uppercase">Transport Happiness Group</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              Đối tác Fulfillment toàn cầu cho eCommerce Seller.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Dịch vụ</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><a href="#" className="hover:text-gold-light transition-colors">THG Fulfill</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">THG Express</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">THG Warehouse</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">THG Order</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><a href="#" className="hover:text-gold-light transition-colors">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li>📧 contact@thgfulfill.com</li>
              <li>📞 +84 123 456 789</li>
              <li>📍 TP. Hồ Chí Minh, Việt Nam</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/40">
          © 2026 THG Fulfill. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
