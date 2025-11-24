'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { Search, Eye, Plus } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useBillingItems, useBillingItemStats } from '@/modules/rcm/hooks/use-billing-items';
import type { BillingItem } from '@/modules/rcm/types/billing-item';
import { ItemType, ChargeType, BillingCodeType } from '@/modules/rcm/types/billing-item';

const statusVariant: Record<string, 'default' | 'secondary'> = {
  active: 'default',
  inactive: 'secondary',
};

const toLabel = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const createColumns = (
  locale: string,
  router: ReturnType<typeof useRouter>,
): ColumnDef<BillingItem>[] => [
  {
    accessorKey: 'billingCode',
    header: 'Code',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.billingCode}</div>
        <p className="text-xs text-muted-foreground">{toLabel(row.original.billingCodeType)}</p>
      </div>
    ),
  },
  {
    accessorKey: 'billingDescription',
    header: 'Description',
    cell: ({ getValue }) => (
      <p className="max-w-xs truncate" title={getValue<string>()}>
        {getValue<string>()}
      </p>
    ),
  },
  {
    accessorKey: 'itemType',
    header: 'Type',
    cell: ({ getValue }) => toLabel(getValue<string>()),
  },
  {
    accessorKey: 'chargeType',
    header: 'Charge',
    cell: ({ getValue }) => toLabel(getValue<string>()),
  },
  {
    accessorKey: 'listPrice',
    header: 'List price (AED)',
    cell: ({ getValue }) => {
      const value = getValue<number | null>();
      return value != null ? value.toFixed(2) : '—';
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ getValue }) => {
      const isActive = getValue<boolean>();
      return <Badge variant={isActive ? statusVariant.active : statusVariant.inactive}>{isActive ? 'Active' : 'Inactive'}</Badge>;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? formatDistanceToNow(new Date(value), { addSuffix: true }) : '—';
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/rcm-setup/billing-items/${row.original.id}`)}>
        <Eye className="mr-2 h-4 w-4" /> View
      </Button>
    ),
  },
];

export default function BillingItemsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState<'all' | ItemType>('all');
  const [chargeTypeFilter, setChargeTypeFilter] = useState<'all' | ChargeType>('all');
  const [codeTypeFilter, setCodeTypeFilter] = useState<'all' | BillingCodeType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [includeGlobal, setIncludeGlobal] = useState(true);

  const filters = useMemo(
    () => ({
      itemType: itemTypeFilter === 'all' ? undefined : itemTypeFilter,
      chargeType: chargeTypeFilter === 'all' ? undefined : chargeTypeFilter,
      billingCodeType: codeTypeFilter === 'all' ? undefined : codeTypeFilter,
      isActive:
        statusFilter === 'all' ? undefined : statusFilter === 'active'
          ? true
          : false,
      includeGlobal,
    }),
    [itemTypeFilter, chargeTypeFilter, codeTypeFilter, statusFilter, includeGlobal],
  );

  const { data: billingItems, isLoading, error } = useBillingItems(filters);
  const { data: stats } = useBillingItemStats();

  const columns = useMemo(() => createColumns(locale, router), [locale, router]);
  const sanitized = useMemo(() => billingItems ?? [], [billingItems]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sanitized;
    return sanitized.filter((item) =>
      `${item.billingCode} ${item.billingDescription}`.toLowerCase().includes(term),
    );
  }, [sanitized, search]);

  const statCards = [
    { label: 'Total items', value: stats?.total ?? sanitized.length },
    { label: 'Active', value: stats?.active ?? 0 },
    { label: 'Inactive', value: stats?.inactive ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search billing items..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={itemTypeFilter} onValueChange={(value) => setItemTypeFilter(value as 'all' | ItemType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Item type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All item types</SelectItem>
            {Object.values(ItemType).map((option) => (
              <SelectItem key={option} value={option}>
                {toLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={chargeTypeFilter} onValueChange={(value) => setChargeTypeFilter(value as 'all' | ChargeType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Charge type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All charge types</SelectItem>
            {Object.values(ChargeType).map((option) => (
              <SelectItem key={option} value={option}>
                {toLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={codeTypeFilter} onValueChange={(value) => setCodeTypeFilter(value as 'all' | BillingCodeType)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Code system" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All systems</SelectItem>
            {Object.values(BillingCodeType).map((option) => (
              <SelectItem key={option} value={option}>
                {toLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 py-4">
          <div>
            <p className="text-sm font-medium">Include global catalog items</p>
            <p className="text-xs text-muted-foreground">Global billing items shared across tenants</p>
          </div>
          <Switch checked={includeGlobal} onCheckedChange={setIncludeGlobal} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load billing items: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Billing items"
          cta={
            <Button size="sm" asChild>
              <Link href={`/${locale}/rcm-setup/billing-items/new`}>
                <Plus className="mr-2 h-4 w-4" /> New billing item
              </Link>
            </Button>
          }
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyState={search ? 'No billing items match your search.' : 'No billing items found.'}
          onRowClick={(row) => router.push(`/${locale}/rcm-setup/billing-items/${row.id}`)}
        />
      )}
    </div>
  );
}
