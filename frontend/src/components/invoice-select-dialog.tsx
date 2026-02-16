'use client';

import { useState } from 'react';
import { FileText, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogCloseButton,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInvoices } from '@/modules/rcm/hooks/use-invoices';
import type { Invoice, InvoiceStatus } from '@/modules/rcm/types/invoice';

interface InvoiceSelectDialogProps {
  label?: string;
  patientId?: string;
  selectedInvoice: Invoice | null;
  onSelect: (invoice: Invoice) => void;
  onClear: () => void;
  disabled?: boolean;
}

const statusColors: Record<InvoiceStatus | string, string> = {
  unpaid: 'bg-yellow-500/10 text-yellow-500',
  partial: 'bg-orange-500/10 text-orange-500',
  paid: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatAmount(amount: number | string, currency: string): string {
  return `${Number(amount).toFixed(2)} ${currency}`;
}

export function InvoiceSelectDialog({
  label = 'Invoice',
  patientId,
  selectedInvoice,
  onSelect,
  onClear,
  disabled = false,
}: InvoiceSelectDialogProps) {
  const [open, setOpen] = useState(false);

  const { data: invoices, isLoading } = useInvoices(
    patientId ? { patientId } : undefined,
  );

  const handleSelect = (invoice: Invoice) => {
    onSelect(invoice);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {!selectedInvoice ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start text-muted-foreground"
              disabled={disabled}
            >
              <FileText className="mr-2 h-4 w-4" />
              {patientId ? 'Select invoice...' : 'Select a patient first'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogCloseButton />
            <DialogHeader>
              <DialogTitle>Select Invoice</DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-auto mt-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Loading invoices...
                </p>
              ) : !invoices || invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  {patientId
                    ? 'No invoices found for this patient.'
                    : 'Please select a patient first.'}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Net Amount</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Balance Due</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow
                        key={invoice.id}
                        className="cursor-pointer"
                        onClick={() => handleSelect(invoice)}
                      >
                        <TableCell className="font-medium">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={statusColors[invoice.status] || ''}
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatAmount(invoice.netAmount, invoice.currency)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatAmount(invoice.amountPaid, invoice.currency)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatAmount(invoice.balanceDue, invoice.currency)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelect(invoice);
                            }}
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/30 p-3 text-sm">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(selectedInvoice.invoiceDate)} &middot;{' '}
                <Badge
                  variant="secondary"
                  className={`${statusColors[selectedInvoice.status] || ''} text-xs`}
                >
                  {selectedInvoice.status}
                </Badge>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Net: {formatAmount(selectedInvoice.netAmount, selectedInvoice.currency)}{' '}
                &middot; Balance: {formatAmount(selectedInvoice.balanceDue, selectedInvoice.currency)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClear}
            disabled={disabled}
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
