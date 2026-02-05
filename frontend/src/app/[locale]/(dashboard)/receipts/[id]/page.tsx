'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Trash2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { ReceiptForm } from '@/modules/rcm/components/receipt-form';
import {
  useReceipt,
  useUpdateReceipt,
  useAllocateReceipt,
  useDeleteReceipt,
} from '@/modules/rcm/hooks/use-receipts';
import { PaymentMethod } from '@/modules/rcm/types/receipt';
import type { AllocateReceiptInput, CreateReceiptInput } from '@/modules/rcm/types/receipt';

const paymentLabels: Record<string, string> = {
  [PaymentMethod.CASH]: 'Cash',
  [PaymentMethod.CARD]: 'Card',
  [PaymentMethod.UPI]: 'UPI',
  [PaymentMethod.BANK_TRANSFER]: 'Bank transfer',
  [PaymentMethod.WALLET]: 'Wallet',
};

interface AllocationDraft {
  tempId: string;
  invoiceId: string;
  allocatedAmount: string;
}

const createTempId = () => `alloc-${Math.random().toString(36).slice(2)}-${Date.now()}`;

export default function ReceiptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const receiptId = params.id as string;
  const toast = useToast();

  const { data: receipt, isLoading, error } = useReceipt(receiptId);
  const updateMutation = useUpdateReceipt();
  const allocateMutation = useAllocateReceipt();
  const deleteMutation = useDeleteReceipt();

  const [allocationRows, setAllocationRows] = useState<AllocationDraft[]>([createEmptyAllocation()]);

  useEffect(() => {
    setAllocationRows([createEmptyAllocation()]);
  }, [receiptId]);

  const formatMoney = (value: number, currency: string) => `${value.toFixed(2)} ${currency}`;

  const handleUpdate = async (payload: CreateReceiptInput) => {
    await updateMutation.mutateAsync({ id: receiptId, payload });
    toast({ title: 'Receipt updated' });
  };

  const handleAddAllocationRow = () => {
    setAllocationRows((prev) => [...prev, createEmptyAllocation()]);
  };

  const handleAllocationChange = (tempId: string, field: keyof AllocationDraft, value: string) => {
    setAllocationRows((prev) => prev.map((row) => (row.tempId === tempId ? { ...row, [field]: value } : row)));
  };

  const handleRemoveAllocationRow = (tempId: string) => {
    setAllocationRows((prev) => (prev.length === 1 ? prev : prev.filter((row) => row.tempId !== tempId)));
  };

  const handleAllocate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allocations = allocationRows
      .map((row) => ({
        invoiceId: row.invoiceId.trim(),
        allocatedAmount: Number(row.allocatedAmount) || 0,
      }))
      .filter((row) => row.invoiceId && row.allocatedAmount > 0);

    if (allocations.length === 0) {
      toast({ variant: 'destructive', title: 'Add at least one allocation' });
      return;
    }

    const payload: AllocateReceiptInput = { allocations };
    await allocateMutation.mutateAsync({ id: receiptId, payload });
    toast({ title: 'Receipt allocated' });
    setAllocationRows([createEmptyAllocation()]);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this receipt?')) return;
    await deleteMutation.mutateAsync(receiptId);
    toast({ title: 'Receipt deleted' });
    router.push(`/${locale}/receipts`);
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !receipt) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load receipt: ${(error as Error).message}` : 'Receipt not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/receipts`} aria-label="Back to receipts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Receipt #{receipt.receiptNumber}</p>
          <h1 className="text-3xl font-bold">{formatMoney(receipt.amount, receipt.currency)}</h1>
          {receipt.paidCurrency &&
            receipt.paidAmount != null &&
            receipt.paidCurrency !== receipt.currency && (
              <p className="text-sm text-muted-foreground">
                Paid {formatMoney(receipt.paidAmount, receipt.paidCurrency)} · FX{' '}
                {(receipt.fxRateToBase ?? 1).toFixed(4)}
              </p>
            )}
        </div>
        <Badge variant="secondary" className="ml-auto">
          {paymentLabels[receipt.paymentMethod]}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm" title={receipt.patientId}>
              {receipt.patientId}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Receipt date</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{format(new Date(receipt.receiptDate), 'PPP')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{receipt.txnReference || '—'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit receipt</CardTitle>
        </CardHeader>
        <CardContent>
          <ReceiptForm
            initialValues={receipt}
            submitLabel="Update receipt"
            isSubmitting={updateMutation.isPending}
            onSubmit={handleUpdate}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Allocations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {receipt.allocations?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Allocated at</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.allocations.map((allocation) => (
                  <TableRow key={allocation.id}>
                    <TableCell className="font-mono text-xs" title={allocation.invoiceId}>
                      {allocation.invoiceId}
                    </TableCell>
                    <TableCell>{formatMoney(allocation.allocatedAmount, receipt.currency)}</TableCell>
                    <TableCell>{allocation.createdAt ? format(new Date(allocation.createdAt), 'PPP p') : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No allocations recorded.</p>
          )}

          <form className="space-y-3" onSubmit={handleAllocate}>
            <div className="grid gap-3 md:grid-cols-3">
              {allocationRows.map((row) => (
                <div key={row.tempId} className="grid gap-3 rounded-md border p-3 md:grid-cols-[1fr_120px_auto]">
                  <div className="space-y-2">
                    <Label>Invoice ID</Label>
                    <Input value={row.invoiceId} onChange={(event) => handleAllocationChange(row.tempId, 'invoiceId', event.target.value)} placeholder="Invoice UUID" />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={row.allocatedAmount}
                      onChange={(event) => handleAllocationChange(row.tempId, 'allocatedAmount', event.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-end justify-end">
                    <Button type="button" variant="ghost" disabled={allocationRows.length === 1} onClick={() => handleRemoveAllocationRow(row.tempId)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={handleAddAllocationRow}>
                Add another invoice
              </Button>
              <Button type="submit" disabled={allocateMutation.isPending}>
                {allocateMutation.isPending ? 'Allocating…' : 'Allocate'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium text-destructive">Delete receipt</p>
            <p className="text-sm text-muted-foreground">Deletes this receipt permanently. Allocations will be removed.</p>
          </div>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteMutation.isPending ? 'Deleting…' : 'Delete receipt'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function createEmptyAllocation(): AllocationDraft {
  return {
    tempId: createTempId(),
    invoiceId: '',
    allocatedAmount: '',
  };
}
