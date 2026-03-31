'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAllResults } from '@/modules/clinical/hooks/use-reporting';
import { ResultStatusBadge } from '@/modules/clinical/components/reporting/ResultStatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { Badge } from '@/components/ui/badge';
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
import { Search, ScanLine, Eye, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { NewReportDialog } from '@/modules/clinical/components/reporting/NewReportDialog';
import type { PatientResult } from '@/modules/clinical/types/reporting';

export default function ImagingResultsListPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, isLoading, error } = useAllResults({
    type: 'imaging',
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page,
    limit,
  });

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
          <h1 className="text-3xl font-bold">Imaging Results</h1>
          <p className="text-muted-foreground mt-1">
            View and manage radiology and imaging reports
          </p>
        </div>
        <NewReportDialog reportType="imaging" />
      </div>

      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search imaging results..."
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
          <LoadingSpinner size="lg" text="Loading imaging results..." />
        </div>
      )}

      {error && (
        <Card className="p-6 text-center">
          <p className="text-destructive font-semibold mb-2">Error loading imaging results</p>
          <p className="text-sm text-muted-foreground">
            {(error as any)?.response?.data?.message || 'Please try again or contact support.'}
          </p>
        </Card>
      )}

      {!isLoading && !error && data && (
        <div className="space-y-4">
          {data.results.length === 0 ? (
            <Card className="p-12 text-center">
              <ScanLine className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No imaging results found</p>
              <p className="text-muted-foreground">
                Imaging results will appear here once reports are created from clinical orders.
              </p>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Name</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Modality</TableHead>
                    <TableHead>Body Part</TableHead>
                    <TableHead>Critical</TableHead>
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
                      onClick={() => router.push(`/${locale}/results/imaging/${result.orderId}`)}
                    >
                      <TableCell className="font-medium">{result.orderName}</TableCell>
                      <TableCell>{result.patientName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {result.imagingSummary?.modality || '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {result.imagingSummary?.bodyPart || '-'}
                      </TableCell>
                      <TableCell>
                        {result.imagingSummary?.criticalFinding ? (
                          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Critical
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
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
                            router.push(`/${locale}/results/imaging/${result.orderId}`);
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

          {data.results.length > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, data.total)} of {data.total}
                </div>
                <Select value={String(limit)} onValueChange={(val) => { setLimit(Number(val)); setPage(1); }}>
                  <SelectTrigger className="w-[110px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 / page</SelectItem>
                    <SelectItem value="20">20 / page</SelectItem>
                    <SelectItem value="50">50 / page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | string)[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      typeof item === 'string' ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground text-sm">...</span>
                      ) : (
                        <Button
                          key={item}
                          variant={item === page ? 'default' : 'outline'}
                          size="icon"
                          className="h-8 w-8 text-xs"
                          onClick={() => setPage(item)}
                        >
                          {item}
                        </Button>
                      ),
                    )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
