'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye, Plus, Search, Banknote } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { ListPagination, pageOffset } from '@/components/ui/list-pagination';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRemittances } from '@/modules/rcm/hooks/use-remittance';
import type { Remittance, RemittanceStatus } from '@/modules/rcm/types/remittance';
import { PageHeader } from '@/components/ui/page-header';

const statusLabels: Record<RemittanceStatus, string> = {
  received: 'Received',
  processing: 'Processing',
  processed: 'Processed',
  reconciled: 'Reconciled',
  error: 'Error',
};

const PAGE_SIZE = 20;

const createColumns = (locale: string, router: ReturnType<typeof useRouter>): ColumnDef<Remittance>[] => [
  {
    accessorKey: 'remittanceNumber',
    header: 'Remittance #',
    cell: ({ getValue }) => <span className="font-mono text-xs">{getValue<string>()}</span>,
  },
  {
    id: 'payer',
    header: 'Payer',
    cell: ({ row }) =>
      row.original.payer?.payerName ?? (
        <span className="font-mono text-xs" title={row.original.payerId}>
          {row.original.payerId.slice(0, 8)}
        </span>
      ),
  },
  {
    accessorKey: 'paymentDate',
    header: 'Payment date',
    cell: ({ getValue }) => {
      const value = getValue<string | null | undefined>();
      return value ? format(new Date(value), 'dd MMM yyyy') : '—';
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Method',
    cell: ({ getValue }) => getValue<string | null | undefined>() || '—',
  },
  {
    accessorKey: 'totalPaid',
    header: 'Paid',
    cell: ({ getValue }) => Number(getValue<number | string>() ?? 0).toFixed(2),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<RemittanceStatus>();
      return <Badge variant="secondary">{statusLabels[status] ?? status}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${locale}/revenue-cycle/remittance/${row.original.id}`)}
      >
        <Eye className="mr-2 h-4 w-4" /> View
      </Button>
    ),
  },
];

export default function RemittancePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useRemittances(
    {
      search: debouncedSearch || undefined,
      limit: PAGE_SIZE,
      offset: pageOffset(page, PAGE_SIZE),
    },
    { keepPreviousData: true },
  );
  const remittances = useMemo(() => data?.remittances ?? [], [data]);
  const columns = useMemo(() => createColumns(locale, router), [locale, router]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Remittances"
        subtitle="Payer remittance advices and payment posting"
        icon={Banknote}
        actions={
          <Button asChild>
            <Link href={`/${locale}/revenue-cycle/remittance/new`}>
              <Plus className="mr-2 h-4 w-4" /> New remittance
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
                placeholder="Search by remittance number, payment ref, or payer..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <ResourceTable
          columns={columns}
          data={remittances}
          isLoading={isLoading}
          error={error}
          emptyMessage="No remittances found."
        />
        <ListPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          onPageChange={setPage}
          itemLabel="remittances"
        />
      </div>
    </div>
  );
}
