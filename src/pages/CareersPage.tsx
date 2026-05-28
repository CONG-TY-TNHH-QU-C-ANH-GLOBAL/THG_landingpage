import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useCmsJobs } from "@/hooks/useCmsContent";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { isPastDeadline } from "@/lib/deadline";
import { SafeHtml } from "@/lib/sanitizeHtml";
import { ACCENT, DEFAULT_ACCENT, jobFromCmsListItem, type Job } from "@/lib/careers";

const FILTERS = [
    { key: "all", label: "Tất cả", count: 7 },
    { key: "ai", label: "🤖 AI / R&D" },
    { key: "finance", label: "Kế toán" },
    { key: "sales", label: "Sale / CSKH" },
    { key: "ops", label: "Vận hành" },
    { key: "sourcing", label: "Sourcing & Báo giá" },
];

const WHY_CARDS = [
    { icon: "🌍", title: "Môi trường quốc tế", desc: "Làm việc với khách hàng, supplier và đối tác tại VN, TQ, Mỹ và Châu Âu mỗi ngày." },
    { icon: "🚀", title: "Tăng trưởng cùng công ty", desc: "Gia nhập THG ở giai đoạn scale-up — cơ hội thăng tiến rõ ràng, lộ trình phát triển minh bạch." },
    { icon: "🎓", title: "Đào tạo bài bản", desc: "Được đào tạo chuyên sâu về E-commerce, logistics quốc tế, POD/Dropship từ đội ngũ chuyên gia." },
    { icon: "💛", title: 'Văn hóa "Happiness"', desc: "Company Trip hàng năm, thưởng tháng 13, môi trường trẻ trung, cởi mở, tôn trọng cá nhân." },
];

const REWARDS = [
    { icon: "🏆", tag: "KPI hàng tháng", name: "Thưởng xếp hạng Grade", desc: "Đánh giá hiệu suất cuối mỗi tháng theo 3 mức Grade B / A / A+. Thưởng tự động, minh bạch.", featured: false },
    { icon: "💼", tag: "Sales · CSKH", name: "Thưởng chốt đơn lớn", desc: "Thưởng trên từng đơn có giá trị cao được chốt thành công — từ Express, Dropship, POD đến Warehouse US.", featured: false },
    { icon: "📦", tag: "Vận chuyển", name: "Thưởng Express Bulk", desc: "Thưởng phân tầng theo khối lượng đơn hàng vận chuyển: trên 50kg, trên 100kg, trên 500kg.", featured: false },
    { icon: "🌟", tag: "Khai thác", name: "Thưởng khách hàng mới", desc: "Ghi nhận ngay khi đưa được một khách hàng mới vào giao dịch lần đầu với THG.", featured: false },
    { icon: "⭐", tag: "Upgrade", name: "Thưởng khách hàng lên VIP", desc: "Khi chăm sóc khách hàng đạt ngưỡng VIP trong tháng, Sales và CSKH cùng nhận thưởng.", featured: false },
    { icon: "📈", tag: "Doanh thu", name: "Thưởng tỷ lệ chốt cao", desc: "Sales/CS cá nhân đạt tỷ lệ chốt request ≥ 80% sẽ nhận thưởng hiệu suất.", featured: false },
    { icon: "🤝", tag: "Upsell", name: "Thưởng Upsell thành công", desc: "Thưởng khi giới thiệu thành công thêm dịch vụ THG cho khách hàng đang có.", featured: false },
    { icon: "✅", tag: "Hiệu suất", name: "Thưởng 100% task đúng hạn", desc: "Hoàn thành 100% task được giao trong tháng mà không có task nào trễ hạn.", featured: false },
    { icon: "👑", tag: "CEO Award", name: "Nhân viên xuất sắc tháng", desc: "Giải thưởng do chính CEO chọn mỗi tháng — kèm tiền thưởng và Certificate ghi nhận.", featured: true },
];

/* ─── COMPONENT ─── */
const CareersPage = () => {
    const { t, language } = useI18n();
    const cmsJobs = useCmsJobs(language);
    const [filter, setFilter] = useState("all");

    // Adapt CMS list endpoint shape → card-level Job. Rich content
    // (responsibilities/requirements/benefits/…) lives on the dedicated
    // /careers/:slug detail page, which each card links to.
    const allJobs = useMemo<Job[]>(() => {
        if (!cmsJobs.data) return [];
        return cmsJobs.data.jobs
            .slice()
            .sort((a, b) => a.position - b.position)
            .map(jobFromCmsListItem);
    }, [cmsJobs.data]);

    const filtered = filter === "all" ? allJobs : allJobs.filter((j) => j.filter === filter);

    return (
        <div className="min-h-screen bg-background">
            <SeoHead
                title="Careers — THG Fulfill"
                description={t("careers.hero_subtitle")}
                path="/careers"
            />
            <JsonLdBreadcrumb
                items={[
                    { name: "Home", url: "https://thgfulfill.com/" },
                    { name: "Careers", url: "https://thgfulfill.com/careers" },
                ]}
            />
            <Navbar />

            {/* ═══ HERO ═══ */}
            <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, hsl(220 25% 12%) 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
                <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                    <ScrollReveal>
                        <span className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-4 py-2 text-[11.5px] font-bold tracking-[0.1em] uppercase text-navy/80 shadow-sm mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary" /> {t("careers.hero_badge2")}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy leading-[1.05] tracking-tight">
                            {t("careers.hero_title_1")} <span className="text-gradient-gold">{t("careers.hero_title_2")}</span>.<br />
                            {t("careers.hero_title_3")} <span className="text-gradient-gold">{t("careers.hero_title_4")}</span>.
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mt-6 leading-relaxed">
                            {t("careers.hero_desc")}
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <div className="flex flex-wrap gap-12 md:gap-16 mt-12 pt-10 border-t border-border">
                            {[
                                { num: "7+", label: t("careers.stat1_label") },
                                { num: "3", label: t("careers.stat2_label") },
                                { num: "4", label: t("careers.stat3_label") },
                                { num: "15/05", label: t("careers.stat4_label") },
                            ].map((s, i) => (
                                <div key={i}>
                                    <div className="text-4xl font-extrabold text-navy tracking-tight">{s.num.includes("+") ? <>{s.num.replace("+", "")}<span className="text-primary">+</span></> : s.num}</div>
                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] mt-1.5">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ═══ WHY THG ═══ */}
            <section className="py-6 bg-background">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {WHY_CARDS.map((c, i) => (
                            <ScrollReveal key={i} delay={i * 80} className="h-full">
                                <div className="bg-white border border-border rounded-2xl p-6 hover:-translate-y-1 transition-transform h-full flex flex-col">
                                    <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center text-2xl mb-3.5">{c.icon}</div>
                                    <h3 className="font-bold text-[15.5px] text-navy">{t(`careers.why${i + 1}_title`) || c.title}</h3>
                                    <p className="text-[13.5px] text-muted-foreground mt-1 leading-relaxed">{t(`careers.why${i + 1}_desc`) || c.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ OPEN POSITIONS ═══ */}
            <section id="careers-jobs" className="py-16 bg-background scroll-mt-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <ScrollReveal>
                        <p className="text-[11.5px] font-bold text-primary uppercase tracking-[0.2em] text-center">{t("careers.pos_eyebrow")}</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-navy text-center mt-3 tracking-tight">{t("careers.pos_title")} <span className="text-gradient-gold">{t("careers.pos_title_highlight")}</span></h2>
                        <p className="text-center text-muted-foreground text-[15.5px] max-w-xl mx-auto mt-3">{t("careers.pos_desc")}</p>
                    </ScrollReveal>

                    {/* Filter chips */}
                    <div className="flex flex-wrap gap-2.5 justify-center mt-10 mb-10">
                        {FILTERS.map((f, i) => {
                            const labelKey = ["careers.filter_all", "careers.filter_ai", "careers.filter_acc", "careers.filter_sale", "careers.filter_ops", "careers.filter_src"][i];
                            return (
                                <button key={f.key} onClick={() => setFilter(f.key)}
                                    className={`px-5 py-2.5 rounded-full text-[13.5px] font-semibold border transition-all cursor-pointer ${filter === f.key ? "bg-navy text-white border-navy" : "bg-white border-border text-muted-foreground hover:text-navy hover:border-primary"}`}>
                                    {t(labelKey) || f.label}{f.count ? <span className="ml-1.5 opacity-55">{f.count}</span> : null}
                                </button>
                            );
                        })}
                    </div>

                    {/* Job cards grid — CMS data only. Empty state when CMS unseeded. */}
                    {cmsJobs.isLoading && (
                        <div className="text-center text-muted-foreground py-12">Đang tải tin tuyển dụng...</div>
                    )}
                    {!cmsJobs.isLoading && allJobs.length === 0 && (
                        <div className="text-center text-muted-foreground py-12">
                            Hiện chưa có vị trí tuyển dụng nào. Vui lòng quay lại sau.
                        </div>
                    )}
                    <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}>
                        {filtered.map((job, i) => {
                            const accentColor = ACCENT[job.cat] || DEFAULT_ACCENT;
                            const expired = isPastDeadline(job.deadline);
                            return (
                                <ScrollReveal key={job.id} delay={i * 80} className="h-full">
                                    <Link to={`/careers/${job.id}`}
                                        className={`bg-white border border-border rounded-2xl p-[30px] cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl relative overflow-hidden flex flex-col h-full min-h-[320px] group ${expired ? "opacity-60 grayscale" : ""}`}
                                        style={{ "--accent": accentColor } as React.CSSProperties}>
                                        <div className="absolute top-0 left-0 right-0 h-[3px] opacity-70 group-hover:opacity-100 group-hover:h-1 transition-all" style={{ background: accentColor }} />
                                        {expired ? (
                                            <div className="absolute top-[18px] right-[18px] bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 text-[10px] font-extrabold tracking-[0.1em] uppercase rounded-md z-10">
                                                {t("careers.expired_badge") || "Đã hết hạn"}
                                            </div>
                                        ) : job.hot && (
                                            <div className="absolute top-[18px] -right-[32px] text-white px-9 py-1 text-[10px] font-extrabold tracking-[0.12em] rotate-[35deg] z-10 whitespace-nowrap"
                                                style={{ background: '#2E6F8E', boxShadow: '0 4px 12px rgba(46,111,142,0.25)' }}>
                                                {t("careers.hot")}
                                            </div>
                                        )}
                                        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.12em] uppercase px-2.5 py-1.5 rounded-[5px] self-start" style={{ background: `${accentColor}18`, color: accentColor }}>
                                            {job.badge}
                                        </span>
                                        <div className="text-[13px] font-bold italic mt-3.5 tracking-[0.3px]" style={{ color: accentColor }}>
                                            {job.tagline}
                                        </div>
                                        <h3 className="text-[23px] font-extrabold text-navy mt-1.5 leading-[1.2] tracking-[-0.01em]">
                                            {job.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-[1.6] mt-3 flex-1">
                                            {job.desc}
                                        </p>
                                        <div className="flex flex-wrap gap-2.5 mt-[18px] pt-[18px] border-t border-dashed border-border text-[12.5px] text-muted-foreground font-medium">
                                            {job.location && <span className="inline-flex items-center gap-[5px]">📍 {job.location}</span>}
                                            {job.type && <span className="inline-flex items-center gap-[5px]">⏱ {job.type}</span>}
                                            {job.deadline && <span className="inline-flex items-center gap-[5px]">📅 {t(`careers.stat4_label`)} {job.deadline}</span>}
                                        </div>
                                        <div className="flex justify-between items-center mt-[18px]">
                                            <div className="font-extrabold text-lg text-navy leading-[1.2] tracking-[-0.01em]">
                                                {job.salary}
                                                <span className="block text-primary font-bold text-[12.5px] mt-0.5 tracking-[0.2px]">
                                                    {job.salaryUnit}
                                                </span>
                                            </div>
                                            <div className="w-[38px] h-[38px] rounded-full border border-border flex items-center justify-center text-navy transition-all duration-300 group-hover:rotate-[-45deg] group-hover:text-white group-hover:border-transparent" style={{ backgroundColor: 'var(--bg, #F7F5F0)' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = accentColor; (e.currentTarget as HTMLElement).style.borderColor = accentColor; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg, #F7F5F0)'; (e.currentTarget as HTMLElement).style.borderColor = ''; }}>
                                                →
                                            </div>
                                        </div>
                                    </Link>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section >

            {/* ═══ CAREER PATH BANNER ═══ */}
            < section className="py-10" >
                <div className="container mx-auto px-4 max-w-6xl">
                    <ScrollReveal>
                        <div className="bg-gradient-to-br from-white to-card border border-border rounded-[20px] p-12 md:p-14 relative overflow-hidden">
                            <div className="absolute -right-20 -top-20 w-[280px] h-[280px] rounded-full bg-gradient-radial from-primary/10 to-transparent" />
                            <div className="relative mb-8 max-w-3xl">
                                <p className="text-[11.5px] font-bold text-primary uppercase tracking-[0.2em]">{t("careers.path_eyebrow")}</p>
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-navy leading-[1.15] tracking-tight mt-3.5">
                                    {t("careers.path_title_1")} <span className="text-gradient-gold">{t("careers.path_title_2")}</span>
                                </h3>
                                <p className="text-muted-foreground text-[15px] mt-3 leading-relaxed">
                                    {t("careers.path_desc")}
                                </p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 relative">
                                {[1, 2, 3].map((num) => (
                                    <div key={num} className="bg-white border border-border rounded-2xl p-6 relative">
                                        {num < 3 && (
                                            <div className="hidden md:grid absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card place-items-center text-primary font-extrabold text-2xl">→</div>
                                        )}
                                        <div className="w-8 h-8 rounded-full bg-primary text-white font-extrabold text-sm grid place-items-center mb-3.5">{num}</div>
                                        <div className="text-[17px] font-extrabold text-navy tracking-[-0.01em] mb-1">{t(`careers.p${num}_title`)}</div>
                                        <div className="text-[11.5px] text-primary font-bold tracking-[0.1em] uppercase mb-2.5">{t(`careers.p${num}_time`)}</div>
                                        <p className="text-[13px] text-muted-foreground leading-relaxed">{t(`careers.p${num}_desc`)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ═══ REWARDS ═══ */}
            <section className="py-20 bg-card">
                <div className="container mx-auto px-4 max-w-6xl">
                    <ScrollReveal>
                        <p className="text-[11.5px] font-bold text-primary uppercase tracking-[0.2em] text-center">{t("careers.rew_eyebrow")}</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-navy text-center mt-3 tracking-tight">{t("careers.rew_title")} <span className="text-gradient-gold">{t("careers.rew_title_highlight")}</span></h2>
                        <p className="text-center text-muted-foreground text-[15.5px] max-w-xl mx-auto mt-3">{t("careers.rew_desc")}</p>
                    </ScrollReveal>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
                        {REWARDS.map((r, i) => (
                            <ScrollReveal key={i} delay={i * 60} className="h-full">
                                <div className={`h-full flex flex-col rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-lg ${r.featured ? "bg-navy text-white border-navy" : "bg-white border-border"}`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${r.featured ? "bg-primary/20" : "bg-primary/5"}`}>{r.icon}</div>
                                    <span className={`inline-block text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded mb-3 ${r.featured ? "bg-primary/20 text-[hsl(var(--gold))] border border-primary/30" : "bg-primary/5 text-primary border border-primary/20"}`}>{t(`careers.r${i + 1}_tag`) || r.tag}</span>
                                    <h3 className={`text-[17px] font-extrabold mb-1.5 ${r.featured ? "text-white" : "text-navy"}`}>{t(`careers.r${i + 1}_title`) || r.name}</h3>
                                    <p className={`text-[13px] leading-relaxed ${r.featured ? "text-white/70" : "text-muted-foreground"}`}>{t(`careers.r${i + 1}_desc`) || r.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>
            {/* ═══ BOTTOM CTA ═══ */}
            <section className="py-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <ScrollReveal>
                        <div className="bg-navy text-white rounded-3xl p-12 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                            <div className="absolute -right-36 -bottom-36 w-80 h-80 rounded-full bg-gradient-radial from-primary/25 to-transparent" />
                            <div className="relative z-10">
                                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">{t("careers.cta_title1")}<br /><span className="text-[hsl(var(--gold))]">{t("careers.cta_title2")}</span></h3>
                                <SafeHtml as="p" className="text-white/70 mt-3 text-[15px]" html={t("careers.cta_desc")} />
                            </div>
                            <div className="relative z-10 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("careers-jobs")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                                    className="px-8 py-4 rounded-full font-bold text-[15px] border border-[hsl(var(--gold))]/30 text-[hsl(var(--gold))] bg-[hsl(var(--gold))]/10 transition-all hover:-translate-y-0.5 hover:bg-[hsl(var(--gold))]/20"
                                >
                                    {t("careers.cta_btn")}
                                </button>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <ContactSection />

        </div>
    );
};

export default CareersPage;
