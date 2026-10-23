// Dates are handled as local calendar days ("YYYY-MM-DD"), since a study day
// follows the student's clock, not UTC.

export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out;
}

// Whole days from today to the key (negative when it has passed).
export function daysUntil(key: string, today: Date): number {
  const a = fromKey(dayKey(today)).getTime();
  const b = fromKey(key).getTime();
  return Math.round((b - a) / 86_400_000);
}

export function dueLabel(key: string, today: Date): string {
  const n = daysUntil(key, today);
  if (n === 0) return 'Due today';
  if (n === 1) return 'Due tomorrow';
  if (n === -1) return '1 day overdue';
  if (n < 0) return `${-n} days overdue`;
  if (n < 7) return `Due ${fromKey(key).toLocaleDateString(undefined, { weekday: 'long' })}`;
  return `Due in ${n} days`;
}

export function formatMinutes(total: number): string {
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
