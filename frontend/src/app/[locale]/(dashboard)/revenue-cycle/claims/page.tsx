'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { format, endOfDay, startOfDay, subDays } from 'date-fns';
import { Calendar, Eye, Plus, Search, User } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { ResourceTable } from '@/components/tables/resource-table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppCalendar as CalendarPicker } from '@/components/ui/app-calendar';
import { useClaims } from '@/modules/rcm/hooks/use-claims';
import type { Claim, ClaimStatus } from '@/modules/rcm/types/claims';

const statusLabels: Record<ClaimStatus, string> = {
  draft: 'Draft',
  pending: 'Pending',
  ready: 'Ready',
  scrubbing: 'Scrubbing',
  validated: 'Validated',
  failed_validation: 'Failed validation',
  submitted: 'Submitted',
  acknowledged: 'Acknowledged',
  rejected: 'Rejected',
  pending_adjudication: 'Pending adjudication',
  adjudicated: 'Adjudicated',
  paid: 'Paid',
  partially_paid: 'Partially paid',
  denied: 'Denied',
  appealed: 'Appealed',
  cancelled: 'Cancelled',
};

const createColumns = (locale: string, router: ReturnType<typeof useRouter>): ColumnDef<Claim>[] => [
  {
    accessorKey: 'claimNumber',
    header: 'Claim #',
    cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
  },
  {
    id: 'patient',
    header: 'Patient',
    cell: ({ row }) => {
      const pd = row.original.patientDisplay;
      if (!pd) {
        return (
          <p className="font-mono text-xs text-muted-foreground" title={row.original.patientId}>
            {row.original.patientId.slice(0, 8)}...
          </p>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">
              {pd.displayName || 'Unknown patient'}
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>MRN: {pd.mrn || '—'}</span>
              <span>&bull;</span>
              <span>
                {pd.gender || '—'} / {pd.age != null ? `${pd.age}y` : '—'}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'serviceDate',
    header: 'Service date',
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value ? format(new Date(value), 'PP') : '—';
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total',
    cell: ({ row }) => {
      const amount = Number(row.original.totalAmount) || 0;
      return `${amount.toFixed(2)} ${row.original.currency ?? 'AED'}`;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<ClaimStatus>();
      return <Badge variant="secondary">{statusLabels[status]}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${locale}/revenue-cycle/claims/${row.original.id}`)}
      >
        <Eye className="mr-2 h-4 w-4" /> View
      </Button>
    ),
  },
];

export default function ClaimsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ClaimStatus>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'range'>('today');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    return { from: now, to: now };
  });

  const todayRange = useMemo(() => {
    const now = new Date();
    return {
      startDate: startOfDay(now).toISOString(),
      endDate: endOfDay(now).toISOString(),
    };
  }, []);

  const yesterdayRange = useMemo(() => {
    const now = new Date();
    const yesterday = subDays(now, 1);
    return {
      startDate: startOfDay(yesterday).toISOString(),
      endDate: endOfDay(yesterday).toISOString(),
    };
  }, []);

  const activeRange = useMemo(() => {
    if (dateFilter === 'today') {
      return todayRange;
    }
    if (dateFilter === 'yesterday') {
      return yesterdayRange;
    }
    if (dateFilter === 'range' && dateRange?.from) {
      const from = startOfDay(dateRange.from).toISOString();
      const toDate = dateRange.to ?? dateRange.from;
      const to = endOfDay(toDate).toISOString();
      return { startDate: from, endDate: to };
    }
    return { startDate: undefined, endDate: undefined };
  }, [dateFilter, dateRange, todayRange, yesterdayRange]);

  const rangeLabel = useMemo(() => {
    if (!dateRange?.from) return 'Select date range';
    if (dateRange.to && dateRange.to.getTime() !== dateRange.from.getTime()) {
      return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
    }
    return format(dateRange.from, 'MMM d, yyyy');
  }, [dateRange]);

  const filters = useMemo(
    () => ({
      status: statusFilter === 'all' ? undefined : statusFilter,
      dateFrom: activeRange.startDate,
      dateTo: activeRange.endDate,
    }),
    [statusFilter, activeRange],
  );

  const { data, isLoading, error } = useClaims(filters);
  const claims = useMemo(() => data?.claims ?? [], [data]);
  const columns = useMemo(() => createColumns(locale, router), [locale, router]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return claims;
    return claims.filter((claim) =>
      `${claim.claimNumber} ${claim.patientDisplay?.displayName ?? ''} ${claim.patientDisplay?.mrn ?? ''}`
        .toLowerCase()
        .includes(term),
    );
  }, [claims, search]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by claim number, patient name, or MRN..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as 'all' | ClaimStatus)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Object.keys(statusLabels).map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabels[status as ClaimStatus]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={dateFilter}
              onValueChange={(value) => {
                const next = value as 'today' | 'yesterday' | 'range';
                setDateFilter(next);
                if (next === 'range' && !dateRange?.from) {
                  const now = new Date();
                  setDateRange({ from: now, to: now });
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="range">Date Range</SelectItem>
              </SelectContent>
            </Select>
            {dateFilter === 'range' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {rangeLabel}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <CalendarPicker
                    mode="range"
                    numberOfMonths={2}
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range)}
                  />
                </PopoverContent>
              </Popover>
            )}
            <Button asChild className="ml-auto">
              <Link href={`/${locale}/revenue-cycle/claims/new`}>
                <Plus className="mr-2 h-4 w-4" /> New claim
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <ResourceTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        error={error}
        emptyMessage="No claims found."
        title="Claims"
        cta={null}
      />
    </div>
  );
}
