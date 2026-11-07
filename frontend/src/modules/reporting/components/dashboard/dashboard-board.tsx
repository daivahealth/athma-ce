'use client';

import { ATTENTION_TONES, MetricTile } from '@/components/ui/metric-tile';
import type { BadgeTone } from '@/components/ui/tone-badge';
import type { DashboardMetrics } from '@/modules/reporting/hooks/use-dashboard-metrics';

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
  return groups.flatMap((group) => group.tiles).filter((tile) => ATTENTION_TONES.has(tile.tone)).length;
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
              <MetricTile
                key={tile.key}
                metricKey={tile.key}
                label={tile.label}
                value={tile.value}
                note={tile.note}
                tone={tile.tone}
                href={`/${locale}${tile.href}`}
                isLoading={isLoading}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
