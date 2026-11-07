/** Public LP pages are hosted separately from the React application. */
export function monthlySourcingHref({
  year,
  month,
}: Readonly<{ year: number; month: number }>): string {
  return `https://lp.thgfulfill.com/thang-${month}-${year}`;
}
