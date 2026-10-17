import type { CSSProperties, ReactNode } from "react";

import { LeadFormDialog } from "@/components/lead/LeadFormDialog";

// "Hướng dẫn đọc bảng giá" (bgp-huongdan), transcribed from the XKCN Hub v6.0
// sheet as markup: its numbered navy/gold banners, the use-this-vs-that pairs,
// the comparison table and the glossary. Static reference copy, so it lives
// here rather than in the CMS. The sheet's two "#" links switch views, so they
// are buttons; its mailto CTA opens the lead form.

const LINK = { color: "var(--blue)", fontWeight: 600 } as const;

/** The sheet's in-page link: an underlined anchor that switches views in place.
 *  Its href is the rates pane it lives in, so it stays a real link without JS;
 *  with JS the click is handled here and the URL is left alone. */
function SheetLink({ style, onClick, children }: Readonly<{ style: CSSProperties; onClick?: () => void; children: ReactNode }>) {
    return (
        <a
            href="#bang-gia"
            className="xkcn-link"
            style={style}
            onClick={(e) => {
                e.preventDefault();
                onClick?.();
            }}
        >
            {children}
        </a>
    );
}

function Banner({ num, title, sub }: Readonly<{ num: string; title: string; sub: string }>) {
    return (
        <div className="g-banner">
            <div className="g-num">{num}</div>
            <div className="g-content"><div className="g-title">{title}</div><div className="g-sub">{sub}</div></div>
        </div>
    );
}

export function ChinhNgachRateGuide({ onShowRates, onJumpToQuotation }: Readonly<{
    onShowRates?: () => void;
    onJumpToQuotation?: () => void;
}>) {
    return (
        <div className="wrap">
            <div className="phead">
                <div className="phead-tag">📖 Hướng dẫn đọc bảng giá</div>
                <h2>Hướng Dẫn Đọc Bảng Giá Chính Ngạch</h2>
                <p>Dành cho người mới — giải thích từng phần từ đầu · <SheetLink style={LINK} onClick={onShowRates}>Xem bảng giá →</SheetLink></p>
            </div>
            <Banner num="?" title="Vận chuyển chính ngạch là gì?" sub="Đọc phần này trước" />
            <p style={{ fontSize: 14, marginBottom: 14 }}><strong>Chính ngạch</strong> là vận chuyển hàng hóa thương mại <strong>hợp pháp, đầy đủ giấy tờ, khai báo hải quan đúng quy định</strong> tại cả Việt Nam lẫn Mỹ.</p>
            <div className="two-col">
                <div className="info-box green"><h4>✅ Nên dùng chính ngạch khi</h4><ul><li>Hàng từ 50 kg trở lên</li><li>Nhập kho FBA Amazon</li><li>Cần hóa đơn xuất nhập khẩu hợp lệ</li><li>Muốn giá rẻ hơn DHL/FedEx</li><li>Hàng giá trị cao, cần bảo hiểm</li></ul></div>
                <div className="info-box amber"><h4>⚡ Dùng Air Express (DHL) khi</h4><ul><li>Hàng nhỏ, dưới 50 kg</li><li>Cần giao trong 3–5 ngày</li><li>POD đơn lẻ (từng đơn hàng)</li><li>Hàng mẫu, thử nghiệm</li></ul></div>
            </div>
            <div className="divider" />
            <Banner num="1" title="Ba hình thức vận chuyển trong bảng giá" sub="Sea Matson · Sea thường · Air" />
            <div className="xkcn-scroll">
                <table className="g-table">
                    <thead><tr><th>Hình thức</th><th>Thời gian</th><th>Phù hợp với</th><th>Giá tương đối</th></tr></thead>
                    <tbody>
                        <tr className="ghl"><td>🚢 MATSON (Line Hỏa Tốc)</td><td>17–18 ngày</td><td>Cần nhanh, lịch cố định Thứ 5</td><td>Cao hơn Sea thường</td></tr>
                        <tr><td>🌊 Sea thường</td><td>18–40 ngày</td><td>Không gấp, muốn giá rẻ</td><td>Rẻ nhất</td></tr>
                        <tr><td>✈️ Air (Hàng không)</td><td>7–8 ngày port-to-port</td><td>Hàng gấp, giá trị cao</td><td>Đắt nhất</td></tr>
                    </tbody>
                </table>
            </div>
            <div className="divider" />
            <Banner num="2" title="LCL vs FCL — Hàng lẻ hay nguyên container?" sub="Khái niệm cần hiểu trước khi xem giá Sea" />
            <div className="two-col">
                <div className="info-box green"><h4>📦 LCL — Hàng lẻ</h4><p style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: 8 }}>Nhiều khách gom chung 1 container. Tính theo CBM hoặc MT, lấy số nào lớn hơn.</p><ul><li>Phù hợp dưới ~12 CBM</li><li>Mới bắt đầu, chưa đủ hàng</li></ul></div>
                <div className="info-box blue"><h4>🚢 FCL — Nguyên container</h4><p style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: 8 }}>Thuê riêng 1 container. Giá mỗi CBM rẻ hơn LCL đáng kể khi hàng đủ nhiều.</p><ul><li>Phù hợp từ ~12 CBM trở lên</li><li>20GP: ~25 CBM · 40HC: ~68 CBM</li></ul></div>
            </div>
            <div className="note green">💡 <strong>Quy tắc:</strong> Dưới 10 CBM → LCL. Trên 12 CBM → FCL. Từ 10–12 CBM → hỏi TH Group.</div>
            <div className="divider" />
            <Banner num="3" title="MATSON · Sea thường · Air — Chi tiết giá và phụ phí" sub="Xem tab Bảng giá để tra cứu đầy đủ" />
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Tất cả giá cước, phụ phí, địa chỉ CFS, lịch cut-off và bảng hải quan luồng xanh/vàng/đỏ được hiển thị đầy đủ trong tab <strong>Bảng giá</strong>.</p>
            <div className="note blue">📋 Muốn xem dự toán chi phí trọn gói cho 1 lô hàng cụ thể (HPH → HOU, 1×40HC)? <SheetLink style={{ color: "var(--blue)", fontWeight: 700 }} onClick={onJumpToQuotation}>Xem tab Dự toán chi phí →</SheetLink></div>
            <div className="divider" />
            <Banner num="📖" title="Bảng giải thích thuật ngữ" sub="Tra cứu khi gặp từ lạ" />
            <div className="glossgrid">
                <div className="glossitem"><div className="term">LCL / FCL</div><div className="def">Hàng lẻ gom chung / Nguyên container thuê riêng</div></div>
                <div className="glossitem"><div className="term">CBM / MT / W/M</div><div className="def">Mét khối / Tấn (1.000 kg) / Lấy số lớn hơn giữa CBM và MT</div></div>
                <div className="glossitem"><div className="term">CFS</div><div className="def">Kho tập kết hàng LCL trước khi lên container</div></div>
                <div className="glossitem"><div className="term">ETD / ETA / Cut-off</div><div className="def">Ngày tàu khởi hành / Đến nơi / Deadline nộp hàng</div></div>
                <div className="glossitem"><div className="term">HBL / AMS / ISF</div><div className="def">Vận đơn nhà / Khai báo điện tử / An ninh nhập khẩu Mỹ</div></div>
                <div className="glossitem"><div className="term">FAF / MAF</div><div className="def">Phụ phí nhiên liệu &amp; cảng biển — đã gộp vào giá Matson FCL</div></div>
                <div className="glossitem"><div className="term">FBA / All-in / DDP</div><div className="def">Kho Amazon / Báo giá trọn gói / Delivered Duty Paid</div></div>
                <div className="glossitem"><div className="term">Luồng xanh/vàng/đỏ</div><div className="def">Phân loại kiểm tra HQ: xanh=thông ngay · vàng=kiểm chứng từ · đỏ=kiểm hàng</div></div>
            </div>
            <div className="cta" style={{ marginTop: 28 }}>
                <LeadFormDialog
                    sourcePage="/chinh-ngach-pricing#huong-dan"
                    defaultMessage="Liên hệ báo giá All-in trọn gói"
                    trigger={<button type="button" className="cta-link">📞 Liên hệ báo giá All-in trọn gói</button>}
                />
            </div>
        </div>
    );
}
