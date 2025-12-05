'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ResourceTable } from '@/components/tables/resource-table';
import { useToast } from '@/components/ui/use-toast';
import { useCatalogMappings, useCreateCatalogMapping } from '@/modules/rcm/hooks/use-catalog-mappings';
import type { CatalogMapping, CatalogMappingFilters, CatalogType } from '@/modules/rcm/types/catalog-mapping';

const catalogTypeLabels: Record<CatalogType, string> = {
  medication: 'Medication',
  lab_test: 'Lab test',
  imaging_study: 'Imaging study',
  procedure: 'Procedure',
  package: 'Package',
  administrative_service: 'Administrative service',
};

const createColumns = (): ColumnDef<CatalogMapping>[] => [
  {
    accessorKey: 'catalogType',
    header: 'Catalog',
    cell: ({ row }) => (
      <div>
        <p className="font-semibold capitalize">{catalogTypeLabels[row.original.catalogType]}</p>
        <p className="text-xs text-muted-foreground font-mono">{row.original.catalogItemId}</p>
      </div>
    ),
  },
  {
    accessorKey: 'billingItemId',
    header: 'Billing item',
    cell: ({ row }) => (
      <div>
        <p className="font-mono text-sm">{row.original.billingItemId}</p>
        <div className="flex gap-2 mt-1">
          {row.original.isPrimary && <Badge variant="default">Primary</Badge>}
          {row.original.isAutomatic && <Badge variant="outline">Auto</Badge>}
          {row.original.requiresApproval && <Badge variant="secondary">Needs approval</Badge>}
        </div>
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
        <Badge variant="default" className="bg-green-600">
          Active
        </Badge>
      ) : (
        <Badge variant="secondary">Inactive</Badge>
      ),
  },
  {
    accessorKey: 'effectiveDate',
    header: 'Effective',
    cell: ({ row }) => {
      const start = row.original.effectiveDate ? format(new Date(row.original.effectiveDate), 'PPP') : '—';
      const end = row.original.expirationDate ? format(new Date(row.original.expirationDate), 'PPP') : '—';
      return (
        <div className="text-sm">
          <p>{start}</p>
          <p className="text-xs text-muted-foreground">Ends: {end}</p>
        </div>
      );
    },
  },
];

export default function CatalogMappingsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();

  const [filters, setFilters] = useState<CatalogMappingFilters>({ isActive: true });
  const [newMapping, setNewMapping] = useState({
    catalogType: 'lab_test' as CatalogType,
    catalogItemId: '',
    billingItemId: '',
    quantity: 1,
    isAutomatic: true,
    isPrimary: true,
    requiresApproval: false,
    mappingReason: '',
    notes: '',
  });

  const { data: mappings, isLoading, error } = useCatalogMappings(filters);
  const { mutateAsync: createMapping, isPending: isCreating } = useCreateCatalogMapping();

  const columns = useMemo(() => createColumns(), []);

  const handleCreate = async () => {
    if (!newMapping.catalogItemId.trim() || !newMapping.billingItemId.trim()) {
      toast.toast({
        variant: 'destructive',
        title: 'Missing data',
        description: 'Catalog item ID and billing item ID are required.',
      });
      return;
    }

    try {
      await createMapping({
        catalogType: newMapping.catalogType,
        catalogItemId: newMapping.catalogItemId.trim(),
        billingItemId: newMapping.billingItemId.trim(),
        quantity: newMapping.quantity || 1,
        isAutomatic: newMapping.isAutomatic,
        isPrimary: newMapping.isPrimary,
        requiresApproval: newMapping.requiresApproval,
        mappingReason: newMapping.mappingReason || undefined,
        notes: newMapping.notes || undefined,
        isActive: true,
      });
      toast.toast({ title: 'Mapping created', description: 'Catalog mapping saved successfully.' });
      setNewMapping((prev) => ({ ...prev, catalogItemId: '', billingItemId: '', mappingReason: '', notes: '' }));
    } catch (err) {
      toast.toast({
        variant: 'destructive',
        title: 'Failed to create mapping',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Catalog mappings</h1>
          <p className="text-muted-foreground">Link clinical catalogs to billing items for charge automation.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <Label>Catalog type</Label>
            <Select
              value={filters.catalogType ?? 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, catalogType: value === 'all' ? undefined : (value as CatalogType) }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.entries(catalogTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  isActive: value === 'all' ? undefined : value === 'active',
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
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
                setFilters((prev) => ({
                  ...prev,
                  isPrimary: value === 'all' ? undefined : value === 'yes',
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Primary</SelectItem>
                <SelectItem value="no">Secondary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Billing item ID</Label>
            <Input
              placeholder="Billing item UUID"
              value={filters.billingItemId ?? ''}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, billingItemId: e.target.value || undefined }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create mapping</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Label>Catalog type</Label>
            <Select
              value={newMapping.catalogType}
              onValueChange={(value) => setNewMapping((prev) => ({ ...prev, catalogType: value as CatalogType }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(catalogTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Catalog item ID</Label>
            <Input
              placeholder="Clinical catalog item UUID"
              value={newMapping.catalogItemId}
              onChange={(e) => setNewMapping((prev) => ({ ...prev, catalogItemId: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Billing item ID</Label>
            <Input
              placeholder="Billing item UUID"
              value={newMapping.billingItemId}
              onChange={(e) => setNewMapping((prev) => ({ ...prev, billingItemId: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Quantity</Label>
            <Input
              type="number"
              min={0}
              value={newMapping.quantity}
              onChange={(e) => setNewMapping((prev) => ({ ...prev, quantity: Number(e.target.value) || 1 }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Mapping reason</Label>
            <Input
              placeholder="Why this mapping exists"
              value={newMapping.mappingReason}
              onChange={(e) => setNewMapping((prev) => ({ ...prev, mappingReason: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea
              rows={2}
              placeholder="Optional notes"
              value={newMapping.notes}
              onChange={(e) => setNewMapping((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="auto"
                checked={newMapping.isAutomatic}
                onCheckedChange={(checked) => setNewMapping((prev) => ({ ...prev, isAutomatic: checked }))}
              />
              <Label htmlFor="auto">Automatic</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="primary"
                checked={newMapping.isPrimary}
                onCheckedChange={(checked) => setNewMapping((prev) => ({ ...prev, isPrimary: checked }))}
              />
              <Label htmlFor="primary">Primary</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="requires-approval"
                checked={newMapping.requiresApproval}
                onCheckedChange={(checked) => setNewMapping((prev) => ({ ...prev, requiresApproval: checked }))}
              />
              <Label htmlFor="requires-approval">Requires approval</Label>
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? 'Saving...' : 'Create mapping'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load catalog mappings: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Catalog mappings"
          columns={columns}
          data={mappings ?? []}
          isLoading={isLoading}
          emptyState="No mappings found for the selected filters."
          cta={<div />}
        />
      )}
    </div>
  );
}
