'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import type { ChargePostingRule } from '../types/charge-posting-rule';
import {
  EventType,
  EventSource,
  BillingItemType,
  ChargeCalculationMethod,
  PriceSource,
  QuantitySource,
  type CreateChargePostingRuleInput,
} from '../types/charge-posting-rule';
import { FeeScheduleCodeType } from '../types/fee-schedule';
import { useFeeSchedulePriceLookup } from '../hooks/use-fee-schedules';

interface ChargePostingRuleFormProps {
  initialValues?: Partial<ChargePostingRule>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (payload: CreateChargePostingRuleInput) => Promise<void> | void;
  onCancel?: () => void;
}

const toStartCase = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const booleanOrDefault = (value: boolean | undefined, fallback: boolean) => (value === undefined ? fallback : value);

export function ChargePostingRuleForm({ initialValues, submitLabel = 'Save rule', isSubmitting, onSubmit, onCancel }: ChargePostingRuleFormProps) {
  const hydratedState = useMemo(() => ({
    ruleName: initialValues?.ruleName ?? '',
    eventType: initialValues?.eventType ?? EventType.PROCEDURE_PERFORMED,
    eventSource: initialValues?.eventSource ?? EventSource.ENCOUNTER,
    billingItemType: initialValues?.billingItemType ?? BillingItemType.PROCEDURE,
    billingItemId: initialValues?.billingItemId ?? '',
    chargeCalculationMethod: initialValues?.chargeCalculationMethod ?? ChargeCalculationMethod.CATALOG_PRICE,
    priceSource: initialValues?.priceSource ?? PriceSource.CATALOG,
    quantitySource: initialValues?.quantitySource ?? QuantitySource.EVENT,
    basePrice: initialValues?.basePrice != null ? String(initialValues.basePrice) : '',
    discountPercentage: initialValues?.discountPercentage != null ? String(initialValues.discountPercentage) : '',
    taxPercentage: initialValues?.taxPercentage != null ? String(initialValues.taxPercentage) : '',
    priority: initialValues?.priority != null ? String(initialValues.priority) : '0',
    isActive: booleanOrDefault(initialValues?.isActive, true),
    autoApprove: booleanOrDefault(initialValues?.autoApprove, true),
    description: initialValues?.description ?? '',
    conditions: initialValues?.conditions ? JSON.stringify(initialValues.conditions, null, 2) : '',
    configuration: initialValues?.configuration ? JSON.stringify(initialValues.configuration, null, 2) : '',
  }), [initialValues]);

  const [form, setForm] = useState(hydratedState);
  useEffect(() => setForm(hydratedState), [hydratedState]);
  const priceLookup = useFeeSchedulePriceLookup();
  const [lookupCode, setLookupCode] = useState('');
  const [lookupCodeType, setLookupCodeType] = useState<FeeScheduleCodeType>(FeeScheduleCodeType.CPT);
  const [lookupMessage, setLookupMessage] = useState('');

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const parseJsonField = (value: string) => {
    if (!value.trim()) return undefined;
    return JSON.parse(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.ruleName.trim()) {
      return;
    }

    try {
      const payload: CreateChargePostingRuleInput = {
        ruleName: form.ruleName.trim(),
        eventType: form.eventType,
        eventSource: form.eventSource,
        billingItemType: form.billingItemType,
        billingItemId: form.billingItemId.trim() || undefined,
        chargeCalculationMethod: form.chargeCalculationMethod,
        priceSource: form.priceSource,
        quantitySource: form.quantitySource,
        isActive: form.isActive,
        autoApprove: form.autoApprove,
        description: form.description.trim() || undefined,
      };

      if (form.basePrice) payload.basePrice = Number(form.basePrice);
      if (form.discountPercentage) payload.discountPercentage = Number(form.discountPercentage);
      if (form.taxPercentage) payload.taxPercentage = Number(form.taxPercentage);
      if (form.priority) payload.priority = Number(form.priority);
      if (form.conditions) payload.conditions = parseJsonField(form.conditions);
      if (form.configuration) payload.configuration = parseJsonField(form.configuration);

      await onSubmit(payload);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON in conditions/configuration.');
      }
      throw error;
    }
  };

  const handleLookupPrice = async () => {
    if (!lookupCode.trim()) {
      setLookupMessage('Enter a code to look up.');
      return;
    }
    const result = await priceLookup.mutateAsync({ code: lookupCode.trim(), codeType: lookupCodeType });
    if (result.price != null) {
      handleChange('basePrice', String(result.price));
      setLookupMessage(`Found ${result.price.toFixed(2)} ${result.currency ?? 'AED'}`);
    } else {
      setLookupMessage(result.message ?? 'Price not found');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Rule details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Rule name *</Label>
            <Input value={form.ruleName} onChange={(event) => handleChange('ruleName', event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Event type</Label>
            <Select value={form.eventType} onValueChange={(value) => handleChange('eventType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EventType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {toStartCase(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Event source</Label>
            <Select value={form.eventSource} onValueChange={(value) => handleChange('eventSource', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EventSource).map((source) => (
                  <SelectItem key={source} value={source}>
                    {toStartCase(source)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Billing item type</Label>
            <Select value={form.billingItemType} onValueChange={(value) => handleChange('billingItemType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(BillingItemType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {toStartCase(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Billing item ID</Label>
            <Input value={form.billingItemId} onChange={(event) => handleChange('billingItemId', event.target.value)} placeholder="Optional catalog item ID" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Charge configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Calculation method</Label>
            <Select value={form.chargeCalculationMethod} onValueChange={(value) => handleChange('chargeCalculationMethod', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ChargeCalculationMethod).map((method) => (
                  <SelectItem key={method} value={method}>
                    {toStartCase(method)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Price source</Label>
            <Select value={form.priceSource} onValueChange={(value) => handleChange('priceSource', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PriceSource).map((source) => (
                  <SelectItem key={source} value={source}>
                    {toStartCase(source)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Quantity source</Label>
            <Select value={form.quantitySource} onValueChange={(value) => handleChange('quantitySource', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(QuantitySource).map((source) => (
                  <SelectItem key={source} value={source}>
                    {toStartCase(source)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Base price</Label>
            <Input type="number" step="0.01" value={form.basePrice} onChange={(event) => handleChange('basePrice', event.target.value)} placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label>Discount %</Label>
            <Input type="number" step="0.1" value={form.discountPercentage} onChange={(event) => handleChange('discountPercentage', event.target.value)} placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label>Tax %</Label>
            <Input type="number" step="0.1" value={form.taxPercentage} onChange={(event) => handleChange('taxPercentage', event.target.value)} placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Input type="number" value={form.priority} onChange={(event) => handleChange('priority', event.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Conditions (JSON)</Label>
              <Textarea
                className="font-mono"
                rows={4}
                value={form.conditions}
                onChange={(event) => handleChange('conditions', event.target.value)}
                placeholder='{"eventData.labTestCategory":{"$eq":"hematology"}}'
              />
            </div>
            <div className="space-y-2">
              <Label>Configuration (JSON)</Label>
              <Textarea
                className="font-mono"
                rows={4}
                value={form.configuration}
                onChange={(event) => handleChange('configuration', event.target.value)}
                placeholder='{"tieredPricing":[{"min":1,"max":5,"price":100}]}'
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} value={form.description} onChange={(event) => handleChange('description', event.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-md border px-4 py-3">
              <div>
                <p className="font-medium">Active</p>
                <p className="text-sm text-muted-foreground">Inactive rules will be skipped</p>
              </div>
              <Switch checked={form.isActive} onCheckedChange={(checked) => handleChange('isActive', checked)} />
            </div>
            <div className="flex items-center justify-between rounded-md border px-4 py-3">
              <div>
                <p className="font-medium">Auto approve charges</p>
                <p className="text-sm text-muted-foreground">Otherwise charges land in draft</p>
              </div>
              <Switch checked={form.autoApprove} onCheckedChange={(checked) => handleChange('autoApprove', checked)} />
            </div>
          </div>

          <div className="space-y-3 rounded-md border px-4 py-3">
            <p className="font-medium">Fee schedule price lookup</p>
            <div className="grid gap-3 md:grid-cols-[170px_1fr_auto]">
              <Select value={lookupCodeType} onValueChange={(value) => setLookupCodeType(value as FeeScheduleCodeType)}>
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
              <Input value={lookupCode} onChange={(event) => setLookupCode(event.target.value)} placeholder="Enter billing code" />
              <Button type="button" onClick={handleLookupPrice} disabled={priceLookup.isPending}>
                {priceLookup.isPending ? 'Looking…' : 'Use price'}
              </Button>
            </div>
            {lookupMessage && <p className="text-sm text-muted-foreground">{lookupMessage}</p>}
          </div>
        </CardContent>
      </Card>

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
