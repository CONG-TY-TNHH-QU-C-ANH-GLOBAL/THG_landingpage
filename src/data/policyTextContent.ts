/**
 * policyTextContent.ts
 * Nội dung text của các mục chính sách — EN / VI / ZH
 * Dùng bởi PolicyTextRenderer khi người dùng xem ngôn ngữ EN hoặc ZH
 */

export interface PolicyTextLine {
    en: string;
    vi: string;
    zh: string;
}

export interface PolicyTextBlock {
    type: "normal" | "warn" | "info";
    heading: PolicyTextLine;
    content: PolicyTextLine[];
}

export interface PolicyTextSection {
    blocks: PolicyTextBlock[];
}

export const policyTextContent: Record<string, PolicyTextSection> = {
    warehouse: {
        blocks: [
            {
                type: "info",
                heading: {
                    en: "Warehouse Policy",
                    vi: "Chính sách Kho hàng",
                    zh: "仓储政策",
                },
                content: [
                    {
                        en: "All goods must be properly packaged and labeled prior to delivery to our warehouse.",
                        vi: "Hàng hóa phải được đóng gói và dán nhãn đúng cách trước khi giao đến kho.",
                        zh: "所有货物在运送至仓库前，必须妥善包装并贴有规范标签。",
                    },
                    {
                        en: "THG formally accepts goods for storage only after they successfully pass the warehouse inspection.",
                        vi: "THG nhận hàng lưu kho sau khi kiểm tra thành công tại kho.",
                        zh: "货物经仓库彻底查验合格后，THG方予正式接收入库。",
                    },
                    {
                        en: "Storage fees will apply once the complimentary storage period expires. Please consult our current fee schedule.",
                        vi: "Phí lưu kho áp dụng sau thời gian miễn phí. Vui lòng tham khảo bảng giá hiện hành.",
                        zh: "免租期届满后将产生仓储费用，具体标准请参阅现行资费表。",
                    },
                    {
                        en: "THG shall not be held liable for any damages resulting from inadequate or improper packaging by the sender.",
                        vi: "THG không chịu trách nhiệm về hư hỏng do đóng gói không đúng cách từ phía người gửi.",
                        zh: "如因发件人包装不当导致货物受损，THG概不承担任何责任。",
                    },
                    {
                        en: "Contraband, counterfeit products, and hazardous materials are strictly prohibited.",
                        vi: "Hàng cấm, hàng giả và hàng nguy hiểm tuyệt đối không được chấp nhận.",
                        zh: "严禁接收任何违禁品、假冒伪劣商品及危险物品。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "Important Notices",
                    vi: "Lưu ý quan trọng",
                    zh: "重要通知",
                },
                content: [
                    {
                        en: "Goods remaining uncollected for 30 days beyond the free storage period will incur additional surcharge.",
                        vi: "Hàng không được lấy trong 30 ngày sau thời gian miễn phí sẽ bị tính thêm phí.",
                        zh: "超出免费存储期30天仍未提取的货物，将加收额外滞纳金。",
                    },
                    {
                        en: "THG reserves the right to dispose of any goods left unclaimed for more than 90 days.",
                        vi: "THG có quyền xử lý hàng không được nhận sau 90 ngày.",
                        zh: "对于逾期90天无人认领的货物，THG保留全权处置之权利。",
                    },
                ],
            },
        ],
    },

    "pod-dropship": {
        blocks: [
            {
                type: "info",
                heading: {
                    en: "POD / Dropship Policy",
                    vi: "Chính sách POD / Dropship",
                    zh: "POD / 代发货(Dropship)政策",
                },
                content: [
                    {
                        en: "THG offers comprehensive Print-on-Demand (POD) and Dropship fulfillment services tailored for e-commerce sellers.",
                        vi: "THG cung cấp dịch vụ In theo yêu cầu (POD) và Dropship cho các nhà bán hàng thương mại điện tử.",
                        zh: "THG专为电子商务卖家提供全面的按需打印（POD）及代发货（Dropship）履约服务。",
                    },
                    {
                        en: "All orders must be submitted via the THG system, ensuring recipient details are complete and precise.",
                        vi: "Đơn hàng phải được gửi qua hệ thống THG với thông tin người nhận đầy đủ và chính xác.",
                        zh: "所有订单必须通过THG系统提交，并确保收件人信息完整且准确无误。",
                    },
                    {
                        en: "Product images and specifications must meet our quality standards before production can commence.",
                        vi: "Hình ảnh và thông số sản phẩm phải đáp ứng tiêu chuẩn chất lượng trước khi sản xuất.",
                        zh: "产品图片及规格必须在投产前符合我们的质量标准。",
                    },
                    {
                        en: "Delivery timeframes vary depending on the destination country and the selected shipping method.",
                        vi: "Thời gian giao hàng thay đổi tùy theo quốc gia đích và phương thức vận chuyển được chọn.",
                        zh: "交货时间将根据目的国家和所选物流方式的不同而有所差异。",
                    },
                    {
                        en: "Copyright-infringing designs or counterfeit goods are strictly forbidden and will result in immediate order cancellation.",
                        vi: "Các thiết kế vi phạm bản quyền hoặc hàng giả bị nghiêm cấm và sẽ dẫn đến hủy đơn hàng.",
                        zh: "严禁使用侵权设计或生产仿冒品，一经发现将立即取消订单。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "Quality Assurance & Returns",
                    vi: "Chất lượng & Hoàn trả",
                    zh: "质量保证与退货",
                },
                content: [
                    {
                        en: "Claims for defective items must be filed within 14 days of delivery, accompanied by photographic evidence.",
                        vi: "Khiếu nại về sản phẩm lỗi phải được gửi trong vòng 14 ngày kể từ ngày giao hàng kèm bằng chứng ảnh.",
                        zh: "针对缺陷产品的索赔必须在交付后14天内提出，并附带照片作为凭证。",
                    },
                    {
                        en: "THG assumes no responsibility for returns caused by incorrect or incomplete recipient addresses provided by the sender.",
                        vi: "Hoàn trả do địa chỉ người nhận không chính xác không thuộc trách nhiệm của THG.",
                        zh: "因发件人提供的收件地址不正确导致的退货，THG概不负责。",
                    },
                ],
            },
        ],
    },

    shipping: {
        blocks: [
            {
                type: "info",
                heading: {
                    en: "Shipping Policy",
                    vi: "Chính sách Vận chuyển",
                    zh: "物流运输政策",
                },
                content: [
                    {
                        en: "THG provides global shipping services to over 200 countries and territories worldwide.",
                        vi: "THG cung cấp dịch vụ vận chuyển quốc tế đến hơn 200 quốc gia và vùng lãnh thổ trên toàn thế giới.",
                        zh: "THG的国际物流服务覆盖全球200多个国家和地区。",
                    },
                    {
                        en: "Shipping fees are calculated based on either the actual weight or volumetric weight, whichever is greater.",
                        vi: "Phí vận chuyển được tính dựa trên trọng lượng thực tế hoặc trọng lượng thể tích, lấy mức cao hơn.",
                        zh: "运费将按实际重量或体积重量两者中的较大者进行计费。",
                    },
                    {
                        en: "Prohibited items include hazardous materials, firearms, narcotics, and any goods restricted by the destination country.",
                        vi: "Hàng cấm bao gồm: hàng nguy hiểm, vũ khí, ma túy và các mặt hàng bị hạn chế bởi quốc gia đích.",
                        zh: "禁运品包括：危险品、武器、毒品及目的国家限制进口的任何物品。",
                    },
                    {
                        en: "Destination customs duties and taxes are the sole responsibility of the recipient or sender, as per the shipping agreement.",
                        vi: "Thuế hải quan và các loại thuế tại điểm đến thuộc trách nhiệm của người nhận hoặc người gửi (theo thỏa thuận).",
                        zh: "目的地海关关税及其他税费应由收件人或发件人（依协议）全额承担。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "Shipping Restrictions",
                    vi: "Hạn chế vận chuyển",
                    zh: "运输限制",
                },
                content: [
                    {
                        en: "Deliveries to Amazon fulfillment centers are strictly not permitted across any shipping channels.",
                        vi: "Địa chỉ kho Amazon không được chấp nhận cho bất kỳ kênh vận chuyển nào.",
                        zh: "所有运输渠道均不接受派送至亚马逊(Amazon)各仓库地址。",
                    },
                    {
                        en: "Military addresses (APO/FPO) have limited coverage depending on the specific shipping channel utilized.",
                        vi: "Địa chỉ quân sự (APO/FPO) có phạm vi phủ sóng hạn chế tùy theo kênh vận chuyển.",
                        zh: "军事地址（APO/FPO）的派送范围有限，具体视所选运输渠道而定。",
                    },
                    {
                        en: "Comprehensive shipping terms are available on our dedicated Shipping Policy page.",
                        vi: "Chính sách vận chuyển chi tiết có trên trang chính sách vận chuyển riêng biệt.",
                        zh: "详细的运输条款请参阅我们专属的物流政策页面。",
                    },
                ],
            },
        ],
    },

    "bulk-compensation": {
        blocks: [
            {
                type: "info",
                heading: {
                    en: "Bulk Cargo Compensation Policy",
                    vi: "Chính sách Đền bù Hàng lô",
                    zh: "大宗货物理赔政策",
                },
                content: [
                    {
                        en: "Compensation claims for bulk shipments must be submitted within 60 days following the date of warehouse check-in.",
                        vi: "Yêu cầu bồi thường hàng lô phải được gửi trong vòng 60 ngày kể từ ngày nhập kho.",
                        zh: "大宗货物的理赔申请必须在入库之日起60天内提交。",
                    },
                    {
                        en: "The maximum compensation shall not exceed the declared value or USD 100 per shipment, whichever is lower.",
                        vi: "Mức bồi thường tối đa không vượt quá giá trị khai báo hoặc 100 USD mỗi lô hàng, lấy mức thấp hơn.",
                        zh: "最高赔偿额不得超过申报价值或每票货物100美元（以较低者为准）。",
                    },
                    {
                        en: "All claims must be supported by necessary documentation: commercial invoice, packing list, and clear photo evidence of the damage.",
                        vi: "Yêu cầu bồi thường cần tài liệu hỗ trợ: hóa đơn, danh sách đóng gói và bằng chứng hình ảnh về hư hỏng.",
                        zh: "理赔申请需提供相应的支持文件：商业发票、装箱单以及清晰的损坏照片凭证。",
                    },
                    {
                        en: "THG will conduct a thorough investigation into all claims prior to issuing any compensation decisions.",
                        vi: "THG điều tra tất cả các khiếu nại trước khi đưa ra quyết định bồi thường.",
                        zh: "THG将在作出任何理赔决定之前，对所有索赔进行彻底调查。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "Exemptions from Compensation",
                    vi: "Các trường hợp không được bồi thường",
                    zh: "免赔及除外责任",
                },
                content: [
                    {
                        en: "Damages resulting from inadequate or improper packaging by the sender are not eligible for compensation.",
                        vi: "Hư hỏng do đóng gói không đúng cách từ phía người gửi không được bồi thường.",
                        zh: "因发件人包装不当或存在缺陷而导致的损坏，不在理赔范围内。",
                    },
                    {
                        en: "Losses incurred due to the seizure of prohibited items by customs authorities are entirely excluded.",
                        vi: "Tổn thất do hải quan tịch thu hàng cấm không được bồi thường.",
                        zh: "因海关查扣违禁品而造成的损失，我司概不赔偿。",
                    },
                    {
                        en: "Force majeure events (including natural disasters, strikes, and governmental actions) are completely excluded from liability.",
                        vi: "Các sự kiện bất khả kháng (thiên tai, đình công, hành động của chính phủ) được loại trừ.",
                        zh: "不可抗力事件（包括自然灾害、罢工及政府行为等）一律排除在理赔范围之外。",
                    },
                ],
            },
        ],
    },

    "pod-tiktok": {
        blocks: [
            {
                type: "info",
                heading: {
                    en: "POD – TikTok Shipping Policy",
                    vi: "Chính sách POD – TikTok Shipping",
                    zh: "POD – TikTok 专属物流政策",
                },
                content: [
                    {
                        en: "THG offers a specialized POD fulfillment service equipped with dedicated shipping channels for TikTok Shop merchants.",
                        vi: "THG cung cấp dịch vụ POD chuyên biệt cho người bán TikTok Shop với các kênh vận chuyển riêng.",
                        zh: "THG专为TikTok Shop商家提供专属POD履约服务，并配备特定的物流渠道。",
                    },
                    {
                        en: "All orders must strictly adhere to TikTok Shop platform policies and comply with local market regulations.",
                        vi: "Đơn hàng phải tuân thủ chính sách nền tảng TikTok Shop và quy định thị trường địa phương.",
                        zh: "所有订单必须严格遵守TikTok Shop平台政策及当地市场法规。",
                    },
                    {
                        en: "Shipping timelines are robustly aligned with TikTok Shop's stringent fulfillment performance requirements.",
                        vi: "Thời gian vận chuyển được căn chỉnh theo yêu cầu thực hiện đơn hàng của TikTok Shop.",
                        zh: "物流时效经过优化，以全面契合TikTok Shop的履约考核要求。",
                    },
                    {
                        en: "Products must not infringe upon trademarks, copyrights, or violate any platform content guidelines.",
                        vi: "Sản phẩm không được vi phạm nhãn hiệu, bản quyền hoặc chính sách nội dung của nền tảng.",
                        zh: "产品绝不得侵犯任何商标、版权，或违反平台的任何内容指引。",
                    },
                ],
            },
            {
                type: "warn",
                heading: {
                    en: "TikTok-Specific Guidelines",
                    vi: "Lưu ý riêng cho TikTok",
                    zh: "TikTok 专属注意事项",
                },
                content: [
                    {
                        en: "Any penalties levied by TikTok Shop due to late fulfillment are the sole liability of the seller.",
                        vi: "Các khoản phạt do thực hiện đơn hàng trễ từ TikTok Shop thuộc trách nhiệm của người bán.",
                        zh: "因延迟履约而导致的任何TikTok Shop平台罚款，均由卖家全权承担。",
                    },
                    {
                        en: "Return requests initiated on TikTok Shop must be handled in accordance with the platform's official return procedures.",
                        vi: "Yêu cầu trả hàng qua TikTok Shop phải tuân theo quy trình hoàn trả của nền tảng.",
                        zh: "通过TikTok Shop发起的退货申请，必须严格遵循该平台的官方退货流程。",
                    },
                ],
            },
        ],
    }
};
