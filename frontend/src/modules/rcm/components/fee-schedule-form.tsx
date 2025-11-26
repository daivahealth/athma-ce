'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { FeeSchedule } from '../types/fee-schedule';
import {
  AuthorityCode,
  FeeScheduleStatus,
  FeeScheduleType,
  type CreateFeeScheduleInput,
} from '../types/fee-schedule';

interface FeeScheduleFormProps {
  initialValues?: Partial<FeeSchedule>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (payload: CreateFeeScheduleInput) => Promise<void> | void;
  onCancel?: () => void;
}

export function FeeScheduleForm({ initialValues, submitLabel = 'Save schedule', isSubmitting, onSubmit, onCancel }: FeeScheduleFormProps) {
  const hydratedState = useMemo(() => ({
    scheduleName: initialValues?.scheduleName ?? '',
    scheduleType: initialValues?.scheduleType ?? FeeScheduleType.TENANT,
    authorityCode: initialValues?.authorityCode ?? AuthorityCode.DHA,
    version: initialValues?.version ?? '',
    effectiveFrom: initialValues?.effectiveFrom ? initialValues.effectiveFrom.slice(0, 10) : '',
    effectiveTo: initialValues?.effectiveTo ? initialValues.effectiveTo.slice(0, 10) : '',
    status: initialValues?.status ?? FeeScheduleStatus.ACTIVE,
    baseFeeScheduleId: initialValues?.baseFeeScheduleId ?? '',
    metadata: initialValues?.metadata ? JSON.stringify(initialValues.metadata, null, 2) : '',
  }), [initialValues]);

  const [form, setForm] = useState(hydratedState);
  useEffect(() => setForm(hydratedState), [hydratedState]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.scheduleName.trim() || !form.effectiveFrom) {
      return;
    }

    const payload: CreateFeeScheduleInput = {
      scheduleName: form.scheduleName.trim(),
      scheduleType: form.scheduleType,
      version: form.version.trim() || undefined,
      effectiveFrom: new Date(form.effectiveFrom).toISOString(),
      status: form.status,
    };

    if (form.authorityCode && form.scheduleType === FeeScheduleType.AUTHORITY) {
      payload.authorityCode = form.authorityCode;
    }
    if (form.effectiveTo) {
      payload.effectiveTo = new Date(form.effectiveTo).toISOString();
    }
    if (form.baseFeeScheduleId) {
      payload.baseFeeScheduleId = form.baseFeeScheduleId.trim();
    }
    if (form.metadata.trim()) {
      payload.metadata = JSON.parse(form.metadata);
    }

    await onSubmit(payload);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Schedule details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input value={form.scheduleName} onChange={(event) => handleChange('scheduleName', event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.scheduleType} onValueChange={(value) => handleChange('scheduleType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FeeScheduleType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {form.scheduleType === FeeScheduleType.AUTHORITY && (
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
          )}
          <div className="space-y-2">
            <Label>Version</Label>
            <Input value={form.version} onChange={(event) => handleChange('version', event.target.value)} placeholder="v1.0" />
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
                {Object.values(FeeScheduleStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Base schedule ID</Label>
            <Input value={form.baseFeeScheduleId} onChange={(event) => handleChange('baseFeeScheduleId', event.target.value)} placeholder="Derived from..." />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Metadata (JSON)</Label>
            <Textarea
              className="font-mono"
              rows={4}
              value={form.metadata}
              onChange={(event) => handleChange('metadata', event.target.value)}
              placeholder='{"payer":"ABC"}'
            />
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
