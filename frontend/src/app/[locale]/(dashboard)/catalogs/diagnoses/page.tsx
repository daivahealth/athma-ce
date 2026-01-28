'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, Eye, Search } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ResourceTable } from '@/components/tables/resource-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDiagnoses, useDiagnosisVersions } from '@/modules/foundation/hooks/use-catalogs';
import type { Diagnosis } from '@/modules/foundation/types/catalog';

const createColumns = (locale: string): ColumnDef<Diagnosis>[] => [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => (
      <div>
        <p className="font-mono text-sm font-semibold">{row.original.code}</p>
        {row.original.codeType && (
          <p className="text-xs text-muted-foreground capitalize">{row.original.codeType}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.shortDescription || row.original.description}</p>
        {row.original.category && (
          <p className="text-xs text-muted-foreground">Category: {row.original.category}</p>
        )}
      </div>
    ),
  },
  {
    id: 'version',
    header: 'Version',
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="font-semibold">{row.original.version?.codeSet || '—'}</p>
        <p className="text-xs text-muted-foreground">{row.original.version?.versionLabel || '—'}</p>
      </div>
    ),
  },
  {
    accessorKey: 'chapter',
    header: 'Chapter / Block',
    cell: ({ row }) => (
      <div className="text-sm">
        <p>{row.original.chapter || '—'}</p>
        <p className="text-xs text-muted-foreground">{row.original.block || '—'}</p>
      </div>
    ),
  },
  {
    id: 'billable',
    header: 'Billable',
    cell: ({ row }) =>
      row.original.isBillable ? (
        <Badge variant="outline" className="border-green-500 text-green-600">
          Billable
        </Badge>
      ) : (
        <Badge variant="secondary">Reference</Badge>
      ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ getValue }) =>
      getValue<boolean>() ? (
        <Badge variant="default" className="bg-green-600">
          Active
        </Badge>
      ) : (
        <Badge variant="secondary">Inactive</Badge>
      ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Link href={`/${locale}/catalogs/diagnoses/${row.original.id}`}>
        <button
          type="button"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <Eye className="mr-2 h-4 w-4" /> View
        </button>
      </Link>
    ),
  },
];

export default function DiagnosesCatalogPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');
  const [versionFilter, setVersionFilter] = useState<string>('all');

  const { data: versions } = useDiagnosisVersions({ isActive: true });

  const { data: diagnoses, isLoading, error } = useDiagnoses({
    search,
    versionId: versionFilter !== 'all' ? versionFilter : undefined,
  });

  const columns = useMemo(() => createColumns(locale), [locale]);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/${locale}/catalogs`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to catalogs
        </Link>
      </Button>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search diagnoses..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={versionFilter} onValueChange={(value) => setVersionFilter(value)}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="All ICD versions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ICD Versions</SelectItem>
            {versions?.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                {version.codeSet} · {version.versionLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load diagnoses: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Diagnoses"
          columns={columns}
          data={diagnoses ?? []}
          isLoading={isLoading}
          emptyState="No diagnoses found for the selected filters."
          cta={<div />}
        />
      )}
    </div>
  );
}
