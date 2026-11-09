'use client';

import type { ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { BadgeTone } from '@/components/ui/tone-badge';
import { cn } from '@/lib/utils';

/** "PATIENT_IN_OT" → "Patient In Ot"; the OT lists' one label rule for enum values. */
export function humanize(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** The dot colour of each tone, written out so Tailwind keeps them. */
const DOT: Partial<Record<BadgeTone, string>> = {
  sky: 'bg-sky-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  fuchsia: 'bg-fuchsia-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-500',
  emerald: 'bg-emerald-500',
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  rose: 'bg-rose-500',
  slate: 'bg-slate-400',
};

export interface OtStatusFilterOption<T extends string> {
  value: T;
  tone: BadgeTone;
  label?: string;
}

/**
 * The status chips above an OT list: "All" plus one chip per status, each with
 * its count in the current search. A chip with no rows is dimmed but still
 * clickable so the filter never hides a status the user is looking for
 * (unless `hideEmpty` is set for a long list such as schedule statuses).
 */
export function OtStatusFilter<T extends string>({
  options,
  value,
  onChange,
  counts,
  total,
  hideEmpty = false,
}: {
  options: ReadonlyArray<OtStatusFilterOption<T>>;
  value: 'all' | T;
  onChange: (value: 'all' | T) => void;
  counts: Partial<Record<T, number>>;
  total: number;
  /** Leave out statuses with no rows (except the selected one), for long status lists. */
  hideEmpty?: boolean;
}) {
  const chip = (key: 'all' | T, label: string, count: number, tone?: BadgeTone) => {
    const active = value === key;
    return (
      <button
        key={key}
        type="button"
        role="radio"
        aria-checked={active}
        onClick={() => onChange(key)}
        className={cn(
          'inline-flex h-8 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          active
            ? 'border-primary bg-primary text-primary-foreground shadow-sm'
            : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5',
          !active && count === 0 && 'text-muted-foreground',
        )}
      >
        {tone ? (
          <span
            className={cn(
              'size-1.5 rounded-full',
              active ? 'bg-primary-foreground' : (DOT[tone] ?? DOT.slate),
            )}
            aria-hidden="true"
          />
        ) : null}
        {label}
        <span
          className={cn(
            'min-w-5 rounded-full px-1.5 text-[11px] tabular-nums leading-4',
            active ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground',
          )}
        >
          {count}
        </span>
      </button>
    );
  };

  return (
    <div role="radiogroup" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
      {chip('all', 'All', total)}
      {options
        .filter((option) => !hideEmpty || value === option.value || (counts[option.value] ?? 0) > 0)
        .map((option) =>
          chip(
            option.value,
            option.label ?? humanize(option.value),
            counts[option.value] ?? 0,
            option.tone,
          ),
        )}
    </div>
  );
}

/** Patient search for an OT list, with a clear button once something is typed. */
export function OtSearchInput({
  value,
  onChange,
  placeholder = 'Search by patient name, MRN or phone',
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative w-full sm:max-w-sm', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 pl-9 pr-8 [&::-webkit-search-cancel-button]:hidden"
        aria-label={placeholder}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

/** The bar above an OT table: search on the left, a result count and extras on the right, chips below. */
export function OtListToolbar({
  search,
  filters,
  summary,
}: {
  search: ReactNode;
  filters?: ReactNode;
  summary?: ReactNode;
}) {
  return (
    <div className="space-y-3 border-b px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {search}
        {summary ? <div className="text-xs text-muted-foreground">{summary}</div> : null}
      </div>
      {filters ? <div className="-mx-1 overflow-x-auto px-1 pb-0.5">{filters}</div> : null}
    </div>
  );
}

/** Placeholder rows while an OT list loads, shaped like the real rows so the page does not jump. */
export function OtTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-4">
          <div className="w-48 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-44" />
          </div>
          <div className="flex flex-1 items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
          <Skeleton className="hidden h-5 w-20 rounded-full md:block" />
          <Skeleton className="hidden h-8 w-24 md:block" />
        </div>
      ))}
    </div>
  );
}

/** A red panel for a list or detail that failed to load. */
export function OtErrorPanel({ error, className }: { error: unknown; className?: string }) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive',
        className,
      )}
    >
      {error instanceof Error ? error.message : String(error ?? 'Something went wrong.')}
    </div>
  );
}

/** A date over a smaller time, the way every OT table shows when something happens. */
export function OtDateTime({
  date,
  time,
  muted,
}: {
  date: string;
  time?: string | null;
  muted?: boolean;
}) {
  return (
    <div className="whitespace-nowrap">
      <div
        className={cn('text-sm font-medium', muted ? 'text-muted-foreground' : 'text-foreground')}
      >
        {date}
      </div>
      {time ? <div className="text-xs tabular-nums text-muted-foreground">{time}</div> : null}
    </div>
  );
}

/** Counts per value of `key` across rows, for the status chips. */
export function countBy<T, K extends string>(
  rows: readonly T[],
  key: (row: T) => K,
): Partial<Record<K, number>> {
  const counts: Partial<Record<K, number>> = {};
  for (const row of rows) {
    const k = key(row);
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}
