'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ResultStatusBadge } from '../ResultStatusBadge';
import { ResultStatusWorkflow } from '../ResultStatusWorkflow';
import { ReportVersionIndicator } from '../ReportVersionIndicator';
import { ReportEditor } from '../ReportEditor';
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

  const [reportContent, setReportContent] = useState<Record<string, any> | undefined>(
    report.reportContent || undefined,
  );
  const [criticalFinding, setCriticalFinding] = useState(report.criticalFinding);

  const updateReport = useUpdateImagingReport();
  const transitionStatus = useTransitionImagingReportStatus();

  const handleContentChange = useCallback((content: Record<string, any>) => {
    setReportContent(content);
  }, []);

  const buildPayload = (): UpdateImagingReportInput => ({
    reportContent: reportContent,
    criticalFinding,
  });

  const handleSave = async () => {
    await updateReport.mutateAsync({ id: report.id, data: buildPayload() });
    onSaved?.();
  };

  const handleSubmitPreliminary = async () => {
    await updateReport.mutateAsync({ id: report.id, data: buildPayload() });
    await transitionStatus.mutateAsync({ id: report.id, status: ReportStatus.PRELIMINARY });
    onSaved?.();
  };

  const handleSubmitFinal = async () => {
    await updateReport.mutateAsync({ id: report.id, data: buildPayload() });
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
          criticalFinding && 'border-red-300 bg-red-50',
        )}
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={criticalFinding}
            onChange={(e) => setCriticalFinding(e.target.checked)}
            disabled={!isEditable}
            className="h-4 w-4"
          />
          <span className={cn('font-medium', criticalFinding && 'text-red-700')}>
            Critical Finding
          </span>
        </label>
        {criticalFinding && (
          <p className="mt-2 text-sm text-red-600">
            This report contains a critical finding. The ordering clinician must be notified.
          </p>
        )}
      </div>

      {/* Report Editor */}
      <div>
        <h3 className="text-sm font-medium mb-2">Report Content</h3>
        <ReportEditor
          content={reportContent}
          onChange={handleContentChange}
          editable={isEditable}
          placeholder="Start typing your imaging report...

Use headings to organize sections like Technique, Findings, Impression, etc.
Use bullet lists for structured observations."
        />
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
