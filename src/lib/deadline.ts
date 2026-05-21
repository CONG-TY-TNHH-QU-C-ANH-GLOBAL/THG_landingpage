// Parse operator-entered deadline strings. Accepts DD/MM/YYYY (Vietnamese
// default), DD-MM-YYYY, DD.MM.YYYY and ISO YYYY-MM-DD. Returns null when the
// string can't be parsed; callers treat null as "no deadline → always open".

export function parseDeadline(s: string | null | undefined): Date | null {
  if (!s) return null;
  const trimmed = s.trim();
  const dmy = trimmed.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (dmy) {
    const d = new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function isPastDeadline(s: string | null | undefined): boolean {
  const d = parseDeadline(s);
  if (!d) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

export function daysUntilDeadline(s: string | null | undefined): number | null {
  const d = parseDeadline(s);
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
