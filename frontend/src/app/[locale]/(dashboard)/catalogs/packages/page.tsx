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
import { usePackages, usePackageTypes } from '@/modules/clinical/hooks/use-packages';
import type { Package, PackageType } from '@/modules/clinical/types/package';

const careSettingLabels: Record<string, string> = {
  OP: 'Outpatient',
  IP: 'Inpatient',
  DAYCARE: 'Daycare',
  ANY: 'Any',
};

const createColumns = (
  locale: string,
  packageTypeLookup: Record<string, string>,
): ColumnDef<Package>[] => [
  {
    accessorKey: 'name',
    header: 'Package',
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.original.name}</p>
        <p className="font-mono text-xs text-muted-foreground">{row.original.code}</p>
      </div>
    ),
  },
  {
    accessorKey: 'packageType',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant="secondary">
        {packageTypeLookup[row.original.packageType || ''] || '—'}
      </Badge>
    ),
  },
  {
    accessorKey: 'careSetting',
    header: 'Care Setting',
    cell: ({ row }) => careSettingLabels[row.original.careSetting || 'ANY'] || '—',
  },
  {
    accessorKey: 'items',
    header: 'Items',
    cell: ({ row }) => row.original.items?.length ?? 0,
  },
  {
    accessorKey: 'validityDays',
    header: 'Validity',
    cell: ({ row }) => (row.original.validityDays ? `${row.original.validityDays} days` : '—'),
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
      <Link href={`/${locale}/catalogs/packages/${row.original.id}`}>
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

export default function PackagesCatalogPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');
  const [packageType, setPackageType] = useState<string>('all');
  const [status, setStatus] = useState<string>('active');

  const { data: typeOptions } = usePackageTypes();

  const { data: packages, isLoading, error } = usePackages({
    search: search || undefined,
    packageType: packageType !== 'all' ? (packageType as PackageType) : undefined,
    isActive: status === 'all' ? undefined : status === 'active',
  });

  const packageTypeLookup = useMemo(
    () =>
      (typeOptions || []).reduce<Record<string, string>>((acc, type) => {
        acc[type.code] = type.name;
        return acc;
      }, {}),
    [typeOptions],
  );

  const columns = useMemo(
    () => createColumns(locale, packageTypeLookup),
    [locale, packageTypeLookup],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search packages..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={packageType} onValueChange={(value) => setPackageType(value)}>
          <SelectTrigger className="w-full md:w-52">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {typeOptions?.map((type) => (
              <SelectItem key={type.code} value={type.code}>
                {type.name}
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
          Failed to load packages: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Packages"
          columns={columns}
          data={packages ?? []}
          isLoading={isLoading}
          emptyState="No packages match your filters."
          cta={<div />}
        />
      )}
    </div>
  );
}
