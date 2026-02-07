'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Plus, Search } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBatches } from '@/modules/rcm/hooks/use-batches';
import type { Batch, BatchStatus } from '@/modules/rcm/types/batches';

const statusLabels: Record<BatchStatus, string> = {
  open: 'Open',
  closed: 'Closed',
  submitting: 'Submitting',
  submitted: 'Submitted',
  acknowledged: 'Acknowledged',
  rejected: 'Rejected',
  partially_processed: 'Partially processed',
};

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
  const { data, isLoading, error } = useBatches();
  const batches = useMemo(() => data?.batches ?? [], [data]);
  const columns = useMemo(() => createColumns(locale, router), [locale, router]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return batches;
    return batches.filter((batch) => batch.batchNumber.toLowerCase().includes(term));
  }, [batches, search]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search batches by number..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Button asChild className="ml-auto">
              <Link href={`/${locale}/revenue-cycle/batches/new`}>
                <Plus className="mr-2 h-4 w-4" /> New batch
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
        emptyMessage="No batches found."
        title="Batches"
      />
    </div>
  );
}
