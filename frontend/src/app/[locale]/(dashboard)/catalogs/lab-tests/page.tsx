'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { useLabTests } from '@/modules/foundation/hooks/use-catalogs';
import type { LabTest } from '@/modules/foundation/types/catalog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye } from 'lucide-react';

const createColumns = (router: ReturnType<typeof useRouter>, locale: string): ColumnDef<LabTest>[] => [
  {
    accessorKey: 'testName',
    header: 'Test Name',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.testName}</div>
        {row.original.testCategory && (
          <div className="text-xs text-muted-foreground">{row.original.testCategory}</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'loincCode',
    header: 'LOINC Code',
    cell: ({ getValue }) => {
      const code = getValue<string>();
      return <span className="font-mono text-xs">{code}</span>;
    },
  },
  {
    accessorKey: 'cptCode',
    header: 'CPT Code',
    cell: ({ getValue }) => {
      const code = getValue<string | null>();
      return code ? <span className="font-mono text-xs">{code}</span> : '—';
    },
  },
  {
    accessorKey: 'specimenType',
    header: 'Specimen',
    cell: ({ getValue }) => <span className="capitalize">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'fastingRequired',
    header: 'Fasting',
    cell: ({ getValue, row }) => {
      const required = getValue<boolean>();
      return required ? (
        <Badge variant="secondary" className="text-xs">
          {row.original.fastingDurationHours
            ? `${row.original.fastingDurationHours}h`
            : 'Yes'}
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: 'turnaroundTimeHours',
    header: 'TAT',
    cell: ({ getValue }) => {
      const hours = getValue<number | null>();
      return hours ? `${hours}h` : '—';
    },
  },
  {
    accessorKey: 'units',
    header: 'Units',
    cell: ({ getValue }) => getValue<string | null>() || '—',
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
        onClick={() => router.push(`/${locale}/catalogs/lab-tests/${row.original.id}`)}
      >
        <Eye className="h-4 w-4 mr-2" />
        View
      </Button>
    ),
  },
];

export default function LabTestsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');

  const { data: labTests, isLoading, error } = useLabTests({ search });
  const columns = createColumns(router, locale);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: `/${locale}/dashboard`, label: 'Dashboard' },
          { href: `/${locale}/catalogs`, label: 'Catalogs' },
          { href: `/${locale}/catalogs/lab-tests`, label: 'Lab Tests' },
        ]}
      />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search lab tests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-md border p-6 text-sm text-muted-foreground">
          Loading lab tests...
        </div>
      ) : error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load lab tests: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Lab Tests"
          columns={columns}
          data={labTests ?? []}
        />
      )}
    </div>
  );
}
