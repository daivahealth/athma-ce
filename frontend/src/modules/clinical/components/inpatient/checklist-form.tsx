'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Calendar, Clock, FileCheck, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  useChecklistInstance,
  useSaveChecklistResponse,
  useSaveChecklistResponsesBulk,
  useCompleteChecklistInstance,
  useVerifyChecklistInstance,
} from '@/modules/clinical/hooks/use-checklists';
import type {
  ChecklistInstance,
  ChecklistTemplateItem,
  ChecklistItemType,
  ChecklistInstanceStatus,
} from '@/modules/clinical/types/checklist';

interface ChecklistFormProps {
  instanceId: string;
  onComplete?: () => void;
  onVerify?: () => void;
}

interface ChecklistSection {
  name: string;
  items: ChecklistTemplateItem[];
}

export function ChecklistForm({ instanceId, onComplete, onVerify }: ChecklistFormProps) {
  const { data: instance, isLoading } = useChecklistInstance(instanceId);
  const saveResponse = useSaveChecklistResponse(instanceId);
  const saveResponsesBulk = useSaveChecklistResponsesBulk(instanceId);
  const completeInstance = useCompleteChecklistInstance(instanceId);
  const verifyInstance = useVerifyChecklistInstance(instanceId);

  const [formValues, setFormValues] = useState<Record<string, any>>({});

  // Initialize form values from existing responses
  useEffect(() => {
    if (instance?.responses) {
      const values: Record<string, any> = {};
      instance.responses.forEach((response) => {
        const itemKey = response.templateItem?.itemKey;
        if (itemKey) {
          values[itemKey] =
            response.valueBoolean ??
            response.valueText ??
            response.valueNumber ??
            response.valueDate ??
            response.valueDatetime ??
            response.valueTime ??
            response.valueJson;
        }
      });
      setFormValues(values);
    }
  }, [instance?.responses]);

  // Group items by section
  const sections = useMemo<ChecklistSection[]>(() => {
    if (!instance?.template?.items) return [];

    const sectionMap = new Map<string, ChecklistTemplateItem[]>();

    instance.template.items.forEach((item) => {
      const sectionName = item.sectionName || 'General';
      if (!sectionMap.has(sectionName)) {
        sectionMap.set(sectionName, []);
      }
      sectionMap.get(sectionName)!.push(item);
    });

    return Array.from(sectionMap.entries()).map(([name, items]) => ({
      name,
      items: items.sort((a, b) => a.sortOrder - b.sortOrder),
    }));
  }, [instance?.template?.items]);

  // Calculate completion progress
  const progress = useMemo(() => {
    if (!instance?.template?.items) return { answered: 0, total: 0, percent: 0 };

    const total = instance.template.items.filter(
      (item) => item.itemType !== 'SECTION_HEADER'
    ).length;
    const answered = Object.keys(formValues).filter(
      (key) => formValues[key] !== undefined && formValues[key] !== null && formValues[key] !== ''
    ).length;

    return {
      answered,
      total,
      percent: total > 0 ? Math.round((answered / total) * 100) : 0,
    };
  }, [instance?.template?.items, formValues]);

  // Check if item should be shown based on conditions
  const shouldShowItem = (item: ChecklistTemplateItem): boolean => {
    if (!item.showIfCondition) return true;

    const { field, operator, value } = item.showIfCondition as any;
    const fieldValue = formValues[field];

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'not_equals':
        return fieldValue !== value;
      case 'contains':
        return String(fieldValue || '').includes(String(value));
      case 'greater_than':
        return Number(fieldValue || 0) > Number(value);
      default:
        return true;
    }
  };

  const handleValueChange = (itemKey: string, templateItemId: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [itemKey]: value }));

    // Auto-save after debounce
    saveResponse.mutate({
      templateItemId,
      value,
    });
  };

  const handleComplete = async () => {
    try {
      await completeInstance.mutateAsync();
      onComplete?.();
    } catch (error) {
      console.error('Failed to complete checklist:', error);
    }
  };

  const handleVerify = async () => {
    try {
      await verifyInstance.mutateAsync();
      onVerify?.();
    } catch (error) {
      console.error('Failed to verify checklist:', error);
    }
  };

  const renderField = (item: ChecklistTemplateItem) => {
    const value = formValues[item.itemKey];

    switch (item.itemType) {
      case 'BOOLEAN':
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              id={item.itemKey}
              checked={value === true}
              onChange={(event) =>
                handleValueChange(item.itemKey, item.id, event.target.checked)
              }
              disabled={instance?.status === 'COMPLETED' || instance?.status === 'VERIFIED'}
            />
            <Label htmlFor={item.itemKey} className="cursor-pointer">
              {item.label}
              {item.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );

      case 'TEXT':
        return (
          <div className="space-y-2">
            <Label htmlFor={item.itemKey}>
              {item.label}
              {item.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={item.itemKey}
              value={value || ''}
              onChange={(e) => handleValueChange(item.itemKey, item.id, e.target.value)}
              placeholder={item.placeholder || ''}
              disabled={instance?.status === 'COMPLETED' || instance?.status === 'VERIFIED'}
            />
            {item.helpText && (
              <p className="text-xs text-gray-500">{item.helpText}</p>
            )}
          </div>
        );

      case 'TEXT_AREA':
        return (
          <div className="space-y-2">
            <Label htmlFor={item.itemKey}>
              {item.label}
              {item.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={item.itemKey}
              value={value || ''}
              onChange={(e) => handleValueChange(item.itemKey, item.id, e.target.value)}
              placeholder={item.placeholder || ''}
              rows={3}
              disabled={instance?.status === 'COMPLETED' || instance?.status === 'VERIFIED'}
            />
            {item.helpText && (
              <p className="text-xs text-gray-500">{item.helpText}</p>
            )}
          </div>
        );

      case 'NUMBER':
        return (
          <div className="space-y-2">
            <Label htmlFor={item.itemKey}>
              {item.label}
              {item.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={item.itemKey}
              type="number"
              value={value || ''}
              onChange={(e) => handleValueChange(item.itemKey, item.id, parseFloat(e.target.value))}
              placeholder={item.placeholder || ''}
              disabled={instance?.status === 'COMPLETED' || instance?.status === 'VERIFIED'}
            />
            {item.helpText && (
              <p className="text-xs text-gray-500">{item.helpText}</p>
            )}
          </div>
        );

      case 'DATE':
        return (
          <div className="space-y-2">
            <Label htmlFor={item.itemKey}>
              {item.label}
              {item.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={item.itemKey}
              type="date"
              value={value || ''}
              onChange={(e) => handleValueChange(item.itemKey, item.id, e.target.value)}
              disabled={instance?.status === 'COMPLETED' || instance?.status === 'VERIFIED'}
            />
            {item.helpText && (
              <p className="text-xs text-gray-500">{item.helpText}</p>
            )}
          </div>
        );

      case 'SELECT_SINGLE':
        return (
          <div className="space-y-2">
            <Label htmlFor={item.itemKey}>
              {item.label}
              {item.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value || ''}
              onValueChange={(val) => handleValueChange(item.itemKey, item.id, val)}
              disabled={instance?.status === 'COMPLETED' || instance?.status === 'VERIFIED'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {item.options?.values?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {item.options?.labels?.[option] || option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {item.helpText && (
              <p className="text-xs text-gray-500">{item.helpText}</p>
            )}
          </div>
        );

      case 'SECTION_HEADER':
        return (
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            {item.label}
          </h3>
        );

      default:
        return (
          <div className="text-sm text-gray-500">
            Unsupported field type: {item.itemType}
          </div>
        );
    }
  };

  const getStatusBadge = (status: ChecklistInstanceStatus) => {
    switch (status) {
      case 'NOT_STARTED':
        return <Badge variant="outline">Not Started</Badge>;
      case 'IN_PROGRESS':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'VERIFIED':
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <FileCheck className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!instance) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Checklist not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{instance.template?.name}</h2>
            {instance.template?.description && (
              <p className="text-gray-600 mt-1">{instance.template.description}</p>
            )}
          </div>
          {getStatusBadge(instance.status)}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700">
              Completion Progress: {progress.answered} of {progress.total} items
            </span>
            <span className="font-semibold">{progress.percent}%</span>
          </div>
          <Progress value={progress.percent} className="h-2" />
        </div>

        {/* Due Date */}
        {instance.dueAt && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Due: {format(new Date(instance.dueAt), 'MMM d, yyyy h:mm a')}</span>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <Card key={section.name} className="p-6">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">{section.name}</h3>
            <div className="space-y-4">
              {section.items
                .filter((item) => shouldShowItem(item))
                .map((item) => (
                  <div key={item.id} className="space-y-2">
                    {renderField(item)}
                  </div>
                ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      {instance.status !== 'VERIFIED' && instance.status !== 'CANCELLED' && (
        <div className="flex justify-end gap-3 sticky bottom-0 bg-white p-4 border-t">
          {instance.status !== 'COMPLETED' && (
            <Button
              onClick={handleComplete}
              disabled={
                completeInstance.isPending ||
                progress.percent < (instance.template?.minimumCompletionPercent || 100)
              }
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          )}
          {instance.status === 'COMPLETED' && instance.template?.requiresVerification && (
            <Button
              onClick={handleVerify}
              disabled={verifyInstance.isPending}
              variant="default"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Verify
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
