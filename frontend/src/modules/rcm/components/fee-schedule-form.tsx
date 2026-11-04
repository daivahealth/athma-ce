'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarRange } from 'lucide-react';
import { FIELD_CONTROL, FormActions, FormSection } from '@/components/forms/form-layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

export function FeeScheduleForm({
  initialValues,
  submitLabel = 'Save schedule',
  isSubmitting,
  onSubmit,
  onCancel,
}: FeeScheduleFormProps) {
  const hydratedState = useMemo(
    () => ({
      scheduleName: initialValues?.scheduleName ?? '',
      scheduleType: initialValues?.scheduleType ?? FeeScheduleType.TENANT,
      authorityCode: initialValues?.authorityCode ?? AuthorityCode.DHA,
      version: initialValues?.version ?? '',
      effectiveFrom: initialValues?.effectiveFrom ? initialValues.effectiveFrom.slice(0, 10) : '',
      effectiveTo: initialValues?.effectiveTo ? initialValues.effectiveTo.slice(0, 10) : '',
      status: initialValues?.status ?? FeeScheduleStatus.ACTIVE,
      baseFeeScheduleId: initialValues?.baseFeeScheduleId ?? '',
      metadata: initialValues?.metadata ? JSON.stringify(initialValues.metadata, null, 2) : '',
    }),
    [initialValues],
  );

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
      <FormSection
        icon={CalendarRange}
        title="Schedule details"
        description="Name, scope and the period the prices apply"
        contentClassName="grid gap-4 md:grid-cols-2"
      >
        <div className="space-y-2">
          <Label htmlFor="scheduleName">
            Name<span className="ml-0.5 text-destructive">*</span>
          </Label>
          <Input
            id="scheduleName"
            value={form.scheduleName}
            onChange={(event) => handleChange('scheduleName', event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="scheduleType">Type</Label>
          <Select
            value={form.scheduleType}
            onValueChange={(value) => handleChange('scheduleType', value)}
          >
            <SelectTrigger id="scheduleType">
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
            <Label htmlFor="authorityCode">Authority</Label>
            <Select
              value={form.authorityCode}
              onValueChange={(value) => handleChange('authorityCode', value)}
            >
              <SelectTrigger id="authorityCode">
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
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={form.version}
            onChange={(event) => handleChange('version', event.target.value)}
            placeholder="v1.0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="effectiveFrom">
            Effective from<span className="ml-0.5 text-destructive">*</span>
          </Label>
          <Input
            id="effectiveFrom"
            type="date"
            className={FIELD_CONTROL}
            value={form.effectiveFrom}
            onChange={(event) => handleChange('effectiveFrom', event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="effectiveTo">Effective to</Label>
          <Input
            id="effectiveTo"
            type="date"
            className={FIELD_CONTROL}
            value={form.effectiveTo}
            onChange={(event) => handleChange('effectiveTo', event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={form.status} onValueChange={(value) => handleChange('status', value)}>
            <SelectTrigger id="status">
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
          <Label htmlFor="baseFeeScheduleId">Base schedule ID</Label>
          <Input
            id="baseFeeScheduleId"
            value={form.baseFeeScheduleId}
            onChange={(event) => handleChange('baseFeeScheduleId', event.target.value)}
            placeholder="Derived from..."
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="metadata">Metadata (JSON)</Label>
          <Textarea
            id="metadata"
            className="font-mono"
            rows={4}
            value={form.metadata}
            onChange={(event) => handleChange('metadata', event.target.value)}
            placeholder='{"payer":"ABC"}'
          />
        </div>
      </FormSection>

      <FormActions submitLabel={submitLabel} isSubmitting={isSubmitting} onCancel={onCancel} />
    </form>
  );
}
