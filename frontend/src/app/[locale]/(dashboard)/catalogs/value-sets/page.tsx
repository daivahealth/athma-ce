'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Search } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ResourceTable } from '@/components/tables/resource-table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useValueSets, useValueSetCategories } from '@/modules/clinical/hooks/use-valuesets';
import type { ValueSet } from '@/modules/clinical/types/valueset';

const createColumns = (locale: string): ColumnDef<ValueSet>[] => [
  {
    accessorKey: 'name',
    header: 'Value Set',
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.original.name}</p>
        <p className="font-mono text-xs text-muted-foreground">{row.original.code}</p>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.original.category || 'uncategorized'}
      </Badge>
    ),
  },
  {
    accessorKey: 'version',
    header: 'Version',
    cell: ({ row }) => row.original.version || '—',
  },
  {
    accessorKey: 'conceptCount',
    header: 'Concepts',
    cell: ({ row }) => row.original.conceptCount ?? '—',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) =>
      getValue<string>() === 'active' ? (
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
      <Link href={`/${locale}/catalogs/value-sets/${row.original.code}`}>
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

export default function ValueSetsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<string>('active');

  const { data: categories } = useValueSetCategories();
  const { data: valueSets, isLoading, error } = useValueSets({
    search: search || undefined,
    category: category !== 'all' ? category : undefined,
    status: status !== 'all' ? status : undefined,
  });

  const columns = useMemo(() => createColumns(locale), [locale]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search value sets..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load value sets: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Value Sets"
          columns={columns}
          data={valueSets ?? []}
          isLoading={isLoading}
          emptyState="No value sets match your filters."
          cta={<div />}
        />
      )}
    </div>
  );
}
