'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ResourceTable } from '@/components/tables/resource-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useObservationCodes } from '@/modules/foundation/hooks/use-catalogs';
import type { ObservationCode } from '@/modules/foundation/types/catalog';

const createColumns = (): ColumnDef<ObservationCode>[] => [
  {
    accessorKey: 'displayName',
    header: 'Observation',
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.original.displayName}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.displayNameAr || row.original.codeSystem}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.code}</span>,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: 'labDomain',
    header: 'Lab Domain',
    cell: ({ row }) =>
      row.original.category === 'laboratory' ? (
        <Badge variant="outline" className="capitalize">
          {row.original.labDomain || 'unclassified'}
        </Badge>
      ) : (
        '—'
      ),
  },
  {
    accessorKey: 'dataType',
    header: 'Data Type',
    cell: ({ row }) => <span className="capitalize">{row.original.dataType}</span>,
  },
  {
    accessorKey: 'defaultUnit',
    header: 'Default Unit',
    cell: ({ row }) => row.original.defaultUnit || '—',
  },
  {
    id: 'referenceRange',
    header: 'Default Range',
    cell: ({ row }) => {
      const low = row.original.refRangeLow;
      const high = row.original.refRangeHigh;
      if (low == null && high == null) return '—';
      return `${low ?? '—'} to ${high ?? '—'}`;
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge variant="default" className="bg-green-600">
          Active
        </Badge>
      ) : (
        <Badge variant="secondary">Inactive</Badge>
      ),
  },
];

export default function ObservationCodesPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  const queryCategory = category !== 'all' ? category : undefined;
  const { data: observationCodes, isLoading, error } = useObservationCodes(queryCategory);

  const categories = useMemo(() => {
    const unique = new Set((observationCodes ?? []).map((item) => item.category));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [observationCodes]);

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return observationCodes ?? [];
    return (observationCodes ?? []).filter((item) =>
      item.displayName.toLowerCase().includes(term) ||
      item.code.toLowerCase().includes(term) ||
      item.codeSystem.toLowerCase().includes(term),
    );
  }, [observationCodes, search]);

  const columns = useMemo(() => createColumns(), []);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/${locale}/catalogs`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to catalogs
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Observation Codes</h1>
        <p className="text-muted-foreground">
          Browse canonical observation definitions used for lab analytes, vitals, imaging findings, and structured result entry.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search observation name, code, or code system..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-56">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ResourceTable
        title="Observation Catalog"
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        error={error as Error | null}
        emptyState="No observation codes match your filters."
        cta={<div />}
      />
    </div>
  );
}
