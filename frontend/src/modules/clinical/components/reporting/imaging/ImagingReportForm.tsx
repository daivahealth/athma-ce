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
import type { ImagingReport, UpdateImagingReportInput } from '../../../types/reporting';
import {
  useUpdateImagingReport,
  useTransitionImagingReportStatus,
} from '../../../hooks/use-reporting';

interface ImagingReportFormProps {
  report: ImagingReport;
  onSaved?: () => void;
}

export function ImagingReportForm({ report, onSaved }: ImagingReportFormProps) {
  const isEditable =
    report.reportStatus === ReportStatus.DRAFT || report.reportStatus === ReportStatus.PRELIMINARY;

  const [formData, setFormData] = useState<UpdateImagingReportInput>({
    technique: report.technique || '',
    comparison: report.comparison || '',
    findings: report.findings || '',
    impression: report.impression || '',
    recommendations: report.recommendations || '',
    criticalFinding: report.criticalFinding,
    comments: report.comments || '',
  });

  const updateReport = useUpdateImagingReport();
  const transitionStatus = useTransitionImagingReportStatus();

  const updateField = (field: keyof UpdateImagingReportInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await updateReport.mutateAsync({ id: report.id, data: formData });
    onSaved?.();
  };

  const handleSubmitPreliminary = async () => {
    await handleSave();
    await transitionStatus.mutateAsync({ id: report.id, status: ReportStatus.PRELIMINARY });
    onSaved?.();
  };

  const handleSubmitFinal = async () => {
    await handleSave();
    await transitionStatus.mutateAsync({ id: report.id, status: ReportStatus.FINAL });
    onSaved?.();
  };

  const isSaving = updateReport.isPending || transitionStatus.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Imaging Report</h2>
          <ResultStatusBadge status={report.reportStatus} />
          <ReportVersionIndicator
            version={report.version}
            reportStatus={report.reportStatus}
            previousVersionId={report.previousVersionId}
          />
        </div>
        <ResultStatusWorkflow currentStatus={report.reportStatus} />
      </div>

      {/* Study Info */}
      <div className="rounded-lg border p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {report.modality && (
            <div>
              <span className="text-muted-foreground">Modality:</span>{' '}
              <span className="font-medium">{report.modality}</span>
            </div>
          )}
          {report.bodyPart && (
            <div>
              <span className="text-muted-foreground">Body Part:</span>{' '}
              <span className="font-medium">{report.bodyPart}</span>
            </div>
          )}
        </div>
      </div>

      {/* Critical Finding Toggle */}
      <div
        className={cn(
          'rounded-lg border p-4',
          formData.criticalFinding && 'border-red-300 bg-red-50',
        )}
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.criticalFinding || false}
            onChange={(e) => updateField('criticalFinding', e.target.checked)}
            disabled={!isEditable}
            className="h-4 w-4"
          />
          <span className={cn('font-medium', formData.criticalFinding && 'text-red-700')}>
            Critical Finding
          </span>
        </label>
        {formData.criticalFinding && (
          <p className="mt-2 text-sm text-red-600">
            This report contains a critical finding. The ordering clinician must be notified.
          </p>
        )}
      </div>

      {/* Report Sections */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="technique">Technique</Label>
          <Textarea
            id="technique"
            value={formData.technique || ''}
            onChange={(e) => updateField('technique', e.target.value)}
            disabled={!isEditable}
            placeholder="Describe the imaging technique used..."
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="comparison">Comparison</Label>
          <Textarea
            id="comparison"
            value={formData.comparison || ''}
            onChange={(e) => updateField('comparison', e.target.value)}
            disabled={!isEditable}
            placeholder="Comparison with prior studies..."
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="findings">Findings</Label>
          <Textarea
            id="findings"
            value={formData.findings || ''}
            onChange={(e) => updateField('findings', e.target.value)}
            disabled={!isEditable}
            placeholder="Describe the imaging findings..."
            rows={6}
          />
        </div>
        <div>
          <Label htmlFor="impression">Impression</Label>
          <Textarea
            id="impression"
            value={formData.impression || ''}
            onChange={(e) => updateField('impression', e.target.value)}
            disabled={!isEditable}
            placeholder="Clinical impression and conclusion..."
            rows={4}
            className={cn(formData.criticalFinding && 'border-red-300')}
          />
        </div>
        <div>
          <Label htmlFor="recommendations">Recommendations</Label>
          <Textarea
            id="recommendations"
            value={formData.recommendations || ''}
            onChange={(e) => updateField('recommendations', e.target.value)}
            disabled={!isEditable}
            placeholder="Follow-up recommendations..."
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="comments">Additional Comments</Label>
          <Textarea
            id="comments"
            value={formData.comments || ''}
            onChange={(e) => updateField('comments', e.target.value)}
            disabled={!isEditable}
            placeholder="Additional comments..."
            rows={2}
          />
        </div>
      </div>

      {/* Actions */}
      {isEditable && (
        <div className="flex justify-end gap-3">
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
      )}
    </div>
  );
}
