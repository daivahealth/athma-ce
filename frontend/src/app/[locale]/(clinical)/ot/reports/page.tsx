'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format, formatDistanceToNow, isSameDay } from 'date-fns';
import {
  Eye,
  FileSignature,
  FileText,
  MoreHorizontal,
  Plus,
  RotateCcw,
  StopCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { PatientIdentity } from '@/components/ui/patient-identity';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useCancelOtReport, useOtReports, useSignOtReport } from '@/modules/ot/hooks/use-ot';
import { OT_REPORT_STATUSES, type OtReport, type OtReportStatus } from '@/modules/ot/types';
import { OT_REPORT_STATUS_TONE } from '@/modules/ot/ot-tone';
import { OtReportStatusBadge } from '@/modules/ot/components/ot-status-badge';
import {
  OtDateTime,
  OtErrorPanel,
  OtListToolbar,
  OtSearchInput,
  OtStatusFilter,
  OtTableSkeleton,
  countBy,
} from '@/modules/ot/components/ot-list';

const STATUS_OPTIONS = OT_REPORT_STATUSES.map((value) => ({
  value,
  tone: OT_REPORT_STATUS_TONE[value],
}));
const SIGNABLE: OtReportStatus[] = ['DRAFT', 'AMENDED'];

function surgeryTime(schedule: OtReport['schedule']) {
  if (!schedule) return null;
  const start = new Date(schedule.scheduledStartTime);
  const end = new Date(schedule.scheduledEndTime);
  return {
    date: format(start, 'dd MMM yyyy'),
    time: isSameDay(start, end)
      ? `${format(start, 'HH:mm')} – ${format(end, 'HH:mm')}`
      : `${format(start, 'HH:mm')} – ${format(end, 'dd MMM, HH:mm')}`,
  };
}

export default function OtReportsPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const publishToast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OtReportStatus>('all');
  const deferredSearchQuery = useDeferredValue(searchQuery.trim());

  // Status is filtered here rather than on the server so each chip can show its count.
  const {
    data: reports,
    isLoading,
    error,
  } = useOtReports(deferredSearchQuery ? { search: deferredSearchQuery } : undefined);
  const allReports = useMemo(
    () => [...(reports ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [reports],
  );
  const counts = useMemo(() => countBy(allReports, (r) => r.reportStatus), [allReports]);
  const visibleReports = useMemo(
    () =>
      statusFilter === 'all'
        ? allReports
        : allReports.filter((r) => r.reportStatus === statusFilter),
    [allReports, statusFilter],
  );
  const awaitingSignature = (counts.DRAFT ?? 0) + (counts.AMENDED ?? 0);

  const signReport = useSignOtReport();
  const cancelReport = useCancelOtReport();
  const reportHref = (id: string) => `/${params.locale}/ot/reports/${id}`;
  const newHref = `/${params.locale}/ot/reports/new`;

  const handleSign = async (id: string) => {
    try {
      await signReport.mutateAsync({ id });
      publishToast({
        title: 'OT report signed',
        description: 'The operative report is now signed.',
      });
    } catch (error) {
      publishToast({
        variant: 'destructive',
        title: 'Unable to sign OT report',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelReport.mutateAsync({ id });
      publishToast({
        title: 'OT report cancelled',
        description: 'The report was moved to cancelled status.',
      });
    } catch (error) {
      publishToast({
        variant: 'destructive',
        title: 'Unable to cancel OT report',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const filtered = Boolean(deferredSearchQuery) || statusFilter !== 'all';

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        icon={FileText}
        title="OT Reports"
        subtitle="Operative notes for theatre cases: sign drafts and amend signed reports."
        actions={
          <Button asChild>
            <Link href={newHref}>
              <Plus className="mr-2 h-4 w-4" />
              New OT Report
            </Link>
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <OtListToolbar
          search={<OtSearchInput value={searchQuery} onChange={setSearchQuery} />}
          summary={
            !isLoading && !error ? (
              <span>
                {awaitingSignature > 0 ? (
                  <span className="font-medium text-amber-700 dark:text-amber-300">
                    {awaitingSignature} awaiting signature
                  </span>
                ) : (
                  <span>All reports signed</span>
                )}
                {' · '}
                {visibleReports.length} of {allReports.length} shown
              </span>
            ) : null
          }
          filters={
            <OtStatusFilter
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              counts={counts}
              total={allReports.length}
            />
          }
        />

        {isLoading ? (
          <OtTableSkeleton />
        ) : error ? (
          <OtErrorPanel error={error} className="m-5" />
        ) : visibleReports.length === 0 ? (
          <EmptyState
            icon={FileSignature}
            title={filtered ? 'No reports match' : 'No OT reports yet'}
            description={
              filtered
                ? 'Try another name or MRN, or pick a different status.'
                : 'Create the first operative report for a scheduled case.'
            }
            action={
              filtered ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button asChild size="sm">
                  <Link href={newHref}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create OT Report
                  </Link>
                </Button>
              )
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Report</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className="whitespace-nowrap">Surgery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleReports.map((report) => {
                const slot = surgeryTime(report.schedule);
                const versionCount = report.versions?.length ?? 0;
                const canSign = SIGNABLE.includes(report.reportStatus);
                return (
                  <TableRow
                    key={report.id}
                    className="group cursor-pointer"
                    onClick={() => router.push(reportHref(report.id))}
                  >
                    <TableCell className="max-w-[320px] py-4 pl-5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={reportHref(report.id)}
                          className="text-sm font-semibold tabular-nums text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {report.reportNumber}
                        </Link>
                        {versionCount > 1 ? (
                          <span className="rounded-md border bg-muted/60 px-1.5 text-[10px] font-medium leading-4 text-muted-foreground">
                            v{versionCount}
                          </span>
                        ) : null}
                      </div>
                      <div
                        className="mt-0.5 truncate text-sm text-foreground/80"
                        title={report.remarks ?? undefined}
                      >
                        {report.remarks || (
                          <span className="text-muted-foreground">No procedure note</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <PatientIdentity source={report} />
                    </TableCell>
                    <TableCell className="py-4">
                      {slot ? (
                        <OtDateTime date={slot.date} time={slot.time} />
                      ) : (
                        <OtDateTime date="Not scheduled" muted />
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col items-start gap-1">
                        <OtReportStatusBadge status={report.reportStatus} />
                        <span
                          className="whitespace-nowrap text-xs text-muted-foreground"
                          title={
                            report.signedAt
                              ? format(new Date(report.signedAt), 'dd MMM yyyy, HH:mm')
                              : format(new Date(report.createdAt), 'dd MMM yyyy, HH:mm')
                          }
                        >
                          {report.signedAt
                            ? `Signed ${formatDistanceToNow(new Date(report.signedAt), { addSuffix: true })}`
                            : `Created ${formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-5">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {canSign ? (
                          <Button
                            size="sm"
                            onClick={() => handleSign(report.id)}
                            disabled={signReport.isPending}
                          >
                            <FileSignature className="mr-1.5 h-3.5 w-3.5" />
                            Sign
                          </Button>
                        ) : report.reportStatus === 'SIGNED' ? (
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`${newHref}?amend=${report.id}`}>
                              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                              Amend
                            </Link>
                          </Button>
                        ) : null}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              aria-label="More actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => router.push(reportHref(report.id))}>
                              <Eye className="mr-2 h-4 w-4" />
                              View report
                            </DropdownMenuItem>
                            {report.reportStatus !== 'CANCELLED' ? (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  disabled={cancelReport.isPending}
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleCancel(report.id)}
                                >
                                  <StopCircle className="mr-2 h-4 w-4" />
                                  Cancel report
                                </DropdownMenuItem>
                              </>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
