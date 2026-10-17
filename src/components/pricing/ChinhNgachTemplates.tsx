import { useState, type ReactNode } from "react";

import { trackEvent } from "@/lib/analytics";

// "Mẫu giấy tờ" (pane-mgt) as the XKCN Hub v6.0 sheet lays it out: a 2×2 grid
// of cards, and one detail panel under the grid for the card you pick, with a
// close button. The four detail bodies are the sheet's markup transcribed to
// JSX; inline styles are the sheet's own.
//
// The sheet embedded its nine sample files as base64 data URIs, which is most
// of why it weighs 3.2 MB. They are served from public/chinh-ngach-docs/ and
// referenced by path. They were named .png while being JPEG throughout, so the
// extensions — and the "(JPG)" in the copy — match the bytes.

/** Served from public/, so the path is absolute and needs no import. */
const DOC_ASSET_BASE = "/chinh-ngach-docs/";

function CommercialInvoice() {
    return (
        <>
            <div className="ior-section">
                <div className="ior-section-title">📘 Commercial Invoice là gì?</div>
                <div className="ior-def">
                    <strong>Commercial Invoice (Hóa đơn thương mại)</strong> là chứng từ thương mại quan trọng nhất trong bộ hồ sơ xuất khẩu. Đây là căn cứ để hải quan Mỹ (<strong>CBP</strong>) xác định giá trị hàng hóa, áp mã HS Code, tính thuế nhập khẩu, và xét duyệt thông quan.
                    <br /><br />
                    Commercial Invoice khác với Invoice nội địa — phải ghi đầy đủ thông tin theo yêu cầu của <strong>19 CFR Part 141</strong> (Quy định hải quan Mỹ).
                </div>
            </div>
            <div className="ior-grid">
                <div className="ior-item"><div className="ior-item-label">Ai lập?</div><div className="ior-item-val">Người bán / Exporter (doanh nghiệp Việt Nam)</div></div>
                <div className="ior-item"><div className="ior-item-label">Ngôn ngữ</div><div className="ior-item-val">Tiếng Anh — bắt buộc khi nhập vào Mỹ</div></div>
                <div className="ior-item"><div className="ior-item-label">Số bản cần có</div><div className="ior-item-val">Tối thiểu 3 bản gốc (Exporter / Forwarder / Importer)</div></div>
                <div className="ior-item"><div className="ior-item-label">Căn cứ pháp lý</div><div className="ior-item-val">19 CFR §141.86 — CBP Commercial Invoice Requirements</div></div>
            </div>
            <div className="ior-section" style={{ marginTop: 18 }}>
                <div className="ior-section-title">📋 Các thông tin bắt buộc trên Commercial Invoice (theo CBP)</div>
                <div className="two-col">
                    <div className="info-box green">
                        <h4>✅ Thông tin người mua / bán</h4>
                        <ul>
                            <li>Tên + địa chỉ đầy đủ của Exporter (Seller)</li>
                            <li>Tên + địa chỉ đầy đủ của Consignee (Buyer/IOR)</li>
                            <li>Số Invoice + ngày lập</li>
                            <li>Điều kiện giao hàng (Incoterms 2020)</li>
                            <li>Phương thức thanh toán (TT, LC, DP...)</li>
                        </ul>
                    </div>
                    <div className="info-box blue">
                        <h4>📦 Thông tin hàng hóa</h4>
                        <ul>
                            <li>Mô tả hàng hóa đầy đủ (tên, quy cách, chất liệu)</li>
                            <li>HS Code (6 chữ số trở lên)</li>
                            <li>Số lượng, đơn vị tính</li>
                            <li>Đơn giá + tổng giá (USD)</li>
                            <li>Nước xuất xứ (Country of Origin: Vietnam)</li>
                            <li>Trọng lượng tịnh / gross</li>
                        </ul>
                    </div>
                </div>
                <div className="note amber" style={{ marginTop: 12 }}>⚠️ <strong>Lỗi phổ biến:</strong> Ghi giá thấp hơn thực tế (undervalue) để tránh thuế → CBP phát hiện sẽ phạt gấp đôi thuế + tịch thu hàng. Ghi sai HS Code → truy thu thuế + penalize.</div>
            </div>
            <div className="ior-section" style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--bd)" }}>
                <div className="ior-section-title">🖼️ Mẫu Commercial Invoice tham khảo</div>
                <div style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: 14, lineHeight: "1.65" }}>Bấm vào từng mẫu để xem và tải về (JPG). Các mẫu dưới đây được sử dụng thực tế trong xuất nhập khẩu quốc tế.</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <a href={`${DOC_ASSET_BASE}CI_Mau_1.jpg`} download="CI_Mau_1.jpg" className="img-download-card">
                        <img src={`${DOC_ASSET_BASE}CI_Mau_1.jpg`} alt="Commercial Invoice mẫu 1" loading="lazy" />
                        <div className="img-dl-label">⬇️ Tải mẫu CI — Dạng bảng chuẩn</div>
                    </a>
                    <a href={`${DOC_ASSET_BASE}CI_Mau_2.jpg`} download="CI_Mau_2.jpg" className="img-download-card">
                        <img src={`${DOC_ASSET_BASE}CI_Mau_2.jpg`} alt="Commercial Invoice mẫu 2" loading="lazy" />
                        <div className="img-dl-label">⬇️ Tải mẫu CI — Casio format</div>
                    </a>
                    <a href={`${DOC_ASSET_BASE}CI_Mau_3.jpg`} download="CI_Mau_3.jpg" className="img-download-card">
                        <img src={`${DOC_ASSET_BASE}CI_Mau_3.jpg`} alt="Commercial Invoice mẫu 3" loading="lazy" />
                        <div className="img-dl-label">⬇️ Tải mẫu CI — Microdyn Singapore</div>
                    </a>
                    <a href={`${DOC_ASSET_BASE}CI_Mau_4.jpg`} download="CI_Mau_4.jpg" className="img-download-card">
                        <img src={`${DOC_ASSET_BASE}CI_Mau_4.jpg`} alt="Commercial Invoice mẫu 4" loading="lazy" />
                        <div className="img-dl-label">⬇️ Tải mẫu CI — Trương Phú Vinh</div>
                    </a>
                </div>
            </div>
        </>
    );
}

function PackingList() {
    return (
        <>
            <div className="ior-section">
                <div className="ior-section-title">📘 Packing List là gì?</div>
                <div className="ior-def">
                    <strong>Packing List (Phiếu đóng gói)</strong> là chứng từ mô tả chi tiết cách đóng gói hàng hóa trong lô hàng xuất khẩu. Cùng với Commercial Invoice, Packing List giúp hải quan CBP và người nhận hàng kiểm tra, đối chiếu hàng hóa thực tế.
                    <br /><br />
                    Packing List không có giá trị hàng hóa (không ghi giá), chỉ tập trung vào <strong>số lượng, đóng gói, trọng lượng và thể tích</strong>.
                </div>
            </div>
            <div className="ior-grid">
                <div className="ior-item"><div className="ior-item-label">Ai lập?</div><div className="ior-item-val">Người bán / Exporter (doanh nghiệp Việt Nam)</div></div>
                <div className="ior-item"><div className="ior-item-label">Ngôn ngữ</div><div className="ior-item-val">Tiếng Anh — phải khớp với Commercial Invoice</div></div>
                <div className="ior-item"><div className="ior-item-label">Số bản cần có</div><div className="ior-item-val">Tối thiểu 3 bản (Exporter / Forwarder / Importer)</div></div>
                <div className="ior-item"><div className="ior-item-label">Lưu ý quan trọng</div><div className="ior-item-val">Số lượng, trọng lượng phải khớp 100% với B/L và Invoice</div></div>
            </div>
            <div className="ior-section" style={{ marginTop: 18 }}>
                <div className="ior-section-title">📋 Thông tin bắt buộc trong Packing List</div>
                <div className="two-col">
                    <div className="info-box green">
                        <h4>✅ Thông tin chung</h4>
                        <ul>
                            <li>Tên + địa chỉ Shipper và Consignee</li>
                            <li>Số Invoice tham chiếu + ngày</li>
                            <li>Số B/L (nếu đã có)</li>
                            <li>Cảng xếp hàng → Cảng dỡ hàng</li>
                            <li>Phương thức vận chuyển (Sea / Air)</li>
                        </ul>
                    </div>
                    <div className="info-box blue">
                        <h4>📦 Chi tiết từng kiện hàng</h4>
                        <ul>
                            <li>Số thứ tự kiện / mark & number</li>
                            <li>Mô tả hàng hóa trong kiện</li>
                            <li>Số lượng (PCS / CTN / SET...)</li>
                            <li>Trọng lượng tịnh (Net Weight) — kg</li>
                            <li>Trọng lượng cả bì (Gross Weight) — kg</li>
                            <li>Thể tích (CBM)</li>
                        </ul>
                    </div>
                </div>
                <div className="note amber" style={{ marginTop: 12 }}>⚠️ <strong>Lỗi phổ biến:</strong> Trọng lượng trong Packing List không khớp với B/L → hải quan nghi ngờ, có thể kiểm tra thực tế hàng (Luồng đỏ). Số kiện sai → delay thông quan.</div>
            </div>
            <div className="ior-section" style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--bd)" }}>
                <div className="ior-section-title">🖼️ Mẫu Packing List tham khảo</div>
                <div style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: 14, lineHeight: "1.65" }}>Bấm vào từng mẫu để xem và tải về (JPG).</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <a href={`${DOC_ASSET_BASE}PL_Mau_1.jpg`} download="PL_Mau_1.jpg" className="img-download-card">
                        <img src={`${DOC_ASSET_BASE}PL_Mau_1.jpg`} alt="Packing List mẫu 1" loading="lazy" />
                        <div className="img-dl-label">⬇️ Tải mẫu PL — Dạng bảng quốc tế</div>
                    </a>
                    <a href={`${DOC_ASSET_BASE}PL_Mau_2.jpg`} download="PL_Mau_2.jpg" className="img-download-card">
                        <img src={`${DOC_ASSET_BASE}PL_Mau_2.jpg`} alt="Packing List mẫu 2" loading="lazy" />
                        <div className="img-dl-label">⬇️ Tải mẫu PL — Long Uyen format</div>
                    </a>
                    <a href={`${DOC_ASSET_BASE}PL_Mau_3.jpg`} download="PL_Mau_3.jpg" className="img-download-card">
                        <img src={`${DOC_ASSET_BASE}PL_Mau_3.jpg`} alt="Packing List mẫu 3" loading="lazy" />
                        <div className="img-dl-label">⬇️ Tải mẫu PL — Shandong CHT format</div>
                    </a>
                    <a href={`${DOC_ASSET_BASE}PL_Mau_4.jpg`} download="PL_Mau_4.jpg" className="img-download-card">
                        <img src={`${DOC_ASSET_BASE}PL_Mau_4.jpg`} alt="Packing List mẫu 4" loading="lazy" />
                        <div className="img-dl-label">⬇️ Tải mẫu PL — Trương Phú Vinh format</div>
                    </a>
                </div>
            </div>
        </>
    );
}

function IorAgreement() {
    return (
        <>

            <div className="ior-section">
                <div className="ior-section-title">📘 IOR là gì?</div>
                <div className="ior-def">
                    <strong>IOR (Importer of Record)</strong> — Người Nhập Khẩu Chính Thức — là cá nhân hoặc tổ chức <strong>chịu trách nhiệm pháp lý</strong> về việc hàng hóa được nhập khẩu hợp pháp vào Mỹ. IOR phải có mã số thuế hoặc EIN tại Mỹ, đứng tên trên tờ khai hải quan CBP, và chịu trách nhiệm nộp thuế nhập khẩu.
                    <br /><br />
                    Với doanh nghiệp Việt Nam <strong>chưa có công ty LLC tại Mỹ</strong>, TH Group cung cấp dịch vụ IOR thông qua đối tác <strong>RES Trade &amp; Transit LLC</strong> — đứng tên nhập khẩu hàng hóa thay mặt khách hàng.
                </div>
            </div>
            <div className="ior-grid">
                <div className="ior-item"><div className="ior-item-label">Bên cung cấp IOR</div><div className="ior-item-val">RES Trade &amp; Transit LLC<br /><span style={{ fontSize: 11, color: "var(--muted)" }}>502 W 7th ST STE 100, Erie, PA 16592</span></div></div>
                <div className="ior-item"><div className="ior-item-label">Mã số doanh nghiệp</div><div className="ior-item-val" style={{ fontFamily: "'JetBrains Mono',monospace" }}>EIN: 33-5019901</div></div>
                <div className="ior-item"><div className="ior-item-label">Kho nhận hàng</div><div className="ior-item-val">4136 Sunflower Circle<br />Winston-Salem, NC 27105</div></div>
                <div className="ior-item"><div className="ior-item-label">Phương thức thanh toán</div><div className="ior-item-val">Bank transfer USD<br /><span style={{ fontSize: 11, color: "var(--muted)" }}>Bank of America · SWIFT: BOFAUS3N</span></div></div>
            </div>

            <div className="ior-section" style={{ marginTop: 18 }}>
                <div className="ior-section-title">⚡ Khi nào cần IOR?</div>
                <div className="two-col" style={{ marginBottom: "0" }}>
                    <div className="info-box green"><h4>✅ Bắt buộc phải có IOR khi</h4><ul><li>Hàng trị giá trên $800 USD vào Mỹ</li><li>Doanh nghiệp VN chưa có LLC tại Mỹ</li><li>Nhập hàng theo đường sea/air chính ngạch</li><li>Cần thông quan CBP hợp lệ</li></ul></div>
                    <div className="info-box blue"><h4>📋 Nội dung hợp đồng IOR bao gồm</h4><ul><li>Lưu kho và quản lý tồn kho tại Mỹ</li><li>Xử lý đơn hàng (pick, pack, ship)</li><li>Mua nhãn vận chuyển USPS/UPS/FedEx</li><li>Báo cáo tồn kho hàng tháng</li></ul></div>
                </div>
            </div>

            <div className="ior-section" style={{ marginTop: 18 }}>
                <div className="ior-section-title">📋 Quy trình ký kết và sử dụng IOR</div>
                <div className="ior-steps">
                    <div className="ior-step"><div className="ior-step-num">01</div><div className="ior-step-body"><div className="ior-step-title">Tải file hợp đồng mẫu</div><div className="ior-step-desc">Tải về file DOCX bên dưới, điền thông tin Bên A (doanh nghiệp của bạn): tên, địa chỉ, mã số thuế, người đại diện.</div></div></div>
                    <div className="ior-step"><div className="ior-step-num">02</div><div className="ior-step-body"><div className="ior-step-title">Gửi cho TH Group review</div><div className="ior-step-desc">Gửi bản điền về <strong>sale@thgfulfill.com</strong> để TH Group kiểm tra và kết nối với đối tác RES Trade &amp; Transit LLC tại Mỹ.</div></div></div>
                    <div className="ior-step"><div className="ior-step-num">03</div><div className="ior-step-body"><div className="ior-step-title">Ký kết &amp; hiệu lực</div><div className="ior-step-desc">Hai bên ký kết điện tử hoặc bản cứng. Hợp đồng có hiệu lực ngay — TH Group cung cấp số hợp đồng để gắn vào bộ chứng từ xuất khẩu.</div></div></div>
                    <div className="ior-step"><div className="ior-step-num">04</div><div className="ior-step-body"><div className="ior-step-title">Sử dụng IOR cho lô hàng</div><div className="ior-step-desc">Ghi thông tin RES Trade &amp; Transit LLC vào Commercial Invoice và bộ chứng từ. TH Group đứng tên thông quan tại CBP thay bạn.</div></div></div>
                </div>
            </div>

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--bd)" }}>
                <div style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: 12, lineHeight: "1.65" }}>📁 File hợp đồng mẫu song ngữ Anh–Việt. Mở bằng Microsoft Word hoặc Google Docs để chỉnh sửa thông tin Bên A.</div>
                <a className="download-btn" href={`${DOC_ASSET_BASE}THG_IOR_Agreement_Mau.docx`} download="THG_IOR_Agreement_Mau.docx">
                    <span className="dl-icon">⬇️</span>Tải hợp đồng IOR mẫu (.docx)
                </a>
                <div style={{ marginTop: 10, fontSize: "11.5px", color: "var(--muted)" }}>Cần hỗ trợ điền và ký hợp đồng? Liên hệ <strong>sale@thgfulfill.com</strong> · <strong>033 512 4089</strong></div>
            </div>
        </>
    );
}

function ExportDeclaration() {
    return (
        <>
            <div className="ior-def" style={{ marginBottom: 16 }}>
                <strong>Tờ khai hải quan xuất khẩu</strong> là văn bản pháp lý khai báo thông tin hàng hóa với Hải quan Việt Nam khi xuất khẩu. Từ năm 2014, Việt Nam áp dụng hệ thống khai báo điện tử <strong>VNACCS/VCIS</strong> — doanh nghiệp khai báo online và nhận kết quả phân luồng tự động.
            </div>
            <div className="two-col" style={{ marginBottom: 16 }}>
                <div className="info-box gray"><h4>📌 Thông tin bắt buộc phải khai</h4><ul><li>Tên hàng hóa + HS Code chính xác</li><li>Số lượng, trọng lượng, trị giá (USD)</li><li>Điều kiện giao hàng (Incoterms)</li><li>Cảng xếp hàng và cảng dỡ hàng</li><li>Phương tiện vận chuyển</li></ul></div>
                <div className="info-box amber"><h4>⚠️ Lỗi hay gặp khi khai tờ khai</h4><ul><li>Sai HS Code → truy thu thuế</li><li>Trị giá thấp hơn thực tế → vi phạm</li><li>Thiếu giấy phép XK (nếu có)</li><li>Không khớp với Commercial Invoice</li></ul></div>
            </div>
            <div className="luong-row">
                <div className="lcard xanh"><div className="ln">🟢 Luồng Xanh</div><div className="lp">Thông ngay</div><div className="lsub">Không cần kiểm tra thêm · Phổ biến nhất</div></div>
                <div className="lcard vang"><div className="ln">🟡 Luồng Vàng</div><div className="lp">Kiểm CT</div><div className="lsub">Hải quan kiểm tra chứng từ giấy tờ</div></div>
                <div className="lcard do"><div className="ln">🔴 Luồng Đỏ</div><div className="lp">Kiểm hàng</div><div className="lsub">Kiểm tra thực tế hàng hóa · Mất thêm 1–3 ngày</div></div>
            </div>
            <div className="note blue" style={{ marginTop: 16 }}>💡 <strong>TH Group hỗ trợ toàn bộ:</strong> Khai báo tờ khai hải quan điện tử, nộp ISF, và thông quan nhập khẩu tại CBP — doanh nghiệp chỉ cần cung cấp thông tin hàng hóa và chứng từ. Liên hệ <strong>sale@thgfulfill.com</strong> để được hỗ trợ.</div>
        </>
    );
}

interface Template {
    id: "ci" | "pl" | "ior" | "tk";
    icon: string;
    title: string;
    sub: string;
    /** The detail panel's own header line, worded differently in the sheet. */
    panelSub: string;
    Body: () => ReactNode;
}

const TEMPLATES: readonly Template[] = [
    { id: "ci", icon: "🧾", title: "Commercial Invoice", sub: "Hóa đơn thương mại — hướng dẫn điền theo chuẩn CBP", panelSub: "Hóa đơn thương mại — chuẩn CBP Mỹ", Body: CommercialInvoice },
    { id: "pl", icon: "📦", title: "Packing List", sub: "Phiếu đóng gói — cấu trúc chuẩn và cách điền theo từng loại hàng", panelSub: "Phiếu đóng gói — cấu trúc chuẩn TH Group", Body: PackingList },
    { id: "ior", icon: "🛡️", title: "Hợp đồng ủy thác nhập khẩu (IOR)", sub: "Warehouse & Order Fulfillment Service Agreement — tải file mẫu TH Group", panelSub: "Warehouse & Order Fulfillment Service Agreement", Body: IorAgreement },
    { id: "tk", icon: "📋", title: "Tờ khai hải quan xuất khẩu", sub: "Hướng dẫn khai báo hải quan điện tử VNACCS", panelSub: "Hướng dẫn khai báo điện tử VNACCS", Body: ExportDeclaration },
];

export function ChinhNgachTemplates() {
    const [openId, setOpenId] = useState<Template["id"] | null>(null);
    const open = TEMPLATES.find((tpl) => tpl.id === openId);

    function show(id: Template["id"]) {
        setOpenId(id);
        // As the sheet does: bring the panel into view once it has rendered.
        window.setTimeout(() => document.getElementById("mgtDetailPanel")?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
    }

    return (
        <>
            <div className="mgt-intro">Bấm vào từng mục để xem hướng dẫn chi tiết và tải file mẫu.</div>
            <div className="mgt-grid">
                    {TEMPLATES.map((tpl) => (
                            <button
                                    key={tpl.id}
                                    type="button"
                                    id={`mgt-${tpl.id}`}
                                    className={`mgt-card${openId === tpl.id ? " active" : ""}`}
                                    aria-expanded={openId === tpl.id}
                                    aria-controls="mgtDetailPanel"
                                    onClick={() => show(tpl.id)}
                            >
                                    <div className="mgt-card-head">
                                            <div className="mgt-icon" aria-hidden="true">{tpl.icon}</div>
                                            <div>
                                                    <div className="mgt-title">{tpl.title}</div>
                                                    <div className="mgt-sub">{tpl.sub}</div>
                                            </div>
                                            <span className="mgt-badge">Xem →</span>
                                    </div>
                            </button>
                    ))}
            </div>

            {open && (
                    <div className="mgt-detail-panel active" id="mgtDetailPanel" role="region" aria-label={open.title}>
                            <div className="mgt-detail-panel-header">
                                    <span className="ph-icon" aria-hidden="true">{open.icon}</span>
                                    <div>
                                            <div className="ph-title">{open.title}</div>
                                            <div className="ph-sub">{open.panelSub}</div>
                                    </div>
                                    <button type="button" className="ph-close" aria-label="Đóng" onClick={() => setOpenId(null)}>✕</button>
                            </div>
                            {/* One listener for every sample file in the body: taking the IOR
                                    contract is an intent signal worth counting. */}
                            <div
                                    className="mgt-detail-panel-body"
                                    onClick={(e) => {
                                            const file = (e.target as HTMLElement).closest("a[download]")?.getAttribute("download");
                                            if (file) trackEvent("download_template", { template: open.id, file });
                                    }}
                            >
                                    <open.Body />
                            </div>
                    </div>
            )}
        </>
    );
}
