'use client';

import { useEffect, useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Coins, Tag } from 'lucide-react';
import { FormActions, FormField, FormSection } from '@/components/forms/form-layout';
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <FormSection
        icon={Tag}
        title="Billing code"
        description="What is billed and under which code system"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField id="itemType" label="Item type" required>
            <Select
              value={form.itemType}
              onValueChange={(value) => handleChange('itemType', value)}
            >
              <SelectTrigger id="itemType">
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
          </FormField>
          <FormField id="chargeType" label="Charge type" required>
            <Select
              value={form.chargeType}
              onValueChange={(value) => handleChange('chargeType', value)}
            >
              <SelectTrigger id="chargeType">
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
          </FormField>
          <FormField id="billingCode" label="Billing code" required>
            <Input
              id="billingCode"
              value={form.billingCode}
              onChange={(event) => handleChange('billingCode', event.target.value)}
              placeholder="e.g., CPT 99203"
              required
            />
          </FormField>
          <FormField id="billingCodeType" label="Code system" required>
            <Select
              value={form.billingCodeType}
              onValueChange={(value) => handleChange('billingCodeType', value)}
            >
              <SelectTrigger id="billingCodeType">
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
          </FormField>
        </div>
        <FormField id="billingDescription" label="Description" required>
          <Input
            id="billingDescription"
            value={form.billingDescription}
            onChange={(event) => handleChange('billingDescription', event.target.value)}
            placeholder="Consultation 30 minutes"
            required
          />
        </FormField>
      </FormSection>

      <FormSection
        icon={Coins}
        title="Pricing & status"
        description="Default unit, list price and availability"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <FormField id="defaultUnit" label="Default unit">
            <Input
              id="defaultUnit"
              value={form.defaultUnit}
              onChange={(event) => handleChange('defaultUnit', event.target.value)}
              placeholder="each"
            />
          </FormField>
          <FormField id="listPrice" label={`List price (${currency})`}>
            <Input
              id="listPrice"
              type="number"
              step="0.01"
              value={form.listPrice}
              onChange={(event) => handleChange('listPrice', event.target.value)}
              placeholder="150.00"
            />
          </FormField>
          <FormField id="clinicalRefId" label="Clinical reference ID">
            <Input
              id="clinicalRefId"
              value={form.clinicalRefId}
              onChange={(event) => handleChange('clinicalRefId', event.target.value)}
              placeholder="Catalog item ID (optional)"
            />
          </FormField>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-md border border-border px-4 py-3">
          <div>
            <Label htmlFor="isActive" className="font-medium">
              Is active?
            </Label>
            <p className="text-sm text-muted-foreground">
              Inactive codes are hidden from ordering workflows.
            </p>
          </div>
          <Switch
            id="isActive"
            checked={form.isActive}
            onCheckedChange={(checked) => handleChange('isActive', checked)}
          />
        </div>
      </FormSection>

      <FormActions submitLabel={submitLabel} isSubmitting={isSubmitting} onCancel={onCancel} />
    </form>
  );
}
