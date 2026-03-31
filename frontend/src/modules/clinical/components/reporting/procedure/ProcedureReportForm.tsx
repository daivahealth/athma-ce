'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResultStatusBadge } from '../ResultStatusBadge';
import { ResultStatusWorkflow } from '../ResultStatusWorkflow';
import { ReportVersionIndicator } from '../ReportVersionIndicator';
import { ReportEditor } from '../ReportEditor';
import { ReportStatus } from '../../../types/reporting';
import type { ProcedureReport, UpdateProcedureReportInput } from '../../../types/reporting';
import {
  useUpdateProcedureReport,
  useTransitionProcedureReportStatus,
} from '../../../hooks/use-reporting';

interface ProcedureReportFormProps {
  report: ProcedureReport;
  onSaved?: () => void;
}

export function ProcedureReportForm({ report, onSaved }: ProcedureReportFormProps) {
  const isEditable =
    report.reportStatus === ReportStatus.DRAFT || report.reportStatus === ReportStatus.PRELIMINARY;

  const [reportContent, setReportContent] = useState<Record<string, any> | undefined>(
    report.reportContent || undefined,
  );
  const [metaData, setMetaData] = useState({
    startTime: report.startTime?.slice(0, 16) || '',
    endTime: report.endTime?.slice(0, 16) || '',
    durationMinutes: report.durationMinutes ?? undefined as number | undefined,
  });

  const updateReport = useUpdateProcedureReport();
  const transitionStatus = useTransitionProcedureReportStatus();

  const handleContentChange = useCallback((content: Record<string, any>) => {
    setReportContent(content);
  }, []);

  const updateMeta = (field: keyof typeof metaData, value: any) => {
    setMetaData((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = (): UpdateProcedureReportInput => ({
    reportContent: reportContent,
    startTime: metaData.startTime || undefined,
    endTime: metaData.endTime || undefined,
    durationMinutes: metaData.durationMinutes,
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
          <h2 className="text-lg font-semibold">Procedure Report</h2>
          <ResultStatusBadge status={report.reportStatus} />
          <ReportVersionIndicator
            version={report.version}
            reportStatus={report.reportStatus}
            previousVersionId={report.previousVersionId}
          />
        </div>
        <ResultStatusWorkflow currentStatus={report.reportStatus} />
      </div>

      {/* Procedure Metadata */}
      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Procedure Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={metaData.startTime}
              onChange={(e) => updateMeta('startTime', e.target.value)}
              disabled={!isEditable}
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={metaData.endTime}
              onChange={(e) => updateMeta('endTime', e.target.value)}
              disabled={!isEditable}
            />
          </div>
          <div>
            <Label htmlFor="durationMinutes">Duration (min)</Label>
            <Input
              id="durationMinutes"
              type="number"
              value={metaData.durationMinutes ?? ''}
              onChange={(e) =>
                updateMeta('durationMinutes', e.target.value ? parseInt(e.target.value) : undefined)
              }
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>

      {/* Report Editor */}
      <div>
        <h3 className="text-sm font-medium mb-2">Report Content</h3>
        <ReportEditor
          content={reportContent}
          onChange={handleContentChange}
          editable={isEditable}
          placeholder="Start typing your procedure report...

Use headings to organize sections like Indication, Procedure Description, Findings, Complications, Post-Procedure Instructions, etc."
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
