'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Plus, AlertTriangle, Clock } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { usePharmacyStock } from '@/modules/pharmacy/hooks/use-pharmacy-stock';
import type { PharmacyStock } from '@/modules/pharmacy/types/stock';
import { PharmacyStockStatus } from '@/modules/pharmacy/types/stock';

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
  const [statusFilter, setStatusFilter] = useState('');
  const [searchCode, setSearchCode] = useState('');

  const { data: stocks = [], isLoading } = usePharmacyStock({
    ...(statusFilter && { status: statusFilter }),
    ...(searchCode && { drugCode: searchCode }),
  });

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
          <div className="font-medium">{row.original.drugName}</div>
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by drug code..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-52"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
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

      <ResourceTable
        columns={columns}
        data={stocks}
        isLoading={isLoading}
        emptyMessage="No stock batches found"
      />
    </div>
  );
}
