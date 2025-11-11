'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { useProcedures } from '@/modules/foundation/hooks/use-catalogs';
import type { Procedure } from '@/modules/foundation/types/catalog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye } from 'lucide-react';

const createColumns = (router: ReturnType<typeof useRouter>, locale: string): ColumnDef<Procedure>[] => [
  {
    accessorKey: 'procedureName',
    header: 'Procedure Name',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.procedureName}</div>
        {row.original.procedureCategory && (
          <div className="text-xs text-muted-foreground">{row.original.procedureCategory}</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'bodySystem',
    header: 'Body System',
    cell: ({ getValue }) => <span className="capitalize">{getValue<string>()}</span>,
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
    accessorKey: 'icd10PcsCode',
    header: 'ICD-10-PCS',
    cell: ({ getValue }) => {
      const code = getValue<string | null>();
      return code ? <span className="font-mono text-xs">{code}</span> : '—';
    },
  },
  {
    accessorKey: 'anesthesiaType',
    header: 'Anesthesia',
    cell: ({ getValue }) => {
      const type = getValue<string | null>();
      return type ? (
        <Badge variant="outline" className="text-xs capitalize">{type}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: 'estimatedDurationMinutes',
    header: 'Duration',
    cell: ({ getValue }) => {
      const minutes = getValue<number | null>();
      return minutes ? `${minutes} min` : '—';
    },
  },
  {
    accessorKey: 'consentRequired',
    header: 'Consent',
    cell: ({ getValue, row }) => {
      const required = getValue<boolean>();
      return required ? (
        <Badge variant="secondary" className="text-xs">
          {row.original.consentType || 'Required'}
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
        onClick={() => router.push(`/${locale}/catalogs/procedures/${row.original.id}`)}
      >
        <Eye className="h-4 w-4 mr-2" />
        View
      </Button>
    ),
  },
];

export default function ProceduresPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');

  const { data: procedures, isLoading, error } = useProcedures({ search });
  const columns = createColumns(router, locale);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search procedures..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-md border p-6 text-sm text-muted-foreground">
          Loading procedures...
        </div>
      ) : error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load procedures: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Procedures"
          columns={columns}
          data={procedures ?? []}
        />
      )}
    </div>
  );
}
