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
import { useRemittances } from '@/modules/rcm/hooks/use-remittance';
import type { Remittance, RemittanceStatus } from '@/modules/rcm/types/remittance';

const statusLabels: Record<RemittanceStatus, string> = {
  received: 'Received',
  processing: 'Processing',
  processed: 'Processed',
  reconciled: 'Reconciled',
  error: 'Error',
};

const createColumns = (locale: string, router: ReturnType<typeof useRouter>): ColumnDef<Remittance>[] => [
  {
    accessorKey: 'id',
    header: 'Remittance ID',
    cell: ({ getValue }) => <span className="font-mono text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'payerId',
    header: 'Payer',
    cell: ({ getValue }) => (
      <p className="font-mono text-xs" title={getValue<string>()}>
        {getValue<string>()}
      </p>
    ),
  },
  {
    accessorKey: 'format',
    header: 'Format',
  },
  {
    accessorKey: 'paymentAmount',
    header: 'Paid',
    cell: ({ getValue }) => Number(getValue<number>()).toFixed(2),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<RemittanceStatus>();
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

  const { data, isLoading, error } = useRemittances();
  const remittances = useMemo(() => data?.remittances ?? [], [data]);
  const columns = useMemo(() => createColumns(locale, router), [locale, router]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return remittances;
    return remittances.filter((remit) => remit.id.toLowerCase().includes(term));
  }, [remittances, search]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search remittances..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Button asChild className="ml-auto">
              <Link href={`/${locale}/revenue-cycle/remittance/new`}>
                <Plus className="mr-2 h-4 w-4" /> New remittance
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
        emptyMessage="No remittances found."
        title="Remittances"
      />
    </div>
  );
}
