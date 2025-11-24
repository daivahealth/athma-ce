'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InvoiceStatus, type CreateInvoiceInput } from '../types/invoice';

interface InvoiceFormProps {
  onSubmit: (payload: CreateInvoiceInput) => Promise<void> | void;
  isSubmitting?: boolean;
}

interface LineDraft {
  tempId: string;
  chargeId: string;
  description: string;
  quantity: string;
  unitPrice: string;
  lineDiscount: string;
}

const createTempId = () => `line-${Math.random().toString(36).slice(2)}-${Date.now()}`;

const createEmptyLine = (): LineDraft => ({
  tempId: createTempId(),
  chargeId: '',
  description: '',
  quantity: '1',
  unitPrice: '0',
  lineDiscount: '0',
});

export function InvoiceForm({ onSubmit, isSubmitting }: InvoiceFormProps) {
  const [patientId, setPatientId] = useState('');
  const [encounterId, setEncounterId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('AED');
  const [amountPaid, setAmountPaid] = useState('0');
  const [lines, setLines] = useState<LineDraft[]>([createEmptyLine()]);

  const computed = useMemo(() => {
    const parsedLines = lines.map((line, index) => {
      const quantity = Number(line.quantity) || 0;
      const unitPrice = Number(line.unitPrice) || 0;
      const discount = Number(line.lineDiscount) || 0;
      const gross = quantity * unitPrice;
      const amount = Math.max(gross - discount, 0);
      return {
        lineNumber: index + 1,
        chargeId: line.chargeId.trim(),
        description: line.description.trim() || undefined,
        quantity,
        unitPrice,
        lineDiscount: discount,
        lineAmount: amount,
      };
    });

    const grossAmount = parsedLines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
    const totalDiscounts = parsedLines.reduce((sum, line) => sum + (line.lineDiscount || 0), 0);
    const netAmount = grossAmount - totalDiscounts;
    const paid = Number(amountPaid) || 0;
    const balanceDue = netAmount - paid;

    return { parsedLines, grossAmount, totalDiscounts, netAmount, paid, balanceDue };
  }, [lines, amountPaid]);

  const handleLineChange = (tempId: string, field: keyof LineDraft, value: string) => {
    setLines((prev) => prev.map((line) => (line.tempId === tempId ? { ...line, [field]: value } : line)));
  };

  const handleRemoveLine = (tempId: string) => {
    setLines((prev) => (prev.length === 1 ? prev : prev.filter((line) => line.tempId !== tempId)));
  };

  const handleAddLine = () => {
    setLines((prev) => [...prev, createEmptyLine()]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!patientId.trim() || !invoiceNumber.trim()) {
      return;
    }

    const payload: CreateInvoiceInput = {
      patientId: patientId.trim(),
      encounterId: encounterId.trim() || undefined,
      invoiceNumber: invoiceNumber.trim(),
      invoiceDate: invoiceDate ? new Date(invoiceDate).toISOString() : undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      grossAmount: computed.grossAmount,
      totalDiscounts: computed.totalDiscounts,
      netAmount: computed.netAmount,
      amountPaid: computed.paid,
      balanceDue: computed.balanceDue,
      status:
        computed.balanceDue <= 0
          ? InvoiceStatus.PAID
          : computed.paid > 0
          ? InvoiceStatus.PARTIAL
          : InvoiceStatus.UNPAID,
      currency,
      invoiceLines: computed.parsedLines.map((line) => ({
        chargeId: line.chargeId,
        lineNumber: line.lineNumber,
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        lineDiscount: line.lineDiscount,
      })),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Patient ID *</Label>
            <Input value={patientId} onChange={(event) => setPatientId(event.target.value)} required placeholder="Patient UUID" />
          </div>
          <div className="space-y-2">
            <Label>Encounter ID</Label>
            <Input value={encounterId} onChange={(event) => setEncounterId(event.target.value)} placeholder="Encounter UUID" />
          </div>
          <div className="space-y-2">
            <Label>Invoice number *</Label>
            <Input value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} required placeholder="INV-2024-001" />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input value={currency} onChange={(event) => setCurrency(event.target.value)} placeholder="AED" />
          </div>
          <div className="space-y-2">
            <Label>Invoice date</Label>
            <Input type="date" value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Due date</Label>
            <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Amount paid</Label>
            <Input type="number" step="0.01" value={amountPaid} onChange={(event) => setAmountPaid(event.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle>Invoice lines</CardTitle>
          <Button type="button" variant="outline" onClick={handleAddLine}>
            Add line
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Charge ID *</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Line total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((line) => {
                const quantity = Number(line.quantity) || 0;
                const unitPrice = Number(line.unitPrice) || 0;
                const discount = Number(line.lineDiscount) || 0;
                const total = Math.max(quantity * unitPrice - discount, 0);
                return (
                  <TableRow key={line.tempId}>
                    <TableCell className="min-w-[140px]">
                      <Input
                        value={line.chargeId}
                        onChange={(event) => handleLineChange(line.tempId, 'chargeId', event.target.value)}
                        placeholder="Charge UUID"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={line.description}
                        onChange={(event) => handleLineChange(line.tempId, 'description', event.target.value)}
                        placeholder="Description"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="1"
                        min="0"
                        value={line.quantity}
                        onChange={(event) => handleLineChange(line.tempId, 'quantity', event.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={line.unitPrice}
                        onChange={(event) => handleLineChange(line.tempId, 'unitPrice', event.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={line.lineDiscount}
                        onChange={(event) => handleLineChange(line.tempId, 'lineDiscount', event.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{total.toFixed(2)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button type="button" variant="ghost" disabled={lines.length === 1} onClick={() => handleRemoveLine(line.tempId)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="grid gap-2 rounded-md border p-4 text-sm">
            <div className="flex items-center justify-between">
              <span>Gross amount</span>
              <span className="font-mono">{computed.grossAmount.toFixed(2)} {currency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total discounts</span>
              <span className="font-mono">{computed.totalDiscounts.toFixed(2)} {currency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Net amount</span>
              <span className="font-mono font-semibold">{computed.netAmount.toFixed(2)} {currency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Amount paid</span>
              <span className="font-mono">{computed.paid.toFixed(2)} {currency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Balance due</span>
              <span className="font-mono font-semibold">{computed.balanceDue.toFixed(2)} {currency}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Create invoice'}
        </Button>
      </div>
    </form>
  );
}
