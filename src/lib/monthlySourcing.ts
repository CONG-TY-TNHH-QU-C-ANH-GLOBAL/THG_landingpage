/** Monthly "Top sản phẩm & nguồn hàng" pages live on the main domain, e.g. /vi/top-nguon-hang/thang-10-2026. */
export function monthlySourcingHref(
  { year, month }: Readonly<{ year: number; month: number }>,
  language: string,
): string {
  return `/${language}/top-nguon-hang/thang-${month}-${year}`;
}
