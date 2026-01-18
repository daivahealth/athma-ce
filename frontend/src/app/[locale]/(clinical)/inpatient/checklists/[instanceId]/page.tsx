'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import {
  useChecklistInstance,
  useSaveChecklistResponsesBulk,
  useCompleteChecklistInstance,
  useVerifyChecklistInstance,
  useCancelChecklistInstance,
} from '@/modules/clinical/hooks/use-checklists';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import type { ChecklistTemplateItem, ChecklistInstanceResponse } from '@/modules/clinical/types/checklist';
import { ChecklistItemType, ChecklistInstanceStatus } from '@/modules/clinical/types/checklist';

const getResponseValue = (response?: ChecklistInstanceResponse) => {
  if (!response) return undefined;
  if (response.valueBoolean !== undefined && response.valueBoolean !== null) return response.valueBoolean;
  if (response.valueText) return response.valueText;
  if (response.valueNumber !== undefined && response.valueNumber !== null) return response.valueNumber;
  if (response.valueDate) return response.valueDate;
  if (response.valueDatetime) return response.valueDatetime;
  if (response.valueTime) return response.valueTime;
  if (response.valueJson !== undefined && response.valueJson !== null) return response.valueJson;
  return undefined;
};

const isEmptyValue = (value: any) => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
};

export default function ChecklistInstancePage() {
  const params = useParams();
  const router = useRouter();
  const instanceId = params.instanceId as string;
  const { toast } = useToast();

  const { data: instance, isLoading } = useChecklistInstance(instanceId);
  const saveBulkMutation = useSaveChecklistResponsesBulk(instanceId);
  const completeMutation = useCompleteChecklistInstance(instanceId);
  const verifyMutation = useVerifyChecklistInstance(instanceId);
  const cancelMutation = useCancelChecklistInstance(instanceId);
  const staffListQuery = useStaffList();

  const template = instance?.template;
  const items = template?.items ?? [];

  const itemKeyMap = useMemo(() => {
    const map = new Map<string, ChecklistTemplateItem>();
    items.forEach((item) => map.set(item.itemKey, item));
    return map;
  }, [items]);

  const initialValues = useMemo(() => {
    const map = new Map<string, any>();
    instance?.responses?.forEach((response) => {
      map.set(response.templateItemId, getResponseValue(response));
    });
    return map;
  }, [instance?.responses]);

  const [responses, setResponses] = useState<Record<string, any>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!instance) return;
    const next: Record<string, any> = {};
    items.forEach((item) => {
      if (initialValues.has(item.id)) {
        next[item.id] = initialValues.get(item.id);
      }
    });
    setResponses(next);
    setDirty(false);
  }, [instance, items, initialValues]);

  const sections = useMemo(() => {
    const grouped = new Map<string, ChecklistTemplateItem[]>();
    items.forEach((item) => {
      const key = item.sectionName || 'General';
      const list = grouped.get(key) ?? [];
      list.push(item);
      grouped.set(key, list);
    });
    return Array.from(grouped.entries()).map(([section, list]) => ({
      section,
      items: list.sort((a, b) => a.sortOrder - b.sortOrder),
    }));
  }, [items]);

  const getValueByItemKey = (itemKey: string) => {
    const item = itemKeyMap.get(itemKey);
    if (!item) return undefined;
    return responses[item.id] ?? initialValues.get(item.id);
  };

  const shouldShowItem = (item: ChecklistTemplateItem) => {
    if (!item.showIfCondition) return true;
    const targetValue = getValueByItemKey(item.showIfCondition.field);
    const conditionValue = item.showIfCondition.value;

    switch (item.showIfCondition.operator) {
      case 'equals':
        return targetValue === conditionValue;
      case 'not_equals':
        return targetValue !== conditionValue;
      case 'contains':
        return Array.isArray(targetValue) ? targetValue.includes(conditionValue) : false;
      case 'greater_than':
        return typeof targetValue === 'number' && targetValue > conditionValue;
      default:
        return true;
    }
  };

  const updateResponse = (itemId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [itemId]: value }));
    setDirty(true);
  };

  const handleSaveDraft = async () => {
    if (!instance) return;
    const payload = items
      .map((item) => ({
        templateItemId: item.id,
        value: responses[item.id],
      }))
      .filter((response) => !isEmptyValue(response.value) || response.value === false);

    if (payload.length === 0) {
      toast({ title: 'Nothing to save', description: 'Add responses before saving.' });
      return;
    }

    await saveBulkMutation.mutateAsync({ responses: payload });
    setDirty(false);
    toast({ title: 'Checklist saved', description: 'Draft responses saved.' });
  };

  const handleComplete = async () => {
    await completeMutation.mutateAsync();
    toast({ title: 'Checklist completed', description: 'Checklist marked as completed.' });
  };

  const handleVerify = async () => {
    await verifyMutation.mutateAsync();
    toast({ title: 'Checklist verified', description: 'Checklist verified successfully.' });
  };

  const handleCancel = async () => {
    await cancelMutation.mutateAsync();
    toast({ title: 'Checklist cancelled', description: 'Checklist cancelled.' });
  };

  const readOnly =
    instance?.status === ChecklistInstanceStatus.COMPLETED ||
    instance?.status === ChecklistInstanceStatus.VERIFIED ||
    instance?.status === ChecklistInstanceStatus.CANCELLED;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Checklist</h1>
            <p className="text-sm text-muted-foreground">Complete and verify checklist items.</p>
          </div>
        </div>
        {instance?.status && (
          <Badge variant="secondary" className="uppercase text-xs">
            {instance.status}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading checklist...</p>
      ) : !instance ? (
        <p className="text-sm text-muted-foreground">Checklist not found.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card>
            <CardHeader>
              <CardTitle>{template?.name ?? 'Checklist'}</CardTitle>
              {template?.description && (
                <p className="text-sm text-muted-foreground">{template.description}</p>
              )}
            </CardHeader>
            <Separator />
            <CardContent className="space-y-6">
              {sections.map((section) => (
                <div key={section.section} className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.section}
                  </h3>
                  <div className="space-y-4">
                    {section.items.map((item) => {
                      if (item.itemType === ChecklistItemType.SECTION_HEADER) {
                        return (
                          <div key={item.id} className="text-sm font-semibold text-slate-700">
                            {item.label}
                          </div>
                        );
                      }
                      if (!shouldShowItem(item)) return null;

                      const value = responses[item.id] ?? initialValues.get(item.id) ?? '';
                      const isRequired = item.isRequired;

                      return (
                        <div key={item.id} className="rounded-xl border border-border/50 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-sm font-medium">
                              {item.label}
                              {isRequired && <span className="text-rose-500"> *</span>}
                            </label>
                            <Badge variant="outline" className="text-[10px] uppercase">
                              {item.itemType}
                            </Badge>
                          </div>
                          {item.helpText && (
                            <p className="mt-1 text-xs text-muted-foreground">{item.helpText}</p>
                          )}
                          <div className="mt-3">
                            {item.itemType === ChecklistItemType.BOOLEAN && (
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={Boolean(value)}
                                  onChange={(event) => updateResponse(item.id, event.target.checked)}
                                  disabled={readOnly}
                                />
                                <span className="text-sm">Yes</span>
                              </div>
                            )}
                            {item.itemType === ChecklistItemType.TEXT && (
                              <Input
                                value={value}
                                onChange={(event) => updateResponse(item.id, event.target.value)}
                                placeholder={item.placeholder ?? ''}
                                disabled={readOnly}
                              />
                            )}
                            {item.itemType === ChecklistItemType.TEXT_AREA && (
                              <Textarea
                                value={value}
                                onChange={(event) => updateResponse(item.id, event.target.value)}
                                placeholder={item.placeholder ?? ''}
                                rows={3}
                                disabled={readOnly}
                              />
                            )}
                            {item.itemType === ChecklistItemType.NUMBER && (
                              <Input
                                type="number"
                                value={value}
                                onChange={(event) =>
                                  updateResponse(
                                    item.id,
                                    event.target.value ? Number(event.target.value) : ''
                                  )
                                }
                                disabled={readOnly}
                              />
                            )}
                            {item.itemType === ChecklistItemType.DATE && (
                              <Input
                                type="date"
                                value={value}
                                onChange={(event) => updateResponse(item.id, event.target.value)}
                                disabled={readOnly}
                              />
                            )}
                            {item.itemType === ChecklistItemType.DATETIME && (
                              <Input
                                type="datetime-local"
                                value={value}
                                onChange={(event) => updateResponse(item.id, event.target.value)}
                                disabled={readOnly}
                              />
                            )}
                            {item.itemType === ChecklistItemType.TIME && (
                              <Input
                                type="time"
                                value={value}
                                onChange={(event) => updateResponse(item.id, event.target.value)}
                                disabled={readOnly}
                              />
                            )}
                            {item.itemType === ChecklistItemType.SELECT_SINGLE && (
                              <Select
                                value={value}
                                onValueChange={(val) => updateResponse(item.id, val)}
                                disabled={readOnly}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={item.placeholder ?? 'Select'} />
                                </SelectTrigger>
                                <SelectContent>
                                  {item.options?.values?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {item.options?.labels?.[option] ?? option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {item.itemType === ChecklistItemType.SELECT_MULTIPLE && (
                              <div className="space-y-2">
                                {item.options?.values?.map((option) => {
                                  const list = Array.isArray(value) ? value : [];
                                  const checked = list.includes(option);
                                  return (
                                    <label key={option} className="flex items-center gap-2 text-sm">
                                      <Checkbox
                                        checked={checked}
                                        onChange={(event) => {
                                          const next = event.target.checked
                                            ? [...list, option]
                                            : list.filter((entry) => entry !== option);
                                          updateResponse(item.id, next);
                                        }}
                                        disabled={readOnly}
                                      />
                                      {item.options?.labels?.[option] ?? option}
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                            {item.itemType === ChecklistItemType.STAFF_SELECTOR && (
                              <Select
                                value={value}
                                onValueChange={(val) => updateResponse(item.id, val)}
                                disabled={readOnly}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={item.placeholder ?? 'Select staff'} />
                                </SelectTrigger>
                                <SelectContent>
                                  {staffListQuery.data?.map((staff) => (
                                    <SelectItem key={staff.id} value={staff.id}>
                                      {staff.displayName ??
                                        `${staff.firstName ?? ''} ${staff.lastName ?? ''}`.trim()}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {item.itemType === ChecklistItemType.FILE_UPLOAD && (
                              <p className="text-xs text-muted-foreground">File upload not yet supported.</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checklist Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Status: {instance.status}</p>
                <p>Completion: {instance.completionPercent}%</p>
                {instance.dueAt && <p>Due: {new Date(instance.dueAt).toLocaleString()}</p>}
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={handleSaveDraft}
                  disabled={readOnly || saveBulkMutation.isPending || !dirty}
                >
                  {saveBulkMutation.isPending ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleComplete}
                  disabled={readOnly || completeMutation.isPending}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {completeMutation.isPending ? 'Completing...' : 'Mark Complete'}
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleVerify}
                  disabled={readOnly || verifyMutation.isPending}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
                </Button>
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={readOnly || cancelMutation.isPending}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
