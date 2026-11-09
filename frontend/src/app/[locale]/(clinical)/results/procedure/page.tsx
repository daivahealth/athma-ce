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
import { AlertTriangle, ChevronLeft, ChevronRight, ClipboardCheck, Clock, Search, SearchX } from 'lucide-react';
import { LabPatientCell } from '@/modules/clinical/components/lab-operations/lab-ui';
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

function formatDuration(minutes: number | null | undefined) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const NO_COMPLICATION_PATTERN = /^(none|nil|n\/?a|no(ne)?\s+(known\s+)?complications?(\s+noted)?|uneventful)\.?$/i;

function hasComplications(text: string | null | undefined): text is string {
  const value = text?.trim();
  return Boolean(value) && !NO_COMPLICATION_PATTERN.test(value as string);
}

export default function ProcedureResultsListPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useAllResults({
    type: 'procedure',
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: debouncedSearch.trim() || undefined,
    page,
    limit,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const errorMessage =
    error && typeof error === 'object' && 'response' in error
      ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Please try again or contact support.')
      : 'Please try again or contact support.';

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const firstRow = data && data.total > 0 ? (page - 1) * limit + 1 : 0;
  const lastRow = data ? Math.min(page * limit, data.total) : 0;
  const isFiltered = statusFilter !== 'all' || debouncedSearch.trim().length > 0;
  const openResult = (result: PatientResult) => router.push(`/${locale}/results/procedure/${result.orderId}`);

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Procedure Results"
        subtitle="Procedure reports across the facility, newest first"
        icon={ClipboardCheck}
        actions={<NewReportDialog reportType="procedure" />}
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by patient, MRN or procedure"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search procedure results"
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
          <EmptyState icon={AlertTriangle} title="Couldn't load procedure results" description={errorMessage} />
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
              icon={ClipboardCheck}
              title="No procedure results yet"
              description="Procedure reports appear here once they are created from clinical orders."
            />
          )
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="pl-4">Patient</TableHead>
                <TableHead>Procedure</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Complications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results.map((result: PatientResult) => {
                const summary = result.procedureSummary;
                const duration = formatDuration(summary?.durationMinutes);
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
                    <TableCell className="max-w-xs">
                      <div className="font-medium text-foreground">{result.orderName}</div>
                      {summary?.procedureDescription ? (
                        <p
                          className="line-clamp-1 text-xs text-muted-foreground"
                          title={summary.procedureDescription}
                        >
                          {summary.procedureDescription}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {duration ? (
                        <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                          {duration}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not recorded</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {hasComplications(summary?.complications) ? (
                        <div className="flex flex-col items-start gap-1">
                          <ToneBadge tone="amber">
                            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                            Complications
                          </ToneBadge>
                          <p className="line-clamp-2 text-xs text-muted-foreground" title={summary?.complications ?? undefined}>
                            {summary?.complications}
                          </p>
                        </div>
                      ) : summary?.complications?.trim() ? (
                        <ToneBadge tone="emerald">No complications</ToneBadge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not recorded</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <ResultStatusBadge status={result.reportStatus} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
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
    <div className="divide-y divide-border/60" aria-busy="true" aria-label="Loading procedure results">
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
