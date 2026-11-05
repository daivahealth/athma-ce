'use client';

import { useEffect, useMemo, useState } from 'react';
import { Banknote, Plus, Split, UserRound } from 'lucide-react';
import { FIELD_CONTROL, FormActions, FormSection } from '@/components/forms/form-layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PatientSearchSelect } from '@/components/patient-search-select';
import type { Receipt } from '../types/receipt';
import { PaymentMethod, type CreateReceiptInput } from '../types/receipt';
import { usePatient } from '@/modules/clinical/hooks/use-patients';
import type { Patient } from '@/modules/clinical/types/patient';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';
import { useReceiptStats } from '../hooks/use-receipts';
import { formatDocumentNumber } from '../utils/format-document-number';

interface ReceiptFormProps {
  initialValues?: Partial<Receipt>;
  submitLabel?: string;
  isSubmitting?: boolean;
  showCurrencyField?: boolean;
  onSubmit: (payload: CreateReceiptInput) => Promise<void> | void;
  onCancel?: () => void;
}

interface AllocationDraft {
  tempId: string;
  invoiceId: string;
  allocatedAmount: string;
}

const startLabel = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
const createTempId = () => `alloc-${Math.random().toString(36).slice(2)}-${Date.now()}`;

const defaultState = {
  patientId: '',
  invoiceId: '',
  receiptNumber: '',
  receiptDate: new Date().toISOString().slice(0, 10),
  paidAmount: '',
  paidCurrency: 'AED',
  fxRateToBase: '1',
  paymentMethod: PaymentMethod.CASH,
  txnReference: '',
  notes: '',
};

export function ReceiptForm({
  initialValues,
  submitLabel = 'Save receipt',
  isSubmitting,
  showCurrencyField = true,
  onSubmit,
  onCancel,
}: ReceiptFormProps) {
  const hydratedState = useMemo(() => {
    if (!initialValues) return defaultState;
    return {
      patientId: initialValues.patientId ?? '',
      invoiceId: initialValues.invoiceId ?? '',
      receiptNumber: initialValues.receiptNumber ?? '',
      receiptDate: initialValues.receiptDate ? initialValues.receiptDate.slice(0, 10) : '',
      paidAmount:
        initialValues.paidAmount != null
          ? String(initialValues.paidAmount)
          : initialValues.amount != null
            ? String(initialValues.amount)
            : '',
      paidCurrency: initialValues.paidCurrency ?? initialValues.currency ?? 'AED',
      fxRateToBase: initialValues.fxRateToBase != null ? String(initialValues.fxRateToBase) : '1',
      paymentMethod: initialValues.paymentMethod ?? PaymentMethod.CASH,
      txnReference: initialValues.txnReference ?? '',
      notes: initialValues.notes ?? '',
    };
  }, [initialValues]);

  const hydratedAllocations = useMemo<AllocationDraft[]>(() => {
    if (!initialValues?.allocations?.length) return [createEmptyAllocationDraft()];
    return initialValues.allocations.map((allocation) => ({
      tempId: createTempId(),
      invoiceId: allocation.invoiceId,
      allocatedAmount: String(allocation.allocatedAmount),
    }));
  }, [initialValues]);

  const [form, setForm] = useState(hydratedState);
  const [allocations, setAllocations] = useState<AllocationDraft[]>(hydratedAllocations);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [baseCurrency, setBaseCurrency] = useState('AED');
  const [paidCurrencyDirty, setPaidCurrencyDirty] = useState(false);

  const { data: patientDetails } = usePatient(form.patientId);
  const { data: currencyConfig } = useResolveConfig('finance.currency');
  const { data: receiptFormatConfig } = useResolveConfig('finance.receipt_number_format');
  const { data: receiptPrefixConfig } = useResolveConfig('finance.receipt_prefix');
  const { data: receiptStartConfig } = useResolveConfig('finance.receipt_start_number');
  const { data: receiptStats } = useReceiptStats();
  useEffect(() => {
    setForm(hydratedState);
  }, [hydratedState]);

  useEffect(() => {
    const resolvedCurrency = currencyConfig?.value;
    if (typeof resolvedCurrency === 'string' && resolvedCurrency.trim()) {
      setBaseCurrency(resolvedCurrency);
      if (!paidCurrencyDirty) {
        setForm((prev) => ({ ...prev, paidCurrency: resolvedCurrency }));
      }
    }
  }, [currencyConfig, paidCurrencyDirty]);

  useEffect(() => {
    setAllocations(hydratedAllocations);
  }, [hydratedAllocations]);

  useEffect(() => {
    if (patientDetails && !selectedPatient) {
      setSelectedPatient(patientDetails);
    }
  }, [patientDetails, selectedPatient]);

  function createEmptyAllocationDraft(): AllocationDraft {
    return {
      tempId: createTempId(),
      invoiceId: '',
      allocatedAmount: '',
    };
  }

  const handleChange = (field: keyof typeof form, value: string | PaymentMethod) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAllocationChange = (tempId: string, field: keyof AllocationDraft, value: string) => {
    setAllocations((prev) =>
      prev.map((allocation) =>
        allocation.tempId === tempId ? { ...allocation, [field]: value } : allocation,
      ),
    );
  };

  const handleAddAllocation = () => {
    setAllocations((prev) => [...prev, createEmptyAllocationDraft()]);
  };

  const handleRemoveAllocation = (tempId: string) => {
    setAllocations((prev) =>
      prev.length === 1 ? prev : prev.filter((allocation) => allocation.tempId !== tempId),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.patientId.trim()) {
      return;
    }

    const paidCurrency = form.paidCurrency.trim().toUpperCase();
    const paidAmount = Number(form.paidAmount) || 0;
    const fxRate =
      paidCurrency && paidCurrency === baseCurrency ? 1 : Number(form.fxRateToBase) || 0;

    if (!paidCurrency || paidAmount <= 0 || fxRate <= 0) {
      return;
    }

    const baseAmount = Number((paidAmount * fxRate).toFixed(2));

    const fmt = receiptFormatConfig?.value;
    const prefix = receiptPrefixConfig?.value;
    const startNumber = receiptStartConfig?.value;
    const total = receiptStats?.total;

    if (
      typeof fmt !== 'string' ||
      typeof prefix !== 'string' ||
      typeof startNumber !== 'number' ||
      typeof total !== 'number'
    ) {
      return;
    }

    const receiptNumber = formatDocumentNumber(fmt, prefix, startNumber, total);

    const payload: CreateReceiptInput = {
      patientId: form.patientId.trim(),
      invoiceId: form.invoiceId.trim() || undefined,
      receiptNumber,
      receiptDate: form.receiptDate ? new Date(form.receiptDate).toISOString() : undefined,
      amount: baseAmount,
      currency: baseCurrency,
      paidAmount,
      paidCurrency,
      fxRateToBase: fxRate,
      paymentMethod: form.paymentMethod,
      txnReference: form.txnReference.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };

    const parsedAllocations = allocations
      .map((allocation) => ({
        invoiceId: allocation.invoiceId.trim(),
        allocatedAmount: Number(allocation.allocatedAmount) || 0,
      }))
      .filter((allocation) => allocation.invoiceId && allocation.allocatedAmount > 0);

    if (parsedAllocations.length > 0) {
      payload.allocations = parsedAllocations;
    }

    await onSubmit(payload);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <FormSection icon={UserRound} title="Patient" description="Who the payment is received from">
        <div>
          <PatientSearchSelect
            required
            selectedPatient={selectedPatient}
            onSelect={(patient) => {
              setSelectedPatient(patient);
              handleChange('patientId', patient.id);
            }}
            onClear={() => {
              setSelectedPatient(null);
              handleChange('patientId', '');
            }}
          />
        </div>
      </FormSection>

      <FormSection
        icon={Banknote}
        title="Payment"
        description="Amount, currency and how it was paid"
        contentClassName="grid gap-4 md:grid-cols-2"
      >
        <div className="space-y-2">
          <Label htmlFor="receiptInvoiceId">Invoice ID</Label>
          <Input
            id="receiptInvoiceId"
            value={form.invoiceId}
            onChange={(event) => handleChange('invoiceId', event.target.value)}
            placeholder="Invoice UUID"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="receiptDate">Receipt date</Label>
          <Input
            id="receiptDate"
            type="date"
            className={FIELD_CONTROL}
            value={form.receiptDate}
            onChange={(event) => handleChange('receiptDate', event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paidAmount">
            Paid amount<span className="ml-0.5 text-destructive">*</span>
          </Label>
          <Input
            id="paidAmount"
            type="number"
            step="0.01"
            value={form.paidAmount}
            onChange={(event) => handleChange('paidAmount', event.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paidCurrency">
            Paid currency<span className="ml-0.5 text-destructive">*</span>
          </Label>
          <Input
            id="paidCurrency"
            value={form.paidCurrency}
            onChange={(event) => {
              setPaidCurrencyDirty(true);
              handleChange('paidCurrency', event.target.value);
            }}
            placeholder={baseCurrency}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fxRateToBase">FX rate to {baseCurrency}</Label>
          <Input
            id="fxRateToBase"
            type="number"
            step="0.0001"
            min="0"
            value={
              form.paidCurrency.trim().toUpperCase() === baseCurrency ? '1' : form.fxRateToBase
            }
            onChange={(event) => handleChange('fxRateToBase', event.target.value)}
            disabled={form.paidCurrency.trim().toUpperCase() === baseCurrency}
            placeholder="1.0000"
          />
        </div>
        {showCurrencyField && (
          <div className="space-y-2">
            <Label htmlFor="baseAmount">Base amount ({baseCurrency})</Label>
            <Input
              id="baseAmount"
              value={(() => {
                const paidAmount = Number(form.paidAmount) || 0;
                const fxRate =
                  form.paidCurrency.trim().toUpperCase() === baseCurrency
                    ? 1
                    : Number(form.fxRateToBase) || 0;
                if (!paidAmount || !fxRate) return '';
                return (paidAmount * fxRate).toFixed(2);
              })()}
              readOnly
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">
            Payment method<span className="ml-0.5 text-destructive">*</span>
          </Label>
          <Select
            value={form.paymentMethod}
            onValueChange={(value) => handleChange('paymentMethod', value as PaymentMethod)}
          >
            <SelectTrigger id="paymentMethod">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(PaymentMethod).map((method) => (
                <SelectItem key={method} value={method}>
                  {startLabel(method)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="txnReference">Transaction reference</Label>
          <Input
            id="txnReference"
            value={form.txnReference}
            onChange={(event) => handleChange('txnReference', event.target.value)}
            placeholder="POS TXN ID"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="receiptNotes">Notes</Label>
          <Input
            id="receiptNotes"
            value={form.notes}
            onChange={(event) => handleChange('notes', event.target.value)}
            placeholder="Optional notes"
          />
        </div>
      </FormSection>

      <FormSection
        icon={Split}
        title="Allocations"
        description="Optional: apply this receipt to one or more invoices"
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleAddAllocation}
          >
            <Plus className="h-4 w-4" />
            Add allocation
          </Button>
        }
        contentClassName="space-y-3"
      >
        {allocations.map((allocation) => (
          <div
            key={allocation.tempId}
            className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-[1fr_160px_auto]"
          >
            <div className="space-y-2">
              <Label>Invoice ID</Label>
              <Input
                value={allocation.invoiceId}
                onChange={(event) =>
                  handleAllocationChange(allocation.tempId, 'invoiceId', event.target.value)
                }
                placeholder="Invoice UUID"
              />
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={allocation.allocatedAmount}
                onChange={(event) =>
                  handleAllocationChange(allocation.tempId, 'allocatedAmount', event.target.value)
                }
                placeholder="0.00"
              />
            </div>
            <div className="flex items-end justify-end">
              <Button
                type="button"
                variant="ghost"
                disabled={allocations.length === 1}
                onClick={() => handleRemoveAllocation(allocation.tempId)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </FormSection>

      <FormActions submitLabel={submitLabel} busy={isSubmitting} onCancel={onCancel} />
    </form>
  );
}
