import { pricingData } from "@/data/pricingData";

const SimpleTable = ({ title, columns, data }: any) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="glass-card rounded-2xl overflow-hidden border border-border/50 mb-8 shadow-sm">
            <div className="bg-navy p-5 border-b border-primary-foreground/10 flex items-center gap-3">
                <h3 className="text-lg font-bold text-primary-foreground tracking-wide uppercase">{title}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-secondary/40 text-muted-foreground uppercase text-xs font-semibold">
                        <tr>
                            {columns.map((c: any) => (
                                <th key={c.key} className="px-5 py-3.5 border-r border-border/30 last:border-0">{c.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row: any, i: number) => (
                            <tr key={i} className="border-b border-border/30 hover:bg-primary/5 transition-colors duration-200">
                                {columns.map((c: any) => (
                                    <td key={c.key} className="px-5 py-3.5 border-r border-border/30 last:border-0 text-foreground font-medium">
                                        {row[c.key] || "—"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ExtrasSection = () => {
    return (
        <div className="space-y-2 animate-fade-in">
            <div className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight mb-3">
                    📝 PHỤ PHÍ & DỊCH VỤ KHÁC
                </h2>
                <p className="text-muted-foreground">
                    Chi tiết phụ phí vùng sâu, phí phân phối lại, thuế VAT và các dịch vụ hoả tốc.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex flex-col h-full">
                    <SimpleTable
                        title="Phụ Phí Vùng Sâu (Remote Area)"
                        columns={[{ key: 'usd', label: 'Surcharge ($)' }]}
                        data={(pricingData as any).remoteSurcharge || []}
                    />
                    <div className="p-5 bg-gold/10 border border-gold/30 rounded-2xl text-sm text-foreground mb-8 shadow-sm flex-1">
                        <strong className="block mb-2 text-gold-dark text-base flex items-center gap-2">
                            <span>💡</span> Các Quốc Gia Áp Dụng:
                        </strong>
                        <p className="leading-relaxed mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gold inline-block"></span>
                            Nhật Bản (Japan), Croatia, Thụy Điển (Sweden), Vương Quốc Anh (Great Britain) và Mỹ (U.S).
                        </p>
                        <p className="text-muted-foreground text-xs italic">
                            *Phụ phí cước vùng sâu/vùng xa có thể thay đổi tuỳ theo Zipcode thực tế của tuyến đường giao hàng cuối.
                        </p>
                    </div>
                </div>

                <div>
                    <SimpleTable
                        title="Thuế VAT & Phí Xử Lý"
                        columns={[
                            { key: 'country', label: 'Quốc Gia' },
                            { key: 'vat', label: 'VAT %' },
                            { key: 'service', label: 'Service Charge' }
                        ]}
                        data={(pricingData as any).vatData || []}
                    />
                </div>

                <div>
                    <SimpleTable
                        title="Phí Phân Phối Lại (Re-delivery)"
                        columns={[
                            { key: 'dest', label: 'Khu Vực' },
                            { key: 'code', label: 'Mã QG' },
                            { key: 'usd', label: 'Phí ($)' }
                        ]}
                        data={(pricingData as any).redeliveryData || []}
                    />
                </div>

                <div>
                    <SimpleTable
                        title="Cước Hỏa Tốc (UPS, DHL, Fedex)"
                        columns={[
                            { key: 'ups', label: 'UPS' },
                            { key: 'dhl', label: 'DHL' },
                            { key: 'fedex', label: 'Fedex' }
                        ]}
                        data={(pricingData as any).expressPricings || []}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExtrasSection;
