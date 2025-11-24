'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, CreditCard, Slash } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import {
  useInvoice,
  useUpdateInvoiceStatus,
  useRecordInvoicePayment,
  useCancelInvoice,
} from '@/modules/rcm/hooks/use-invoices';
import { InvoiceStatus } from '@/modules/rcm/types/invoice';

const statusVariant: Record<InvoiceStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [InvoiceStatus.UNPAID]: 'destructive',
  [InvoiceStatus.PARTIAL]: 'outline',
  [InvoiceStatus.PAID]: 'default',
  [InvoiceStatus.CANCELLED]: 'secondary',
};

const statusLabel: Record<InvoiceStatus, string> = {
  [InvoiceStatus.UNPAID]: 'Unpaid',
  [InvoiceStatus.PARTIAL]: 'Partial',
  [InvoiceStatus.PAID]: 'Paid',
  [InvoiceStatus.CANCELLED]: 'Cancelled',
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const toast = useToast();
  const locale = params.locale as string;
  const invoiceId = params.id as string;

  const { data: invoice, isLoading, error } = useInvoice(invoiceId);
  const updateStatusMutation = useUpdateInvoiceStatus();
  const paymentMutation = useRecordInvoicePayment();
  const cancelMutation = useCancelInvoice();

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [statusValue, setStatusValue] = useState<InvoiceStatus>(InvoiceStatus.UNPAID);

  useEffect(() => {
    if (invoice) {
      setStatusValue(invoice.status);
    }
  }, [invoice]);

  const handleStatusUpdate = async () => {
    if (!invoice) return;
    await updateStatusMutation.mutateAsync({ id: invoice.id, payload: { status: statusValue } });
    toast({ title: 'Invoice status updated' });
  };

  const handleRecordPayment = async () => {
    if (!invoice) return;
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      toast({ variant: 'destructive', title: 'Enter a payment amount' });
      return;
    }
    await paymentMutation.mutateAsync({ id: invoice.id, payload: { amount, reference: paymentReference || undefined } });
    setPaymentAmount('');
    setPaymentReference('');
    toast({ title: 'Payment recorded' });
  };

  const handleCancel = async () => {
    if (!invoice) return;
    if (!window.confirm('Cancel this invoice? (Only unpaid invoices can be cancelled)')) return;
    await cancelMutation.mutateAsync(invoice.id);
    toast({ title: 'Invoice cancelled' });
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !invoice) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load invoice: ${(error as Error).message}` : 'Invoice not found.'}
      </div>
    );
  }

  const formatMoney = (value: number) => `${value.toFixed(2)} ${invoice.currency}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/invoices`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to invoices
          </Link>
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Invoice #{invoice.invoiceNumber}</p>
          <h1 className="text-3xl font-bold">{formatMoney(invoice.netAmount)}</h1>
        </div>
        <Badge variant={statusVariant[invoice.status]} className="ml-auto">
          {statusLabel[invoice.status]}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm" title={invoice.patientId}>
              {invoice.patientId}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Invoice date</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{format(new Date(invoice.invoiceDate), 'PPP')}</p>
            {invoice.dueDate && <p className="text-xs text-muted-foreground">Due {format(new Date(invoice.dueDate), 'PPP')}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Balance due</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{formatMoney(invoice.balanceDue)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span>Gross amount</span>
              <span className="font-mono">{formatMoney(invoice.grossAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discounts</span>
              <span className="font-mono">{formatMoney(invoice.totalDiscounts)}</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span>Net amount</span>
              <span className="font-mono">{formatMoney(invoice.netAmount)}</span>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span>Amount paid</span>
              <span className="font-mono">{formatMoney(invoice.amountPaid)}</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span>Balance due</span>
              <span className="font-mono">{formatMoney(invoice.balanceDue)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice lines</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.invoiceLines?.map((line) => (
                <TableRow key={line.id ?? line.lineNumber}>
                  <TableCell>{line.lineNumber}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{line.description || 'Charge'}</div>
                    <p className="text-xs text-muted-foreground">Charge: {line.chargeId}</p>
                  </TableCell>
                  <TableCell>{line.quantity}</TableCell>
                  <TableCell>{formatMoney(line.unitPrice)}</TableCell>
                  <TableCell>{formatMoney(line.lineDiscount ?? 0)}</TableCell>
                  <TableCell className="text-right font-mono">{formatMoney(line.lineAmount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Update status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={statusValue} onValueChange={(value) => setStatusValue(value as InvoiceStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(InvoiceStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabel[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleStatusUpdate} disabled={updateStatusMutation.isPending}>
              {updateStatusMutation.isPending ? 'Updating...' : 'Update status'}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Record payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Reference</Label>
              <Input value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} placeholder="Receipt / transaction" />
            </div>
            <Button onClick={handleRecordPayment} disabled={paymentMutation.isPending}>
              <CreditCard className="mr-2 h-4 w-4" />
              {paymentMutation.isPending ? 'Saving...' : 'Record payment'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium text-destructive">Cancel invoice</p>
            <p className="text-sm text-muted-foreground">Cancelling reopens associated charges and marks this invoice as cancelled.</p>
          </div>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={cancelMutation.isPending || invoice.status === InvoiceStatus.CANCELLED}
          >
            <Slash className="mr-2 h-4 w-4" />
            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel invoice'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
