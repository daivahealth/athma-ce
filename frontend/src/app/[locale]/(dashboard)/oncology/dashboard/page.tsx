'use client';

import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MetricTile } from '@/components/ui/metric-tile';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToneBadge, type BadgeTone } from '@/components/ui/tone-badge';
import { TONE_BAR } from '@/components/ui/tone-classes';
import { cn } from '@/lib/utils';
import { PopulationHealthView } from '@/plugins/oncology/components/dashboard/PopulationHealthView';
import { useOncologyDashboard } from '@/plugins/oncology/hooks/use-oncology';
import { oncologyStatusTone } from '@/plugins/oncology/lib/oncology-tone';
import { addDaysIso, formatDate, formatShortDate, todayIso } from '@/plugins/oncology/lib/treatment-day';
import type { OncologyDashboard, OncologyDashboardPatient } from '@/plugins/oncology/types';

interface Tile {
  key: string;
  label: string;
  value: number;
  note?: string;
  tone: BadgeTone;
  href?: string;
}

const plural = (count: number, one: string, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;
const label = (value: string) => value.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

/** Amber when something waits, otherwise quiet. */
const waiting = (count: number, tone: BadgeTone = 'amber'): BadgeTone => (count > 0 ? tone : 'slate');

function TileRow({ id, title, tiles, isLoading }: { id: string; title: string; tiles: Tile[]; isLoading: boolean }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="text-sm font-semibold text-foreground">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {tiles.map((tile) => (
          <MetricTile
            key={tile.key}
            metricKey={tile.key}
            label={tile.label}
            value={tile.value}
            note={tile.note}
            tone={tile.tone}
            href={tile.href}
            isLoading={isLoading}
          />
        ))}
      </div>
    </section>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col rounded-xl border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      <div className="flex-1 p-4">{children}</div>
    </section>
  );
}

function PatientLine({ patient }: { patient: OncologyDashboardPatient | null }) {
  if (!patient) return <span className="text-sm text-muted-foreground">Unknown patient</span>;
  return (
    <div className="min-w-0">
      <div className="truncate text-sm font-medium leading-tight text-foreground">{patient.displayName}</div>
      <div className="text-xs text-muted-foreground">
        MRN: {patient.mrn} · {patient.gender || '—'} / {patient.age}y
      </div>
    </div>
  );
}

/** Horizontal bars for the active caseload by cancer type. */
function CancerTypeBars({ rows }: { rows: OncologyDashboard['caseload']['byCancerType'] }) {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">No patients with active disease.</p>;
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={row.key} className="space-y-1">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-foreground">{row.key}</span>
            <span className="tabular-nums font-medium text-foreground">{row.count}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className={cn('h-full rounded-full', TONE_BAR.violet)} style={{ width: `${(row.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Operations view: caseload, the day's chemotherapy and radiotherapy work,
 * approvals waiting, tumour board and care-pathway gaps. Laid out like the
 * Today dashboard and the OT Board.
 */
function OperationsView() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'en';
  const base = `/${locale}/oncology`;
  const [date, setDate] = useState(todayIso);
  const isToday = date === todayIso();
  const { data, isLoading, error, refetch, isFetching } = useOncologyDashboard(date);

  const updatedAt = data?.generatedAt
    ? new Date(data.generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null;
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date);

  const c = data?.caseload;
  const g = data?.pathwayGaps;
  const ch = data?.chemo;
  const dc = data?.dayCare;
  const rt = data?.radiation;
  const tb = data?.tumorBoard;
  const pl = data?.plans;

  const approvals =
    (ch?.awaitingApproval ?? 0) + (ch?.awaitingVerification ?? 0) + (rt?.prescriptionsAwaitingApproval ?? 0) + (pl?.carePlansDraft ?? 0);
  const dayWord = isToday ? 'today' : 'on this day';

  const caseloadTiles: Tile[] = [
    {
      key: 'active-patients',
      label: 'Active patients',
      value: c?.activePatients ?? 0,
      note: `${c?.registeredPatients ?? 0} registered`,
      tone: 'sky',
      href: `${base}/registry`,
    },
    {
      key: 'new-diagnoses',
      label: 'New diagnoses',
      value: c?.newDiagnosesLast30Days ?? 0,
      note: 'Last 30 days',
      tone: (c?.newDiagnosesLast30Days ?? 0) > 0 ? 'blue' : 'slate',
      href: `${base}/registry`,
    },
    {
      key: 'metastatic',
      label: 'Metastatic',
      value: c?.metastatic ?? 0,
      note: 'Distant spread, active',
      tone: (c?.metastatic ?? 0) > 0 ? 'violet' : 'slate',
      href: `${base}/registry`,
    },
    {
      key: 'unstaged',
      label: 'Not staged',
      value: g?.unstaged ?? 0,
      note: 'Active, no staging',
      tone: waiting(g?.unstaged ?? 0, 'orange'),
      href: `${base}/staging`,
    },
    {
      key: 'without-care-plan',
      label: 'No care plan',
      value: g?.withoutCarePlan ?? 0,
      note: 'Active, no open plan',
      tone: waiting(g?.withoutCarePlan ?? 0, 'orange'),
      href: `${base}/care-plans`,
    },
    {
      key: 'not-discussed',
      label: 'Not at MDT',
      value: g?.notDiscussedAtTumorBoard ?? 0,
      note: 'Never on a tumour board',
      tone: waiting(g?.notDiscussedAtTumorBoard ?? 0),
      href: `${base}/tumor-board`,
    },
  ];

  const treatmentTiles: Tile[] = [
    {
      key: 'day-care-scheduled',
      label: 'Day-care patients',
      value: dc?.scheduled ?? 0,
      note: `${dc?.given ?? 0} given · ${dc?.held ?? 0} held`,
      tone: (dc?.scheduled ?? 0) > 0 ? 'sky' : 'slate',
      href: `${base}/day-care`,
    },
    {
      key: 'day-care-unordered',
      label: 'Not yet ordered',
      value: dc?.notYetOrdered ?? 0,
      note: `Scheduled ${dayWord}, no order`,
      tone: waiting(dc?.notYetOrdered ?? 0),
      href: `${base}/day-care`,
    },
    {
      key: 'chemo-in-progress',
      label: 'Chemo running',
      value: ch?.inProgressToday ?? 0,
      note: `${ch?.completedToday ?? 0} of ${ch?.ordersToday ?? 0} orders done`,
      tone: (ch?.inProgressToday ?? 0) > 0 ? 'violet' : 'slate',
      href: `${base}/orders`,
    },
    {
      key: 'fractions-today',
      label: 'RT fractions',
      value: rt?.fractionsToday ?? 0,
      note: `${rt?.fractionsDelivered ?? 0} delivered`,
      tone: (rt?.fractionsToday ?? 0) > 0 ? 'teal' : 'slate',
      href: `${base}/radiation`,
    },
    {
      key: 'fractions-missed',
      label: 'Missed fractions',
      value: rt?.fractionsMissed ?? 0,
      note: (rt?.fractionsMissed ?? 0) > 0 ? 'Reschedule needed' : 'None missed',
      tone: (rt?.fractionsMissed ?? 0) > 0 ? 'red' : 'green',
      href: `${base}/radiation`,
    },
    {
      key: 'active-courses',
      label: 'Active courses',
      value: (pl?.schedulesActive ?? 0) + (rt?.activeCourses ?? 0),
      note: `${pl?.schedulesActive ?? 0} chemo · ${rt?.activeCourses ?? 0} RT`,
      tone: (pl?.schedulesActive ?? 0) + (rt?.activeCourses ?? 0) > 0 ? 'green' : 'slate',
      href: `${base}/treatment-plans`,
    },
  ];

  const actionTiles: Tile[] = [
    {
      key: 'chemo-awaiting-approval',
      label: 'Chemo to approve',
      value: ch?.awaitingApproval ?? 0,
      note: 'Pending orders',
      tone: waiting(ch?.awaitingApproval ?? 0),
      href: `${base}/orders?status=pending`,
    },
    {
      key: 'chemo-awaiting-verification',
      label: 'Chemo to verify',
      value: ch?.awaitingVerification ?? 0,
      note: 'Approved, pharmacy check',
      tone: waiting(ch?.awaitingVerification ?? 0),
      href: `${base}/orders?status=approved`,
    },
    {
      key: 'chemo-held',
      label: 'Chemo on hold',
      value: ch?.held ?? 0,
      note: `${pl?.schedulesOnHold ?? 0} schedules on hold`,
      tone: waiting(ch?.held ?? 0, 'orange'),
      href: `${base}/orders?status=held`,
    },
    {
      key: 'rt-awaiting-approval',
      label: 'RT to approve',
      value: rt?.prescriptionsAwaitingApproval ?? 0,
      note: 'Draft prescriptions',
      tone: waiting(rt?.prescriptionsAwaitingApproval ?? 0),
      href: `${base}/radiation`,
    },
    {
      key: 'care-plans-draft',
      label: 'Plans to approve',
      value: pl?.carePlansDraft ?? 0,
      note: `${pl?.carePlansActive ?? 0} active care plans`,
      tone: waiting(pl?.carePlansDraft ?? 0),
      href: `${base}/care-plans`,
    },
    {
      key: 'tumor-board-overdue',
      label: 'MDT overdue',
      value: tb?.overdue ?? 0,
      note: `${tb?.next7Days ?? 0} cases in next 7 days`,
      tone: (tb?.overdue ?? 0) > 0 ? 'red' : 'green',
      href: `${base}/tumor-board`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setDate((d) => addDaysIso(d, -1))}
            aria-label="Previous day"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-8 w-auto"
            aria-label="Dashboard date"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setDate((d) => addDaysIso(d, 1))}
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {!isToday ? (
            <Button variant="ghost" size="sm" className="h-8" onClick={() => setDate(todayIso())}>
              Today
            </Button>
          ) : null}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {updatedAt ? <span>Live · updated {updatedAt}</span> : null}
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-8">
            <RefreshCw className={cn('mr-1 h-3.5 w-3.5', isFetching && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Oncology Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
            {validDate ? formatDate(date) : 'Pick a date'}
            {!isLoading && data ? (
              <>
                {' · '}
                {approvals > 0 ? (
                  <span className="font-medium text-warning">{plural(approvals, 'item')} waiting for sign-off</span>
                ) : (
                  <span className="font-medium text-success">nothing waiting for sign-off</span>
                )}
              </>
            ) : null}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="h-8">
            <Link href={`${base}/day-care`}>Day-care Worklist</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8">
            <Link href={`${base}/registry`}>Registry</Link>
          </Button>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {(error as Error).message}
        </div>
      ) : null}

      <TileRow id="onc-dash-treatment" title={isToday ? 'Treatment today' : 'Treatment on this day'} tiles={treatmentTiles} isLoading={isLoading} />
      <TileRow id="onc-dash-actions" title="Waiting for action" tiles={actionTiles} isLoading={isLoading} />
      <TileRow id="onc-dash-caseload" title="Caseload and pathway gaps" tiles={caseloadTiles} isLoading={isLoading} />

      {isLoading ? (
        <div className="grid gap-3 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-[280px] w-full rounded-xl" />
          ))}
        </div>
      ) : data ? (
        <div className="grid gap-3 lg:grid-cols-3">
          <Panel
            title="Upcoming tumour board"
            action={
              <Link href={`${base}/tumor-board`} className="shrink-0 whitespace-nowrap text-xs text-muted-foreground hover:text-foreground">
                View all
              </Link>
            }
          >
            {data.tumorBoard.upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No cases waiting for discussion.</p>
            ) : (
              <ul className="divide-y">
                {data.tumorBoard.upcoming.map((item) => {
                  const overdue = !!item.meetingDate && item.meetingDate < date;
                  return (
                    <li key={item.id}>
                      <Link
                        href={`${base}/tumor-board/${item.id}/edit`}
                        className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0 hover:opacity-80"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <PatientLine patient={item.patient} />
                          <div className="truncate text-xs text-muted-foreground">
                            {[item.cancerType, item.primarySite].filter(Boolean).join(' · ')}
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span className={cn('text-xs tabular-nums', overdue ? 'font-medium text-destructive' : 'text-muted-foreground')}>
                            {item.meetingDate ? formatShortDate(item.meetingDate) : '—'}
                          </span>
                          <ToneBadge tone={overdue ? 'red' : oncologyStatusTone(item.status)}>
                            {overdue ? 'Overdue' : label(item.status)}
                          </ToneBadge>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel
            title="Chemo orders needing action"
            action={
              <Link href={`${base}/orders`} className="shrink-0 whitespace-nowrap text-xs text-muted-foreground hover:text-foreground">
                View all
              </Link>
            }
          >
            {data.ordersNeedingAction.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders pending approval, verification or on hold.</p>
            ) : (
              <ul className="divide-y">
                {data.ordersNeedingAction.map((order) => (
                  <li key={order.id}>
                    <Link
                      href={`${base}/orders/${order.id}`}
                      className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0 hover:opacity-80"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <PatientLine patient={order.patient} />
                        <div className="truncate text-xs text-muted-foreground">
                          <span className="font-mono">{order.protocolCode}</span> · Cycle {order.cycleNumber}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {order.scheduledDate ? formatShortDate(order.scheduledDate) : '—'}
                        </span>
                        <ToneBadge tone={oncologyStatusTone(order.status)}>{label(order.status)}</ToneBadge>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Active disease by cancer type"
            action={
              <span className="flex flex-wrap justify-end gap-1">
                {data.caseload.byClinicalStatus.map((s) => (
                  <ToneBadge key={s.key} tone="slate">
                    {label(s.key)} {s.count}
                  </ToneBadge>
                ))}
              </span>
            }
          >
            <CancerTypeBars rows={data.caseload.byCancerType} />
          </Panel>
        </div>
      ) : null}
    </div>
  );
}

type DashboardView = 'operations' | 'population';

/**
 * Oncology Dashboard: the population health view of the cancer registry
 * (default), or the day's operations (`?view=operations`). An old
 * `?view=population` link still opens the default tab.
 */
export default function OncologyDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view: DashboardView = searchParams.get('view') === 'operations' ? 'operations' : 'population';

  const setView = (next: string) => {
    const query = new URLSearchParams(searchParams.toString());
    if (next === 'operations') query.set('view', 'operations');
    else query.delete('view');
    const search = query.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  return (
    <Tabs value={view} onValueChange={setView} className="flex flex-col gap-6 page-transition">
      <TabsList aria-label="Dashboard view" className="self-start">
        <TabsTrigger value="population" className="px-4">
          Population health
        </TabsTrigger>
        <TabsTrigger value="operations" className="px-4">
          Operations
        </TabsTrigger>
      </TabsList>
      <TabsContent value="operations" className="mt-0">
        <OperationsView />
      </TabsContent>
      <TabsContent value="population" className="mt-0">
        <PopulationHealthView />
      </TabsContent>
    </Tabs>
  );
}
