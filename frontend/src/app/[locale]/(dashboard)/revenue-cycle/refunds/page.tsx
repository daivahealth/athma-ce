'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { format, endOfDay, startOfDay, subDays } from 'date-fns';
import { Search, Eye, Plus, Calendar, User } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { ResourceTable } from '@/components/tables/resource-table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AppCalendar as CalendarPicker } from '@/components/ui/app-calendar';

import { useRefunds } from '@/modules/rcm/hooks/use-refunds';
import type { Refund } from '@/modules/rcm/types/refund';
import { RefundStatus, RefundMethod } from '@/modules/rcm/types/refund';

const statusLabels: Record<string, string> = {
  [RefundStatus.PENDING]: 'Pending',
  [RefundStatus.APPROVED]: 'Approved',
  [RefundStatus.REJECTED]: 'Rejected',
  [RefundStatus.PROCESSED]: 'Processed',
  [RefundStatus.VOIDED]: 'Voided',
};

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [RefundStatus.PENDING]: 'secondary',
  [RefundStatus.APPROVED]: 'default',
  [RefundStatus.REJECTED]: 'destructive',
  [RefundStatus.PROCESSED]: 'default',
  [RefundStatus.VOIDED]: 'outline',
};

const methodLabels: Record<string, string> = {
  [RefundMethod.CASH]: 'Cash',
  [RefundMethod.CARD_REVERSAL]: 'Card reversal',
  [RefundMethod.BANK_TRANSFER]: 'Bank transfer',
  [RefundMethod.CHEQUE]: 'Cheque',
  [RefundMethod.WALLET]: 'Wallet',
  [RefundMethod.OTHER]: 'Other',
};

const createColumns = (
  locale: string,
  router: ReturnType<typeof useRouter>,
): ColumnDef<Refund>[] => [
  {
    accessorKey: 'refundNumber',
    header: 'Refund #',
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
            <span className="font-medium">{pd.displayName || 'Unknown patient'}</span>
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
    accessorKey: 'refundDate',
    header: 'Date',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? format(new Date(value), 'PP') : '—';
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => `${Number(row.original.amount).toFixed(2)} ${row.original.currency}`,
  },
  {
    accessorKey: 'refundMethod',
    header: 'Method',
    cell: ({ getValue }) => {
      const method = getValue<RefundMethod>();
      return <Badge variant="secondary">{methodLabels[method]}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<RefundStatus>();
      return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${locale}/revenue-cycle/refunds/${row.original.id}`)}
      >
        <Eye className="mr-2 h-4 w-4" /> View
      </Button>
    ),
  },
];

export default function RefundsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RefundStatus>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | RefundMethod>('all');
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
      refundMethod: methodFilter === 'all' ? undefined : methodFilter,
      dateFrom: activeRange.startDate,
      dateTo: activeRange.endDate,
    }),
    [statusFilter, methodFilter, activeRange],
  );

  const { data: refunds, isLoading, error } = useRefunds(filters);
  const columns = useMemo(() => createColumns(locale, router), [locale, router]);
  const sanitized = useMemo(() => refunds ?? [], [refunds]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sanitized;
    return sanitized.filter((refund) =>
      `${refund.refundNumber} ${refund.patientDisplay?.displayName ?? ''} ${refund.patientDisplay?.mrn ?? ''}`
        .toLowerCase()
        .includes(term),
    );
  }, [sanitized, search]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by refund number, patient name, or MRN..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as 'all' | RefundStatus)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Object.values(RefundStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={methodFilter}
              onValueChange={(value) => setMethodFilter(value as 'all' | RefundMethod)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods</SelectItem>
                {Object.values(RefundMethod).map((method) => (
                  <SelectItem key={method} value={method}>
                    {methodLabels[method]}
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
              <SelectTrigger className="w-[150px]">
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
                    onSelect={(range) => {
                      setDateRange(range);
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </CardContent>
      </Card>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load refunds: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Refunds"
          cta={
            <Button size="sm" asChild>
              <Link href={`/${locale}/revenue-cycle/refunds/new`}>
                <Plus className="mr-2 h-4 w-4" /> New refund
              </Link>
            </Button>
          }
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyState={search ? 'No refunds match your search.' : 'No refunds found.'}
          onRowClick={(row) => router.push(`/${locale}/revenue-cycle/refunds/${row.id}`)}
        />
      )}
    </div>
  );
}
