'use client';

import { useEffect, useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { FeeScheduleItem } from '../types/fee-schedule';
import { FeeScheduleCodeType, type CreateFeeScheduleItemInput } from '../types/fee-schedule';

interface FeeScheduleItemFormProps {
  feeScheduleId: string;
  initialValues?: Partial<FeeScheduleItem>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (payload: CreateFeeScheduleItemInput) => Promise<void> | void;
  onCancel?: () => void;
}

export function FeeScheduleItemForm({ feeScheduleId, initialValues, submitLabel = 'Save item', isSubmitting, onSubmit, onCancel }: FeeScheduleItemFormProps) {
  const hydratedState = useMemo(() => ({
    code: initialValues?.code ?? '',
    codeType: initialValues?.codeType ?? FeeScheduleCodeType.CPT,
    baseAmount: initialValues?.baseAmount != null ? String(initialValues.baseAmount) : '',
    currency: initialValues?.currency ?? 'AED',
    unit: initialValues?.unit ?? '',
    multiplier: initialValues?.multiplier != null ? String(initialValues.multiplier) : '',
    discountPct: initialValues?.discountPct != null ? String(initialValues.discountPct) : '',
    maxAllowedAmount: initialValues?.maxAllowedAmount != null ? String(initialValues.maxAllowedAmount) : '',
    serviceGroup: initialValues?.serviceGroup ?? '',
    priority: initialValues?.priority != null ? String(initialValues.priority) : '100',
  }), [initialValues]);

  const [form, setForm] = useState(hydratedState);
  useEffect(() => setForm(hydratedState), [hydratedState]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.code.trim()) return;
    const payload: CreateFeeScheduleItemInput = {
      feeScheduleId,
      code: form.code.trim(),
      codeType: form.codeType,
      baseAmount: Number(form.baseAmount) || 0,
      currency: form.currency,
    };
    if (form.unit) payload.unit = form.unit;
    if (form.multiplier) payload.multiplier = Number(form.multiplier);
    if (form.discountPct) payload.discountPct = Number(form.discountPct);
    if (form.maxAllowedAmount) payload.maxAllowedAmount = Number(form.maxAllowedAmount);
    if (form.serviceGroup) payload.serviceGroup = form.serviceGroup;
    if (form.priority) payload.priority = Number(form.priority);

    await onSubmit(payload);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Code *</Label>
          <Input value={form.code} onChange={(event) => handleChange('code', event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Code type</Label>
          <Select value={form.codeType} onValueChange={(value) => handleChange('codeType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(FeeScheduleCodeType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Base amount *</Label>
          <Input type="number" step="0.01" value={form.baseAmount} onChange={(event) => handleChange('baseAmount', event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Currency</Label>
          <Input value={form.currency} onChange={(event) => handleChange('currency', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Unit</Label>
          <Input value={form.unit} onChange={(event) => handleChange('unit', event.target.value)} />
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
          <Label>Service group</Label>
          <Input value={form.serviceGroup} onChange={(event) => handleChange('serviceGroup', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Input type="number" value={form.priority} onChange={(event) => handleChange('priority', event.target.value)} />
        </div>
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
