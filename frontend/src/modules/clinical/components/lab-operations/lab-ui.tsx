import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/** Shared building blocks so the lab worklists read as one family. */

export function patientInitials(name?: string | null) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
}

function formatGender(gender?: string | null) {
  if (!gender) return null;
  return gender[0].toUpperCase() + gender.slice(1).toLowerCase();
}

export function LabPatientCell({
  name,
  mrn,
  age,
  gender,
}: {
  name?: string | null;
  mrn?: string | null;
  age?: number | null;
  gender?: string | null;
}) {
  const genderLabel = formatGender(gender);
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
        aria-hidden="true"
      >
        {patientInitials(name)}
      </span>
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">{name || 'Unknown patient'}</div>
        <div className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
          <span className="font-mono">{mrn || '—'}</span>
          {genderLabel || age != null ? <span aria-hidden="true">·</span> : null}
          {genderLabel ? <span>{genderLabel}</span> : null}
          {age != null ? <span>{age}y</span> : null}
        </div>
      </div>
    </div>
  );
}

/** A specimen's barcode as the thing a tech scans for: monospaced, on a quiet chip. */
export function SpecimenCode({ value }: { value?: string | null }) {
  if (!value) return <span className="text-xs text-muted-foreground">Not labelled</span>;
  return (
    <span className="inline-flex rounded-md border border-border/70 bg-muted/50 px-1.5 py-0.5 font-mono text-xs text-foreground">
      {value}
    </span>
  );
}

export function WorklistSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border/60" aria-busy="true" aria-label="Loading worklist">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <Skeleton className="size-9 rounded-full" />
          <div className="w-44 space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function formatLabDateTime(value?: string | Date | null) {
  if (!value) return null;
  const date = new Date(value);
  return {
    day: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
}

export function LabDateTime({ value, empty = '—' }: { value?: string | Date | null; empty?: string }) {
  const formatted = formatLabDateTime(value);
  if (!formatted) return <span className="text-xs text-muted-foreground">{empty}</span>;
  return (
    <div>
      <div className="text-sm text-foreground">{formatted.day}</div>
      <div className="text-xs text-muted-foreground">{formatted.time}</div>
    </div>
  );
}

/** `YYYY-MM-DD` for a Date in the browser's local time zone (the value an `<input type="date">` uses). */
export function toLocalDateInput(date: Date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function shiftDateInput(value: string, days: number) {
  const [y, m, d] = value.split('-').map(Number);
  return toLocalDateInput(new Date(y, m - 1, d + days));
}

/**
 * Local-day window for a `YYYY-MM-DD` value as ISO instants: `from` is local midnight (inclusive),
 * `to` is the next local midnight (exclusive). Sent as the lab list `from` / `to` query params.
 */
export function localDayRange(value: string) {
  const [y, m, d] = value.split('-').map(Number);
  return {
    from: new Date(y, m - 1, d).toISOString(),
    to: new Date(y, m - 1, d + 1).toISOString(),
  };
}

/** Selected day for a lab list, defaulting to today, plus its `from` / `to` query window. */
export function useLabDayFilter() {
  const [date, setDate] = useState(() => toLocalDateInput());
  const range = useMemo(() => localDayRange(date), [date]);
  return { date, setDate, range };
}

/** Day picker for lab lists: previous / next day, a date input and a jump back to today. */
export function LabDateFilter({
  value,
  onChange,
  label = 'Date',
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const today = toLocalDateInput();
  return (
    <div className="flex items-center gap-1" role="group" aria-label={`${label} filter`}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        onClick={() => onChange(shiftDateInput(value, -1))}
        aria-label="Previous day"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="relative">
        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="date"
          value={value}
          max={today}
          onChange={(event) => onChange(event.target.value || today)}
          className="h-9 w-[11.5rem] pl-9"
          aria-label={label}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        onClick={() => onChange(shiftDateInput(value, 1))}
        disabled={value >= today}
        aria-label="Next day"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-9"
        onClick={() => onChange(today)}
        disabled={value === today}
      >
        Today
      </Button>
    </div>
  );
}

/** Longest date range a lab list accepts. The list loads every report in the range before paging. */
export const MAX_LAB_RANGE_DAYS = 92;

export interface LabDateRange {
  /** First day, `YYYY-MM-DD`, inclusive. */
  from: string;
  /** Last day, `YYYY-MM-DD`, inclusive. */
  to: string;
}

/** Days from `a` to `b` (both `YYYY-MM-DD`, local), e.g. the same day is 0. */
function dayDiff(a: string, b: string) {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000);
}

/**
 * Query window for a range of local days as ISO instants: `from` is local midnight of the first
 * day (inclusive), `to` is local midnight after the last day (exclusive).
 */
export function localDateRange(range: LabDateRange) {
  return { from: localDayRange(range.from).from, to: localDayRange(range.to).to };
}

/**
 * Keeps a range valid after one end changed: no later than today, `from` ≤ `to` (the other end
 * follows the one that moved), and at most `MAX_LAB_RANGE_DAYS` days long.
 */
export function normaliseLabRange(next: LabDateRange, changed: 'from' | 'to', today = toLocalDateInput()): LabDateRange {
  let from = next.from > today ? today : next.from;
  let to = next.to > today ? today : next.to;
  if (from > to) {
    if (changed === 'from') to = from;
    else from = to;
  }
  if (dayDiff(from, to) + 1 > MAX_LAB_RANGE_DAYS) {
    if (changed === 'from') to = shiftDateInput(from, MAX_LAB_RANGE_DAYS - 1);
    else from = shiftDateInput(to, -(MAX_LAB_RANGE_DAYS - 1));
  }
  return { from, to };
}

/** Range ending today that covers `days` days (1 = today only). */
export function lastDaysRange(days: number, today = toLocalDateInput()): LabDateRange {
  return { from: shiftDateInput(today, -(days - 1)), to: today };
}

/** Selected date range for a lab list, defaulting to today, plus its `from` / `to` query window. */
export function useLabDateRangeFilter() {
  const [range, setRange] = useState<LabDateRange>(() => lastDaysRange(1));
  const query = useMemo(() => localDateRange(range), [range]);
  return { range, setRange, query };
}

const RANGE_PRESETS = [
  { days: 1, label: 'Today' },
  { days: 7, label: 'Last 7 days' },
  { days: 30, label: 'Last 30 days' },
] as const;

/** Date-range picker for lab lists: presets plus first and last day inputs. */
export function LabDateRangeFilter({
  value,
  onChange,
  label = 'Date',
}: {
  value: LabDateRange;
  onChange: (value: LabDateRange) => void;
  label?: string;
}) {
  const today = toLocalDateInput();
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={`${label} filter`}>
      <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-1">
        {RANGE_PRESETS.map((preset) => {
          const target = lastDaysRange(preset.days, today);
          const active = value.from === target.from && value.to === target.to;
          return (
            <button
              key={preset.days}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(target)}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-1">
        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="date"
            value={value.from}
            max={today}
            onChange={(event) => onChange(normaliseLabRange({ ...value, from: event.target.value || today }, 'from', today))}
            className="h-9 w-[10.5rem] pl-9"
            aria-label={`${label} from`}
          />
        </div>
        <span className="px-1 text-sm text-muted-foreground" aria-hidden="true">
          to
        </span>
        <Input
          type="date"
          value={value.to}
          max={today}
          onChange={(event) => onChange(normaliseLabRange({ ...value, to: event.target.value || today }, 'to', today))}
          className="h-9 w-[9rem]"
          aria-label={`${label} to`}
        />
      </div>
    </div>
  );
}
