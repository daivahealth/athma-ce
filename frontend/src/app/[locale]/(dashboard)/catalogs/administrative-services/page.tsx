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
import { useAdministrativeServices, useAdministrativeServiceCategories, useAdministrativeServiceTypes } from '@/modules/clinical/hooks/use-administrative-services';
import type { AdministrativeService } from '@/modules/clinical/types/administrative-service';

const careSettingLabels: Record<string, string> = {
  OP: 'Outpatient',
  IP: 'Inpatient',
  DAYCARE: 'Daycare',
  ANY: 'Any',
};

const createColumns = (
  locale: string,
  categoryLookup: Record<string, string>,
  typeLookup: Record<string, string>,
): ColumnDef<AdministrativeService>[] => [
  {
    accessorKey: 'serviceName',
    header: 'Service',
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.original.serviceName}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {row.original.serviceCode || '—'}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'serviceCategory',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {categoryLookup[row.original.serviceCategory] || row.original.serviceCategory}
      </Badge>
    ),
  },
  {
    accessorKey: 'serviceType',
    header: 'Type',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.serviceType ? typeLookup[row.original.serviceType] || row.original.serviceType : '—'}
      </span>
    ),
  },
  {
    accessorKey: 'careSetting',
    header: 'Care Setting',
    cell: ({ row }) => careSettingLabels[row.original.careSetting || 'ANY'] || '—',
  },
  {
    accessorKey: 'durationMinutes',
    header: 'Duration',
    cell: ({ row }) => (row.original.durationMinutes ? `${row.original.durationMinutes} mins` : '—'),
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
      <Link href={`/${locale}/catalogs/administrative-services/${row.original.id}`}>
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

export default function AdministrativeServicesPage() {
  const params = useParams();
  const locale = params.locale as string;

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [serviceType, setServiceType] = useState<string>('all');
  const [status, setStatus] = useState<string>('active');

  const { data: categoryOptions } = useAdministrativeServiceCategories();
  const { data: typeOptions } = useAdministrativeServiceTypes();

  const { data: services, isLoading, error } = useAdministrativeServices({
    search: search || undefined,
    serviceCategory: category !== 'all' ? (category as AdministrativeService['serviceCategory']) : undefined,
    serviceType: serviceType !== 'all' ? (serviceType as AdministrativeService['serviceType']) : undefined,
    isActive: status === 'all' ? undefined : status === 'active',
  });

  const categoryLookup = useMemo(
    () =>
      (categoryOptions || []).reduce<Record<string, string>>((acc, opt) => {
        acc[opt.code] = opt.name;
        return acc;
      }, {}),
    [categoryOptions],
  );

  const typeLookup = useMemo(
    () =>
      (typeOptions || []).reduce<Record<string, string>>((acc, opt) => {
        acc[opt.code] = opt.name;
        return acc;
      }, {}),
    [typeOptions],
  );

  const columns = useMemo(
    () => createColumns(locale, categoryLookup, typeLookup),
    [locale, categoryLookup, typeLookup],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search administrative services..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className="w-full md:w-52">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categoryOptions?.map((option) => (
              <SelectItem key={option.code} value={option.code}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={serviceType} onValueChange={(value) => setServiceType(value)}>
          <SelectTrigger className="w-full md:w-52">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {typeOptions?.map((option) => (
              <SelectItem key={option.code} value={option.code}>
                {option.name}
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
          Failed to load administrative services: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Administrative Services"
          columns={columns}
          data={services ?? []}
          isLoading={isLoading}
          emptyState="No services match your filters."
          cta={<div />}
        />
      )}
    </div>
  );
}
