'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ResultStatusBadge } from '../ResultStatusBadge';
import { ResultStatusWorkflow } from '../ResultStatusWorkflow';
import { ReportVersionIndicator } from '../ReportVersionIndicator';
import { ReportStatus } from '../../../types/reporting';
import type { LabReport, LabResultItemInput, UpdateLabReportInput } from '../../../types/reporting';
import {
  useUpdateLabReport,
  useSaveLabResultItems,
  useTransitionLabReportStatus,
} from '../../../hooks/use-reporting';

interface LabResultEntryFormProps {
  report: LabReport;
  onSaved?: () => void;
}

function computeInterpretation(
  value: number | undefined,
  low: number | undefined,
  high: number | undefined,
): { interpretation: string; abnormal: boolean; critical: boolean } {
  if (value === undefined || (low === undefined && high === undefined)) {
    return { interpretation: '', abnormal: false, critical: false };
  }

  if (low !== undefined && high !== undefined) {
    const criticalLow = low * 0.5;
    const criticalHigh = high * 1.5;

    if (value <= criticalLow) return { interpretation: 'critical_low', abnormal: true, critical: true };
    if (value >= criticalHigh) return { interpretation: 'critical_high', abnormal: true, critical: true };
    if (value < low) return { interpretation: 'low', abnormal: true, critical: false };
    if (value > high) return { interpretation: 'high', abnormal: true, critical: false };
  }

  return { interpretation: 'normal', abnormal: false, critical: false };
}

export function LabResultEntryForm({ report, onSaved }: LabResultEntryFormProps) {
  const isEditable = report.reportStatus === ReportStatus.DRAFT || report.reportStatus === ReportStatus.PRELIMINARY;

  const [reportData, setReportData] = useState<UpdateLabReportInput>({
    specimenType: report.specimenType || '',
    collectionDate: report.collectionDate?.split('T')[0] || '',
    receivedDate: report.receivedDate?.split('T')[0] || '',
    comments: report.comments || '',
  });

  const [items, setItems] = useState<LabResultItemInput[]>(
    report.items.map((item) => ({
      id: item.id,
      testCode: item.testCode,
      codeSystem: item.codeSystem,
      testName: item.testName,
      testNameAr: item.testNameAr || undefined,
      valueNumeric: item.valueNumeric ?? undefined,
      valueString: item.valueString || undefined,
      unit: item.unit || undefined,
      refRangeLow: item.refRangeLow ?? undefined,
      refRangeHigh: item.refRangeHigh ?? undefined,
      refRangeText: item.refRangeText || undefined,
      interpretation: item.interpretation || undefined,
      abnormalFlag: item.abnormalFlag,
      criticalFlag: item.criticalFlag,
      comment: item.comment || undefined,
      sortOrder: item.sortOrder,
    })),
  );

  const updateReport = useUpdateLabReport();
  const saveItems = useSaveLabResultItems();
  const transitionStatus = useTransitionLabReportStatus();

  const updateItem = (index: number, field: string, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      // Auto-compute interpretation for numeric values
      if (field === 'valueNumeric' || field === 'refRangeLow' || field === 'refRangeHigh') {
        const item = updated[index];
        const result = computeInterpretation(
          item.valueNumeric,
          item.refRangeLow,
          item.refRangeHigh,
        );
        updated[index] = {
          ...updated[index],
          interpretation: result.interpretation || item.interpretation,
          abnormalFlag: result.abnormal,
          criticalFlag: result.critical,
        };
      }

      return updated;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        testCode: '',
        testName: '',
        sortOrder: prev.length,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    await updateReport.mutateAsync({
      id: report.id,
      orderId: report.orderId,
      data: reportData,
    });
    await saveItems.mutateAsync({
      reportId: report.id,
      items,
    });
    onSaved?.();
  };

  const handleSubmitPreliminary = async () => {
    await handleSave();
    await transitionStatus.mutateAsync({
      id: report.id,
      status: ReportStatus.PRELIMINARY,
    });
    onSaved?.();
  };

  const handleSubmitFinal = async () => {
    await handleSave();
    await transitionStatus.mutateAsync({
      id: report.id,
      status: ReportStatus.FINAL,
    });
    onSaved?.();
  };

  const isSaving = updateReport.isPending || saveItems.isPending || transitionStatus.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Lab Report</h2>
          <ResultStatusBadge status={report.reportStatus} />
          <ReportVersionIndicator
            version={report.version}
            reportStatus={report.reportStatus}
            previousVersionId={report.previousVersionId}
          />
        </div>
        <ResultStatusWorkflow currentStatus={report.reportStatus} />
      </div>

      {/* Specimen Info */}
      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Specimen Information</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="specimenType">Specimen Type</Label>
            <Input
              id="specimenType"
              value={reportData.specimenType || ''}
              onChange={(e) => setReportData((prev) => ({ ...prev, specimenType: e.target.value }))}
              disabled={!isEditable}
              placeholder="e.g., Blood, Urine"
            />
          </div>
          <div>
            <Label htmlFor="collectionDate">Collection Date</Label>
            <Input
              id="collectionDate"
              type="date"
              value={reportData.collectionDate || ''}
              onChange={(e) => setReportData((prev) => ({ ...prev, collectionDate: e.target.value }))}
              disabled={!isEditable}
            />
          </div>
          <div>
            <Label htmlFor="receivedDate">Received Date</Label>
            <Input
              id="receivedDate"
              type="date"
              value={reportData.receivedDate || ''}
              onChange={(e) => setReportData((prev) => ({ ...prev, receivedDate: e.target.value }))}
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>

      {/* Result Items */}
      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Result Items</h3>
          {isEditable && (
            <Button variant="outline" size="sm" onClick={addItem}>
              + Add Item
            </Button>
          )}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
          <div className="col-span-2">Test Name</div>
          <div className="col-span-1">Code</div>
          <div className="col-span-2">Value</div>
          <div className="col-span-1">Unit</div>
          <div className="col-span-1">Ref Low</div>
          <div className="col-span-1">Ref High</div>
          <div className="col-span-1">Interpretation</div>
          <div className="col-span-2">Comment</div>
          <div className="col-span-1"></div>
        </div>

        {/* Items */}
        {items.map((item, index) => {
          const isAbnormal = item.abnormalFlag;
          const isCritical = item.criticalFlag;

          return (
            <div
              key={index}
              className={cn(
                'grid grid-cols-12 gap-2 items-center py-1',
                isCritical && 'bg-red-50 rounded px-1',
                isAbnormal && !isCritical && 'bg-amber-50 rounded px-1',
              )}
            >
              <div className="col-span-2">
                <Input
                  value={item.testName}
                  onChange={(e) => updateItem(index, 'testName', e.target.value)}
                  disabled={!isEditable}
                  placeholder="Test name"
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-1">
                <Input
                  value={item.testCode}
                  onChange={(e) => updateItem(index, 'testCode', e.target.value)}
                  disabled={!isEditable}
                  placeholder="LOINC"
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  value={item.valueNumeric ?? ''}
                  onChange={(e) =>
                    updateItem(
                      index,
                      'valueNumeric',
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  disabled={!isEditable}
                  placeholder="Result"
                  className={cn(
                    'h-8 text-sm',
                    isCritical && 'border-red-500 text-red-700 font-bold',
                    isAbnormal && !isCritical && 'border-amber-500 text-amber-700 font-semibold',
                  )}
                />
              </div>
              <div className="col-span-1">
                <Input
                  value={item.unit || ''}
                  onChange={(e) => updateItem(index, 'unit', e.target.value)}
                  disabled={!isEditable}
                  placeholder="Unit"
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-1">
                <Input
                  type="number"
                  value={item.refRangeLow ?? ''}
                  onChange={(e) =>
                    updateItem(
                      index,
                      'refRangeLow',
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  disabled={!isEditable}
                  placeholder="Low"
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-1">
                <Input
                  type="number"
                  value={item.refRangeHigh ?? ''}
                  onChange={(e) =>
                    updateItem(
                      index,
                      'refRangeHigh',
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  disabled={!isEditable}
                  placeholder="High"
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-1">
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded',
                    item.interpretation === 'normal' && 'bg-green-100 text-green-700',
                    item.interpretation === 'high' && 'bg-amber-100 text-amber-700',
                    item.interpretation === 'low' && 'bg-amber-100 text-amber-700',
                    item.interpretation === 'critical_high' && 'bg-red-100 text-red-700',
                    item.interpretation === 'critical_low' && 'bg-red-100 text-red-700',
                  )}
                >
                  {item.interpretation || '-'}
                </span>
              </div>
              <div className="col-span-2">
                <Input
                  value={item.comment || ''}
                  onChange={(e) => updateItem(index, 'comment', e.target.value)}
                  disabled={!isEditable}
                  placeholder="Comment"
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-1">
                {isEditable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="h-8 w-8 p-0 text-red-500"
                  >
                    x
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            No result items. Click &quot;+ Add Item&quot; to begin entering results.
          </p>
        )}
      </div>

      {/* Comments */}
      <div className="rounded-lg border p-4 space-y-2">
        <Label htmlFor="comments">Comments</Label>
        <Textarea
          id="comments"
          value={reportData.comments || ''}
          onChange={(e) => setReportData((prev) => ({ ...prev, comments: e.target.value }))}
          disabled={!isEditable}
          placeholder="Additional comments..."
          rows={3}
        />
      </div>

      {/* Actions */}
      {isEditable && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            Save Draft
          </Button>
          {report.reportStatus === ReportStatus.DRAFT && (
            <Button
              variant="secondary"
              onClick={handleSubmitPreliminary}
              disabled={isSaving}
            >
              Submit as Preliminary
            </Button>
          )}
          <Button onClick={handleSubmitFinal} disabled={isSaving}>
            Finalize Report
          </Button>
        </div>
      )}
    </div>
  );
}
