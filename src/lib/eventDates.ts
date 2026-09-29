/** "2026-07-14" → "14/07/2026"; anything unparseable is shown as stored. */
function formatDay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

/** CMS stores ISO days; readers expect dd/MM/yyyy, with a range for multi-day events. */
export function formatEventDates(start: string, end: string | null | undefined): string {
  if (!end || end === start) return formatDay(start);
  return `${formatDay(start)} – ${formatDay(end)}`;
}
