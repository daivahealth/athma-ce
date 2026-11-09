'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAllResults } from '@/modules/clinical/hooks/use-reporting';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { ResultStatusBadge } from '@/modules/clinical/components/reporting/ResultStatusBadge';
import { reportStatusTone } from '@/modules/clinical/utils/lab-result-tone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ToneBadge } from '@/components/ui/tone-badge';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Search,
  SearchX,
} from 'lucide-react';
import {
  LabDateRangeFilter,
  LabPatientCell,
  MAX_LAB_RANGE_DAYS,
  useLabDateRangeFilter,
} from '@/modules/clinical/components/lab-operations/lab-ui';
import { NewReportDialog } from '@/modules/clinical/components/reporting/NewReportDialog';
import type { PatientResult } from '@/modules/clinical/types/reporting';

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PRELIMINARY', label: 'Preliminary' },
  { value: 'FINAL', label: 'Final' },
  { value: 'AMENDED', label: 'Amended' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const;

const DOT_CLASS: Record<string, string> = {
  slate: 'bg-slate-400',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
};

function formatDay(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function LabResultsListPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [page, setPage] = useState(1);
  const { range, setRange, query } = useLabDateRangeFilter();
  const limit = 20;

  const { data, isLoading, error } = useAllResults({
    type: 'lab',
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: debouncedSearch.trim() || undefined,
    ...query,
    page,
    limit,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, range]);

  const errorMessage =
    error && typeof error === 'object' && 'response' in error
      ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Please try again or contact support.')
      : 'Please try again or contact support.';

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const firstRow = data && data.total > 0 ? (page - 1) * limit + 1 : 0;
  const lastRow = data ? Math.min(page * limit, data.total) : 0;
  const isFiltered = statusFilter !== 'all' || debouncedSearch.trim().length > 0;
  const openResult = (result: PatientResult) => router.push(`/${locale}/results/lab/${result.orderId}`);

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Lab Results"
        subtitle="Laboratory reports across the facility for the selected dates, newest first"
        icon={FlaskConical}
        actions={
          <>
            <LabDateRangeFilter value={range} onChange={setRange} label="Reported" />
            <NewReportDialog reportType="lab" />
          </>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search lab results"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search lab results"
            />
          </div>
          <div
            role="radiogroup"
            aria-label="Filter by report status"
            className="flex flex-wrap items-center gap-1 rounded-lg bg-muted/60 p-1"
          >
            {STATUS_FILTERS.map((filter) => {
              const active = statusFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setStatusFilter(filter.value);
                    setPage(1);
                  }}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    active
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {filter.value !== 'all' ? (
                    <span
                      className={cn('size-1.5 rounded-full', DOT_CLASS[reportStatusTone(filter.value)])}
                      aria-hidden="true"
                    />
                  ) : null}
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <ResultsSkeleton />
        ) : error ? (
          <EmptyState icon={AlertTriangle} title="Couldn't load lab results" description={errorMessage} />
        ) : !data || data.results.length === 0 ? (
          isFiltered ? (
            <EmptyState
              icon={SearchX}
              title="No results match"
              description="Try a different search or status filter."
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('all');
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={FlaskConical}
              title="No lab results in these dates"
              description={`Pick a wider range (up to ${MAX_LAB_RANGE_DAYS} days), or reports appear here once results are entered against lab orders.`}
            />
          )
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="pl-4">Patient</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Findings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results.map((result: PatientResult) => {
                const abnormal = result.labSummary?.abnormalCount ?? 0;
                const critical = result.labSummary?.criticalCount ?? 0;
                const items = result.labSummary?.itemCount ?? 0;
                const isNarrative = result.labSummary?.reportStyle === 'narrative';

                return (
                  <TableRow
                    key={result.id}
                    tabIndex={0}
                    className="group cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none"
                    onClick={() => openResult(result)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') openResult(result);
                    }}
                  >
                    <TableCell className="pl-4">
                      <LabPatientCell
                        name={result.patientName}
                        mrn={result.patientDisplay?.mrn}
                        age={result.patientDisplay?.age}
                        gender={result.patientDisplay?.gender}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{result.orderName}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="capitalize">{result.labSummary?.specimenType || 'Specimen pending'}</span>
                        {result.labSummary?.specimenNumber ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">{result.labSummary.specimenNumber}</span>
                          </>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {critical > 0 ? (
                          <ToneBadge tone="red" strong>
                            {critical} critical
                          </ToneBadge>
                        ) : null}
                        {abnormal > 0 ? (
                          <ToneBadge tone="amber">{abnormal} abnormal</ToneBadge>
                        ) : null}
                        {abnormal === 0 && critical === 0 ? (
                          isNarrative ? (
                            <span className="text-xs text-muted-foreground">Narrative report</span>
                          ) : items > 0 ? (
                            <ToneBadge tone="emerald">All {items} in range</ToneBadge>
                          ) : (
                            <span className="text-xs text-muted-foreground">No values yet</span>
                          )
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ResultStatusBadge status={result.reportStatus} />
                    </TableCell>
                    <TableCell>
                      {result.reportedAt ? (
                        <>
                          <div className="text-sm text-foreground">{formatDay(result.reportedAt)}</div>
                          <div className="text-xs text-muted-foreground">{formatTime(result.reportedAt)}</div>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not reported</span>
                      )}
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <ChevronRight
                        className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                        aria-hidden="true"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {data && data.total > 0 && !isLoading && !error ? (
          <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{firstRow}–{lastRow}</span> of{' '}
              <span className="font-medium text-foreground">{data.total}</span> results
            </div>
            {totalPages > 1 ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  {page} / {totalPages}
                </span>
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
            ) : null}
          </div>
        ) : null}
      </Card>
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="divide-y divide-border/60" aria-busy="true" aria-label="Loading lab results">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <Skeleton className="size-9 rounded-full" />
          <div className="w-48 space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-44" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-3.5 w-20" />
        </div>
      ))}
    </div>
  );
}
