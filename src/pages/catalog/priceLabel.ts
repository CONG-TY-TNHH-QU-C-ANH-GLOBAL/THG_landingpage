/* Giá bán của một số sản phẩm đã gồm cước vận chuyển (khác mặc định: giá là
   tiền hàng, chưa có cước). Nhận diện theo tiền tố THG SKU của sản phẩm — ổn
   định hơn tên, vì tên do Sale sửa được trên CMS. Chỉ thêm vào đây khi đã xác
   nhận giá sản phẩm đó thật sự gồm cước. */
const SHIPPING_INCLUDED_SKU_PREFIXES = ["THG-018-"]; // Hoodie Washed

export function priceIncludesShipping(thgSku: string | null | undefined): boolean {
  const sku = (thgSku ?? "").trim().toUpperCase();
  return SHIPPING_INCLUDED_SKU_PREFIXES.some((p) => sku.startsWith(p));
}

export function sellingPriceLabel(thgSku: string | null | undefined): string {
  return priceIncludesShipping(thgSku)
    ? "Selling price (including shipping cost)"
    : "Selling price (not including shipping cost)";
}
