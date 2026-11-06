'use client';

import { useMemo, useState } from 'react';
import { FlaskConical, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ToneBadge } from '@/components/ui/tone-badge';
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
import { useClinicalOrder } from '../../../hooks/use-charting';
import {
  useCompleteLabResultEntry,
  useLabResultEntryContexts,
} from '../../../hooks/use-lab-operations';
import { useLabTestResultTemplates } from '@/modules/foundation/hooks/use-catalogs';
import { buildLabDisplayRows } from './lab-report-grouping';
import { interpretationArrow, interpretationLabel, interpretationTone } from '../../../utils/lab-result-tone';

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
  const completeResultEntry = useCompleteLabResultEntry();
  const { data: order } = useClinicalOrder(report.orderId);
  const labOrderTestIds = (order?.labTests ?? [])
    .map((labTest) => labTest.id)
    .filter((id): id is string => Boolean(id));
  const { data: resultContexts = [] } = useLabResultEntryContexts(labOrderTestIds);
  const labTestMasterId = order?.labTests?.find((labTest) => Boolean(labTest.labTestMasterId))?.labTestMasterId;
  const { data: labTestTemplates } = useLabTestResultTemplates(labTestMasterId);
  const displayRows = useMemo(
    () =>
      buildLabDisplayRows(
        items,
        order,
        labTestMasterId && labTestTemplates ? { [labTestMasterId]: labTestTemplates } : undefined,
      ),
    [items, order, labTestMasterId, labTestTemplates],
  );

  const updateItem = (index: number, field: keyof LabResultItemInput, value: unknown) => {
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

  const findItemIndex = (rowKey: string, rowCode: string, rowCodeSystem?: string | null) =>
    items.findIndex(
      (item, index) =>
        (item.id ?? `${item.testCode}:${item.codeSystem ?? 'LOINC'}:${index}`) === rowKey ||
        (item.testCode === rowCode && (item.codeSystem ?? 'LOINC') === (rowCodeSystem ?? 'LOINC')),
    );

  const handleSave = async () => {
    await updateReport.mutateAsync({
      id: report.id,
      data: reportData,
    });
    await saveItems.mutateAsync({
      reportId: report.id,
      items,
    });
    onSaved?.();
  };

  const handleCompleteWorkflow = async () => {
    const actionableContexts = resultContexts.filter(
      (context) => context.labOrderTest.status !== 'result_entered',
    );

    await Promise.all(
      actionableContexts.map((context) =>
        completeResultEntry.mutateAsync({
          labOrderTestId: context.labOrderTest.id,
          specimenId: context.specimen.id,
        }),
      ),
    );
  };

  const handleSubmitPreliminary = async () => {
    await handleSave();
    await handleCompleteWorkflow();
    await transitionStatus.mutateAsync({
      id: report.id,
      status: ReportStatus.PRELIMINARY,
    });
    onSaved?.();
  };

  const handleSubmitFinal = async () => {
    await handleSave();
    await handleCompleteWorkflow();
    await transitionStatus.mutateAsync({
      id: report.id,
      status: ReportStatus.FINAL,
    });
    onSaved?.();
  };

  const isSaving =
    updateReport.isPending ||
    saveItems.isPending ||
    transitionStatus.isPending ||
    completeResultEntry.isPending;

  const enteredCount = items.filter(
    (item) => item.valueNumeric != null || Boolean(item.valueString) || Boolean(item.valueCode),
  ).length;
  const criticalCount = items.filter((item) => item.criticalFlag).length;
  const abnormalCount = items.filter((item) => item.abnormalFlag && !item.criticalFlag).length;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/60 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-lg font-semibold tracking-tight">Results</h2>
          <ResultStatusBadge status={report.reportStatus} />
          <ReportVersionIndicator
            version={report.version}
            reportStatus={report.reportStatus}
            previousVersionId={report.previousVersionId}
          />
        </div>
        <ResultStatusWorkflow currentStatus={report.reportStatus} />
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Result Items</h3>
          {isEditable && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={addItem}>
              <Plus className="h-3.5 w-3.5" />
              Add Item
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto px-5 pb-2 pt-3">
        <div className="min-w-[960px]">
          <div className="grid grid-cols-12 gap-2 rounded-lg bg-muted/40 px-2 py-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <div className="col-span-2">Test Name</div>
            <div className="col-span-1">Code</div>
            <div className="col-span-2">Value</div>
            <div className="col-span-1">Unit</div>
            <div className="col-span-1">Ref Low</div>
            <div className="col-span-1">Ref High</div>
            <div className="col-span-1">Flag</div>
            <div className="col-span-2">Comment</div>
            <div className="col-span-1" />
          </div>

          <div className="mt-1 space-y-1">
            {displayRows.map((row) => {
              if (row.kind === 'group') {
                return (
                  <div
                    key={row.key}
                    className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {row.label}
                  </div>
                );
              }

              const index = findItemIndex(row.key, row.item.testCode, row.item.codeSystem);
              if (index === -1) return null;

              const item = items[index];
              const isAbnormal = item.abnormalFlag;
              const isCritical = item.criticalFlag;
              const arrow = interpretationArrow(item.interpretation);

              return (
                <div
                  key={row.key}
                  className={cn(
                    'grid grid-cols-12 items-center gap-2 rounded-lg border-l-[3px] px-2 py-1.5 transition-colors',
                    isCritical
                      ? 'border-l-red-500 bg-red-50/70 dark:bg-red-950/30'
                      : isAbnormal
                        ? 'border-l-amber-400 bg-amber-50/60 dark:bg-amber-950/20'
                        : 'border-l-transparent hover:bg-muted/30',
                  )}
                >
                  <div className={cn('col-span-2', row.indentLevel > 0 && 'pl-4')}>
                    <Input
                      value={item.testName}
                      onChange={(e) => updateItem(index, 'testName', e.target.value)}
                      disabled={!isEditable}
                      placeholder="Test name"
                      aria-label="Test name"
                      className="h-8 text-sm font-medium"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={item.testCode}
                      onChange={(e) => updateItem(index, 'testCode', e.target.value)}
                      disabled={!isEditable}
                      placeholder="LOINC"
                      aria-label="Test code"
                      className="h-8 font-mono text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="relative">
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
                        aria-label={`${item.testName || 'Result'} value`}
                        className={cn(
                          'h-8 pr-7 font-mono text-sm tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                          isCritical && 'border-red-500 font-bold text-red-700 focus-visible:ring-red-500 dark:text-red-300',
                          isAbnormal && !isCritical && 'border-amber-500 font-semibold text-amber-700 focus-visible:ring-amber-500 dark:text-amber-300',
                        )}
                      />
                      {arrow ? (
                        <span
                          className={cn(
                            'pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold',
                            isCritical ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400',
                          )}
                          aria-hidden="true"
                        >
                          {arrow}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={item.unit || ''}
                      onChange={(e) => updateItem(index, 'unit', e.target.value)}
                      disabled={!isEditable}
                      placeholder="Unit"
                      aria-label="Unit"
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
                      aria-label="Reference low"
                      className="h-8 font-mono text-xs"
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
                      aria-label="Reference high"
                      className="h-8 font-mono text-xs"
                    />
                  </div>
                  <div className="col-span-1">
                    {item.interpretation ? (
                      <ToneBadge tone={interpretationTone(item.interpretation)} strong={Boolean(isCritical)}>
                        {interpretationLabel(item.interpretation)}
                      </ToneBadge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={item.comment || ''}
                      onChange={(e) => updateItem(index, 'comment', e.target.value)}
                      disabled={!isEditable}
                      placeholder="Comment"
                      aria-label="Comment"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {isEditable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Remove ${item.testName || 'row'}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {displayRows.length === 0 && (
            <EmptyState
              icon={FlaskConical}
              title="No result items yet"
              description="Press Add Item to start entering analyte values."
              className="py-8"
            />
          )}
        </div>
      </div>

      <div className="space-y-2 px-5 pb-5 pt-3">
        <Label htmlFor="comments" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Comments
        </Label>
        <Textarea
          id="comments"
          value={reportData.comments || ''}
          onChange={(e) => setReportData((prev) => ({ ...prev, comments: e.target.value }))}
          disabled={!isEditable}
          placeholder="Additional comments..."
          rows={3}
        />
      </div>

      {isEditable && (
        <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-border/60 bg-card/95 px-5 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/80 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{enteredCount}</span> of {items.length} values entered
            </span>
            {criticalCount > 0 ? (
              <ToneBadge tone="red" strong>
                {criticalCount} critical
              </ToneBadge>
            ) : null}
            {abnormalCount > 0 ? <ToneBadge tone="amber">{abnormalCount} abnormal</ToneBadge> : null}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={handleSave} disabled={isSaving}>
              Save Draft
            </Button>
            {report.reportStatus === ReportStatus.DRAFT && (
              <Button variant="secondary" onClick={handleSubmitPreliminary} disabled={isSaving}>
                Submit as Preliminary
              </Button>
            )}
            <Button onClick={handleSubmitFinal} disabled={isSaving}>
              Finalize Report
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
