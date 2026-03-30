'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
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

  const updateReport = useUpdateImagingReport();
  const transitionStatus = useTransitionImagingReportStatus();

  const handleContentChange = useCallback((content: Record<string, any>) => {
    setReportContent(content);
  }, []);

  const buildPayload = (): UpdateImagingReportInput => ({
    reportContent: reportContent,
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
