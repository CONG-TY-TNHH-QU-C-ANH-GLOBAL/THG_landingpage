import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import larkPoliciesI18n from "@/data/larkPoliciesI18n.json";

/* ─── Q&A Data ─── */
const qnaList = [
    { q: "Thời gian drop từ CN-US là bao nhiêu ngày?", a: "Thời gian đơn hàng từ Taobao về kho THG (Đông Hoản): khoảng 2 ngày.\nTừ kho ở Trung Quốc đến Mỹ: 5-8 ngày sẽ được giao đến tay người nhận ở Mỹ.\n=> Tổng thời gian vận chuyển có thể từ 8 - 10 ngày." },
    { q: "Có hỗ trợ active tracking phù hợp với policy của TikTok không?", a: "THG có hỗ trợ active tracking. Khi bạn lên đơn hàng buổi sáng THG sẽ trả tracking trong buổi chiều hoặc tối. Sau đó tracking sẽ được active theo đúng policy của TikTok trong vòng 48h." },
    { q: "THG hỗ trợ những tuyến đường vận chuyển nào và thời gian giao hàng như thế nào?", a: "THG cung cấp đa dạng tuyến vận chuyển bao gồm Việt Nam -> Mỹ, Trung Quốc -> Mỹ, và Việt Nam/Trung Quốc -> Worldwide. Chúng tôi có các line chuyên biệt cho TikTok Shop (US/UK/DE), cả hàng lô và epacket để tối ưu chi phí và thời gian giao hàng theo nhu cầu của từng seller." },
    { q: "THG có nhận gửi hàng cồng kềnh hay chỉ gửi được hàng nhỏ thôi?", a: "THG có thể xử lý đa dạng loại hàng hóa từ nhỏ đến cồng kềnh. Với quy trình kiểm tra chất lượng và đóng gói chuẩn, chúng tôi đảm bảo hàng hóa được bảo vệ tối ưu trong quá trình vận chuyển dù kích thước hay trọng lượng ra sao." },
    { q: "Chi phí vận chuyển của THG có cạnh tranh không? Có phát sinh chi phí ẩn nào không?", a: "THG cam kết báo cáo chi phí chi tiết và rõ ràng, không có chi phí phát sinh. Chúng tôi tối ưu chi phí thông qua việc cung cấp cả hàng lô và epacket, giúp seller lựa chọn phương án phù hợp với ngân sách và yêu cầu giao hàng của mình." },
    { q: "Seller có thể theo dõi trạng thái đơn hàng như thế nào?", a: "THG cung cấp hệ thống tracking real-time, cho phép bạn chủ động tra cứu trạng thái đơn hàng bất cứ lúc nào. Mỗi đơn hàng được vận hành qua hệ thống khép kín từ đồng bộ dữ liệu, đóng gói đến theo dõi trạng thái chi tiết." },
    { q: "THG tính cước vận chuyển dựa trên tiêu chí gì? Có phải theo trọng lượng thật không?", a: "THG tính cước theo nguyên tắc lấy cao nhất giữa trọng lượng thực tế (Gross Weight) và trọng lượng thể tích (Volume Weight = L×W×H / 6000).\n\n• Ví dụ: kiện hàng có trọng lượng thực 0.9kg nhưng trọng lượng thể tích 1.1kg thì cước vận chuyển sẽ tính theo 1.1kg.\n• Áp dụng cho tất cả tuyến US/Canada/Mexico/EU.\n• Trọng lượng tối đa: 30kg/kiện." },
    { q: "Chính sách bồi thường của THG?", a: "THG bồi thường 100% giá trị hàng hóa bị thất lạc/hư hỏng do lỗi trong quá trình xử lý tại THG.\n\n• Mức bồi thường tối đa: $500/kiện hàng.\n• Thời hạn khiếu nại: trong vòng 14 ngày kể từ ngày giao hàng dự kiến.\n• Không áp dụng cho: hàng cấm, hàng không khai báo đúng, hoặc hàng bị hải quan tịch thu." },
    { q: "Dịch vụ ePacket từ Trung Quốc sang Mỹ có giới hạn kích thước và trọng lượng ra sao?", a: "Với dịch vụ Line ePacket CHINA - US, kiện hàng có thể nặng tối đa 30kg.\n\n• Kích thước tiêu chuẩn: 55×40×35cm (không tính thêm phí).\n• Kích thước tối đa: 68×43×43cm (có phí bổ sung).\n• Kích thước tối thiểu: 10×15cm để đảm bảo an toàn vận chuyển." },
    { q: "Giá trị khai báo tối đa trên mỗi kiện hàng là bao nhiêu?", a: "Theo quy định từ hãng vận chuyển và hải quan nước đến, giá trị khai báo tối đa khác nhau tùy quốc gia:\n\n• USA: Max USD $60 (nghiêm ngặt).\n• EU: Max EUR €150 / ~USD $155.\n• UK: Max GBP £135 / ~USD $155.\n• Japan: Max USD $110.\n\n⚠️ Lưu ý: Khai báo vượt giới hạn có thể dẫn đến kiện hàng bị giữ lại hoặc thuế phát sinh. Vui lòng liên hệ THG nếu cần tư vấn." },
    { q: "Chính sách hoàn hàng (Return) và gửi lại (Re-delivery) như thế nào?", a: "Khi kiện hàng bị trả về kho hải ngoại (do sai địa chỉ, không có người nhận, hoặc bị từ chối nhận):\n\n• Khách hàng có 14-20 ngày (tùy quốc gia) để yêu cầu Re-delivery.\n• Nếu không có phản hồi trong thời hạn, kiện hàng sẽ bị hủy.\n• THG KHÔNG hỗ trợ hoàn hàng từ nước ngoài về lại Trung Quốc/Việt Nam.\n\nPhí Re-delivery:\n• USA: $10.50/đơn\n• UK: $7.00/đơn\n• Germany: $10.50/đơn\n• Japan: $7.60/đơn\n• Các nước khác: $8.00/đơn" },
    { q: "Pickup tại kho và Return to Sender phí bao nhiêu?", a: "THG cung cấp dịch vụ xử lý hàng trả về:\n\n• Pickup tại kho US (PA/NC): $1.15/đơn\n• Return to Sender: $1.50/đơn\n\nCác đơn hàng pickup tại kho cần đặt lịch trước ít nhất 24h qua hệ thống THG." },
    { q: "Remote Area (Vùng sâu) được xác định như thế nào?", a: "Vùng sâu (Remote Area) được xác định theo hệ thống ZIP code của các hãng vận chuyển quốc tế (USPS, FedEx, DHL).\n\nBao gồm:\n• Alaska, Hawaii, Puerto Rico, Guam\n• APO/FPO (địa chỉ quân sự)\n• Các vùng nông thôn hoặc khó tiếp cận\n\nPhụ phí vùng sâu được tính theo trọng lượng kiện hàng, từ $1.95 (0.05kg) đến $87.82 (30kg). Xem chi tiết trong bảng Phụ Phí Vùng Sâu." },
    { q: "THG hỗ trợ dịch vụ POD (Print on Demand) không?", a: "Có, THG cung cấp dịch vụ POD (Print on Demand) với chất lượng cao:\n\n• Thời gian sản xuất: 2-4 ngày làm việc.\n• Chính sách đổi trả: 7 ngày cho vấn đề chất lượng.\n• Tích hợp TikTok Shipping: tự động tạo nhãn vận chuyển và đồng bộ real-time.\n• Hỗ trợ gửi từ cả VN và CN đi USA/Worldwide." },
];

/* ─── Policy Content Renderer ─── */
const renderPolicyContent = (text: string) => {
    return text.split('\n').map((line, i) => {
        if (!line.trim()) return null;
        if (line.startsWith('### ')) {
            return <strong key={i} className="block mt-5 mb-2 text-navy text-[14px] uppercase tracking-wide">{line.replace('### ', '')}</strong>;
        }
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
            <span key={i} className="block mb-2 pl-2">
                {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j} className="text-navy font-bold">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
            </span>
        );
    });
};

/* ─── Route Policy Content ─── */
export const RoutePolicyContent = ({ policies }: { policies: typeof larkPoliciesI18n }) => {
    const { effectiveLanguage: language } = useI18n();

    const headerTitle = language === 'vi' ? 'Chính sách vận chuyển (Shipping Policies)'
        : language === 'zh' ? '运输政策 (Shipping Policies)' : 'Shipping Policies';
    const headerDesc = language === 'vi' ? 'Các điều khoản và chính sách áp dụng cho tuyến vận chuyển này.'
        : language === 'zh' ? '适用于此运输路线的条款和政策。' : 'Terms and policies applicable to this shipping route.';
    const policyPrefix = language === 'vi' ? 'Điều khoản tuyến'
        : language === 'zh' ? '路线条款' : 'Route Terms';

    return (
        <div className="flex flex-col gap-2.5 pb-2">
            <div className="bg-[#F7F5F0] border border-[var(--pricing-border)] rounded-xl px-4 py-3 mb-2 flex gap-3 text-[13px]">
                <span className="text-xl">🛡️</span>
                <div>
                    <strong className="text-navy block mb-1 notranslate" translate="no">{headerTitle}</strong>
                    <p className="text-muted-foreground notranslate" translate="no">{headerDesc}</p>
                </div>
            </div>
            {policies.map((item, idx) => {
                const content = language === 'vi'
                    ? (item.content?.vi || item.content?.en || '')
                    : (item.content?.en || '');
                const langAttr = language === 'zh' ? 'en' : language;
                const rawTitle = item.title?.vi || item.title?.en || '';
                let cleanTitle = rawTitle
                    .replace(/^Điều khoản tuyến\s*/i, '')
                    .replace(/^Policy\s*/i, '');
                if (language === 'en') {
                    cleanTitle = cleanTitle
                        .replace(/\(Hàng Thường\)/gi, '(Regular Goods)')
                        .replace(/\(Mỹ Phẩm\)/gi, '(Cosmetics)')
                        .replace(/\(Pin\)/gi, '(Batteries)');
                } else if (language === 'zh') {
                    cleanTitle = cleanTitle
                        .replace(/\(Hàng Thường\)/gi, '(普通货物)')
                        .replace(/\(Mỹ Phẩm\)/gi, '(化妆品)')
                        .replace(/\(Pin\)/gi, '(电池)');
                }
                return (
                    <details key={"policy-" + idx} className="group bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden" open={policies.length === 1}>
                        <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-bold text-[13px] md:text-[14px] text-navy hover:text-primary transition-colors">
                            <span className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-[22px] h-[22px] mt-0.5 shrink-0 rounded-full bg-[#1A2E44] text-white text-[12px] font-black">{idx + 1}</span>
                                <span className="leading-snug notranslate" translate="no">{policyPrefix} {cleanTitle}</span>
                            </span>
                            <span className="transition-transform duration-300 group-open:-rotate-180 shrink-0 ml-4">
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </span>
                        </summary>
                        <div lang={langAttr} translate="yes" className="px-[52px] pb-6 text-[13px] text-navy/80 font-medium leading-relaxed border-t border-[var(--pricing-border)]/30 mt-1 pt-3">
                            {renderPolicyContent(content)}
                        </div>
                    </details>
                );
            })}
        </div>
    );
};

/* ─── Shipping Terms Q&A Panel ─── */
const ShippingTermsQnAPanel = () => {
    return (
        <div className="flex flex-col gap-2.5 pb-2">
            <div className="bg-[#F7F5F0] border border-[var(--pricing-border)] rounded-xl px-4 py-3 mb-2 flex gap-3 text-[13px]">
                <span className="text-xl">📄</span>
                <div>
                    <strong className="text-navy block mb-1">Mục Điều khoản quy định chung</strong>
                    <p className="text-muted-foreground">Để đảm bảo quyền lợi, vui lòng đọc kỹ Các câu hỏi thường gặp bên dưới. Những thắc mắc khác vui lòng liên hệ trực tiếp cho Support của THG.</p>
                </div>
            </div>
            {qnaList.map((item, index) => (
                <details key={index} className="group bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-bold text-[13px] md:text-[14px] text-navy hover:text-primary transition-colors">
                        <span className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-[22px] h-[22px] mt-0.5 shrink-0 rounded-full bg-primary/10 text-primary text-[12px] font-black">{index + 1}</span>
                            <span className="leading-snug">{item.q}</span>
                        </span>
                        <span className="transition-transform duration-300 group-open:-rotate-180 shrink-0 ml-4">
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </span>
                    </summary>
                    <div className="px-[52px] pb-4 text-[14px] text-navy/80 font-medium leading-relaxed whitespace-pre-line border-t border-[var(--pricing-border)]/30 mt-1 pt-3">
                        {item.a}
                    </div>
                </details>
            ))}
        </div>
    );
};

export default ShippingTermsQnAPanel;
