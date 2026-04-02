const fs = require('fs');
const f = fs.readFileSync('d:/THG_official/rebuild-your-site-12/src/pages/InternationalPricingPage.tsx', 'utf8');

// Find the VN Express "Phụ Phí" accordion and replace it  
const oldStart = '<Accordion icon="💰" title="Phụ Phí & Dịch Vụ Khác" defaultOpen>';
const oldEnd = '</Accordion>\n                  <Accordion icon="📄"';

const startIdx = f.indexOf(oldStart);
if (startIdx === -1) {
    console.log('Could not find old accordion start. Trying different pattern...');
    // Try to find by unique substring
    const alt = 'Phụ Phí';
    const allIdx = [];
    let pos = 0;
    while ((pos = f.indexOf(alt, pos)) !== -1) {
        const lineStart = f.lastIndexOf('\n', pos);
        console.log('Found at pos', pos, ':', JSON.stringify(f.substring(lineStart + 1, pos + 40)));
        allIdx.push(pos);
        pos++;
    }
    process.exit(1);
}

const endIdx = f.indexOf(oldEnd, startIdx);
if (endIdx === -1) {
    console.log('Could not find old accordion end');
    process.exit(1);
}

const replacement = `<Accordion icon="💰" title="Phụ Phí, Dịch Vụ & Re-delivery" defaultOpen>
                    <div className="flex flex-col gap-6">
                      {/* US Remote Surcharge */}
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">📍 Phụ Phí Vùng Sâu (Remote Area – US)</h4>
                        {remoteSurcharge.length > 0 ? (
                          <CompactAccordionTable
                            headers={["Khu Vực / Zone", \`Surcharge (\${displaySymbol})\`]}
                            data={remoteSurcharge}
                            renderRow={(r, i) => (
                              <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                <td className="px-4 py-3"><span className="notranslate">{r.zone || r.name || \`Zone \${i + 1}\`}</span></td>
                                <td className="px-4 py-3 font-bold"><span className="notranslate">{r.usd ? \`\${displaySymbol}\${(parseFloat(r.usd) * displayRate).toLocaleString("en-US", { maximumFractionDigits: displaySymbol === "₫" ? 0 : 2 })}\` : "Liên hệ THG"}</span></td>
                              </tr>
                            )}
                          />
                        ) : (
                          <table className="w-full border-collapse text-[13px]">
                            <thead><tr className="bg-[#FAFAF8]">
                              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Khu Vực</th>
                              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Surcharge</th>
                            </tr></thead>
                            <tbody>
                              <tr className="border-b border-[var(--pricing-border)]"><td className="px-4 py-3">Alaska / Hawaii</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                              <tr className="border-b border-[var(--pricing-border)]"><td className="px-4 py-3">Puerto Rico</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                              <tr><td className="px-4 py-3">Remote ZIP Codes</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                      {/* Re-delivery / Reship Fee */}
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">🔁 Phí Re-delivery (Gửi Lại)</h4>
                        <p className="text-[12px] text-muted-foreground italic mb-2">* Áp dụng khi kiện hàng bị trả về do địa chỉ sai, không nhận, hoặc từ chối.</p>
                        {redeliveryData.length > 0 ? (
                          <CompactAccordionTable
                            headers={["Khu Vực", "Mã QG", \`Phí (\${displaySymbol})\`]}
                            data={redeliveryData}
                            renderRow={(r, i) => (
                              <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                <td className="px-4 py-3"><span className="notranslate">{r.dest}</span></td>
                                <td className="px-4 py-3"><span className="notranslate">{r.code}</span></td>
                                <td className="px-4 py-3 font-bold"><span className="notranslate" translate="no">{r.usd ? \`\${displaySymbol}\${(parseFloat(r.usd) * displayRate).toLocaleString("en-US", { maximumFractionDigits: displaySymbol === "₫" ? 0 : 2 })}\` : "Liên hệ THG"}</span></td>
                              </tr>
                            )}
                          />
                        ) : (
                          <p className="text-muted-foreground text-[13px] italic">📝 Dữ liệu phí re-delivery đang cập nhật.</p>
                        )}
                      </div>
                      {/* Additional Services */}
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">📦 Phí Dịch Vụ Thêm</h4>
                        <table className="w-full border-collapse text-[13px]">
                          <thead><tr className="bg-[#FAFAF8]">
                            <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Dịch Vụ</th>
                            <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Phí</th>
                          </tr></thead>
                          <tbody>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-4 py-3">Khai báo hải quan</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-4 py-3">Đóng gói thêm</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                            <tr><td className="px-4 py-3">Bảo hiểm hàng hóa</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Accordion>`;

const before = f.substring(0, startIdx);
const after = f.substring(endIdx);
const result = before + replacement + after;
fs.writeFileSync('d:/THG_official/rebuild-your-site-12/src/pages/InternationalPricingPage.tsx', result);
console.log('Done! Replaced VN Express Additional charges section.');
