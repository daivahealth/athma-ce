'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format, isSameDay } from 'date-fns';
import {
  CalendarClock,
  ClipboardList,
  FileSignature,
  FileText,
  History,
  PenLine,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useOtReport, useOtReportVersions, useSignOtReport } from '@/modules/ot/hooks/use-ot';
import { otReportStatusTone } from '@/modules/ot/ot-tone';
import { OtReportStatusBadge } from '@/modules/ot/components/ot-status-badge';
import { OtErrorPanel } from '@/modules/ot/components/ot-list';
import {
  OtDetailHero,
  OtDetailSkeleton,
  OtFact,
  OtLinkRow,
  OtSection,
} from '@/modules/ot/components/ot-detail';

function fmt(value?: string | null): string | null {
  if (!value) return null;
  try {
    return format(new Date(value), 'dd MMM yyyy, HH:mm');
  } catch {
    return value;
  }
}

function fieldLabel(key: string): string {
  const s = key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Renders a single reportData field value: lists as bullet lists, everything else as text. */
function FieldValue({ value }: { value: unknown }) {
  if (value == null || value === '')
    return <span className="text-muted-foreground">Not documented</span>;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-muted-foreground">None</span>;
    return (
      <ul className="list-disc space-y-0.5 pl-4 marker:text-muted-foreground">
        {value.map((item, i) => (
          <li key={i}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
        ))}
      </ul>
    );
  }
  if (typeof value === 'object') {
    return (
      <pre className="whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-xs">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }
  if (typeof value === 'boolean') return <span>{value ? 'Yes' : 'No'}</span>;
  return <span className="whitespace-pre-wrap">{String(value)}</span>;
}

export default function OtReportDetailPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const id = params.id as string;
  const publishToast = useToast();

  const { data: report, isLoading, error } = useOtReport(id);
  const { data: versions } = useOtReportVersions(id);
  const signReport = useSignOtReport();

  const currentVersion =
    versions?.find((v) => v.isCurrent) ?? versions?.[versions.length - 1] ?? report?.versions?.[0];

  const handleSign = async () => {
    try {
      await signReport.mutateAsync({ id });
      publishToast({
        title: 'OT report signed',
        description: 'The operative report is now signed.',
      });
    } catch (err) {
      publishToast({
        variant: 'destructive',
        title: 'Unable to sign OT report',
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  if (isLoading) return <OtDetailSkeleton />;
  if (error || !report) return <OtErrorPanel error={error ?? new Error('OT report not found.')} />;

  const start = report.schedule ? new Date(report.schedule.scheduledStartTime) : null;
  const end = report.schedule ? new Date(report.schedule.scheduledEndTime) : null;
  const surgery =
    start && end
      ? `${format(start, 'dd MMM yyyy, HH:mm')} – ${format(end, isSameDay(start, end) ? 'HH:mm' : 'dd MMM, HH:mm')}`
      : null;
  const fields = currentVersion ? Object.entries(currentVersion.reportData) : [];
  const orderedVersions = [...(versions ?? [])].sort((a, b) => b.versionNo - a.versionNo);

  return (
    <div className="space-y-6 page-transition">
      <OtDetailHero
        backHref={`/${locale}/ot/reports`}
        backLabel="OT Reports"
        kicker="Operative report"
        icon={FileText}
        title={report.reportNumber}
        subtitle={
          report.remarks ? <span className="whitespace-pre-wrap">{report.remarks}</span> : undefined
        }
        tone={otReportStatusTone(report.reportStatus)}
        badges={
          <>
            <OtReportStatusBadge status={report.reportStatus} />
            {currentVersion ? (
              <span className="rounded-full border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                Version {currentVersion.versionNo}
              </span>
            ) : null}
          </>
        }
        actions={
          <>
            {['DRAFT', 'AMENDED'].includes(report.reportStatus) && (
              <Button onClick={handleSign} disabled={signReport.isPending}>
                <FileSignature className="mr-2 h-4 w-4" />
                Sign report
              </Button>
            )}
            {report.reportStatus === 'SIGNED' && (
              <Button variant="outline" asChild>
                <Link href={`/${locale}/ot/reports/new?amend=${report.id}`}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Amend
                </Link>
              </Button>
            )}
          </>
        }
        patient={report}
        facts={
          <>
            <OtFact label="Surgery" icon={CalendarClock} className="sm:col-span-2">
              {surgery}
            </OtFact>
            <OtFact label="Created" icon={PenLine}>
              {fmt(report.createdAt)}
            </OtFact>
            <OtFact label="Signed" icon={FileSignature}>
              {fmt(report.signedAt) ??
                (report.reportStatus === 'CANCELLED' ? null : 'Awaiting signature')}
            </OtFact>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <OtSection
          title="Operative note"
          icon={ClipboardList}
          description={
            currentVersion ? `As recorded in version ${currentVersion.versionNo}` : undefined
          }
          className="lg:col-span-2"
        >
          {fields.length > 0 ? (
            <dl className="divide-y">
              {fields.map(([key, value]) => (
                <div
                  key={key}
                  className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[200px_1fr] sm:gap-4"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:pt-0.5">
                    {fieldLabel(key)}
                  </dt>
                  <dd className="text-sm leading-relaxed text-foreground">
                    <FieldValue value={value} />
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              No detailed operative content has been recorded for this report yet.
            </p>
          )}
        </OtSection>

        <div className="space-y-6">
          <OtSection title="Version history" icon={History}>
            {orderedVersions.length > 0 ? (
              <ol className="space-y-2">
                {orderedVersions.map((v) => (
                  <li
                    key={v.id}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm',
                      v.isCurrent ? 'border-primary/30 bg-primary/5' : 'bg-background',
                    )}
                  >
                    <span className="font-medium">
                      Version {v.versionNo}
                      {v.isCurrent ? (
                        <span className="ml-2 text-xs font-normal text-primary">Current</span>
                      ) : null}
                    </span>
                    <span className="text-xs text-muted-foreground">{fmt(v.createdAt)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">No versions recorded.</p>
            )}
          </OtSection>

          <OtSection title="Related" icon={CalendarClock}>
            <div className="space-y-2">
              <OtLinkRow
                href={`/${locale}/ot/schedules/${report.scheduleId}`}
                icon={CalendarClock}
                title="OT schedule"
                meta={surgery ?? 'Open the theatre booking'}
              />
              <OtLinkRow
                href={`/${locale}/ot/requests/${report.otRequestId}`}
                icon={ClipboardList}
                title="OT request"
                meta="Open the original request"
              />
            </div>
          </OtSection>
        </div>
      </div>
    </div>
  );
}
