'use client';

import Link from 'next/link';
import type { BadgeTone } from '@/components/ui/tone-badge';
import { cn } from '@/lib/utils';

/** A tile per tone, written out so Tailwind keeps them (ported from prrapp's dashboard board). */
const TILE: Partial<Record<BadgeTone, string>> = {
  sky: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800/70 dark:bg-sky-950/40 dark:text-sky-100',
  blue: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800/70 dark:bg-blue-950/40 dark:text-blue-100',
  violet: 'border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-800/70 dark:bg-violet-950/40 dark:text-violet-100',
  teal: 'border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-800/70 dark:bg-teal-950/40 dark:text-teal-100',
  green: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800/70 dark:bg-green-950/40 dark:text-green-100',
  amber: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-100',
  orange:
    'border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-800/70 dark:bg-orange-950/40 dark:text-orange-100',
  red: 'border-red-300 bg-red-50 text-red-900 dark:border-red-800/70 dark:bg-red-950/40 dark:text-red-100',
  slate: 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200',
};

/** The hover border for a tile that links somewhere. */
const TILE_HOVER: Partial<Record<BadgeTone, string>> = {
  sky: 'hover:border-sky-400',
  blue: 'hover:border-blue-400',
  violet: 'hover:border-violet-400',
  teal: 'hover:border-teal-400',
  green: 'hover:border-green-400',
  amber: 'hover:border-amber-400',
  orange: 'hover:border-orange-400',
  red: 'hover:border-red-500',
  slate: 'hover:border-slate-400',
};

/** Tones that ask the reader to do something. */
export const ATTENTION_TONES: ReadonlySet<BadgeTone> = new Set(['amber', 'orange', 'red']);

export interface MetricTileProps {
  label: string;
  value: string | number | null;
  note?: string;
  tone: BadgeTone;
  /** Full href; the tile becomes a link into the page that works the figure. */
  href?: string;
  isLoading?: boolean;
  /** Identifies the figure for tests and analytics. */
  metricKey?: string;
  className?: string;
}

/**
 * One figure on a dashboard: a tinted tile coloured by what it asks of the
 * reader, with a small uppercase label, the value and an optional note. The
 * common tile for the Today dashboard and every operational board.
 */
export function MetricTile({ label, value, note, tone, href, isLoading = false, metricKey, className }: MetricTileProps) {
  const classes = cn(
    'flex min-h-24 flex-col justify-between rounded-xl border px-4 py-3 transition-colors',
    TILE[tone] ?? TILE.slate,
    href && ['focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', TILE_HOVER[tone] ?? TILE_HOVER.slate],
    className,
  );
  const body = (
    <>
      <span className="text-[11px] font-medium uppercase tracking-wide opacity-80">{label}</span>
      <span className="text-2xl font-semibold tabular-nums">
        {isLoading ? (
          <span className="opacity-50">…</span>
        ) : value === null ? (
          '—'
        ) : typeof value === 'number' ? (
          value.toLocaleString('en-GB')
        ) : (
          value
        )}
      </span>
      {note && !isLoading ? <span className="text-[11px] opacity-80">{note}</span> : null}
    </>
  );

  return href ? (
    <Link href={href} data-metric={metricKey} data-tone={tone} className={classes}>
      {body}
    </Link>
  ) : (
    <div data-metric={metricKey} data-tone={tone} className={classes}>
      {body}
    </div>
  );
}
