import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import ScrollReveal from "@/components/ScrollReveal";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CAREERS_JOBS_I18N } from "@/data/careers_i18n";

/* ─── TYPES ─── */
interface Benefit { i: string; t: string; d: string; }
interface Job {
    id: string; cat: string; filter: string; hot?: boolean;
    badge: string; tagline: string; title: string; desc: string;
    salary: string; salaryUnit: string; salaryNote: string;
    location: string; type: string; deadline: string; experience: string;
    lead: string;
    responsibilities: Record<string, string[]>;
    requirements: string[];
    benefits: Benefit[];
    bonuses: string[];
}

/* ─── ACCENT COLORS ─── */
const ACCENT: Record<string, string> = {
    ai: "#2E6F8E",
    finance: "#6B8E5A", "sales-pod": "#C17B5E", "sales-ship": "#5A7A8E",
    "sales-wh": "#8B6B9A", ops: "#D4A548", sourcing: "#B85C6E",
};

/* ─── JOB DATA ─── */
const JOBS: Job[] = [
    {
        id: "ai-intern", cat: "ai", filter: "ai", hot: true, badge: "🤖 AI R&D · Internship",
        tagline: '"Xây dựng lớp AI cho hệ sinh thái fulfillment xuyên biên giới."',
        title: "Thực tập sinh Nghiên cứu AI",
        desc: "Tham gia R&D các giải pháp AI ứng dụng vào vận hành thực tế của THG — từ AI Agent chăm sóc khách đến tool sourcing tự động trên 1688/Taobao.",
        salary: "2 triệu", salaryUnit: "+ thưởng theo dự án", salaryNote: "Mentor 1-1 với CEO · Cơ hội làm dự án AI thực tế",
        location: "TP.HCM · Hybrid", type: "Internship 3–6 tháng", deadline: "15/05/2026", experience: "Không bắt buộc",
        lead: "Nếu bạn đang là sinh viên ngành công nghệ và có niềm đam mê với AI, đây là cơ hội tuyệt vời để bạn áp dụng kiến thức vào sản phẩm thực tế. Bạn sẽ được cùng đội ngũ THG R&D các giải pháp AI cho vận hành E-commerce xuyên biên giới, được mentor bởi CEO — chuyên gia chuyển đổi số cho cộng đồng Seller quốc tế. THG tạo môi trường để bạn học hỏi, thử nghiệm và trưởng thành cùng các dự án AI thực tế.",
        responsibilities: {
            "Tham gia R&D các giải pháp AI": ["Cùng team nghiên cứu và thử nghiệm các giải pháp AI ứng dụng vào THG", "Hỗ trợ xây dựng AI Agent tự động hóa các tác vụ chăm sóc khách hàng", "Tham gia dự án AI Sourcing — hỗ trợ tìm kiếm & phân tích sản phẩm trên 1688/Taobao", "Hỗ trợ phát triển các công cụ AI nội bộ giúp đội CSKH/Sales làm việc hiệu quả hơn"],
            "Học hỏi & thử nghiệm": ["Tìm hiểu và thử nghiệm các công cụ AI hiện đại (ChatGPT, Claude, n8n...)", "Được hướng dẫn cách viết prompt hiệu quả cho các bài toán E-commerce & logistics", "So sánh và lựa chọn model phù hợp cho từng use case của công ty", "Ghi chép tài liệu và chia sẻ lại cho đội vận hành khi được yêu cầu"],
            "Làm việc cùng team": ["Tham gia review dự án AI định kỳ cùng CEO và mentor", "Chủ động đề xuất ý tưởng AI mới cho sản phẩm THG", "Trình bày kết quả nghiên cứu & demo cho team"]
        },
        requirements: ["Đang là sinh viên hoặc mới tốt nghiệp các ngành liên quan: CNTT, Khoa học máy tính, Kỹ thuật phần mềm, Toán - Tin, Khoa học dữ liệu, hoặc các ngành kỹ thuật khác", "Có niềm đam mê thực sự với công nghệ và AI — yếu tố quan trọng nhất", "Tinh thần ham học hỏi, chủ động tìm hiểu — AI là lĩnh vực thay đổi liên tục", "Biết tiếng Anh đọc hiểu tài liệu kỹ thuật cơ bản", "Có kiến thức lập trình cơ bản (bất kỳ ngôn ngữ nào) — sẽ được hỗ trợ học thêm khi cần", "Từng tìm hiểu / thử nghiệm với ChatGPT, Claude hoặc các công cụ AI khác là lợi thế (không bắt buộc)", "Cam kết thực tập tối thiểu 3 tháng — part-time hoặc full-time đều được"],
        benefits: [{ i: "💰", t: "Lương cứng 2 triệu", d: "Cộng thưởng theo từng dự án AI deploy thành công" }, { i: "🎓", t: "Mentor 1-1 với CEO", d: "CEO THG là chuyên gia chuyển đổi số cho cộng đồng Seller quốc tế" }, { i: "🔬", t: "Hỗ trợ công cụ AI", d: "Được cấp quyền sử dụng các AI API & tài nguyên theo từng dự án cụ thể" }, { i: "🏆", t: "Portfolio thực tế", d: "Dự án AI triển khai vào công ty đang vận hành tại 3 nước" }, { i: "🚀", t: "Cơ hội lên chính thức", d: "Hoàn thành tốt → được cân nhắc offer full-time sau kỳ thực tập" }, { i: "🏢", t: "Hybrid linh hoạt", d: "Lên văn phòng 2–3 buổi/tuần, còn lại làm remote" }],
        bonuses: ["Thưởng theo từng milestone dự án AI được hoàn thành", "Thưởng khi giải pháp AI được triển khai vào vận hành thực tế", "Ghi nhận và khen thưởng khi có đóng góp ý tưởng AI hữu ích", "Cơ hội được tài trợ tham dự hội thảo, khóa học về AI tùy theo dự án", "Cơ hội được cân nhắc chuyển thành nhân viên chính thức sau kỳ thực tập"]
    },
    {
        id: "finance", cat: "finance", filter: "finance", badge: "Kế toán · Finance",
        tagline: '"Người giữ sổ sách cho cả hệ sinh thái."',
        title: "Nhân viên Kế toán",
        desc: "Quản lý thu chi, công nợ và hỗ trợ nhân sự cho đội ngũ THG Fulfill. Vị trí then chốt trong bộ máy tài chính.",
        salary: "10 triệu", salaryUnit: "+ thưởng hiệu suất", salaryNote: "Thu nhập thực nhận cao hơn lương cứng",
        location: "TP.HCM", type: "Full-time", deadline: "15/05/2026", experience: "Từ 2 năm",
        lead: "THG Fulfill tìm kiếm một Kế toán kinh nghiệm, cẩn thận và trách nhiệm cao để tham gia quản lý thu chi, theo dõi công nợ và hỗ trợ nhân sự cho đội ngũ đang phát triển nhanh.",
        responsibilities: {
            "Quản lý thu chi nội bộ": ["Ghi chép, kiểm tra và kiểm soát các khoản thu chi hằng ngày", "Lập và quản lý báo cáo thu chi theo tuần / tháng / quý", "Làm báo cáo lợi nhuận (lãi/lỗ) hàng tháng", "Lên phiếu thu / phiếu chi khi phát sinh giao dịch", "Duyệt và chi tiền theo phiếu chi của các bộ phận khác"],
            "Theo dõi công nợ": ["Đối chiếu, theo dõi công nợ phải thu / phải trả trên hệ thống kế toán (Ecount...)", "Theo dõi công nợ tạm ứng của khách hàng, cảnh báo kịp thời", "Lập kế hoạch thanh toán và báo cáo tình hình công nợ định kỳ"],
            "Hỗ trợ nhân sự": ["Theo dõi tình hình nhân sự, làm hợp đồng thử việc / chính thức", "Theo dõi nghỉ phép, đi trễ, về sớm", "Lập các báo cáo nội bộ và thực hiện công việc khác theo phân công"]
        },
        requirements: ["Tốt nghiệp ĐH/CĐ chuyên ngành Kế toán, Tài chính hoặc liên quan", "Có từ 2 năm kinh nghiệm trở lên ở vị trí tương đương", "Thành thạo phần mềm kế toán (MISA, Ecount hoặc tương đương)", "Kỹ năng tổ chức và quản lý thời gian tốt", "Trung thực, cẩn thận và có tinh thần trách nhiệm cao"],
        benefits: [{ i: "💰", t: "Lương cứng 10 triệu", d: "Cộng thưởng hiệu suất & lợi nhuận" }, { i: "🏖️", t: "Company Trip 1–2 lần/năm", d: "Du lịch cùng toàn thể THG" }, { i: "🎁", t: "Thưởng tháng 13", d: "Thưởng Tết & các dịp lễ lớn" }, { i: "🛡️", t: "BHXH / BHYT đầy đủ", d: "Theo quy định pháp luật" }, { i: "⏰", t: "Giờ hành chính", d: "T2–T6: 8h–17h · T7: 8h–12h" }, { i: "🎓", t: "Thử việc 85% lương", d: "2 tháng thử việc — lộ trình thăng tiến rõ ràng" }],
        bonuses: ["Thưởng KPI hàng tháng theo xếp hạng (Grade B / A / A+)", "Thưởng 100% task đúng hạn trong tháng", "Thưởng Nhân viên xuất sắc tháng do CEO chọn", "Các khoản thưởng phúc lợi khác theo hiệu suất công việc"]
    },
    {
        id: "sales-pod", cat: "sales-pod", filter: "sales", badge: "Sales · POD / Dropship",
        tagline: '"Cầu nối giữa Seller toàn cầu và nhà máy Việt – Trung."',
        title: "Nhân viên Sales POD / Dropship",
        desc: "Phát triển khách hàng Seller bán POD, Dropship từ Việt Nam và Trung Quốc đi Mỹ, Châu Âu.",
        salary: "8 triệu", salaryUnit: "+ hoa hồng + thưởng", salaryNote: "Thu nhập không giới hạn theo hiệu suất",
        location: "TP.HCM", type: "Full-time", deadline: "15/05/2026", experience: "Không bắt buộc",
        lead: "THG Fulfill đang mở rộng đội ngũ Sales POD/Dropship để đồng hành cùng hàng ngàn Seller Việt Nam và Trung Quốc đưa sản phẩm đến người tiêu dùng Mỹ, EU và toàn cầu.",
        responsibilities: {
            "Phát triển khách hàng": ["Tìm kiếm khách hàng là các Seller bán online từ VN / TQ đi Mỹ, Châu Âu trong mảng POD, Dropship", "Tư vấn và chăm sóc khách hàng về dịch vụ nguồn hàng, in ấn và vận chuyển", "Xây dựng mối quan hệ tốt với khách hàng hiện có, chủ động tìm kiếm khách hàng mới"],
            "Tư vấn & hỗ trợ": ["Giới thiệu sản phẩm / dịch vụ sẵn có của THG (hơn 1000 mẫu tại kho Mỹ)", "Hỗ trợ khách hàng giải quyết các vấn đề trong quy trình vận hành", "Phối hợp chặt chẽ với đội Operations để đảm bảo trải nghiệm khách hàng tốt nhất"]
        },
        requirements: ["Kinh nghiệm trong lĩnh vực POD hoặc Dropship là một lợi thế (không bắt buộc)", "Kỹ năng giao tiếp và thuyết phục tốt", "Khả năng giải quyết vấn đề và xử lý tình huống nhanh nhẹn", "Chủ động, nhiệt tình và có trách nhiệm trong công việc", "Có tiếng Anh cơ bản để làm việc với khách quốc tế là lợi thế"],
        benefits: [{ i: "💰", t: "Lương cứng 8 triệu", d: "Cộng hoa hồng và thưởng" }, { i: "📈", t: "Hoa hồng không giới hạn", d: "Đạt và vượt KPI càng nhiều, thu nhập càng cao" }, { i: "🚀", t: "Đào tạo POD/Dropship", d: "Đào tạo chuyên sâu về sản phẩm và thị trường quốc tế" }, { i: "🎁", t: "Thưởng tháng 13", d: "Thưởng Tết & các dịp lễ lớn" }, { i: "🏖️", t: "Company Trip", d: "Du lịch cùng công ty hàng năm" }, { i: "⏰", t: "Làm việc linh hoạt", d: "T2–T6: văn phòng · T7 chiều: online" }],
        bonuses: ["Hoa hồng theo bảng doanh thu cá nhân", "Thưởng chốt đơn lớn (Express / Dropship / POD / Warehouse)", "Thưởng khai thác khách hàng mới lần đầu giao dịch", "Thưởng tỷ lệ chốt request cao (≥ 80%)", "Thưởng đưa khách hàng lên hạng VIP trong tháng", "Thưởng KPI hàng tháng theo xếp hạng Grade B / A / A+", "Thưởng Nhân viên xuất sắc tháng do CEO chọn"]
    },
    {
        id: "sales-ship", cat: "sales-ship", filter: "sales", badge: "Sales · Vận chuyển E-commerce",
        tagline: '"Chuyên gia tuyến vận chuyển xuyên biên giới."',
        title: "Nhân viên Sales Vận chuyển Quốc tế",
        desc: "Tư vấn gói cước vận chuyển Ecommerce cho Seller trên TikTok Shop US, Shopify, Amazon, Etsy...",
        salary: "8 triệu", salaryUnit: "+ hoa hồng + thưởng", salaryNote: "Thu nhập không giới hạn theo hiệu suất",
        location: "TP.HCM", type: "Full-time", deadline: "15/05/2026", experience: "Không bắt buộc",
        lead: "THG đang tìm kiếm Sales có niềm đam mê với logistics xuyên biên giới, chuyên tư vấn các gói cước vận chuyển cho cộng đồng Seller đang kinh doanh trên TikTok Shop US, Shopify, Amazon, Etsy.",
        responsibilities: {
            "Phát triển khách hàng": ["Tìm kiếm Seller Việt Nam kinh doanh trên TikTok Shop US, Shopify, Amazon, Etsy", "Tiếp cận khách có nhu cầu vận chuyển hàng từ VN / TQ sang Mỹ hoặc toàn cầu", "Tư vấn gói cước vận chuyển Ecommerce phù hợp theo nhu cầu"],
            "Xử lý & chăm sóc": ["Tiếp nhận yêu cầu vận chuyển từ khách và chuyển bộ phận xử lý", "Theo dõi và cập nhật trạng thái đơn hàng cho khách hàng", "Hỗ trợ giải đáp thắc mắc liên quan đến quy trình vận chuyển"]
        },
        requirements: ["Kinh nghiệm trong lĩnh vực vận chuyển E-commerce là lợi thế", "Kỹ năng giao tiếp và tư vấn tốt", "Khả năng giải quyết vấn đề và xử lý tình huống nhanh nhẹn", "Kỹ năng tổ chức công việc và quản lý thời gian hiệu quả", "Chủ động, tận tâm với khách hàng và có trách nhiệm cao"],
        benefits: [{ i: "💰", t: "Lương cứng 8 triệu", d: "Cộng hoa hồng và thưởng" }, { i: "📈", t: "Hoa hồng không giới hạn", d: "Đạt và vượt KPI càng nhiều, thu nhập càng cao" }, { i: "✈️", t: "Kiến thức logistics", d: "Đào tạo về các tuyến vận chuyển quốc tế VN/CN → US/WW" }, { i: "🎁", t: "Thưởng tháng 13", d: "Thưởng Tết & các dịp lễ lớn" }, { i: "🏖️", t: "Company Trip", d: "Du lịch cùng công ty hàng năm" }, { i: "⏰", t: "Làm việc linh hoạt", d: "T2–T6: văn phòng · T7 chiều: online" }],
        bonuses: ["Hoa hồng theo bảng doanh thu cá nhân", "Thưởng chốt đơn Express Bulk theo tầng khối lượng (> 50kg / 100kg / 500kg)", "Thưởng khai thác khách hàng mới lần đầu giao dịch", "Thưởng tỷ lệ chốt request cao (≥ 80%)", "Thưởng đưa khách hàng lên hạng VIP trong tháng", "Thưởng KPI hàng tháng theo xếp hạng Grade B / A / A+", "Thưởng Nhân viên xuất sắc tháng do CEO chọn"]
    },
    {
        id: "sales-wh", cat: "sales-wh", filter: "sales", badge: "Sales · Warehouse US",
        tagline: '"Người đưa hàng Việt vào kho Mỹ."',
        title: "Nhân viên Sales Warehouse Mỹ",
        desc: "Phát triển khách hàng cho dịch vụ kho bãi và fulfillment tại Mỹ — mảng chiến lược của THG.",
        salary: "8 triệu", salaryUnit: "+ hoa hồng + thưởng", salaryNote: "Thu nhập không giới hạn theo hiệu suất",
        location: "TP.HCM", type: "Full-time", deadline: "15/05/2026", experience: "Không bắt buộc",
        lead: "Với hơn 1000 mẫu sản phẩm sẵn tại kho Mỹ, THG đang cần Sales am hiểu mô hình fulfillment xuyên biên giới để phát triển mảng Warehouse US.",
        responsibilities: {
            "Phát triển khách hàng": ["Tìm kiếm và phát triển khách hàng có nhu cầu gửi hàng qua kho Mỹ để fulfill & phân phối", "Tư vấn dịch vụ kho bãi tại US: lưu trữ, quản lý tồn kho, giao hàng cuối cùng", "Bán các sản phẩm sẵn trong kho Warehouse US qua website công ty"],
            "Vận hành & phối hợp": ["Phối hợp với đội ngũ Operations để đảm bảo hàng hóa được xử lý đúng tiến độ", "Cập nhật thông tin sản phẩm và dịch vụ để tư vấn chính xác, hiệu quả"]
        },
        requirements: ["Kinh nghiệm trong bán hàng hoặc quản lý kho hàng là lợi thế", "Kỹ năng giao tiếp và tư vấn tốt", "Khả năng giải quyết vấn đề và xử lý tình huống nhanh nhẹn", "Kỹ năng tổ chức công việc và quản lý thời gian hiệu quả", "Chủ động, nhiệt tình, tận tâm với khách hàng"],
        benefits: [{ i: "💰", t: "Lương cứng 8 triệu", d: "Cộng hoa hồng và thưởng" }, { i: "🏭", t: "Kho US chiến lược", d: "1000+ mẫu sản phẩm sẵn kho Mỹ" }, { i: "📈", t: "Hoa hồng không giới hạn", d: "Đạt và vượt KPI càng nhiều, thu nhập càng cao" }, { i: "🎁", t: "Thưởng tháng 13", d: "Thưởng Tết & các dịp lễ lớn" }, { i: "🏖️", t: "Company Trip", d: "Du lịch cùng công ty hàng năm" }, { i: "⏰", t: "Làm việc linh hoạt", d: "T2–T6: văn phòng · T7 chiều: online" }],
        bonuses: ["Hoa hồng theo bảng doanh thu cá nhân", "Thưởng chốt đơn Warehouse giá trị lớn", "Thưởng khai thác khách hàng mới lần đầu giao dịch", "Thưởng đưa khách hàng lên hạng VIP trong tháng", "Thưởng KPI hàng tháng theo xếp hạng Grade B / A / A+", "Thưởng Nhân viên xuất sắc tháng do CEO chọn"]
    },
    {
        id: "ops", cat: "ops", filter: "ops", badge: "Operations · Vận hành",
        tagline: '"Xương sống của bộ máy fulfillment."',
        title: "Nhân viên Vận hành TMĐT",
        desc: "Mua hàng, vận chuyển và xử lý đơn Dropship từ 1688 / Alibaba. Vai trò xương sống của bộ máy vận hành.",
        salary: "10 triệu", salaryUnit: "+ hoa hồng + thưởng", salaryNote: "Thu nhập không giới hạn theo hiệu suất",
        location: "TP.HCM", type: "Full-time", deadline: "15/05/2026", experience: "Từ 6 tháng",
        lead: "Vị trí Vận hành là xương sống của bộ máy THG Fulfill — trực tiếp sourcing sản phẩm trên các sàn TMĐT lớn của Trung Quốc, đàm phán với nhà cung cấp và đảm bảo đơn Dropship được xử lý trơn tru.",
        responsibilities: {
            "Mua hàng & Sourcing": ["Tìm kiếm và đánh giá các nguồn hàng mới trên 1688, Alibaba", "Thực hiện mua hàng: thương thảo, đàm phán, đặt hàng và theo dõi đơn", "Hỗ trợ quản lý làm báo giá, tối ưu chi phí vận hành"],
            "Vận hành đơn Dropship": ["Quản lý vận hành đơn Dropship: xử lý đơn từ khách, liên lạc nhà cung cấp", "Đảm bảo giao hàng đúng thời hạn và chất lượng", "Quản lý các đơn vận chuyển từ VN → toàn cầu và từ TQ → toàn cầu"]
        },
        requirements: ["Tối thiểu 6 tháng kinh nghiệm trong TMĐT, vận hành Dropship", "Hiểu biết về quy trình thương mại điện tử", "Kỹ năng giao tiếp và đàm phán tốt", "Cẩn thận là điều kiện tiên quyết", "Có tiếng Trung cơ bản là lợi thế"],
        benefits: [{ i: "💰", t: "Lương cứng 10 triệu", d: "Cộng hoa hồng và thưởng" }, { i: "📈", t: "Hoa hồng theo doanh số", d: "Đạt KPI hàng tháng nhận hoa hồng" }, { i: "🛒", t: "Thông thạo 1688 / Alibaba", d: "Đào tạo bài bản về sourcing Trung Quốc" }, { i: "🎁", t: "Thưởng tháng 13", d: "Thưởng Tết & các dịp lễ lớn" }, { i: "🏖️", t: "Company Trip", d: "Du lịch cùng công ty hàng năm" }, { i: "⏰", t: "Giờ hành chính", d: "T2–T6: 8h–17h" }],
        bonuses: ["Thưởng KPI hàng tháng theo xếp hạng (Grade B / A / A+)", "Thưởng CSKH & Vận hành hỗ trợ chốt đơn giá trị lớn", "Thưởng Upsell thành công dịch vụ THG cho khách hàng", "Thưởng 100% task đúng hạn trong tháng", "Thưởng Nhân viên xuất sắc tháng do CEO chọn"]
    },
    {
        id: "sourcing", cat: "sourcing", filter: "sourcing", badge: "Ngoại giao & Báo giá",
        tagline: '"Cánh tay nối dài đến các nhà máy Trung Quốc."',
        title: "Nhân viên Ngoại giao & Báo giá (China Desk)",
        desc: "Làm việc trực tiếp với nhà máy và supplier Trung Quốc — cầu nối giữa THG và hệ sinh thái sản xuất TQ.",
        salary: "10 triệu", salaryUnit: "+ hoa hồng + thưởng", salaryNote: "Thu nhập không giới hạn theo hiệu suất",
        location: "TP.HCM", type: "Full-time", deadline: "15/05/2026", experience: "Không bắt buộc",
        lead: "Vị trí Ngoại giao & Báo giá là cầu nối chiến lược giữa THG và hệ sinh thái sản xuất Trung Quốc — trực tiếp đàm phán với nhà máy, tìm kiếm supplier mới.",
        responsibilities: {
            "Làm việc với nhà cung cấp": ["Giao tiếp và làm việc trực tiếp với nhà máy, supplier Trung Quốc", "Đàm phán và tìm kiếm nhà cung cấp mới cho các nhóm sản phẩm theo yêu cầu", "Hỗ trợ phiên dịch trong các cuộc họp với nhà máy, đối tác TQ"],
            "Báo giá & Logistics": ["Tính toán và đề xuất chi phí vận chuyển, giá thành sản phẩm", "Tìm kiếm và xây dựng mối quan hệ với các kho lưu trữ & đơn vị vận chuyển", "Soạn thảo báo cáo chi tiết về tình hình làm việc với supplier & logistics"]
        },
        requirements: ["Có tiếng Trung là lợi thế lớn (không bắt buộc)", "Kinh nghiệm làm việc với nhà máy hoặc logistics tại Trung Quốc là lợi thế", "Kỹ năng đàm phán và tìm kiếm thông tin nhà cung cấp tốt", "Làm việc chi tiết, cẩn thận với số liệu", "Tinh thần trách nhiệm, chủ động"],
        benefits: [{ i: "💰", t: "Lương cứng 10 triệu", d: "Cộng hoa hồng và thưởng" }, { i: "🇨🇳", t: "Sử dụng tiếng Trung", d: "Cơ hội phát triển kỹ năng tiếng Trung chuyên nghiệp" }, { i: "🎁", t: "Thưởng tháng 13", d: "Thưởng Tết & các dịp lễ lớn" }, { i: "🌍", t: "Thị trường quốc tế", d: "Tiếp xúc trực tiếp với đối tác Trung Quốc" }, { i: "🎓", t: "Được đào tạo bài bản", d: "Hỗ trợ đào tạo trong suốt quá trình làm việc" }, { i: "🏖️", t: "Company Trip", d: "Du lịch cùng công ty hàng năm" }],
        bonuses: ["Thưởng KPI hàng tháng theo xếp hạng (Grade B / A / A+)", "Thưởng hỗ trợ báo giá & chốt đơn giá trị lớn", "Thưởng đàm phán thành công với supplier chiến lược", "Thưởng 100% task đúng hạn trong tháng", "Thưởng Nhân viên xuất sắc tháng do CEO chọn"]
    },
];

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
    const [filter, setFilter] = useState("all");
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const filtered = filter === "all" ? JOBS : JOBS.filter(j => j.filter === filter);

    const jMap: Record<string, string> = {
        "ai-intern": "j1",
        "finance": "j2",
        "sales-pod": "j3",
        "sales-ship": "j4",
        "sales-wh": "j5",
        "ops": "j6",
        "sourcing": "j7"
    };

    const getJobDetails = (job: Job) => {
        const trans = CAREERS_JOBS_I18N[job.id]?.[language];
        if (!trans) return job;
        return {
            ...job,
            responsibilities: trans.responsibilities || job.responsibilities,
            requirements: trans.requirements || job.requirements,
            benefits: trans.benefits ? trans.benefits.map((b: any, i: number) => ({ ...job.benefits[i], t: b.t, d: b.d })) : job.benefits,
            bonuses: trans.bonuses || job.bonuses
        };
    };

    const closeModal = useCallback(() => {
        setSelectedJob(null);
        document.body.style.overflow = "";
    }, []);

    const openJob = useCallback((job: Job) => {
        setSelectedJob(job);
        document.body.style.overflow = "hidden";
    }, []);

    const activeJob = selectedJob ? getJobDetails(selectedJob) : null;
    const accent = activeJob ? ACCENT[activeJob.cat] || "#A67845" : "#A67845";

    return (
        <div className="min-h-screen bg-background">
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
            <section className="py-16 bg-background">
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

                    {/* Job cards grid */}
                    <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}>
                        {filtered.map((job, i) => {
                            const jTransKey = jMap[job.id];
                            return (
                                <ScrollReveal key={job.id} delay={i * 80} className="h-full">
                                    <div onClick={() => openJob(job)}
                                        className="bg-white border border-border rounded-2xl p-[30px] cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl relative overflow-hidden flex flex-col h-full min-h-[320px] group"
                                        style={{ "--accent": ACCENT[job.cat] } as React.CSSProperties}>
                                        {/* Top accent bar */}
                                        <div className="absolute top-0 left-0 right-0 h-[3px] opacity-70 group-hover:opacity-100 group-hover:h-1 transition-all" style={{ background: ACCENT[job.cat] }} />
                                        {/* HOT · MỚI ribbon */}
                                        {job.hot && (
                                            <div className="absolute top-[18px] -right-[32px] text-white px-9 py-1 text-[10px] font-extrabold tracking-[0.12em] rotate-[35deg] z-10 whitespace-nowrap"
                                                style={{ background: '#2E6F8E', boxShadow: '0 4px 12px rgba(46,111,142,0.25)' }}>
                                                {t("careers.hot")}
                                            </div>
                                        )}
                                        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.12em] uppercase px-2.5 py-1.5 rounded-[5px] self-start" style={{ background: `${ACCENT[job.cat]}18`, color: ACCENT[job.cat] }}>
                                            {t(`careers.${jTransKey}_badge`) || job.badge}
                                        </span>
                                        <div className="text-[13px] font-bold italic mt-3.5 tracking-[0.3px]" style={{ color: ACCENT[job.cat] }}>
                                            {t(`careers.${jTransKey}_tagline`) || job.tagline}
                                        </div>
                                        <h3 className="text-[23px] font-extrabold text-navy mt-1.5 leading-[1.2] tracking-[-0.01em]">
                                            {t(`careers.${jTransKey}_title`) || job.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-[1.6] mt-3 flex-1">
                                            {t(`careers.${jTransKey}_desc`) || job.desc}
                                        </p>
                                        <div className="flex flex-wrap gap-2.5 mt-[18px] pt-[18px] border-t border-dashed border-border text-[12.5px] text-muted-foreground font-medium">
                                            <span className="inline-flex items-center gap-[5px]">📍 {t(`careers.${jTransKey}_location`) || job.location}</span>
                                            <span className="inline-flex items-center gap-[5px]">⏱ {t(`careers.${jTransKey}_type`) || job.type}</span>
                                            <span className="inline-flex items-center gap-[5px]">📅 {t(`careers.stat4_label`)} {job.deadline}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-[18px]">
                                            <div className="font-extrabold text-lg text-navy leading-[1.2] tracking-[-0.01em]">
                                                {t(`careers.${jTransKey}_salary`) || job.salary}
                                                <span className="block text-primary font-bold text-[12.5px] mt-0.5 tracking-[0.2px]">
                                                    {t(`careers.${jTransKey}_salaryUnit`) || job.salaryUnit}
                                                </span>
                                            </div>
                                            <div className="w-[38px] h-[38px] rounded-full border border-border flex items-center justify-center text-navy transition-all duration-300 group-hover:rotate-[-45deg] group-hover:text-white group-hover:border-transparent" style={{ backgroundColor: 'var(--bg, #F7F5F0)' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ACCENT[job.cat]; (e.currentTarget as HTMLElement).style.borderColor = ACCENT[job.cat]; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg, #F7F5F0)'; (e.currentTarget as HTMLElement).style.borderColor = ''; }}>
                                                →
                                            </div>
                                        </div>
                                    </div>
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
                                <p className="text-white/70 mt-3 text-[15px]" dangerouslySetInnerHTML={{ __html: t("careers.cta_desc") }}></p>
                            </div>
                            <div className="relative z-10 shrink-0">
                                <div className="px-8 py-4 rounded-full font-bold text-[15px] border border-[hsl(var(--gold))]/30 text-[hsl(var(--gold))] bg-[hsl(var(--gold))]/10">{t("careers.cta_btn")}</div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <ContactSection />

            {/* ═══ JOB DETAIL MODAL ═══ */}
            {activeJob && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-5 md:p-10 animate-in fade-in" onClick={closeModal}>
                    <div className="bg-white rounded-[22px] max-w-[900px] w-full shadow-2xl relative animate-in slide-in-from-bottom-4" onClick={e => e.stopPropagation()}>
                        {/* Close button */}
                        <button onClick={closeModal} className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all">
                            <X className="w-5 h-5" />
                        </button>

                        {/* Modal Hero */}
                        <div className="p-10 md:p-14 pb-8 border-b border-border relative" style={{ background: `linear-gradient(180deg, ${accent}0F, white)` }}>
                            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accent }} />
                            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded" style={{ background: `${accent}15`, color: accent }}>{t(`careers.${jMap[activeJob.id]}_badge`) || activeJob.badge}</span>
                            <div className="text-sm font-bold italic mt-4" style={{ color: accent }}>{t(`careers.${jMap[activeJob.id]}_tagline`) || activeJob.tagline}</div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-navy mt-1.5 tracking-tight">{t(`careers.${jMap[activeJob.id]}_title`) || activeJob.title}</h2>
                            <p className="text-muted-foreground text-[15.5px] max-w-2xl mt-3.5 leading-relaxed">{t(`careers.${jMap[activeJob.id]}_desc`) || activeJob.lead}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-7 pt-6 border-t border-dashed border-border">
                                {[
                                    { l: t("careers.modal_salary"), v: `${t(`careers.${jMap[activeJob.id]}_salary`) || activeJob.salary} ${t(`careers.${jMap[activeJob.id]}_salaryUnit`) || activeJob.salaryUnit}` },
                                    { l: t("careers.modal_exp"), v: t(`careers.${jMap[activeJob.id]}_exp`) || activeJob.experience },
                                    { l: t("careers.modal_type"), v: t(`careers.${jMap[activeJob.id]}_type`) || activeJob.type },
                                    { l: t("careers.modal_loc"), v: t(`careers.${jMap[activeJob.id]}_location`) || activeJob.location },
                                    { l: t("careers.stat4_label"), v: activeJob.deadline },
                                ].map((qi, i) => (
                                    <div key={i}>
                                        <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{qi.l}</div>
                                        <div className="text-navy font-bold mt-1 text-sm">{qi.v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-10 md:p-14 space-y-9">
                            {/* Benefits */}
                            <div>
                                <h3 className="text-xl font-extrabold text-navy flex items-center gap-3 mb-4"><span className="w-[5px] h-[22px] rounded" style={{ background: accent }} /> 💎 {t("careers.modal_ben_title") || "Quyền lợi hấp dẫn"}</h3>
                                <div className="rounded-2xl p-6 mb-5" style={{ background: `linear-gradient(135deg, ${accent}0C, hsl(36 30% 96%))`, border: `1px solid ${accent}30` }}>
                                    <div className="flex items-center gap-4 flex-wrap mb-4">
                                        <div className="text-3xl font-extrabold text-navy leading-tight">{t(`careers.${jMap[activeJob.id]}_salary`) || activeJob.salary}<span className="block text-primary font-bold text-[15px] mt-0.5">{t(`careers.${jMap[activeJob.id]}_salaryUnit`) || activeJob.salaryUnit}</span></div>
                                        <span className="bg-white border border-border rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold text-navy">{t(`careers.${jMap[activeJob.id]}_salaryNote`) || activeJob.salaryNote}</span>
                                    </div>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {activeJob.benefits.map((b: any, i: number) => (
                                            <div key={i} className="bg-white p-4 rounded-xl border border-border hover:-translate-y-0.5 transition-transform">
                                                <div className="text-xl mb-2">{b.i}</div>
                                                <div className="text-sm font-bold text-navy">{b.t}</div>
                                                <div className="text-[12.5px] text-muted-foreground mt-1">{b.d}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Bonuses */}
                            <div>
                                <h3 className="text-xl font-extrabold text-navy flex items-center gap-3 mb-4"><span className="w-[5px] h-[22px] rounded" style={{ background: accent }} /> 🎯 {t("careers.modal_bonus_title") || "Hệ thống thưởng & hoa hồng"}</h3>
                                <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(201,163,106,0.06), transparent)", border: "1px solid rgba(201,163,106,0.2)" }}>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-3.5" dangerouslySetInnerHTML={{ __html: t("careers.modal_bonus_desc") || 'Ngoài lương cứng và hoa hồng cơ bản, THG áp dụng <strong className="text-navy">hệ thống thưởng đa tầng</strong> để ghi nhận nỗ lực:' }}></p>
                                    <ul className="space-y-2">
                                        {activeJob.bonuses.map((b: string, i: number) => (
                                            <li key={i} className="text-navy text-[13.5px] leading-relaxed pl-6 relative">
                                                <span className="absolute left-1 top-[5px] text-primary font-bold">✓</span>{b}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-muted-foreground text-[12.5px] mt-3.5 pt-3.5 border-t border-dashed border-border italic">{t("careers.modal_bonus_note") || "* Chi tiết mức thưởng và điều kiện cụ thể sẽ được trao đổi trong buổi phỏng vấn."}</p>
                                </div>
                            </div>

                            {/* Responsibilities */}
                            <div>
                                <h3 className="text-xl font-extrabold text-navy flex items-center gap-3 mb-4"><span className="w-[5px] h-[22px] rounded" style={{ background: accent }} /> 📋 {t("careers.modal_resp_title") || "Mô tả công việc"}</h3>
                                {Object.entries(activeJob.responsibilities as Record<string, string[]>).map(([heading, items]) => (
                                    <div key={heading} className="mb-5">
                                        <div className="text-[12.5px] font-bold text-navy uppercase tracking-[0.1em] mb-3 flex items-center gap-2.5 after:content-[''] after:flex-1 after:h-px after:bg-border">{heading}</div>
                                        <ul className="space-y-2.5">
                                            {items.map((item, i) => (
                                                <li key={i} className="text-muted-foreground text-[14.5px] leading-relaxed pl-6 relative">
                                                    <span className="absolute left-1 top-[9px] w-2 h-2 rounded-full opacity-25" style={{ background: accent, boxShadow: `0 0 0 3px ${accent}20` }} />{item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Requirements */}
                            <div>
                                <h3 className="text-xl font-extrabold text-navy flex items-center gap-3 mb-4"><span className="w-[5px] h-[22px] rounded" style={{ background: accent }} /> ✅ {t("careers.modal_req") || "Yêu cầu ứng viên"}</h3>
                                <ul className="space-y-2.5">
                                    {activeJob.requirements.map((r, i) => (
                                        <li key={i} className="text-muted-foreground text-[14.5px] leading-relaxed pl-6 relative">
                                            <span className="absolute left-1 top-[9px] w-2 h-2 rounded-full opacity-25" style={{ background: accent, boxShadow: `0 0 0 3px ${accent}20` }} />{r}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Apply box */}
                            <div>
                                <h3 className="text-xl font-extrabold text-navy flex items-center gap-3 mb-4"><span className="w-[5px] h-[22px] rounded" style={{ background: accent }} /> 📩 {t("careers.modal_apply") || "Ứng tuyển ngay"}</h3>
                                <div className="bg-navy text-white rounded-2xl p-8 flex flex-col gap-6 relative overflow-hidden">
                                    <div className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full bg-gradient-radial from-primary/10 to-transparent" />
                                    <div className="relative z-10">
                                        <h4 className="text-xl font-extrabold">{t("careers.modal_apply_title")}</h4>
                                        <p className="text-white/70 text-[13.5px] mt-1.5" dangerouslySetInnerHTML={{ __html: t("careers.modal_apply_desc") }}></p>
                                    </div>
                                    <div className="flex gap-2.5 flex-wrap relative z-10">
                                        <a href={`mailto:hr@thgfulfill.com?subject=${encodeURIComponent(`${t("careers.modal_apply")} : ${activeJob.title} — THG Fulfill 04/2026`)}`}>
                                            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-full font-bold text-sm shadow-lg transition-all hover:-translate-y-0.5">📧 {t("careers.modal_btn_email") || "Gửi CV qua email"}</button>
                                        </a>
                                        <button onClick={() => { navigator.clipboard.writeText("hr@thgfulfill.com") }} className="bg-transparent border border-white/25 text-white hover:border-[hsl(var(--gold))] hover:text-[hsl(var(--gold))] px-5 py-3.5 rounded-full font-semibold text-sm transition-all">{t("careers.modal_btn_copy") || "Copy email"}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareersPage;
