'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { PayerContract } from '../types/payer-contract';
import {
  AuthorityCode,
  ContractStatus,
  ContractType,
  ReimbursementMethod,
  type CreatePayerContractInput,
} from '../types/payer-contract';
import { payerService } from '../services/payer-service';
import type { Payer } from '../types/payer';

interface PayerContractFormProps {
  initialValues?: Partial<PayerContract>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (payload: CreatePayerContractInput) => Promise<void> | void;
  onCancel?: () => void;
}

const toLabel = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export function PayerContractForm({ initialValues, submitLabel = 'Save contract', isSubmitting, onSubmit, onCancel }: PayerContractFormProps) {
  const hydratedState = useMemo(() => ({
    payerId: initialValues?.payerId ?? '',
    contractName: initialValues?.contractName ?? '',
    contractNumber: initialValues?.contractNumber ?? '',
    authorityCode: initialValues?.authorityCode ?? AuthorityCode.DHA,
    baseFeeScheduleId: initialValues?.baseFeeScheduleId ?? '',
    planCode: initialValues?.planCode ?? '',
    networkType: initialValues?.networkType ?? '',
    lineOfBusiness: initialValues?.lineOfBusiness ?? '',
    contractType: initialValues?.contractType ?? ContractType.FEE_FOR_SERVICE,
    reimbursementMethod: initialValues?.reimbursementMethod ?? ReimbursementMethod.PERCENTAGE_OF_TARIFF,
    effectiveFrom: initialValues?.effectiveFrom ? initialValues.effectiveFrom.slice(0, 10) : '',
    effectiveTo: initialValues?.effectiveTo ? initialValues.effectiveTo.slice(0, 10) : '',
    status: initialValues?.status ?? ContractStatus.ACTIVE,
    defaultMultiplier: initialValues?.defaultMultiplier != null ? String(initialValues.defaultMultiplier) : '',
    defaultDiscountPct: initialValues?.defaultDiscountPct != null ? String(initialValues.defaultDiscountPct) : '',
    defaultMaxAllowedAmount: initialValues?.defaultMaxAllowedAmount != null
      ? String(initialValues.defaultMaxAllowedAmount)
      : '',
    terms: initialValues?.terms ? JSON.stringify(initialValues.terms, null, 2) : '',
    metadata: initialValues?.metadata ? JSON.stringify(initialValues.metadata, null, 2) : '',
  }), [initialValues]);

  const [form, setForm] = useState(hydratedState);
  useEffect(() => setForm(hydratedState), [hydratedState]);

  const [payers, setPayers] = useState<Payer[]>([]);
  const [isLoadingPayers, setIsLoadingPayers] = useState(true);

  // Fetch payers on component mount
  useEffect(() => {
    const fetchPayers = async () => {
      try {
        setIsLoadingPayers(true);
        const payerList = await payerService.list({ status: 'active' });
        setPayers(payerList);
      } catch (error) {
        console.error('Failed to fetch payers:', error);
      } finally {
        setIsLoadingPayers(false);
      }
    };
    fetchPayers();
  }, []);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const parseJson = (value: string) => {
    if (!value.trim()) return undefined;
    return JSON.parse(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.payerId.trim() || !form.contractName.trim() || !form.effectiveFrom) {
      return;
    }

    const payload: CreatePayerContractInput = {
      payerId: form.payerId.trim(),
      contractName: form.contractName.trim(),
      contractNumber: form.contractNumber.trim() || undefined,
      authorityCode: form.authorityCode,
      baseFeeScheduleId: form.baseFeeScheduleId.trim() || undefined,
      planCode: form.planCode.trim() || undefined,
      networkType: form.networkType.trim() || undefined,
      lineOfBusiness: form.lineOfBusiness.trim() || undefined,
      contractType: form.contractType,
      reimbursementMethod: form.reimbursementMethod,
      effectiveFrom: new Date(form.effectiveFrom).toISOString(),
      status: form.status,
    };

    if (form.effectiveTo) payload.effectiveTo = new Date(form.effectiveTo).toISOString();
    if (form.defaultMultiplier) payload.defaultMultiplier = Number(form.defaultMultiplier);
    if (form.defaultDiscountPct) payload.defaultDiscountPct = Number(form.defaultDiscountPct);
    if (form.defaultMaxAllowedAmount) payload.defaultMaxAllowedAmount = Number(form.defaultMaxAllowedAmount);
    if (form.terms.trim()) payload.terms = parseJson(form.terms);
    if (form.metadata.trim()) payload.metadata = parseJson(form.metadata);

    await onSubmit(payload);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Contract details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Payer *</Label>
            <Select value={form.payerId} onValueChange={(value) => handleChange('payerId', value)} disabled={isLoadingPayers} required>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingPayers ? 'Loading payers...' : 'Select a payer'} />
              </SelectTrigger>
              <SelectContent>
                {payers.map((payer) => (
                  <SelectItem key={payer.id} value={payer.id}>
                    {payer.payerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Contract name *</Label>
            <Input value={form.contractName} onChange={(event) => handleChange('contractName', event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Contract number</Label>
            <Input value={form.contractNumber} onChange={(event) => handleChange('contractNumber', event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Authority</Label>
            <Select value={form.authorityCode} onValueChange={(value) => handleChange('authorityCode', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AuthorityCode).map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Base fee schedule ID</Label>
            <Input value={form.baseFeeScheduleId} onChange={(event) => handleChange('baseFeeScheduleId', event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Plan code</Label>
            <Input value={form.planCode} onChange={(event) => handleChange('planCode', event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Network type</Label>
            <Input value={form.networkType} onChange={(event) => handleChange('networkType', event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Line of business</Label>
            <Input value={form.lineOfBusiness} onChange={(event) => handleChange('lineOfBusiness', event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Contract type</Label>
            <Select value={form.contractType} onValueChange={(value) => handleChange('contractType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ContractType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {toLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Reimbursement method</Label>
            <Select value={form.reimbursementMethod} onValueChange={(value) => handleChange('reimbursementMethod', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ReimbursementMethod).map((method) => (
                  <SelectItem key={method} value={method}>
                    {toLabel(method)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Effective from *</Label>
            <Input type="date" value={form.effectiveFrom} onChange={(event) => handleChange('effectiveFrom', event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Effective to</Label>
            <Input type="date" value={form.effectiveTo} onChange={(event) => handleChange('effectiveTo', event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ContractStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {toLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Defaults & notes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Multiplier</Label>
            <Input type="number" step="0.01" value={form.defaultMultiplier} onChange={(event) => handleChange('defaultMultiplier', event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Discount %</Label>
            <Input type="number" step="0.1" value={form.defaultDiscountPct} onChange={(event) => handleChange('defaultDiscountPct', event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Max allowed</Label>
            <Input type="number" step="0.01" value={form.defaultMaxAllowedAmount} onChange={(event) => handleChange('defaultMaxAllowedAmount', event.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label>Terms (JSON)</Label>
            <Textarea className="font-mono" rows={4} value={form.terms} onChange={(event) => handleChange('terms', event.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label>Metadata (JSON)</Label>
            <Textarea className="font-mono" rows={4} value={form.metadata} onChange={(event) => handleChange('metadata', event.target.value)} />
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
