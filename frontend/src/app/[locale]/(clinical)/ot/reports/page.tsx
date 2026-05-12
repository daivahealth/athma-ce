'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FileSignature, Filter, Plus, RotateCcw, Search, StopCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { OT_REPORT_STATUSES, type OtReportStatus } from '@/modules/ot/types';
import { OtReportStatusBadge } from '@/modules/ot/components/ot-status-badge';

export default function OtReportsPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const publishToast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OtReportStatus>('all');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const { data: reports, isLoading, error } = useOtReports(
    deferredSearchQuery || statusFilter !== 'all'
      ? {
          ...(deferredSearchQuery ? { search: deferredSearchQuery } : {}),
          ...(statusFilter !== 'all' ? { reportStatus: statusFilter } : {}),
        }
      : undefined
  );
  const orderedReports = useMemo(
    () => [...(reports ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [reports]
  );
  const signReport = useSignOtReport();
  const cancelReport = useCancelOtReport();

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OT Reports</h1>
          <p className="text-muted-foreground">
            Review operative notes, sign drafts, and send signed reports for amendment.
          </p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/ot/reports/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          New OT Report
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name, MRN, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as 'all' | OtReportStatus)}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {OT_REPORT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading OT reports...</div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {(error as Error).message}
            </div>
          ) : orderedReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileSignature className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No OT reports found</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search criteria.'
                  : 'Create the first operative report for a scheduled case.'}
              </p>
              <Button onClick={() => router.push(`/${params.locale}/ot/reports/new`)}>
                <Plus className="mr-2 h-4 w-4" />
                Create OT Report
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Versions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{report.reportNumber}</div>
                        {report.remarks ? (
                          <div className="line-clamp-1 text-sm text-muted-foreground">
                            {report.remarks}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Operative report ready for workflow action
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{report.scheduleId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">
                            {report.patientDisplay?.displayName || 'Unknown patient'}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>MRN: {report.patientDisplay?.mrn || '—'}</span>
                            <span>•</span>
                            <span>
                              {report.patientDisplay?.gender || '—'} /{' '}
                              {report.patientDisplay?.age ?? '—'}y
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <OtReportStatusBadge status={report.reportStatus} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{format(new Date(report.createdAt), 'dd MMM yyyy, HH:mm')}</div>
                        <div className="text-sm text-muted-foreground">
                          {report.signedAt
                            ? `Signed ${format(new Date(report.signedAt), 'dd MMM yyyy, HH:mm')}`
                            : 'Not signed'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{report.versions?.length ?? 0}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {['DRAFT', 'AMENDED'].includes(report.reportStatus) && (
                          <Button
                            size="sm"
                            onClick={() => handleSign(report.id)}
                            disabled={signReport.isPending}
                          >
                            <FileSignature className="mr-2 h-4 w-4" />
                            Sign
                          </Button>
                        )}
                        {report.reportStatus === 'SIGNED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/${params.locale}/ot/reports/new?amend=${report.id}`)
                            }
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Amend
                          </Button>
                        )}
                        {report.reportStatus !== 'CANCELLED' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCancel(report.id)}
                            disabled={cancelReport.isPending}
                          >
                            <StopCircle className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
