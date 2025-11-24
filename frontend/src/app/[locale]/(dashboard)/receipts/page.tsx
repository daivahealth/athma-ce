'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Search, Eye, Plus } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useReceipts } from '@/modules/rcm/hooks/use-receipts';
import type { Receipt } from '@/modules/rcm/types/receipt';
import { PaymentMethod } from '@/modules/rcm/types/receipt';

const paymentLabels: Record<string, string> = {
  [PaymentMethod.CASH]: 'Cash',
  [PaymentMethod.CARD]: 'Card',
  [PaymentMethod.UPI]: 'UPI',
  [PaymentMethod.BANK_TRANSFER]: 'Bank transfer',
  [PaymentMethod.WALLET]: 'Wallet',
};

const createColumns = (locale: string, router: ReturnType<typeof useRouter>): ColumnDef<Receipt>[] => [
  {
    accessorKey: 'receiptNumber',
    header: 'Receipt #',
    cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'patientId',
    header: 'Patient',
    cell: ({ getValue }) => (
      <p className="font-mono text-xs" title={getValue<string>()}>
        {getValue<string>()}
      </p>
    ),
  },
  {
    accessorKey: 'receiptDate',
    header: 'Date',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? format(new Date(value), 'PP') : '—';
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => `${row.original.amount.toFixed(2)} ${row.original.currency}`,
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Method',
    cell: ({ getValue }) => {
      const method = getValue<PaymentMethod>();
      return <Badge variant="secondary">{paymentLabels[method]}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/receipts/${row.original.id}`)}>
        <Eye className="mr-2 h-4 w-4" /> View
      </Button>
    ),
  },
];

export default function ReceiptsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [search, setSearch] = useState('');
  const [patientFilter, setPatientFilter] = useState('');
  const [invoiceFilter, setInvoiceFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filters = useMemo(
    () => ({
      patientId: patientFilter.trim() || undefined,
      invoiceId: invoiceFilter.trim() || undefined,
      paymentMethod: methodFilter === 'all' ? undefined : methodFilter,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }),
    [patientFilter, invoiceFilter, methodFilter, dateFrom, dateTo],
  );

  const { data: receipts, isLoading, error } = useReceipts(filters);
  const columns = useMemo(() => createColumns(locale, router), [locale, router]);
  const sanitized = useMemo(() => receipts ?? [], [receipts]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sanitized;
    return sanitized.filter((receipt) =>
      `${receipt.receiptNumber} ${receipt.patientId}`.toLowerCase().includes(term),
    );
  }, [sanitized, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search receipts by number or patient ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={methodFilter} onValueChange={(value) => setMethodFilter(value as 'all' | PaymentMethod)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All methods</SelectItem>
            {Object.values(PaymentMethod).map((method) => (
              <SelectItem key={method} value={method}>
                {paymentLabels[method]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-5">
          <div className="space-y-2">
            <Label>Patient ID</Label>
            <Input value={patientFilter} onChange={(event) => setPatientFilter(event.target.value)} placeholder="Patient UUID" />
          </div>
          <div className="space-y-2">
            <Label>Invoice ID</Label>
            <Input value={invoiceFilter} onChange={(event) => setInvoiceFilter(event.target.value)} placeholder="Invoice UUID" />
          </div>
          <div className="space-y-2">
            <Label>From</Label>
            <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>To</Label>
            <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
          </div>
        </CardContent>
      </Card>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load receipts: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Receipts"
          cta={
            <Button size="sm" asChild>
              <Link href={`/${locale}/receipts/new`}>
                <Plus className="mr-2 h-4 w-4" /> New receipt
              </Link>
            </Button>
          }
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyState={search ? 'No receipts match your search.' : 'No receipts found.'}
          onRowClick={(row) => router.push(`/${locale}/receipts/${row.id}`)}
        />
      )}
    </div>
  );
}
