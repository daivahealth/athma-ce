'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Plus, AlertTriangle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { usePharmacyStockPaged } from '@/modules/pharmacy/hooks/use-pharmacy-stock';
import type { PharmacyStock } from '@/modules/pharmacy/types/stock';
import { PharmacyStockStatus } from '@/modules/pharmacy/types/stock';

const PAGE_SIZE = 20;

const STATUS_VARIANTS: Record<PharmacyStockStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [PharmacyStockStatus.ACTIVE]: 'default',
  [PharmacyStockStatus.QUARANTINED]: 'destructive',
  [PharmacyStockStatus.EXPIRED]: 'destructive',
  [PharmacyStockStatus.DEPLETED]: 'secondary',
  [PharmacyStockStatus.RECALLED]: 'destructive',
};

export default function PharmacyStockPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Debounce search — only hits the backend 400 ms after the user stops typing
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const { data: paged, isLoading, isFetching } = usePharmacyStockPaged({
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(statusFilter !== 'all' && { status: statusFilter }),
    page,
    limit: PAGE_SIZE,
  });

  const stocks = paged?.data ?? [];
  const total  = paged?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Reset to page 1 whenever filters change
  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };
  const handleStatus = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const isLowStock = (stock: PharmacyStock) =>
    stock.reorderLevel != null && Number(stock.quantityOnHand) <= Number(stock.reorderLevel);

  const isExpiringSoon = (stock: PharmacyStock) => {
    const expiry = new Date(stock.expiryDate);
    const in30Days = new Date();
    in30Days.setDate(in30Days.getDate() + 30);
    return expiry <= in30Days && expiry > new Date();
  };

  const columns: ColumnDef<PharmacyStock>[] = [
    {
      accessorKey: 'drugName',
      header: 'Drug',
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.original.drugName}</span>
            {row.original.medicationId && (
              <button
                type="button"
                title="View in Medication Catalog"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/${locale}/catalogs/medications/${row.original.medicationId}`);
                }}
              >
                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">catalog</Badge>
              </button>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.genericName ?? row.original.drugCode} · {row.original.dosageForm}
            {row.original.strength && ` · ${row.original.strength}`}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'batchNumber',
      header: 'Batch',
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.batchNumber}</span>
      ),
    },
    {
      accessorKey: 'quantityOnHand',
      header: 'On Hand',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className={isLowStock(row.original) ? 'text-destructive font-medium' : ''}>
            {Number(row.original.quantityOnHand).toFixed(0)} {row.original.unit}
          </span>
          {isLowStock(row.original) && (
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
          )}
        </div>
      ),
    },
    {
      accessorKey: 'expiryDate',
      header: 'Expiry',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className={isExpiringSoon(row.original) ? 'text-amber-600 font-medium' : ''}>
            {format(new Date(row.original.expiryDate), 'MMM yyyy')}
          </span>
          {isExpiringSoon(row.original) && (
            <Clock className="h-3.5 w-3.5 text-amber-600" />
          )}
        </div>
      ),
    },
    {
      accessorKey: 'storageLocation',
      header: 'Location',
      cell: ({ row }) => row.original.storageLocation ?? '—',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANTS[row.original.status as PharmacyStockStatus] ?? 'outline'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'billingItemId',
      header: 'Billing',
      cell: ({ row }) =>
        row.original.billingItemId ? (
          <button
            type="button"
            title="View Billing Item"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/${locale}/rcm-setup/billing-items/${row.original.billingItemId}`);
            }}
          >
            <Badge variant="secondary" className="font-mono text-xs cursor-pointer hover:bg-accent">linked</Badge>
          </button>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => router.push(`/${locale}/pharmacy/stock/${row.original.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to   = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by name, code or batch…"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
          <Select value={statusFilter} onValueChange={handleStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {Object.values(PharmacyStockStatus).map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => router.push(`/${locale}/pharmacy/stock/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          Receive Stock
        </Button>
      </div>

      {/* Table */}
      <ResourceTable
        columns={columns}
        data={stocks}
        isLoading={isLoading}
        emptyState="No stock batches found"
      />

      {/* Pagination footer */}
      {!isLoading && total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className={isFetching ? 'opacity-50' : ''}>
            Showing {from}–{to} of {total} batches
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
