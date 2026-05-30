'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAllResults } from '@/modules/clinical/hooks/use-reporting';
import { ResultStatusBadge } from '@/modules/clinical/components/reporting/ResultStatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, FlaskConical, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { NewReportDialog } from '@/modules/clinical/components/reporting/NewReportDialog';
import type { PatientResult } from '@/modules/clinical/types/reporting';

export default function LabResultsListPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useAllResults({
    type: 'lab',
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page,
    limit,
  });

  const errorMessage =
    error && typeof error === 'object' && 'response' in error
      ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Please try again or contact support.')
      : 'Please try again or contact support.';

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Lab Results</h1>
          <p className="text-muted-foreground mt-1">
            View and manage laboratory test reports
          </p>
        </div>
        <NewReportDialog reportType="lab" />
      </div>

      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lab results..."
              className="pl-10"
              disabled
            />
          </div>
          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PRELIMINARY">Preliminary</SelectItem>
              <SelectItem value="FINAL">Final</SelectItem>
              <SelectItem value="AMENDED">Amended</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" text="Loading lab results..." />
        </div>
      )}

      {error && (
        <Card className="p-6 text-center">
          <p className="text-destructive font-semibold mb-2">Error loading lab results</p>
          <p className="text-sm text-muted-foreground">
            {errorMessage}
          </p>
        </Card>
      )}

      {!isLoading && !error && data && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Found {data.total} lab result{data.total !== 1 ? 's' : ''}
          </div>

          {data.results.length === 0 ? (
            <Card className="p-12 text-center">
              <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No lab results found</p>
              <p className="text-muted-foreground">
                Lab results will appear here once reports are created from clinical orders.
              </p>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Name</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Specimen</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead className="text-center">Abnormal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.results.map((result: PatientResult) => (
                    <TableRow
                      key={result.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/${locale}/results/lab/${result.orderId}`)}
                    >
                      <TableCell className="font-medium">{result.orderName}</TableCell>
                      <TableCell>{result.patientName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div>{result.labSummary?.specimenType || '-'}</div>
                        {result.labSummary?.specimenNumber ? (
                          <div className="font-mono text-xs text-muted-foreground">
                            {result.labSummary.specimenNumber}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-center">
                        {result.labSummary?.itemCount || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {(result.labSummary?.abnormalCount || 0) > 0 ? (
                          <span className="text-amber-600 font-medium">
                            {result.labSummary?.abnormalCount}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                        {(result.labSummary?.criticalCount || 0) > 0 && (
                          <span className="text-red-600 font-medium ml-1">
                            ({result.labSummary?.criticalCount} critical)
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <ResultStatusBadge status={result.reportStatus} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(result.reportedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/${locale}/results/lab/${result.orderId}`);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
