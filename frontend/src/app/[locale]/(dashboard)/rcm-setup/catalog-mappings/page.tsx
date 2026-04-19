'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Sparkles, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ResourceTable } from '@/components/tables/resource-table';
import { useCatalogMappings } from '@/modules/rcm/hooks/use-catalog-mappings';
import type { CatalogMapping, CatalogMappingFilters, CatalogType } from '@/modules/rcm/types/catalog-mapping';

// ─── Constants ────────────────────────────────────────────────────────────────

const catalogTypeLabels: Record<CatalogType, string> = {
  medication: 'Medication',
  lab_test: 'Lab test',
  imaging_study: 'Imaging study',
  procedure: 'Procedure',
  package: 'Package',
  administrative_service: 'Administrative service',
};

// ─── Table columns ─────────────────────────────────────────────────────────────

const createColumns = (
  router: ReturnType<typeof useRouter>,
  locale: string,
): ColumnDef<CatalogMapping>[] => [
  {
    accessorKey: 'catalogType',
    header: 'Catalog item',
    cell: ({ row }) => (
      <div>
        <p className="font-medium capitalize">{catalogTypeLabels[row.original.catalogType]}</p>
        <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{row.original.catalogItemId}</p>
      </div>
    ),
  },
  {
    accessorKey: 'billingItemId',
    header: 'Billing item',
    cell: ({ row }) => {
      const b = row.original.billingItem;
      return b ? (
        <div>
          <p className="font-medium text-sm">{b.billingDescription}</p>
          <p className="text-xs text-muted-foreground font-mono">{b.billingCode}</p>
        </div>
      ) : (
        <span className="font-mono text-xs text-muted-foreground truncate max-w-[180px] block">{row.original.billingItemId}</span>
      );
    },
  },
  {
    id: 'flags',
    header: 'Flags',
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        {row.original.isPrimary && <Badge variant="default" className="text-xs">Primary</Badge>}
        {row.original.isAutomatic && <Badge variant="outline" className="text-xs">Auto</Badge>}
        {row.original.requiresApproval && <Badge variant="secondary" className="text-xs">Needs approval</Badge>}
      </div>
    ),
  },
  {
    accessorKey: 'quantity',
    header: 'Qty',
    cell: ({ getValue }) => getValue<number | null>() ?? 1,
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ getValue }) =>
      getValue<boolean>() ? (
        <Badge variant="default" className="bg-green-600 text-xs">Active</Badge>
      ) : (
        <Badge variant="secondary" className="text-xs">Inactive</Badge>
      ),
  },
  {
    accessorKey: 'effectiveDate',
    header: 'Effective',
    cell: ({ row }) => {
      const start = row.original.effectiveDate ? format(new Date(row.original.effectiveDate), 'dd MMM yyyy') : '—';
      const end = row.original.expirationDate ? format(new Date(row.original.expirationDate), 'dd MMM yyyy') : '—';
      return (
        <div className="text-xs">
          <p>{start}</p>
          {row.original.expirationDate && <p className="text-muted-foreground">Ends: {end}</p>}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${locale}/rcm-setup/catalog-mappings/${row.original.id}`)}
      >
        <Eye className="h-4 w-4 mr-1" />
        View
      </Button>
    ),
  },
];

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function CatalogMappingsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [filters, setFilters] = useState<CatalogMappingFilters>({ isActive: true });

  const { data: mappings, isLoading, error } = useCatalogMappings(filters);
  const columns = useMemo(() => createColumns(router, locale), [router, locale]);

  const totalMappings = mappings?.length ?? 0;
  const primaryMappings = mappings?.filter((m) => m.isPrimary).length ?? 0;
  const requireApproval = mappings?.filter((m) => m.requiresApproval).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Catalog Mappings</h1>
          <p className="text-muted-foreground">Link clinical catalog items to billing items for automatic charge posting.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/rcm-setup/catalog-mappings/suggestions`}>
              <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
              Suggested
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/${locale}/rcm-setup/catalog-mappings/new`}>
              <Plus className="h-4 w-4 mr-2" />
              New Mapping
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total mappings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{isLoading ? '—' : totalMappings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Primary mappings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{isLoading ? '—' : primaryMappings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Require approval</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{isLoading ? '—' : requireApproval}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 grid gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <Label>Catalog type</Label>
            <Select
              value={filters.catalogType ?? 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, catalogType: value === 'all' ? undefined : (value as CatalogType) }))
              }
            >
              <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {Object.entries(catalogTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, isActive: value === 'all' ? undefined : value === 'active' }))
              }
            >
              <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Primary</Label>
            <Select
              value={filters.isPrimary === undefined ? 'all' : filters.isPrimary ? 'yes' : 'no'}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, isPrimary: value === 'all' ? undefined : value === 'yes' }))
              }
            >
              <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Primary only</SelectItem>
                <SelectItem value="no">Secondary only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Billing item ID</Label>
            <Input
              placeholder="Filter by billing item UUID"
              value={filters.billingItemId ?? ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, billingItemId: e.target.value || undefined }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load catalog mappings: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Catalog Mappings"
          columns={columns}
          data={mappings ?? []}
          isLoading={isLoading}
          emptyState="No mappings found. Adjust the filters or create a new mapping."
          cta={<div />}
        />
      )}
    </div>
  );
}
