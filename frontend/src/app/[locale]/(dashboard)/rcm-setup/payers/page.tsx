'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Search, Eye, Plus } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { usePayers, usePayerStats } from '@/modules/rcm/hooks/use-payers';
import type { Payer } from '@/modules/rcm/types/payer';
import { PayerStatus } from '@/modules/rcm/types/payer';

const statusLabels: Record<PayerStatus, string> = {
  [PayerStatus.ACTIVE]: 'Active',
  [PayerStatus.INACTIVE]: 'Inactive',
  [PayerStatus.SUSPENDED]: 'Suspended',
};

const statusVariant: Record<PayerStatus, 'default' | 'secondary' | 'outline'> = {
  [PayerStatus.ACTIVE]: 'default',
  [PayerStatus.INACTIVE]: 'secondary',
  [PayerStatus.SUSPENDED]: 'outline',
};

const createColumns = (
  locale: string,
  router: ReturnType<typeof useRouter>,
  policyCounts: Record<string, number>
): ColumnDef<Payer>[] => [
  {
    accessorKey: 'payerName',
    header: 'Payer',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.payerName}</div>
        {row.original.payerId && (
          <p className="text-xs text-muted-foreground">ID: {row.original.payerId}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'payerType',
    header: 'Type',
    cell: ({ getValue }) => getValue<string | null>() || '—',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<PayerStatus>();
      return <Badge variant={statusVariant[status]}>{statusLabels[status]}</Badge>;
    },
  },
  {
    id: 'policies',
    header: 'Active policies',
    cell: ({ row }) => policyCounts[row.original.id] ?? 0,
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last updated',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? formatDistanceToNow(new Date(value), { addSuffix: true }) : '—';
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${locale}/rcm-setup/payers/${row.original.id}`)}
      >
        <Eye className="mr-2 h-4 w-4" /> View
      </Button>
    ),
  },
];

export default function PayersPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [statusFilter, setStatusFilter] = useState<'all' | PayerStatus>('all');
  const [search, setSearch] = useState('');

  const filters = statusFilter === 'all' ? undefined : { status: statusFilter };
  const { data: payers, isLoading, error } = usePayers(filters);
  const { data: stats } = usePayerStats();

  const policyCounts = stats?.policyCounts ?? {};
  const columns = useMemo(() => createColumns(locale, router, policyCounts), [locale, router, policyCounts]);
  const sanitized = payers ?? [];
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sanitized;
    return sanitized.filter((payer) =>
      `${payer.payerName} ${payer.payerId ?? ''} ${payer.payerType ?? ''}`.toLowerCase().includes(term)
    );
  }, [sanitized, search]);

  const statCards = [
    { label: 'Total payers', value: stats?.total ?? sanitized.length },
    { label: 'Active', value: stats?.byStatus?.[PayerStatus.ACTIVE] ?? 0 },
    { label: 'Inactive', value: stats?.byStatus?.[PayerStatus.INACTIVE] ?? 0 },
    { label: 'Suspended', value: stats?.byStatus?.[PayerStatus.SUSPENDED] ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | PayerStatus)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value={PayerStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={PayerStatus.INACTIVE}>Inactive</SelectItem>
            <SelectItem value={PayerStatus.SUSPENDED}>Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load payers: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Payers"
          cta={
            <Button size="sm" asChild>
              <Link href={`/${locale}/rcm-setup/payers/new`}>
                <Plus className="mr-2 h-4 w-4" /> New payer
              </Link>
            </Button>
          }
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyState={search ? 'No payers match your search.' : 'No payers found.'}
          onRowClick={(row) => router.push(`/${locale}/rcm-setup/payers/${row.id}`)}
        />
      )}
    </div>
  );
}
