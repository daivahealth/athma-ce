'use client';

import { useEffect, useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import type { BillingItem } from '../types/billing-item';
import {
  ItemType,
  BillingCodeType,
  ChargeType,
  type CreateBillingItemInput,
} from '../types/billing-item';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';

interface BillingItemFormProps {
  initialValues?: Partial<BillingItem>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (payload: CreateBillingItemInput) => Promise<void> | void;
  onCancel?: () => void;
}

interface BillingItemFormState {
  itemType: ItemType;
  billingCode: string;
  billingCodeType: BillingCodeType;
  billingDescription: string;
  chargeType: ChargeType;
  defaultUnit: string;
  listPrice: string;
  clinicalRefId: string;
  isActive: boolean;
}

const defaultState: BillingItemFormState = {
  itemType: ItemType.PROCEDURE,
  billingCode: '',
  billingCodeType: BillingCodeType.INTERNAL,
  billingDescription: '',
  chargeType: ChargeType.PROCEDURE,
  defaultUnit: 'each',
  listPrice: '',
  clinicalRefId: '',
  isActive: true,
};

const startCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export function BillingItemForm({
  initialValues,
  submitLabel = 'Save billing item',
  isSubmitting,
  onSubmit,
  onCancel,
}: BillingItemFormProps) {
  const hydratedState = useMemo<BillingItemFormState>(() => {
    if (!initialValues) return defaultState;
    return {
      itemType: initialValues.itemType ?? defaultState.itemType,
      billingCode: initialValues.billingCode ?? '',
      billingCodeType: initialValues.billingCodeType ?? BillingCodeType.INTERNAL,
      billingDescription: initialValues.billingDescription ?? '',
      chargeType: initialValues.chargeType ?? ChargeType.PROCEDURE,
      defaultUnit: initialValues.defaultUnit ?? 'each',
      listPrice:
        initialValues.listPrice !== undefined && initialValues.listPrice !== null
          ? String(initialValues.listPrice)
          : '',
      clinicalRefId: initialValues.clinicalRefId ?? '',
      isActive: initialValues.isActive ?? true,
    };
  }, [initialValues]);

  const { data: currencyConfig } = useResolveConfig('finance.currency');
  const currency =
    typeof currencyConfig?.value === 'string' && currencyConfig.value.trim()
      ? currencyConfig.value.trim()
      : 'AED';

  const [form, setForm] = useState<BillingItemFormState>(hydratedState);

  useEffect(() => {
    setForm(hydratedState);
  }, [hydratedState]);

  const handleChange = (field: keyof BillingItemFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: CreateBillingItemInput = {
      itemType: form.itemType,
      billingCode: form.billingCode.trim(),
      billingCodeType: form.billingCodeType,
      billingDescription: form.billingDescription.trim(),
      chargeType: form.chargeType,
      defaultUnit: form.defaultUnit?.trim() || undefined,
      clinicalRefId: form.clinicalRefId?.trim() || undefined,
      isActive: form.isActive,
    };

    const price = parseFloat(form.listPrice);
    if (!Number.isNaN(price)) {
      payload.listPrice = price;
    }

    await onSubmit(payload);
  };

  const itemTypeOptions = Object.values(ItemType);
  const chargeTypeOptions = Object.values(ChargeType);
  const codeTypeOptions = Object.values(BillingCodeType);

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Item type *</Label>
          <Select value={form.itemType} onValueChange={(value) => handleChange('itemType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {startCase(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Charge type *</Label>
          <Select value={form.chargeType} onValueChange={(value) => handleChange('chargeType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {chargeTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {startCase(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Billing code *</Label>
          <Input
            value={form.billingCode}
            onChange={(event) => handleChange('billingCode', event.target.value)}
            placeholder="e.g., CPT 99203"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Code system *</Label>
          <Select
            value={form.billingCodeType}
            onValueChange={(value) => handleChange('billingCodeType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {codeTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {startCase(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description *</Label>
        <Input
          value={form.billingDescription}
          onChange={(event) => handleChange('billingDescription', event.target.value)}
          placeholder="Consultation 30 minutes"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Default unit</Label>
          <Input
            value={form.defaultUnit}
            onChange={(event) => handleChange('defaultUnit', event.target.value)}
            placeholder="each"
          />
        </div>
        <div className="space-y-2">
          <Label>List price ({currency})</Label>
          <Input
            type="number"
            step="0.01"
            value={form.listPrice}
            onChange={(event) => handleChange('listPrice', event.target.value)}
            placeholder="150.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Clinical reference ID</Label>
        <Input
          value={form.clinicalRefId}
          onChange={(event) => handleChange('clinicalRefId', event.target.value)}
          placeholder="Catalog item ID (optional)"
        />
      </div>

      <div className="flex items-center justify-between rounded-md border px-4 py-3">
        <div>
          <p className="font-medium">Is active?</p>
          <p className="text-sm text-muted-foreground">Inactive codes are hidden from ordering workflows.</p>
        </div>
        <Switch checked={form.isActive} onCheckedChange={(checked) => handleChange('isActive', checked)} />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
