'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { PatientSearchSelect } from '@/components/patient-search-select';

import { useCreateRefund, useRefundStats } from '@/modules/rcm/hooks/use-refunds';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';
import { RefundMethod } from '@/modules/rcm/types/refund';
import type { CreateRefundInput } from '@/modules/rcm/types/refund';
import { formatDocumentNumber } from '@/modules/rcm/utils/format-document-number';

const methodLabels: Record<string, string> = {
  [RefundMethod.CASH]: 'Cash',
  [RefundMethod.CARD_REVERSAL]: 'Card reversal',
  [RefundMethod.BANK_TRANSFER]: 'Bank transfer',
  [RefundMethod.CHEQUE]: 'Cheque',
  [RefundMethod.WALLET]: 'Wallet',
  [RefundMethod.OTHER]: 'Other',
};

export default function NewRefundPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();

  const createMutation = useCreateRefund();
  const { data: currencyConfig } = useResolveConfig('finance.currency');
  const { data: refundFormatConfig } = useResolveConfig('finance.refund_number_format');
  const { data: refundPrefixConfig } = useResolveConfig('finance.refund_prefix');
  const { data: refundStartConfig } = useResolveConfig('finance.refund_start_number');
  const { data: refundStats } = useRefundStats();

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [baseCurrency, setBaseCurrency] = useState('AED');

  const [form, setForm] = useState({
    receiptId: '',
    refundDate: new Date().toISOString().slice(0, 10),
    amount: '',
    refundMethod: RefundMethod.CASH,
    txnReference: '',
    reason: '',
    notes: '',
  });

  // Auto-generate refund number from configuration
  const refundNumber = useMemo(() => {
    const fmt = refundFormatConfig?.value;
    const prefix = refundPrefixConfig?.value;
    const startNumber = refundStartConfig?.value;
    const total = refundStats?.total;

    if (
      typeof fmt !== 'string' ||
      typeof prefix !== 'string' ||
      typeof startNumber !== 'number' ||
      typeof total !== 'number'
    ) {
      return null;
    }

    return formatDocumentNumber(fmt, prefix, startNumber, total);
  }, [refundFormatConfig, refundPrefixConfig, refundStartConfig, refundStats]);

  useEffect(() => {
    const resolvedCurrency = currencyConfig?.value;
    if (typeof resolvedCurrency === 'string' && resolvedCurrency.trim()) {
      setBaseCurrency(resolvedCurrency);
    }
  }, [currencyConfig]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedPatient) {
      toast({ variant: 'destructive', title: 'Please select a patient' });
      return;
    }

    if (!refundNumber) {
      toast({ variant: 'destructive', title: 'Refund number configuration not ready' });
      return;
    }

    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      toast({ variant: 'destructive', title: 'Amount must be greater than 0' });
      return;
    }

    try {
      const payload: CreateRefundInput = {
        patientId: selectedPatient.id,
        receiptId: form.receiptId.trim() || undefined,
        refundNumber,
        refundDate: form.refundDate ? new Date(form.refundDate).toISOString() : undefined,
        amount,
        currency: baseCurrency,
        refundMethod: form.refundMethod,
        txnReference: form.txnReference.trim() || undefined,
        reason: form.reason.trim() || undefined,
        notes: form.notes.trim() || undefined,
        mrn: selectedPatient.mrn,
        patientDisplayName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      };

      const refund = await createMutation.mutateAsync(payload);
      toast({
        title: 'Refund created',
        description: `Refund ${refund.refundNumber} created successfully`,
      });
      router.push(`/${locale}/revenue-cycle/refunds/${refund.id}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to create refund',
        description: (error as Error).message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/revenue-cycle/refunds`} aria-label="Back to refunds">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Refund</h1>
          <p className="text-sm text-muted-foreground">Create a new refund request</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <PatientSearchSelect
              required
              selectedPatient={selectedPatient}
              onSelect={(patient) => setSelectedPatient(patient)}
              onClear={() => setSelectedPatient(null)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Refund Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="refundNumber">Refund Number</Label>
                <Input
                  id="refundNumber"
                  value={refundNumber ?? 'Loading...'}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refundDate">Refund Date</Label>
                <Input
                  id="refundDate"
                  type="date"
                  value={form.refundDate}
                  onChange={(e) => handleChange('refundDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receiptId">Receipt ID (optional)</Label>
                <Input
                  id="receiptId"
                  placeholder="Link to a receipt (UUID)"
                  value={form.receiptId}
                  onChange={(e) => handleChange('receiptId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount ({baseCurrency}) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refundMethod">Refund Method *</Label>
                <Select
                  value={form.refundMethod}
                  onValueChange={(value) => handleChange('refundMethod', value)}
                >
                  <SelectTrigger id="refundMethod">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RefundMethod).map((method) => (
                      <SelectItem key={method} value={method}>
                        {methodLabels[method]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="txnReference">Transaction Reference</Label>
                <Input
                  id="txnReference"
                  placeholder="Transaction reference"
                  value={form.txnReference}
                  onChange={(e) => handleChange('txnReference', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Refund</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for this refund..."
                rows={3}
                value={form.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes..."
                rows={2}
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href={`/${locale}/revenue-cycle/refunds`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={createMutation.isPending || !refundNumber}>
            {createMutation.isPending ? 'Creating...' : 'Create Refund'}
          </Button>
        </div>
      </form>
    </div>
  );
}
