'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { format, endOfDay, startOfDay, subDays } from 'date-fns';
import { Search, Eye, Plus, Calendar, FileText } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { ResourceTable } from '@/components/tables/resource-table';
import { Card, CardContent } from '@/components/ui/card';
import { ToneBadge } from '@/components/ui/tone-badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AppCalendar as CalendarPicker } from '@/components/ui/app-calendar';

import { useInvoices } from '@/modules/rcm/hooks/use-invoices';
import type { Invoice } from '@/modules/rcm/types/invoice';
import { InvoiceStatus } from '@/modules/rcm/types/invoice';
import { invoiceStatusTone } from '@/modules/rcm/utils/billing-tone';
import { PageHeader } from '@/components/ui/page-header';
import { PatientIdentity } from '@/modules/rcm/components/patient-identity';

const statusLabel: Record<InvoiceStatus, string> = {
  [InvoiceStatus.UNPAID]: 'Unpaid',
  [InvoiceStatus.PARTIAL]: 'Partial',
  [InvoiceStatus.PAID]: 'Paid',
  [InvoiceStatus.CANCELLED]: 'Cancelled',
};

const formatCurrency = (value: number, currency: string) => `${Number(value).toFixed(2)} ${currency}`;

const createColumns = (locale: string, router: ReturnType<typeof useRouter>): ColumnDef<Invoice>[] => [
  {
    accessorKey: 'invoiceNumber',
    header: 'Invoice #',
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap font-medium">{getValue<string>()}</span>
    ),
  },
  {
    id: 'patient',
    header: 'Patient',
    cell: ({ row }) => <PatientIdentity source={row.original} />,
  },
  {
    accessorKey: 'invoiceDate',
    header: 'Date',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <span className="whitespace-nowrap">{value ? format(new Date(value), 'PP') : '—'}</span>;
    },
  },
  {
    accessorKey: 'netAmount',
    header: 'Net amount',
    cell: ({ row }) => (
      <span className="whitespace-nowrap tabular-nums">
        {formatCurrency(row.original.netAmount, row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: 'balanceDue',
    header: 'Balance',
    cell: ({ row }) => (
      <span
        className={`whitespace-nowrap tabular-nums ${Number(row.original.balanceDue) > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
      >
        {formatCurrency(row.original.balanceDue, row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<InvoiceStatus>();
      return (
        <ToneBadge tone={invoiceStatusTone(status)} withDot>
          {statusLabel[status] ?? status}
        </ToneBadge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/invoices/${row.original.id}`)}>
        <Eye className="mr-2 h-4 w-4" /> View
      </Button>
    ),
  },
];

export default function InvoicesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
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

  const { data: invoices, isLoading, error } = useInvoices(filters);

  const columns = useMemo(() => createColumns(locale, router), [locale, router]);
  const sanitized = useMemo(() => invoices ?? [], [invoices]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sanitized;
    return sanitized.filter((invoice) =>
      `${invoice.invoiceNumber} ${invoice.patientDisplay?.displayName ?? ''} ${invoice.patientDisplay?.mrn ?? ''}`
        .toLowerCase()
        .includes(term),
    );
  }, [sanitized, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        subtitle="Patient bills and their payment status"
        icon={FileText}
        actions={
          <Button asChild>
            <Link href={`/${locale}/invoices/new`}>
              <Plus className="mr-2 h-4 w-4" /> New invoice
            </Link>
          </Button>
        }
      />
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice number, patient name, or MRN..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | InvoiceStatus)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Object.values(InvoiceStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabel[status]}
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
          Failed to load invoices: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyState={search ? 'No invoices match your search.' : 'No invoices found.'}
          onRowClick={(row) => router.push(`/${locale}/invoices/${row.id}`)}
        />
      )}
    </div>
  );
}
