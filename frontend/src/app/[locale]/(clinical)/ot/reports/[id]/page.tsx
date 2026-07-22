'use client';

import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, FileSignature, History, RotateCcw, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOtReport, useOtReportVersions, useSignOtReport } from '@/modules/ot/hooks/use-ot';
import { OtReportStatusBadge } from '@/modules/ot/components/ot-status-badge';
import { useToast } from '@/components/ui/use-toast';

function fmt(value?: string | null): string {
  if (!value) return '—';
  try {
    return format(new Date(value), 'dd MMM yyyy, HH:mm');
  } catch {
    return value;
  }
}

function fieldLabel(key: string): string {
  const s = key.replace(/([a-z])([A-Z])/g, '$1 $2');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Renders a single reportData field value: lists as bullet lists, everything else as text. */
function FieldValue({ value }: { value: unknown }) {
  if (value == null || value === '') return <span className="text-muted-foreground">Not documented</span>;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-muted-foreground">None</span>;
    return (
      <ul className="list-disc space-y-0.5 pl-4">
        {value.map((item, i) => (
          <li key={i}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
        ))}
      </ul>
    );
  }
  if (typeof value === 'object') {
    return <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(value, null, 2)}</pre>;
  }
  return <span>{String(value)}</span>;
}

export default function OtReportDetailPage() {
  const params = useParams();
  const router = useRouter();
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
      publishToast({ title: 'OT report signed', description: 'The operative report is now signed.' });
    } catch (err) {
      publishToast({
        variant: 'destructive',
        title: 'Unable to sign OT report',
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/ot/reports`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">Loading OT report...</div>
      ) : error || !report ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error instanceof Error ? error.message : 'OT report not found.'}
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {report.reportNumber}
                    <OtReportStatusBadge status={report.reportStatus} />
                  </CardTitle>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-foreground">
                      {report.patientDisplay?.displayName || 'Unknown patient'}
                    </span>
                    <span>
                      MRN: {report.patientDisplay?.mrn || '—'} · {report.patientDisplay?.gender || '—'} /{' '}
                      {report.patientDisplay?.age ?? '—'}y
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {['DRAFT', 'AMENDED'].includes(report.reportStatus) && (
                    <Button size="sm" onClick={handleSign} disabled={signReport.isPending}>
                      <FileSignature className="mr-2 h-4 w-4" />
                      Sign
                    </Button>
                  )}
                  {report.reportStatus === 'SIGNED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/${locale}/ot/reports/new?amend=${report.id}`)}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Amend
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-medium">{fmt(report.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Signed</p>
                <p className="font-medium">{fmt(report.signedAt)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-muted-foreground">Schedule</p>
                <p className="font-medium">
                  {report.schedule
                    ? `${fmt(report.schedule.scheduledStartTime)} – ${format(
                        new Date(report.schedule.scheduledEndTime),
                        'HH:mm',
                      )}`
                    : '—'}
                </p>
              </div>
            </CardContent>
          </Card>

          {report.remarks ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-foreground">{report.remarks}</p>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Operative Report</CardTitle>
            </CardHeader>
            <CardContent>
              {currentVersion ? (
                <div className="space-y-4">
                  {Object.entries(currentVersion.reportData).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {fieldLabel(key)}
                      </p>
                      <div className="text-sm text-foreground">
                        <FieldValue value={value} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No detailed operative content has been recorded for this report yet.
                </p>
              )}
            </CardContent>
          </Card>

          {versions && versions.length > 1 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <History className="h-4 w-4" /> Version History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[...versions]
                  .sort((a, b) => b.versionNo - a.versionNo)
                  .map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-card/60 p-2.5 text-sm"
                    >
                      <span className="font-medium">Version {v.versionNo}{v.isCurrent ? ' (current)' : ''}</span>
                      <span className="text-xs text-muted-foreground">{fmt(v.createdAt)}</span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}
