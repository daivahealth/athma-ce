import type { TreatmentItem } from '@/plugins/oncology/types';

// Day-sheet helpers for patient treatment schedules.

/** Today as YYYY-MM-DD in the browser's local time zone. */
export const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const addDaysIso = (iso: string, n: number) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};

const dateFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const shortFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
const dmyFmt = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

const toUtc = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const formatDate = (iso: string) => dateFmt.format(toUtc(iso));
export const formatShortDate = (iso: string) => shortFmt.format(toUtc(iso));
/** Day, month and year — for spans that can cross a year boundary. */
export const formatDayMonthYear = (iso: string) => dmyFmt.format(toUtc(iso));
export const isWeekend = (iso: string) => [0, 6].includes(toUtc(iso).getUTCDay());

export const formatDose = (i: TreatmentItem) =>
  i.calculatedDose != null ? `${i.calculatedDose} ${i.calculatedUnit ?? ''}`.trim() : '—';

export const formatProtocolDose = (i: TreatmentItem) =>
  `${i.levelDose ?? i.protocolDose} ${i.protocolUnit ?? ''}`.trim();

export interface TimedItem { item: TreatmentItem; offsetMin: number | null }

/**
 * Relative timing for a day: pre-medication at T−30, pre-hydration before the
 * first drug, chemo given in sequence (each starting when the previous infusion
 * ends), then concurrent/post hydration. Labs and supportive care are untimed.
 */
export function timeline(items: TreatmentItem[]): TimedItem[] {
  const sorted = [...items].sort((a, b) => a.sequence - b.sequence);
  const preHydration = sorted.filter((i) => i.kind === 'hydration' && i.timing === 'pre');
  const preHydrationMin = preHydration.length ? 60 : 0;
  let t = preHydrationMin; // chemo starts after pre-hydration
  const out: TimedItem[] = [];
  for (const item of sorted) {
    if (item.kind === 'lab' || item.kind === 'supportive') out.push({ item, offsetMin: null });
    else if (item.kind === 'premed') out.push({ item, offsetMin: -30 });
    else if (item.kind === 'hydration' && item.timing === 'pre') out.push({ item, offsetMin: 0 });
    else if (item.kind === 'chemo') { out.push({ item, offsetMin: t }); t += item.infusionDurationMin ?? 15; }
    else out.push({ item, offsetMin: item.timing === 'concurrent' ? preHydrationMin : t });
  }
  return out;
}

export const formatOffset = (min: number | null) => {
  if (min == null) return '';
  if (min === 0) return 'T0';
  const sign = min < 0 ? '−' : '+';
  const abs = Math.abs(min);
  return `T${sign}${abs >= 60 ? `${Math.floor(abs / 60)}h${abs % 60 ? ` ${abs % 60}m` : ''}` : `${abs}m`}`;
};

/** Clock time for an offset from a chair start time (HH:MM). */
export const clockAt = (start: string, offsetMin: number | null) => {
  if (offsetMin == null || !/^\d{2}:\d{2}$/.test(start)) return '';
  const [h, m] = start.split(':').map(Number);
  const total = ((h * 60 + m + offsetMin) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

export const KIND_LABEL: Record<TreatmentItem['kind'], string> = {
  lab: 'Before treatment',
  premed: 'Pre-medication',
  hydration: 'Hydration',
  chemo: 'Chemotherapy',
  supportive: 'Supportive care',
};
