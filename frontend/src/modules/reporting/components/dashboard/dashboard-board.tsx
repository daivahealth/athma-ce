'use client';

import Link from 'next/link';
import type { BadgeTone } from '@/components/ui/tone-badge';
import { cn } from '@/lib/utils';
import type { DashboardMetrics } from '@/modules/reporting/hooks/use-dashboard-metrics';

/** A tile per tone, written out so Tailwind keeps them (ported from prrapp's dashboard board). */
const TILE: Partial<Record<BadgeTone, string>> = {
  sky: 'border-sky-200 bg-sky-50 text-sky-900 hover:border-sky-400 dark:border-sky-800/70 dark:bg-sky-950/40 dark:text-sky-100',
  blue: 'border-blue-200 bg-blue-50 text-blue-900 hover:border-blue-400 dark:border-blue-800/70 dark:bg-blue-950/40 dark:text-blue-100',
  violet:
    'border-violet-200 bg-violet-50 text-violet-900 hover:border-violet-400 dark:border-violet-800/70 dark:bg-violet-950/40 dark:text-violet-100',
  teal: 'border-teal-200 bg-teal-50 text-teal-900 hover:border-teal-400 dark:border-teal-800/70 dark:bg-teal-950/40 dark:text-teal-100',
  green:
    'border-green-200 bg-green-50 text-green-900 hover:border-green-400 dark:border-green-800/70 dark:bg-green-950/40 dark:text-green-100',
  amber:
    'border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-400 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-100',
  orange:
    'border-orange-200 bg-orange-50 text-orange-900 hover:border-orange-400 dark:border-orange-800/70 dark:bg-orange-950/40 dark:text-orange-100',
  red: 'border-red-300 bg-red-50 text-red-900 hover:border-red-500 dark:border-red-800/70 dark:bg-red-950/40 dark:text-red-100',
  slate:
    'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200',
};

/** Tones that ask the reader to do something. */
const ATTENTION: ReadonlySet<BadgeTone> = new Set(['amber', 'orange', 'red']);

export interface BoardTile {
  key: string;
  label: string;
  href: string;
  value: string | number | null;
  note?: string;
  tone: BadgeTone;
}

export interface BoardGroup {
  id: string;
  title: string;
  tiles: BoardTile[];
}

/** Green when a list is clear, its own colour while something waits, red when it is overdue or urgent. */
const waiting = (count: number | undefined, busy: BadgeTone, clear: BadgeTone = 'green'): BadgeTone =>
  count === undefined ? 'slate' : count > 0 ? busy : clear;

export function buildBoard(metrics: DashboardMetrics, formatMoney: (value: number) => string): BoardGroup[] {
  const w = metrics.worklists;
  const missed = metrics.noShowAppointments + metrics.cancelledAppointments;
  const aging = metrics.arAging?.buckets;
  const over90 = aging?.find((bucket) => bucket.key === 'd90_plus');

  return [
    {
      id: 'clinics',
      title: 'Clinics',
      tiles: [
        {
          key: 'appointments-today',
          label: 'Appointments today',
          href: '/scheduling/appointments',
          value: metrics.appointmentsToday,
          note:
            metrics.appointmentsToday > 0
              ? `${metrics.completedAppointments} completed · ${metrics.appointmentsToday - metrics.completedAppointments - missed} to go`
              : 'Nothing booked today',
          tone: metrics.appointmentsToday > 0 ? 'sky' : 'slate',
        },
        {
          key: 'encounters-in-progress',
          label: 'Patients in clinic',
          href: '/encounters',
          value: w?.encountersInProgress ?? null,
          note: `${metrics.encountersToday} encounter${metrics.encountersToday === 1 ? '' : 's'} today`,
          tone: waiting(w?.encountersInProgress, 'violet'),
        },
        {
          key: 'missed-today',
          label: 'No-shows & cancellations',
          href: '/scheduling/appointments',
          value: missed,
          note: `${metrics.noShowAppointments} no-show · ${metrics.cancelledAppointments} cancelled`,
          tone: missed === 0 ? 'green' : metrics.appointmentsToday > 0 && missed / metrics.appointmentsToday >= 0.15 ? 'red' : 'amber',
        },
        {
          key: 'appointments-next-7',
          label: 'Booked next 7 days',
          href: '/scheduling/calendar',
          value: w?.appointmentsNext7Days ?? null,
          note: `${metrics.appointmentsThisWeek} this week`,
          tone: 'blue',
        },
        {
          key: 'new-patients',
          label: 'New patients this month',
          href: '/patients',
          value: metrics.newPatientsThisMonth,
          note: `${metrics.totalPatients.toLocaleString('en-GB')} registered in all`,
          tone: 'teal',
        },
      ],
    },
    {
      id: 'wards',
      title: 'Wards & diagnostics',
      tiles: [
        {
          key: 'inpatients',
          label: 'Inpatients',
          href: '/inpatient/ward-board',
          value: w?.inpatientsCurrent ?? null,
          note: 'Admitted now',
          tone: w ? 'blue' : 'slate',
        },
        {
          key: 'discharges-due',
          label: 'Discharges due',
          href: '/inpatient/discharges',
          value: w?.dischargesDue ?? null,
          note: 'Planned or past expected date',
          tone: waiting(w?.dischargesDue, 'orange'),
        },
        {
          key: 'lab-orders',
          label: 'Open lab orders',
          href: '/results/lab',
          value: w?.labOrdersOpen ?? null,
          note: w?.urgentOrdersOpen ? `${w.urgentOrdersOpen} urgent` : 'None urgent',
          tone: w?.urgentOrdersOpen ? 'red' : waiting(w?.labOrdersOpen, 'violet'),
        },
        {
          key: 'imaging-orders',
          label: 'Open imaging orders',
          href: '/results',
          value: w?.imagingOrdersOpen ?? null,
          note: 'Ordered, not reported',
          tone: waiting(w?.imagingOrdersOpen, 'violet'),
        },
        {
          key: 'lab-sign-off',
          label: 'Lab reports to sign off',
          href: '/results/lab',
          value: w?.labReportsAwaitingSignOff ?? null,
          note: 'Draft or preliminary',
          tone: waiting(w?.labReportsAwaitingSignOff, 'amber'),
        },
      ],
    },
    {
      id: 'revenue',
      title: 'Revenue cycle',
      tiles: [
        {
          key: 'revenue-mtd',
          label: 'Billed this month',
          href: '/invoices',
          value: formatMoney(metrics.revenueMTD),
          note:
            metrics.revenueLastMonth > 0
              ? `${metrics.revenueGrowth >= 0 ? '+' : ''}${metrics.revenueGrowth.toFixed(0)}% vs all of last month`
              : 'No billing last month',
          tone: 'teal',
        },
        {
          key: 'unpaid',
          label: 'Unpaid invoices',
          href: '/invoices',
          value: metrics.unpaidInvoices,
          note: `${formatMoney(metrics.unpaidAmount)} outstanding`,
          tone: waiting(metrics.unpaidInvoices, 'amber'),
        },
        {
          key: 'overdue',
          label: 'Overdue > 30 days',
          href: '/invoices',
          value: metrics.overdueInvoices,
          note: `${formatMoney(metrics.overdueAmount)} overdue`,
          tone: waiting(metrics.overdueInvoices, 'red'),
        },
        {
          key: 'ar-90',
          label: 'Receivables 90+ days',
          href: '/patient-ledger',
          value: over90 ? formatMoney(over90.amount) : null,
          note: over90 ? `${over90.count} invoice${over90.count === 1 ? '' : 's'}` : undefined,
          tone: over90 ? waiting(over90.amount, 'red') : 'slate',
        },
        {
          key: 'collection-rate',
          label: 'Collected (90 days)',
          href: '/revenue-cycle',
          value:
            metrics.arAging?.collectionRate90d != null ? `${metrics.arAging.collectionRate90d.toFixed(0)}%` : null,
          note: 'Of billing raised in the last 90 days',
          tone:
            metrics.arAging?.collectionRate90d == null
              ? 'slate'
              : metrics.arAging.collectionRate90d >= 85
                ? 'green'
                : metrics.arAging.collectionRate90d >= 60
                  ? 'amber'
                  : 'red',
        },
      ],
    },
  ];
}

export function countNeedingAttention(groups: BoardGroup[]): number {
  return groups.flatMap((group) => group.tiles).filter((tile) => ATTENTION.has(tile.tone)).length;
}

function MetricTile({ tile, isLoading, locale }: { tile: BoardTile; isLoading: boolean; locale: string }) {
  return (
    <Link
      href={`/${locale}${tile.href}`}
      data-metric={tile.key}
      data-tone={tile.tone}
      className={cn(
        'flex min-h-24 flex-col justify-between rounded-xl border px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        TILE[tile.tone] ?? TILE.slate,
      )}
    >
      <span className="text-[11px] font-medium uppercase tracking-wide opacity-80">{tile.label}</span>
      <span className="text-2xl font-semibold tabular-nums">
        {isLoading ? (
          <span className="opacity-50">…</span>
        ) : tile.value === null ? (
          '—'
        ) : typeof tile.value === 'number' ? (
          tile.value.toLocaleString('en-GB')
        ) : (
          tile.value
        )}
      </span>
      {tile.note && !isLoading ? <span className="text-[11px] opacity-80">{tile.note}</span> : null}
    </Link>
  );
}

/**
 * The day at a glance: every worklist's figure in one place, coloured by what
 * it asks of the reader, and each a way into the page that works it.
 */
export function DashboardBoard({
  groups,
  isLoading,
  locale,
}: {
  groups: BoardGroup[];
  isLoading: boolean;
  locale: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`dashboard-${group.id}`} className="flex flex-col gap-2">
          <h2 id={`dashboard-${group.id}`} className="text-sm font-semibold text-foreground">
            {group.title}
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {group.tiles.map((tile) => (
              <MetricTile key={tile.key} tile={tile} isLoading={isLoading} locale={locale} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
