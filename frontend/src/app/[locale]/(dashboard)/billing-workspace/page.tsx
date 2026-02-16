'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { CreditCard } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useInvoices } from '@/modules/rcm/hooks/use-invoices';
import { useReceipts, useCreateReceipt } from '@/modules/rcm/hooks/use-receipts';
import { InvoiceStatus } from '@/modules/rcm/types/invoice';
import { PaymentMethod, type CreateReceiptInput } from '@/modules/rcm/types/receipt';
import { useToast } from '@/components/ui/use-toast';

const statusVariant: Record<InvoiceStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [InvoiceStatus.UNPAID]: 'destructive',
  [InvoiceStatus.PARTIAL]: 'outline',
  [InvoiceStatus.PAID]: 'default',
  [InvoiceStatus.CANCELLED]: 'secondary',
};

const statusLabel: Record<InvoiceStatus, string> = {
  [InvoiceStatus.UNPAID]: 'Unpaid',
  [InvoiceStatus.PARTIAL]: 'Partially paid',
  [InvoiceStatus.PAID]: 'Paid',
  [InvoiceStatus.CANCELLED]: 'Cancelled',
};

const paymentLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Cash',
  [PaymentMethod.CARD]: 'Card',
  [PaymentMethod.UPI]: 'UPI',
  [PaymentMethod.BANK_TRANSFER]: 'Bank transfer',
  [PaymentMethod.WALLET]: 'Wallet',
};

const formatCurrency = (value: number | string | null | undefined, currency: string) =>
  `${Number(value ?? 0).toFixed(2)} ${currency}`;

export default function BillingWorkspacePage() {
  const toast = useToast();

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      patientId: selectedPatient?.id,
      status: statusFilter === 'all' ? undefined : statusFilter,
    }),
    [selectedPatient?.id, statusFilter],
  );

  const { data: invoices, isLoading: isInvoicesLoading, error: invoiceError } = useInvoices(filters);
  const { data: receipts } = useReceipts({ patientId: selectedPatient?.id });
  const createReceipt = useCreateReceipt();

  const invoiceList = useMemo(() => invoices ?? [], [invoices]);

  const selectedInvoice = invoiceList.find((invoice) => invoice.id === selectedInvoiceId) ?? invoiceList[0] ?? null;

  const relatedReceipts = useMemo(() => {
    if (!selectedInvoice?.patientId) return [];
    return (receipts ?? []).filter((receipt) => receipt.patientId === selectedInvoice.patientId);
  }, [receipts, selectedInvoice?.patientId]);

  const [receiptForm, setReceiptForm] = useState({
    amount: '',
    paymentMethod: PaymentMethod.CASH,
    txnReference: '',
    notes: '',
  });

  const handleReceiptChange = (field: string, value: string) => {
    setReceiptForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCollectPayment = async () => {
    if (!selectedInvoice) return;
    const amount = Number(receiptForm.amount);
    if (!amount || amount <= 0) {
      toast({ variant: 'destructive', title: 'Enter an amount to collect.' });
      return;
    }

    const payload: CreateReceiptInput = {
      patientId: selectedInvoice.patientId,
      invoiceId: selectedInvoice.id,
      receiptNumber: `RCPT-${Date.now()}`,
      receiptDate: new Date().toISOString(),
      amount,
      currency: selectedInvoice.currency,
      paymentMethod: receiptForm.paymentMethod,
      txnReference: receiptForm.txnReference || undefined,
      notes: receiptForm.notes || undefined,
      allocations: [
        {
          invoiceId: selectedInvoice.id,
          allocatedAmount: amount,
        },
      ],
    };

    await createReceipt.mutateAsync(payload);
    toast({ title: 'Payment recorded', description: 'Receipt created and allocated.' });
    setReceiptForm({ amount: '', paymentMethod: PaymentMethod.CASH, txnReference: '', notes: '' });
  };

  // Get patient display name from invoice
  const getPatientDisplayName = (invoice: any) => {
    if (invoice.patientDisplay) {
      return invoice.patientDisplay.displayName || `${invoice.patientDisplay.firstName} ${invoice.patientDisplay.lastName}`;
    }
    if (invoice.patientDisplayName) {
      return invoice.patientDisplayName;
    }
    return invoice.patientId.slice(0, 8) + '…';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing workspace</h1>
        <p className="text-muted-foreground">Manage invoices and collect payments side by side.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <div className="mt-3 flex flex-col gap-3">
              <PatientSearchSelect
                label="Search Patient"
                selectedPatient={selectedPatient}
                onSelect={(patient) => {
                  setSelectedPatient(patient);
                  setSelectedInvoiceId(null);
                }}
                onClear={() => {
                  setSelectedPatient(null);
                  setSelectedInvoiceId(null);
                }}
                placeholder="Search by name, MRN, or mobile"
              />
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | InvoiceStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {Object.values(InvoiceStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabel[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-auto">
            {!selectedPatient ? (
              <p className="text-sm text-muted-foreground">Search and select a patient to view their invoices.</p>
            ) : invoiceError ? (
              <p className="text-sm text-destructive">Failed to load invoices: {(invoiceError as Error).message}</p>
            ) : isInvoicesLoading ? (
              <div className="h-32 animate-pulse rounded bg-muted" />
            ) : invoiceList.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invoices found for this patient.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceList.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className={`cursor-pointer ${selectedInvoice?.id === invoice.id ? 'bg-muted/50' : ''}`}
                      onClick={() => setSelectedInvoiceId(invoice.id)}
                    >
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{formatCurrency(invoice.netAmount, invoice.currency)}</TableCell>
                      <TableCell>{formatCurrency(invoice.balanceDue, invoice.currency)}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[invoice.status]}>{statusLabel[invoice.status]}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {selectedInvoice ? (
            <Card>
              <CardHeader>
                <CardTitle>Invoice detail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Invoice #{selectedInvoice.invoiceNumber}</p>
                    <p className="text-2xl font-semibold">{formatCurrency(selectedInvoice.netAmount, selectedInvoice.currency)}</p>
                  </div>
                  <Badge variant={statusVariant[selectedInvoice.status]} className="ml-auto">
                    {statusLabel[selectedInvoice.status]}
                  </Badge>
                </div>
                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">Patient</p>
                    <p className="font-medium">{getPatientDisplayName(selectedInvoice)}</p>
                    {selectedInvoice.patientDisplay?.mrn && (
                      <p className="text-xs text-muted-foreground">MRN: {selectedInvoice.patientDisplay.mrn}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Balance due</p>
                    <p className="font-semibold">{formatCurrency(selectedInvoice.balanceDue, selectedInvoice.currency)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Invoice date</p>
                    <p>{format(new Date(selectedInvoice.invoiceDate), 'PPP')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Recently linked receipts</h3>
                  {relatedReceipts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No receipts recorded for this patient.</p>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Receipt #</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {relatedReceipts.slice(0, 5).map((receipt) => (
                            <TableRow key={receipt.id}>
                              <TableCell>{receipt.receiptNumber}</TableCell>
                              <TableCell>{formatCurrency(receipt.amount, receipt.currency)}</TableCell>
                              <TableCell>{paymentLabels[receipt.paymentMethod]}</TableCell>
                              <TableCell>{format(new Date(receipt.receiptDate), 'PP')}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {selectedPatient ? 'Select an invoice to view details.' : 'Search and select a patient first.'}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Collect payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedInvoice ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={receiptForm.amount}
                        onChange={(event) => handleReceiptChange('amount', event.target.value)}
                        placeholder={selectedInvoice.balanceDue ? Number(selectedInvoice.balanceDue).toFixed(2) : '0.00'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment method</Label>
                      <Select
                        value={receiptForm.paymentMethod}
                        onValueChange={(value) => handleReceiptChange('paymentMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PaymentMethod).map((method) => (
                            <SelectItem key={method} value={method}>
                              {paymentLabels[method]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Reference</Label>
                    <Input
                      value={receiptForm.txnReference}
                      onChange={(event) => handleReceiptChange('txnReference', event.target.value)}
                      placeholder="POS TXN ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      value={receiptForm.notes}
                      onChange={(event) => handleReceiptChange('notes', event.target.value)}
                      placeholder="Optional notes"
                    />
                  </div>
                  <Button onClick={handleCollectPayment} disabled={createReceipt.isPending}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {createReceipt.isPending ? 'Recording…' : 'Record payment'}
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selectedPatient ? 'Select an invoice to collect a payment.' : 'Search and select a patient first.'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
