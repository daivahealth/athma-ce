'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, AlertTriangle, Lock } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResourceTable } from '@/components/tables/resource-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  usePharmacyStockById,
  useAdjustStock,
  useQuarantineStock,
} from '@/modules/pharmacy/hooks/use-pharmacy-stock';
import type { PharmacyStockMovement } from '@/modules/pharmacy/types/stock';

export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const id = params.id as string;

  const { data: stock, isLoading } = usePharmacyStockById(id);
  const adjustMutation = useAdjustStock();
  const quarantineMutation = useQuarantineStock();

  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustOpen, setAdjustOpen] = useState(false);

  const handleAdjust = async () => {
    if (!adjustQty || !adjustReason) return;
    await adjustMutation.mutateAsync({
      id,
      payload: { newQuantityOnHand: Number(adjustQty), reason: adjustReason },
    });
    setAdjustOpen(false);
    setAdjustQty('');
    setAdjustReason('');
  };

  const movementColumns: ColumnDef<PharmacyStockMovement>[] = [
    {
      accessorKey: 'movementType',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.movementType.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => {
        const qty = Number(row.original.quantity);
        return (
          <span className={qty < 0 ? 'text-destructive' : 'text-green-600'}>
            {qty > 0 ? '+' : ''}{qty}
          </span>
        );
      },
    },
    {
      accessorKey: 'quantityAfter',
      header: 'Balance After',
      cell: ({ row }) => Number(row.original.quantityAfter).toFixed(0),
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => row.original.reason ?? '—',
    },
    {
      accessorKey: 'performedAt',
      header: 'When',
      cell: ({ row }) => format(new Date(row.original.performedAt), 'dd MMM yyyy HH:mm'),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!stock) return <div className="text-muted-foreground">Stock batch not found</div>;

  const isLowStock = stock.reorderLevel != null && Number(stock.quantityOnHand) <= Number(stock.reorderLevel);
  const isExpiringSoon = new Date(stock.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-lg font-semibold">{stock.drugName}</h2>
        <Badge variant={stock.status === 'active' ? 'default' : 'destructive'}>{stock.status}</Badge>
      </div>

      {/* Drug Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Drug Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-muted-foreground">Drug Code:</span> <span className="font-mono">{stock.drugCode}</span></div>
          <div><span className="text-muted-foreground">Dosage Form:</span> {stock.dosageForm}</div>
          <div><span className="text-muted-foreground">Strength:</span> {stock.strength ?? '—'}</div>
          <div><span className="text-muted-foreground">Generic:</span> {stock.genericName ?? '—'}</div>
          {stock.isControlled && (
            <div className="col-span-2 flex items-center gap-2 text-amber-600">
              <Lock className="h-4 w-4" />
              Controlled substance {stock.controlledClass && `(${stock.controlledClass})`}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Batch & Inventory */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Batch & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-muted-foreground">Batch #:</span> <span className="font-mono">{stock.batchNumber}</span></div>
          <div><span className="text-muted-foreground">Manufacturer:</span> {stock.manufacturer ?? '—'}</div>
          <div>
            <span className="text-muted-foreground">Expiry:</span>{' '}
            <span className={isExpiringSoon ? 'text-amber-600 font-medium' : ''}>
              {format(new Date(stock.expiryDate), 'dd MMM yyyy')}
            </span>
            {isExpiringSoon && <span className="ml-1 text-amber-600 text-xs">(Soon)</span>}
          </div>
          <div><span className="text-muted-foreground">Received:</span> {format(new Date(stock.receivedDate), 'dd MMM yyyy')}</div>
          <div>
            <span className="text-muted-foreground">On Hand:</span>{' '}
            <span className={isLowStock ? 'text-destructive font-medium' : 'font-medium'}>
              {Number(stock.quantityOnHand).toFixed(0)} {stock.unit}
            </span>
            {isLowStock && <AlertTriangle className="inline ml-1 h-3.5 w-3.5 text-destructive" />}
          </div>
          <div><span className="text-muted-foreground">Reserved:</span> {Number(stock.quantityReserved).toFixed(0)} {stock.unit}</div>
          {stock.reorderLevel != null && (
            <div><span className="text-muted-foreground">Reorder Level:</span> {Number(stock.reorderLevel).toFixed(0)} {stock.unit}</div>
          )}
          <div><span className="text-muted-foreground">Location:</span> {stock.storageLocation ?? '—'}</div>
          {stock.unitCostPrice != null && (
            <div><span className="text-muted-foreground">Cost/Unit:</span> {Number(stock.unitCostPrice).toFixed(2)} {stock.currency}</div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Adjust Quantity</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manual Stock Adjustment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label>New Quantity On Hand</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.001"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  placeholder={`Current: ${Number(stock.quantityOnHand).toFixed(0)}`}
                />
              </div>
              <div className="space-y-1">
                <Label>Reason *</Label>
                <Input
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. cycle count, damage, write-off"
                />
              </div>
              <Button
                onClick={handleAdjust}
                disabled={!adjustQty || !adjustReason || adjustMutation.isPending}
                className="w-full"
              >
                {adjustMutation.isPending ? 'Saving...' : 'Save Adjustment'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {stock.status === 'active' && (
          <Button
            variant="destructive"
            onClick={() => quarantineMutation.mutate(id)}
            disabled={quarantineMutation.isPending}
          >
            Quarantine Batch
          </Button>
        )}
      </div>

      {/* Movement Log */}
      {stock.movements && stock.movements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Movement History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResourceTable
              columns={movementColumns}
              data={stock.movements}
              isLoading={false}
              emptyMessage="No movements"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
