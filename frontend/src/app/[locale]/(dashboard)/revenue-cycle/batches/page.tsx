'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Plus, Search, Layers } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { ListPagination, pageOffset } from '@/components/ui/list-pagination';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBatches } from '@/modules/rcm/hooks/use-batches';
import type { Batch, BatchStatus } from '@/modules/rcm/types/batches';
import { PageHeader } from '@/components/ui/page-header';

const statusLabels: Record<BatchStatus, string> = {
  open: 'Open',
  closed: 'Closed',
  submitting: 'Submitting',
  submitted: 'Submitted',
  acknowledged: 'Acknowledged',
  rejected: 'Rejected',
  partially_processed: 'Partially processed',
};

const PAGE_SIZE = 20;

const createColumns = (locale: string, router: ReturnType<typeof useRouter>): ColumnDef<Batch>[] => [
  {
    accessorKey: 'batchNumber',
    header: 'Batch #',
    cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<BatchStatus>();
      return <Badge variant="secondary">{statusLabels[status]}</Badge>;
    },
  },
  {
    accessorKey: 'claimCount',
    header: 'Claims',
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total',
    cell: ({ row }) => `${row.original.totalAmount.toFixed(2)}`,
  },
  {
    accessorKey: 'claimFormat',
    header: 'Format',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${locale}/revenue-cycle/batches/${row.original.id}`)}
      >
        <Eye className="mr-2 h-4 w-4" /> View
      </Button>
    ),
  },
];

export default function BatchesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useBatches(
    {
      search: debouncedSearch || undefined,
      limit: PAGE_SIZE,
      offset: pageOffset(page, PAGE_SIZE),
    },
    { keepPreviousData: true },
  );
  const batches = useMemo(() => data?.batches ?? [], [data]);
  const columns = useMemo(() => createColumns(locale, router), [locale, router]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Claim batches"
        subtitle="Claims grouped for submission to payers"
        icon={Layers}
        actions={
          <Button asChild>
            <Link href={`/${locale}/revenue-cycle/batches/new`}>
              <Plus className="mr-2 h-4 w-4" /> New batch
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
                placeholder="Search by batch number, submission ref, or payer..."
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
          data={batches}
          isLoading={isLoading}
          error={error}
          emptyMessage="No batches found."
        />
        <ListPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          onPageChange={setPage}
          itemLabel="batches"
        />
      </div>
    </div>
  );
}
