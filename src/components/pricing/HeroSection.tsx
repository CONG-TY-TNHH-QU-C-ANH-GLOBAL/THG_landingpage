import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";

const HeroSection = () => {
    const { tVi } = useI18n();

    return (
        <section className="bg-gradient-to-b from-[hsl(36_30%_96%)] to-[hsl(36_25%_93%)] pt-20 sm:pt-28 pb-6 sm:pb-10 text-center border-b border-[var(--pricing-border)]">
            <div className="container mx-auto px-4">
                <ScrollReveal>
                    <span className="inline-block bg-[#F3EDD8] text-primary border border-[#E8D9A0] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase px-3 sm:px-4 py-1 rounded-full mb-3 sm:mb-4">
                        BẢNG GIÁ QUỐC TẾ
                    </span>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2 sm:mb-3">
                        Tra cứu cước <span className="text-gradient-gold font-sans font-bold">vận chuyển quốc tế</span>
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                        Bảng giá minh bạch, cập nhật real-time cho tất cả tuyến vận chuyển từ Việt Nam & Trung Quốc.
                    </p>

                </ScrollReveal>
            </div>
        </section>
    );
};

export default HeroSection;
