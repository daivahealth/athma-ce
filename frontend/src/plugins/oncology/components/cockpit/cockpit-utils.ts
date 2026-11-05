'use client';

import { useTheme } from 'next-themes';
import { TONE_CHART } from '@/components/ui/tone-classes';
import type { BadgeTone } from '@/components/ui/tone-badge';

// Date-only helpers for the patient cockpit. Values arrive as 'YYYY-MM-DD' or
// full ISO strings for a date column; both are read as a UTC calendar day so a
// date never shifts with the browser's time zone.

const DAY = 86_400_000;

export const isoDay = (v: string | Date | null | undefined): string | null => {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : null;
};

/** Milliseconds for a calendar day (UTC midnight). */
export const dayMs = (v: string | Date | null | undefined): number | null => {
  const d = isoDay(v);
  if (!d) return null;
  const [y, m, dd] = d.split('-').map(Number);
  return Date.UTC(y, m - 1, dd);
};

export const addDaysMs = (ms: number, days: number) => ms + days * DAY;
export const daysBetween = (a: number, b: number) => Math.round((b - a) / DAY);

/** Today as a UTC calendar day, from the browser's local date. */
export const todayMs = () => {
  const d = new Date();
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
};

const fmtDay = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const fmtShort = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', timeZone: 'UTC' });
const fmtMonth = new Intl.DateTimeFormat(undefined, { month: 'short', timeZone: 'UTC' });
const fmtMonthYear = new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric', timeZone: 'UTC' });

export const formatDayMs = (ms: number) => fmtDay.format(new Date(ms));
export const formatShortMs = (ms: number) => fmtShort.format(new Date(ms));
export const formatMonthMs = (ms: number, withYear = false) => (withYear ? fmtMonthYear : fmtMonth).format(new Date(ms));

/** "Today", "Tomorrow", "in 5 days", "3 days ago". */
export function relativeDay(ms: number, today = todayMs()): string {
  const n = daysBetween(today, ms);
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  if (n === -1) return 'Yesterday';
  if (n > 1 && n < 14) return `in ${n} days`;
  if (n < -1 && n > -14) return `${-n} days ago`;
  return formatShortMs(ms);
}

/** First-of-month ticks between two days. */
export function monthTicks(start: number, end: number): number[] {
  const s = new Date(start);
  const ticks: number[] = [];
  let y = s.getUTCFullYear();
  let m = s.getUTCMonth() + 1;
  for (;;) {
    if (m > 11) { m = 0; y += 1; }
    const t = Date.UTC(y, m, 1);
    if (t > end) break;
    ticks.push(t);
    m += 1;
  }
  return ticks;
}

/** Chart colour for a tone in the current light/dark theme. */
export function useChartColour() {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === 'dark' ? 'dark' : 'light';
  return (tone: BadgeTone) => TONE_CHART[tone][mode];
}

export const num = (v: string | number | null | undefined): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
