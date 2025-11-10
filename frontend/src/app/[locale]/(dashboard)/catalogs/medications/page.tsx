'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { useMedications } from '@/modules/foundation/hooks/use-catalogs';
import type { Medication } from '@/modules/foundation/types/catalog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye } from 'lucide-react';

const createColumns = (router: ReturnType<typeof useRouter>, locale: string): ColumnDef<Medication>[] => [
  {
    accessorKey: 'medicationName',
    header: 'Medication Name',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.medicationName}</div>
        {row.original.genericName && (
          <div className="text-xs text-muted-foreground">{row.original.genericName}</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'dosageForm',
    header: 'Form',
    cell: ({ getValue }) => <span className="capitalize">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'strength',
    header: 'Strength',
    cell: ({ getValue }) => getValue<string | null>() || '—',
  },
  {
    accessorKey: 'route',
    header: 'Route',
    cell: ({ getValue }) => {
      const route = getValue<string | null>();
      return route ? <span className="capitalize">{route}</span> : '—';
    },
  },
  {
    accessorKey: 'ndcCode',
    header: 'NDC',
    cell: ({ getValue }) => {
      const code = getValue<string | null>();
      return code ? <span className="font-mono text-xs">{code}</span> : '—';
    },
  },
  {
    accessorKey: 'drugClass',
    header: 'Drug Class',
    cell: ({ getValue }) => getValue<string | null>() || '—',
  },
  {
    accessorKey: 'controlledSubstance',
    header: 'Controlled',
    cell: ({ getValue, row }) => {
      const isControlled = getValue<boolean>();
      return isControlled ? (
        <Badge variant="destructive" className="text-xs">
          {row.original.controlledClass || 'Yes'}
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ getValue }) =>
      getValue<boolean>() ? (
        <Badge variant="default" className="bg-green-600">Active</Badge>
      ) : (
        <Badge variant="secondary">Inactive</Badge>
      ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${locale}/catalogs/medications/${row.original.id}`)}
      >
        <Eye className="h-4 w-4 mr-2" />
        View
      </Button>
    ),
  },
];

export default function MedicationsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');

  const { data: medications, isLoading, error } = useMedications({ search });
  const columns = createColumns(router, locale);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: `/${locale}/dashboard`, label: 'Dashboard' },
          { href: `/${locale}/catalogs`, label: 'Catalogs' },
          { href: `/${locale}/catalogs/medications`, label: 'Medications' },
        ]}
      />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search medications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-md border p-6 text-sm text-muted-foreground">
          Loading medications...
        </div>
      ) : error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load medications: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Medications"
          columns={columns}
          data={medications ?? []}
        />
      )}
    </div>
  );
}
