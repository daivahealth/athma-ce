'use client';

import { useEffect, useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import type { PayerContractAdjustment } from '../types/payer-contract';
import type { CreatePayerContractAdjustmentInput } from '../types/payer-contract';

interface PayerContractAdjustmentFormProps {
  contractId: string;
  initialValues?: Partial<PayerContractAdjustment>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (payload: CreatePayerContractAdjustmentInput) => Promise<void> | void;
  onCancel?: () => void;
}

export function PayerContractAdjustmentForm({
  contractId,
  initialValues,
  submitLabel = 'Save adjustment',
  isSubmitting,
  onSubmit,
  onCancel,
}: PayerContractAdjustmentFormProps) {
  const hydratedState = useMemo(() => ({
    serviceGroup: initialValues?.serviceGroup ?? '',
    billingItemId: initialValues?.billingItemId ?? '',
    feeScheduleItemId: initialValues?.feeScheduleItemId ?? '',
    multiplier: initialValues?.multiplier != null ? String(initialValues.multiplier) : '',
    discountPct: initialValues?.discountPct != null ? String(initialValues.discountPct) : '',
    maxAllowedAmount: initialValues?.maxAllowedAmount != null ? String(initialValues.maxAllowedAmount) : '',
    minAllowedAmount: initialValues?.minAllowedAmount != null ? String(initialValues.minAllowedAmount) : '',
    priority: initialValues?.priority != null ? String(initialValues.priority) : '100',
    effectiveFrom: initialValues?.effectiveFrom ? initialValues.effectiveFrom.slice(0, 10) : '',
    effectiveTo: initialValues?.effectiveTo ? initialValues.effectiveTo.slice(0, 10) : '',
    isExclusion: initialValues?.isExclusion ?? false,
    notes: initialValues?.notes ?? '',
  }), [initialValues]);

  const [form, setForm] = useState(hydratedState);
  useEffect(() => setForm(hydratedState), [hydratedState]);

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: CreatePayerContractAdjustmentInput = {
      contractId,
      serviceGroup: form.serviceGroup.trim() || undefined,
      billingItemId: form.billingItemId.trim() || undefined,
      feeScheduleItemId: form.feeScheduleItemId.trim() || undefined,
      isExclusion: Boolean(form.isExclusion),
      notes: form.notes.trim() || undefined,
    };

    if (form.multiplier) payload.multiplier = Number(form.multiplier);
    if (form.discountPct) payload.discountPct = Number(form.discountPct);
    if (form.maxAllowedAmount) payload.maxAllowedAmount = Number(form.maxAllowedAmount);
    if (form.minAllowedAmount) payload.minAllowedAmount = Number(form.minAllowedAmount);
    if (form.priority) payload.priority = Number(form.priority);
    if (form.effectiveFrom) payload.effectiveFrom = new Date(form.effectiveFrom).toISOString();
    if (form.effectiveTo) payload.effectiveTo = new Date(form.effectiveTo).toISOString();

    await onSubmit(payload);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Service group</Label>
          <Input value={form.serviceGroup} onChange={(event) => handleChange('serviceGroup', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Billing item ID</Label>
          <Input value={form.billingItemId} onChange={(event) => handleChange('billingItemId', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Fee schedule item ID</Label>
          <Input value={form.feeScheduleItemId} onChange={(event) => handleChange('feeScheduleItemId', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Multiplier</Label>
          <Input type="number" step="0.01" value={form.multiplier} onChange={(event) => handleChange('multiplier', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Discount %</Label>
          <Input type="number" step="0.1" value={form.discountPct} onChange={(event) => handleChange('discountPct', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Max allowed</Label>
          <Input type="number" step="0.01" value={form.maxAllowedAmount} onChange={(event) => handleChange('maxAllowedAmount', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Min allowed</Label>
          <Input type="number" step="0.01" value={form.minAllowedAmount} onChange={(event) => handleChange('minAllowedAmount', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Input type="number" value={form.priority} onChange={(event) => handleChange('priority', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Effective from</Label>
          <Input type="date" value={form.effectiveFrom} onChange={(event) => handleChange('effectiveFrom', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Effective to</Label>
          <Input type="date" value={form.effectiveTo} onChange={(event) => handleChange('effectiveTo', event.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-md border px-4 py-3">
        <div>
          <p className="font-medium">Exclusion</p>
          <p className="text-sm text-muted-foreground">Exclude matching services from payment</p>
        </div>
        <Switch checked={form.isExclusion} onCheckedChange={(checked) => handleChange('isExclusion', checked)} />
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Input value={form.notes} onChange={(event) => handleChange('notes', event.target.value)} />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
