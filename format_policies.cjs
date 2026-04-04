const fs = require('fs');
try {
    let rawData = fs.readFileSync('C:/Users/ACER/.gemini/antigravity/brain/c48bac17-4ffe-4b17-a767-3a54e6154d7e/lark_sheets_dump.json', 'utf8');
    let dump = JSON.parse(rawData);

    // Extract raw policies from dump to avoid double-translating previously parsed data
    let json = [];
    Object.keys(dump.sheets).forEach(k => {
        const s = dump.sheets[k];
        if (s.title.toLowerCase().includes('policy')) {
            let content = '';
            if (s.data) {
                s.data.forEach(row => {
                    let rowText = row.filter(cell => cell).join(' ');
                    if (rowText.trim()) content += rowText + '\n\n';
                });
            }
            json.push({ id: k, title: s.title, content: content.trim() });
        }
    });

    const dict = {
        'Chargeable Weight': '⚖️ Trọng lượng tính cước',
        'Service Countries': '🌍 Quốc gia hỗ trợ',
        'Delivery Requirements & Order Placement Instructions': '📋 Yêu cầu đặt hàng & Giao nhận',
        'Pre-Shipment Requirements': '📋 Yêu cầu trước khi gửi',
        'Handover Requirements & Order Instructions': '📋 Quy định bàn giao hàng',
        'Weight Limitation': '⚖️ Giới hạn trọng lượng',
        'Weight Requirements': '⚖️ Yêu cầu trọng lượng',
        'Size Limitation': '📏 Giới hạn kích thước',
        'Size Requirements': '📏 Yêu cầu kích thước',
        'Declared Value & Notes': '💵 Giá trị khai báo & Ghi chú',
        'Declared Value': '💵 Giá trị khai báo',
        'Cargo Attributes': '📦 Tính chất hàng hóa',
        'Goods Properties': '📦 Thuộc tính hàng hóa',
        'Delivery Address Requirements': '📍 Yêu cầu địa chỉ nhận hàng',
        'Return and Re\n-delivery': '🔄 Trả hàng & Giao lại',
        'Return and Re-delivery': '🔄 Trả hàng & Giao lại',
        'Returns & Re-Delivery': '🔄 Trả hàng & Giao lại',
        'Compensation Standard': '🛡️ Tiêu chuẩn bồi thường',
        'Compensation Standards': '🛡️ Tiêu chuẩn bồi thường',
        'Enquiry Website': '🔍 Website tra mã vận đơn',
        'Tracking Websites': '🔍 Website tra mã vận đơn',
        'Other Requirements': '📌 Yêu cầu khác',
        'Shipment Attributes': '📦 Yêu cầu về lô hàng',
        'Goods Properties and Packaging Requirements': '📦 Thuộc tính hàng & Yêu cầu đóng gói',
        'Special Reminder': '⚠️ Nhắc nhở đặc biệt',
        'Starting from 09:00 on June 26, 2021, no VAT will be charged by THG if the customer provides a valid IOSS number.': 'Từ 09:00 ngày 26/06/2021, THG sẽ KHÔNG thu VAT nếu KH cung cấp IOSS.',
        'Starting from 09:00 on June 26, 2021, no VAT will be charged by Yunexpress if the customer provides a valid IOSS number.': 'Từ 09:00 ngày 26/06/2021, KHÔNG thu VAT nếu KH cung cấp IOSS.',
        'Effective 2021/6/26 09:00: If the seller provides a valid IOSS number, THG will not collect VAT.': 'Từ 26/06/2021, KHÔNG thu VAT nếu có xuất trình IOSS hợp lệ.',
        'Parcels with a value of 150 EUR or above, or 155 USD or above are not accepted.': '❌ KHÔNG nhận kiện hàng ≥ 150 EUR hoặc 155 USD.',
        'Amazon warehouse addresses are not accepted.': '❌ KHÔNG nhận chuyển đến kho Amazon.',
        'One parcel per order; multiple parcels under a single order are not accepted.': 'Một đơn hàng chỉ được gửi 1 gói, không gộp nhiều đơn.',
        'Comparing the actual weight of the package and the volumetric weight, the larger one is calculated': 'So sánh trọng lượng thực tế và thể tích, sẽ tính cước mức cao hơn',
        'The greater of actual weight and volumetric weight is used for billing': 'Sẽ dùng trọng lượng thực tế hoặc thể tích quy đổi (mức cao hơn) để tính cước',
        'Switerzerland / Norway : the whole territory': '🇨🇭 Thụy Sĩ / 🇳🇴 Na Uy: Toàn lãnh thổ',
        'Chile : the whole territory, except some restricted areas': '🇨🇱 Chile: Nhận toàn lãnh thổ, trừ vài khu vực hạn chế',
        'UK: Mail is available throughout the UK (the UK mainland and its affiliated islands), and the British overseas territories and offshore islands are not mailed (such as the British Indian Ocean Territory, the British Virgin Islands, Guernsey and Jersey, etc)': '🇬🇧 Anh (UK): Chấp nhận toàn V.Quốc Anh (đất liền & đảo). KHÔNG nhận vùng lãnh thổ hải ngoại của Anh (Lãnh thổ Ấn Độ Dương, Virgin Islands, Guernsey, Jersey...)',
        'United Arab Emirates / Saudi Arabia: POBO': '🇦🇪 UAE / 🇸🇦 Saudi Arabia: Không hỗ trợ hòm thư PO BOX',
        'sg Singapore: Some areas are not accessible. Please refer to the postal code details of the unreachable areas list for details.': '🇸🇬 Singapore: Một bộ phận zipcode vùng sâu vùng xa không giao được.',
        'JP Nhật Bản: APO/FPO military address cannot be delivered, Amazon address cannot be delivered': '🇯🇵 Nhật Bản: KHÔNG nhận địa chỉ quân sự APO/FPO và kho Amazon',
        'USA:': '🇺🇸 Mỹ:',
        'Germany:': '🇩🇪 Đức:',
        'United Kingdom (UK):': '🇬🇧 Anh (UK):',
        'France:': '🇫🇷 Pháp:',
        'Spain:': '🇪🇸 Tây Ban Nha:',
        'Canada:': '🇨🇦 Canada:',
        'Japan:': '🇯🇵 Nhật Bản:',
        'Singapore:': '🇸🇬 Singapore:',
        'Australia:': '🇦🇺 Úc:',
        'Mexico:': '🇲🇽 Mexico:',
        'Switzerland:': '🇨🇭 Thụy Sĩ:',
        'Norway:': '🇳🇴 Na Uy:',
        'United Arab Emirates:': '🇦🇪 UAE:',
        'Saudi Arabia:': '🇸🇦 Ả Rập Xê Út:',
        'New Zealand:': '🇳🇿 New Zealand:'
    };

    json.forEach(item => {
        let text = item.content;

        // Replace roman numeral headers with Vietnamese headers
        // ONLY match if it's strictly at the start of a line
        text = text.replace(/(?:^|\n)([IVX]{1,4})[、\-\.\s]+([A-Za-z\s&]+)/g, (match, numeral, header) => {
            let cleanHeader = header.trim();
            if (dict[cleanHeader]) {
                return '\n### ' + dict[cleanHeader] + '\n';
            }
            return '\n### ' + cleanHeader + '\n';
        });

        // Translate standard sentences & words
        for (const [en, vi] of Object.entries(dict)) {
            if (!en.match(/^[A-Za-z\s]+$/)) { // Only if it's a structural sentence, replace directly
                text = text.split(en).join('**' + vi + '**');
            } else {
                // Direct replacement bounds
                text = text.split('\n' + en).join('\n**' + vi + '**');
            }
        }

        // Convert numbered lists and circle dots to actual bullet points for markdown rendering
        text = text.replace(/\n(\d+[\.\)\]] |①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩|A\) |B\) |C\) )/g, '\n• ');
        text = text.replace(/\n([a-z]\.\s)/g, '\n• '); // a. b. c. lists

        // Remove POBOX formatting errors
        text = text.replace(/POBO\n### X addresses are not accepted\n/g, 'POBOX addresses are NOT accepted.');
        text = text.replace(/POBO\n### address are not accepted\n/g, 'POBOX addresses are NOT accepted.');
        text = text.replace(/POBO\n### addresses are not accepted\n/g, 'POBOX addresses are NOT accepted.');

        item.content = text.trim();
    });

    fs.writeFileSync('d:/THG_official/rebuild-your-site-12/src/data/larkPolicies.json', JSON.stringify(json, null, 2));
    console.log('Successfully formatted JSON policies!');
} catch (e) {
    console.error(e);
}
