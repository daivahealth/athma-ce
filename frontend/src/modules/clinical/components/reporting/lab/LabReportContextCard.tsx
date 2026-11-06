'use client';

import type { LucideIcon } from 'lucide-react';
import { Check, ClipboardList, Cpu, FileCheck2, FlaskConical, ScanLine, Timer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ToneBadge, type BadgeTone } from '@/components/ui/tone-badge';
import { TONE_BAR, TONE_RING, TONE_SOLID, TONE_TEXT, TONE_WASH } from '@/components/ui/tone-classes';
import { labPriorityTone, labStageTone } from '../../../utils/lab-result-tone';
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
  const timelineEntries: Array<{ key: string; label: string; value?: string | Date | null; tone: BadgeTone; icon: LucideIcon }> = [
    { key: 'ordered', label: 'Ordered', value: orderedAt, tone: 'sky', icon: ClipboardList },
    { key: 'collected', label: 'Collected', value: primarySpecimen?.collectedAt, tone: 'amber', icon: FlaskConical },
    { key: 'received', label: 'Received', value: primaryAccession?.receivedAt, tone: 'violet', icon: ScanLine },
    { key: 'processing', label: 'Processing', value: inferredProcessingAt, tone: 'teal', icon: Cpu },
    { key: 'reported', label: 'Reported', value: reportedAt, tone: 'emerald', icon: FileCheck2 },
  ];
  // "Up next" follows the furthest step reached; an earlier step with no timestamp was skipped or not recorded.
  const lastDoneIndex = timelineEntries.reduce((last, entry, index) => (entry.value ? index : last), -1);
  const nextStepIndex = lastDoneIndex + 1 < timelineEntries.length ? lastDoneIndex + 1 : -1;

  if (!order && contexts.length === 0) {
    return null;
  }

  const contextByTestId = new Map(
    contexts.map((context) => [context.labOrderTest.id, context] as const),
  );

  const priority = (order?.priority ?? contexts[0]?.order.priority ?? 'routine').toLowerCase();
  const orderStatus = order?.status ?? contexts[0]?.order.status;
  const tatTone = TAT_TONE[turnaround.status];

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Order</div>
            <div className="mt-0.5 text-xl font-semibold leading-tight text-foreground">
              {order?.orderName ?? contexts[0]?.order.orderName ?? 'Lab Order'}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <ToneBadge tone={labPriorityTone(priority)} strong={priority !== 'routine'} className="capitalize">
                {priority}
              </ToneBadge>
              <span className="rounded-md border border-border/70 bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                {order?.orderCode ?? contexts[0]?.order.orderCode ?? '-'}
              </span>
              {orderStatus ? (
                <ToneBadge tone={labStageTone(orderStatus)} withDot className="capitalize">
                  {orderStatus.split('_').join(' ')}
                </ToneBadge>
              ) : null}
              {encounterOrderCount !== null ? (
                <span className="text-xs text-muted-foreground">
                  · {encounterOrderCount} lab order{encounterOrderCount === 1 ? '' : 's'} in encounter
                </span>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:w-[22rem]">
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

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section aria-label="Workflow timeline" className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Workflow Timeline</div>
            <ol className="grid grid-cols-5">
              {timelineEntries.map((entry, index) => {
                const Icon = entry.icon;
                const done = Boolean(entry.value);
                const isNext = index === nextStepIndex;
                const isSkipped = !done && index < lastDoneIndex;
                const isLast = index === timelineEntries.length - 1;
                const nextDone = !isLast && Boolean(timelineEntries[index + 1].value);
                return (
                  <li key={entry.key} className="relative flex flex-col items-center text-center">
                    {!isLast ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute left-1/2 top-4 h-0.5 w-full',
                          done && nextDone ? TONE_BAR[timelineEntries[index + 1].tone] : 'border-t-2 border-dashed border-border bg-transparent',
                        )}
                      />
                    ) : null}
                    <span
                      className={cn(
                        'relative z-10 flex size-8 items-center justify-center rounded-full border-2 transition-colors',
                        done
                          ? TONE_SOLID[entry.tone]
                          : isNext
                            ? cn('border-dashed bg-card ring-4', TONE_RING[entry.tone], TONE_TEXT[entry.tone])
                            : 'border-dashed border-border bg-card text-muted-foreground',
                      )}
                    >
                      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : <Icon className="h-3.5 w-3.5" />}
                    </span>
                    <span
                      className={cn(
                        'mt-2 text-xs font-semibold',
                        done ? 'text-foreground' : isNext ? TONE_TEXT[entry.tone] : 'text-muted-foreground',
                      )}
                    >
                      {entry.label}
                    </span>
                    <span className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                      {done ? (
                        <>
                          {formatDate(entry.value)}
                          <br />
                          {formatTime(entry.value)}
                        </>
                      ) : isNext ? (
                        'Up next'
                      ) : isSkipped ? (
                        'Not recorded'
                      ) : (
                        'Pending'
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          <section aria-label="Turnaround time" className={cn('rounded-xl border p-4', TONE_WASH[tatTone])}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Timer className={cn('h-4 w-4', TONE_TEXT[tatTone])} />
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Turnaround Time</div>
              </div>
              <TatStatusBadge status={turnaround.status} />
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">
              {labTest?.turnaroundTimeHours
                ? `${labTest.turnaroundTimeHours} hour target from order time`
                : 'No lab test TAT configured'}
            </div>
            {turnaround.progress != null ? (
              <div
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-background/70"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(Math.min(turnaround.progress, 1) * 100)}
                aria-label="Share of turnaround target used"
              >
                <div
                  className={cn('h-full rounded-full', TONE_BAR[tatTone])}
                  style={{ width: `${Math.min(turnaround.progress, 1) * 100}%` }}
                />
              </div>
            ) : null}
            <dl className="mt-3 grid grid-cols-3 gap-2">
              <TatFigure label="Elapsed" value={turnaround.elapsedLabel} />
              <TatFigure label="Due By" value={formatShortDateTime(turnaround.dueAt)} />
              <TatFigure label="Remaining" value={turnaround.remainingLabel} />
            </dl>
          </section>
        </div>

        {tests.length > 1 ? (
          <div className="overflow-hidden rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
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
                const testStatus = context?.labOrderTest.status ?? order?.status ?? 'ordered';

                return (
                  <TableRow key={test.id ?? `${test.testCode}:${test.testName}`}>
                    <TableCell className="font-medium">
                      <div>{test.testName}</div>
                      {test.specimenType ? (
                        <div className="text-xs capitalize text-muted-foreground">{test.specimenType}</div>
                      ) : null}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {test.testCode}
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-xs">{specimen?.barcode ?? specimen?.id ?? 'Pending'}</div>
                      <div className="text-xs capitalize text-muted-foreground">
                        {specimen?.specimenType ?? test.specimenType ?? 'Specimen'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-xs">{accession?.accessionNumber ?? 'Pending'}</div>
                      <div className="text-xs capitalize text-muted-foreground">
                        {accession?.status ?? specimen?.status ?? order?.status ?? 'pending'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ToneBadge tone={labStageTone(testStatus)} withDot className="capitalize">
                        {testStatus.split('_').join(' ')}
                      </ToneBadge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>
        ) : null}

        {tests.length === 0 && contexts[0] ? (
          <div className="grid gap-2 md:grid-cols-3">
            <SummaryCell
              label="Test"
              value={contexts[0].labOrderTest.testName}
              subValue={contexts[0].labOrderTest.testCode}
              compact
            />
            <SummaryCell
              label="Specimen"
              value={contexts[0].specimen.barcode ?? contexts[0].specimen.id}
              subValue={contexts[0].specimen.specimenType ?? 'Specimen'}
              compact
            />
            <SummaryCell
              label="Accession"
              value={contexts[0].accession?.accessionNumber ?? 'Pending'}
              subValue={contexts[0].accession?.status ?? contexts[0].specimen.status}
              compact
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function TatFigure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/70 px-2.5 py-2">
      <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function formatShortDateTime(value?: string | Date | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
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

  const targetMilliseconds = turnaroundTimeHours != null ? turnaroundTimeHours * 60 * 60 * 1000 : null;
  const progress =
    elapsedMilliseconds != null && targetMilliseconds ? Math.max(0, elapsedMilliseconds / targetMilliseconds) : null;

  return {
    status,
    dueAt,
    progress,
    elapsedLabel: formatDuration(elapsedMilliseconds),
    remainingLabel:
      turnaroundTimeHours == null || dueAt == null
        ? 'No target'
        : remainingMilliseconds != null && remainingMilliseconds < 0
          ? `${formatDuration(Math.abs(remainingMilliseconds))} overdue`
          : formatDuration(remainingMilliseconds),
  };
}

type TatStatus = 'missing' | 'on-track' | 'watch' | 'met' | 'breached';

const TAT_TONE: Record<TatStatus, BadgeTone> = {
  missing: 'slate',
  'on-track': 'emerald',
  watch: 'amber',
  met: 'emerald',
  breached: 'red',
};

const TAT_LABEL: Record<TatStatus, string> = {
  missing: 'TAT not configured',
  'on-track': 'Within TAT',
  watch: 'Approaching TAT',
  met: 'TAT met',
  breached: 'TAT breached',
};

function TatStatusBadge({ status }: { status: TatStatus }) {
  return (
    <ToneBadge tone={TAT_TONE[status]} withDot strong={status === 'breached'}>
      {TAT_LABEL[status]}
    </ToneBadge>
  );
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
    <div className={cn('min-w-0 space-y-1', compact && 'rounded-xl border border-border/60 bg-muted/20 p-3')}>
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={cn('truncate font-mono font-medium text-foreground', compact && 'text-sm')} title={value}>
        {value}
      </div>
      {subValue ? (
        <Badge variant="secondary" className="font-normal capitalize">
          {subValue}
        </Badge>
      ) : null}
    </div>
  );
}
