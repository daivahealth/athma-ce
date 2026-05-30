'use client';

import { useState } from 'react';
import { Clock3, FlaskConical, ScanLine, TimerReset } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ClinicalOrder } from '../../../types/charting';
import type { LabReportContext } from '../../../types/lab-operations';
import type { LabReport, PathologyReport, PatientResult } from '../../../types/reporting';
import type { LabTest } from '@/modules/foundation/types/catalog';
import { cn } from '@/lib/utils';

type LabReportContextCardProps = {
  order?: ClinicalOrder | null;
  contexts?: LabReportContext[];
  encounterLabResults?: PatientResult[];
  report?: LabReport | PathologyReport | null;
  labTest?: LabTest | null;
};

export function LabReportContextCard({
  order,
  contexts = [],
  encounterLabResults = [],
  report,
  labTest,
}: LabReportContextCardProps) {
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const encounterLabOrderCount = encounterLabResults.filter((result) => result.reportType === 'lab').length;
  const encounterOrderCount = encounterLabOrderCount > 0 ? encounterLabOrderCount : null;
  const primaryContext = contexts[0];
  const primarySpecimen = primaryContext?.specimen;
  const primaryAccession = primaryContext?.accession;
  const tests = order?.labTests ?? [];
  const primaryProcessingRun = primarySpecimen?.processingRuns
    ?.filter((run) => run.labOrderTestId === primaryContext?.labOrderTest.id)
    .sort((a, b) => {
      const aTime = a.processedAt ? new Date(a.processedAt).getTime() : 0;
      const bTime = b.processedAt ? new Date(b.processedAt).getTime() : 0;
      return bTime - aTime;
    })[0];
  const orderedAt = order?.orderedAt ?? report?.createdAt ?? null;
  const reportedAt = report?.reportedAt ?? report?.verifiedAt ?? null;
  const inferredProcessingAt =
    primaryProcessingRun?.processedAt ??
    (primaryContext?.labOrderTest.status === 'result_entered' || reportedAt
      ? reportedAt ?? report?.updatedAt ?? null
      : null);
  const turnaround = computeTatSummary({
    orderedAt,
    reportedAt,
    turnaroundTimeHours: labTest?.turnaroundTimeHours ?? null,
  });
  const timelineEntries = [
    {
      key: 'ordered',
      label: 'Ordered',
      value: orderedAt,
      accent: 'bg-sky-500/15 text-sky-700 border-sky-200',
      icon: Clock3,
    },
    {
      key: 'collected',
      label: 'Collected',
      value: primarySpecimen?.collectedAt,
      accent: 'bg-amber-500/15 text-amber-700 border-amber-200',
      icon: FlaskConical,
    },
    {
      key: 'received',
      label: 'Received',
      value: primaryAccession?.receivedAt,
      accent: 'bg-violet-500/15 text-violet-700 border-violet-200',
      icon: ScanLine,
    },
    {
      key: 'processing',
      label: 'Processing',
      value: inferredProcessingAt,
      accent: 'bg-emerald-500/15 text-emerald-700 border-emerald-200',
      icon: TimerReset,
    },
    {
      key: 'reported',
      label: 'Reported',
      value: reportedAt,
      accent: 'bg-rose-500/15 text-rose-700 border-rose-200',
      icon: Clock3,
    },
  ];

  if (!order && contexts.length === 0) {
    return null;
  }

  const contextByTestId = new Map(
    contexts.map((context) => [context.labOrderTest.id, context] as const),
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Order & Specimen Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-xl border border-border/60 bg-gradient-to-r from-orange-50/70 via-white to-emerald-50/70 p-4">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,60%)_minmax(0,40%)] xl:items-start">
            <div className="min-w-0 flex-1">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Order</div>
              <div className="mt-1 text-xl font-semibold leading-tight">
                {order?.orderName ?? contexts[0]?.order.orderName ?? 'Lab Order'}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className={cn('capitalize border', getPriorityBadgeClass(order?.priority ?? contexts[0]?.order.priority))}>
                  {order?.priority ?? contexts[0]?.order.priority ?? 'routine'}
                </Badge>
                <Badge variant="outline">
                  {order?.orderCode ?? contexts[0]?.order.orderCode ?? '-'}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {order?.status ?? contexts[0]?.order.status ?? '-'}
                </Badge>
                {encounterOrderCount !== null ? (
                  <Badge variant="outline">
                    {encounterOrderCount} lab order{encounterOrderCount === 1 ? '' : 's'} in encounter
                  </Badge>
                ) : null}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <SummaryCell
                  label="Specimen No."
                  value={primarySpecimen?.barcode ?? primarySpecimen?.id ?? '-'}
                  subValue={primarySpecimen?.specimenType ?? 'Specimen'}
                  compact
                />
                <SummaryCell
                  label="Accession No."
                  value={primaryAccession?.accessionNumber ?? '-'}
                  subValue={primaryAccession?.status ?? primarySpecimen?.status ?? 'pending'}
                  compact
                />
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200/70 bg-white/90 p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Turnaround Time</div>
                  <div className="text-sm font-medium text-foreground">
                    {labTest?.turnaroundTimeHours
                      ? `${labTest.turnaroundTimeHours} hour target from order time`
                      : 'No lab test TAT configured'}
                  </div>
                </div>
                <TatStatusBadge status={turnaround.status} />
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <SummaryCell label="Elapsed" value={turnaround.elapsedLabel} compact />
                <SummaryCell label="Due By" value={formatDateTime(turnaround.dueAt)} compact />
                <SummaryCell label="Remaining" value={turnaround.remainingLabel} compact />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <button
            type="button"
            onClick={() => setTimelineExpanded((current) => !current)}
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Workflow Timeline</div>
              <div className="text-sm font-medium text-foreground">
                Ordered, collected, received, processing, and reported times aligned in sequence
              </div>
            </div>
            <Badge variant="outline">{timelineExpanded ? 'Hide timeline' : 'Show timeline'}</Badge>
          </button>
          {timelineExpanded ? (
            <div className="mt-3 grid gap-2 md:grid-cols-5">
              {timelineEntries.map((entry) => {
                const Icon = entry.icon;
                return (
                  <div
                    key={entry.key}
                    className={cn(
                      'rounded-lg border px-3 py-2',
                      entry.value ? entry.accent : 'border-dashed border-slate-200 bg-white text-slate-500',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" />
                      <div className="text-[11px] font-semibold uppercase tracking-wide">{entry.label}</div>
                    </div>
                    <div className="mt-2 text-sm font-semibold">{formatDate(entry.value)}</div>
                    <div className="text-xs opacity-80">{formatTime(entry.value)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {timelineEntries.map((entry) => (
                <Badge
                  key={entry.key}
                  variant="outline"
                  className={cn(
                    'capitalize',
                    entry.value ? entry.accent : 'border-dashed text-slate-400',
                  )}
                >
                  {entry.label}: {entry.value ? formatDateTime(entry.value) : 'Pending'}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {tests.length > 1 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordered Test</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Specimen</TableHead>
                <TableHead>Accession</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test) => {
                const context = test.id ? contextByTestId.get(test.id) : undefined;
                const specimen = context?.specimen;
                const accession = context?.accession;

                return (
                  <TableRow key={test.id ?? `${test.testCode}:${test.testName}`}>
                    <TableCell className="font-medium">
                      <div>{test.testName}</div>
                      {test.specimenType ? (
                        <div className="text-xs text-muted-foreground">{test.specimenType}</div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {test.testCode}
                    </TableCell>
                    <TableCell>
                      <div>{specimen?.barcode ?? specimen?.id ?? 'Pending'}</div>
                      <div className="text-xs text-muted-foreground">
                        {specimen?.specimenType ?? test.specimenType ?? 'Specimen'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{accession?.accessionNumber ?? 'Pending'}</div>
                      <div className="text-xs text-muted-foreground">
                        {accession?.status ?? specimen?.status ?? order?.status ?? 'pending'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {context?.labOrderTest.status ?? order?.status ?? 'ordered'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : null}

        {tests.length === 0 && contexts[0] ? (
          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCell
              label="Test"
              value={contexts[0].labOrderTest.testName}
              subValue={contexts[0].labOrderTest.testCode}
            />
            <SummaryCell
              label="Specimen"
              value={contexts[0].specimen.barcode ?? contexts[0].specimen.id}
              subValue={contexts[0].specimen.specimenType ?? 'Specimen'}
            />
            <SummaryCell
              label="Accession"
              value={contexts[0].accession?.accessionNumber ?? 'Pending'}
              subValue={contexts[0].accession?.status ?? contexts[0].specimen.status}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function formatDateTime(value?: string | Date | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function formatDate(value?: string | Date | null) {
  if (!value) return 'Pending';
  return new Date(value).toLocaleDateString();
}

function formatTime(value?: string | Date | null) {
  if (!value) return 'No timestamp yet';
  return new Date(value).toLocaleTimeString();
}

function formatDuration(milliseconds?: number | null) {
  if (milliseconds == null || Number.isNaN(milliseconds)) return '-';
  const totalMinutes = Math.max(0, Math.round(milliseconds / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function computeTatSummary({
  orderedAt,
  reportedAt,
  turnaroundTimeHours,
}: {
  orderedAt?: string | Date | null;
  reportedAt?: string | Date | null;
  turnaroundTimeHours?: number | null;
}) {
  const orderedTimestamp = orderedAt ? new Date(orderedAt).getTime() : null;
  const completedTimestamp = reportedAt ? new Date(reportedAt).getTime() : null;
  const comparisonTimestamp = completedTimestamp ?? Date.now();
  const dueAt =
    orderedTimestamp != null && turnaroundTimeHours != null
      ? new Date(orderedTimestamp + turnaroundTimeHours * 60 * 60 * 1000)
      : null;
  const elapsedMilliseconds =
    orderedTimestamp != null ? comparisonTimestamp - orderedTimestamp : null;
  const remainingMilliseconds =
    dueAt != null ? dueAt.getTime() - comparisonTimestamp : null;

  let status: 'missing' | 'on-track' | 'watch' | 'met' | 'breached' = 'missing';
  if (orderedTimestamp != null && turnaroundTimeHours != null) {
    if (completedTimestamp != null) {
      status = dueAt && completedTimestamp > dueAt.getTime() ? 'breached' : 'met';
    } else if (dueAt && comparisonTimestamp > dueAt.getTime()) {
      status = 'breached';
    } else if (remainingMilliseconds != null && remainingMilliseconds <= Math.min(60 * 60 * 1000, turnaroundTimeHours * 0.2 * 60 * 60 * 1000)) {
      status = 'watch';
    } else {
      status = 'on-track';
    }
  }

  return {
    status,
    dueAt,
    elapsedLabel: formatDuration(elapsedMilliseconds),
    remainingLabel:
      turnaroundTimeHours == null || dueAt == null
        ? 'No target'
        : remainingMilliseconds != null && remainingMilliseconds < 0
          ? `${formatDuration(Math.abs(remainingMilliseconds))} overdue`
          : formatDuration(remainingMilliseconds),
  };
}

function TatStatusBadge({ status }: { status: 'missing' | 'on-track' | 'watch' | 'met' | 'breached' }) {
  const config: Record<typeof status, { label: string; className: string }> = {
    missing: {
      label: 'TAT not configured',
      className: 'border-slate-200 bg-slate-100 text-slate-700',
    },
    'on-track': {
      label: 'Within TAT',
      className: 'border-emerald-200 bg-emerald-100 text-emerald-700',
    },
    watch: {
      label: 'Approaching TAT',
      className: 'border-amber-200 bg-amber-100 text-amber-700',
    },
    met: {
      label: 'TAT met',
      className: 'border-emerald-200 bg-emerald-100 text-emerald-700',
    },
    breached: {
      label: 'TAT breached',
      className: 'border-red-200 bg-red-100 text-red-700',
    },
  };

  return <Badge className={cn('w-fit border', config[status].className)}>{config[status].label}</Badge>;
}

function getPriorityBadgeClass(priority?: string | null) {
  switch ((priority ?? '').toLowerCase()) {
    case 'routine':
      return 'border-emerald-200 bg-emerald-100 text-emerald-700';
    case 'stat':
    case 'urgent':
    case 'critical':
      return 'border-red-200 bg-red-100 text-red-700';
    default:
      return 'border-amber-200 bg-amber-100 text-amber-700';
  }
}

function SummaryCell({
  label,
  value,
  subValue,
  compact = false,
}: {
  label: string;
  value: string;
  subValue?: string | null;
  compact?: boolean;
}) {
  return (
    <div className={cn('space-y-1', compact && 'rounded-lg border border-white/70 bg-white/80 p-3')}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={cn('font-medium break-words capitalize', compact && 'text-sm')}>{value}</div>
      {subValue ? (
        <Badge variant="secondary" className="capitalize">
          {subValue}
        </Badge>
      ) : null}
    </div>
  );
}
