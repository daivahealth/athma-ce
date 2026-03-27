'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ResultStatusBadge } from '../ResultStatusBadge';
import { ResultStatusWorkflow } from '../ResultStatusWorkflow';
import { ReportVersionIndicator } from '../ReportVersionIndicator';
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

  const [formData, setFormData] = useState<UpdateProcedureReportInput>({
    indication: report.indication || '',
    procedureDescription: report.procedureDescription || '',
    findings: report.findings || '',
    complications: report.complications || '',
    postProcedureInstructions: report.postProcedureInstructions || '',
    anesthesiaType: report.anesthesiaType || '',
    startTime: report.startTime?.slice(0, 16) || '',
    endTime: report.endTime?.slice(0, 16) || '',
    durationMinutes: report.durationMinutes ?? undefined,
    estimatedBloodLoss: report.estimatedBloodLoss || '',
    comments: report.comments || '',
  });

  const updateReport = useUpdateProcedureReport();
  const transitionStatus = useTransitionProcedureReportStatus();

  const updateField = (field: keyof UpdateProcedureReportInput, value: any) => {
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

      {/* Timing & Anesthesia */}
      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium">Procedure Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="anesthesiaType">Anesthesia Type</Label>
            <select
              id="anesthesiaType"
              value={formData.anesthesiaType || ''}
              onChange={(e) => updateField('anesthesiaType', e.target.value)}
              disabled={!isEditable}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select...</option>
              <option value="none">None</option>
              <option value="local">Local</option>
              <option value="regional">Regional</option>
              <option value="general">General</option>
              <option value="sedation">Conscious Sedation</option>
            </select>
          </div>
          <div>
            <Label htmlFor="estimatedBloodLoss">Estimated Blood Loss</Label>
            <Input
              id="estimatedBloodLoss"
              value={formData.estimatedBloodLoss || ''}
              onChange={(e) => updateField('estimatedBloodLoss', e.target.value)}
              disabled={!isEditable}
              placeholder="e.g., 50ml"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={formData.startTime || ''}
              onChange={(e) => updateField('startTime', e.target.value)}
              disabled={!isEditable}
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={formData.endTime || ''}
              onChange={(e) => updateField('endTime', e.target.value)}
              disabled={!isEditable}
            />
          </div>
          <div>
            <Label htmlFor="durationMinutes">Duration (min)</Label>
            <Input
              id="durationMinutes"
              type="number"
              value={formData.durationMinutes ?? ''}
              onChange={(e) =>
                updateField('durationMinutes', e.target.value ? parseInt(e.target.value) : undefined)
              }
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>

      {/* Report Sections */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="indication">Indication</Label>
          <Textarea
            id="indication"
            value={formData.indication || ''}
            onChange={(e) => updateField('indication', e.target.value)}
            disabled={!isEditable}
            placeholder="Indication for the procedure..."
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="procedureDescription">Procedure Description</Label>
          <Textarea
            id="procedureDescription"
            value={formData.procedureDescription || ''}
            onChange={(e) => updateField('procedureDescription', e.target.value)}
            disabled={!isEditable}
            placeholder="Detailed description of the procedure performed..."
            rows={6}
          />
        </div>
        <div>
          <Label htmlFor="findings">Findings</Label>
          <Textarea
            id="findings"
            value={formData.findings || ''}
            onChange={(e) => updateField('findings', e.target.value)}
            disabled={!isEditable}
            placeholder="Findings during the procedure..."
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="complications">Complications</Label>
          <Textarea
            id="complications"
            value={formData.complications || ''}
            onChange={(e) => updateField('complications', e.target.value)}
            disabled={!isEditable}
            placeholder="Any complications encountered (or 'None')..."
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="postProcedureInstructions">Post-Procedure Instructions</Label>
          <Textarea
            id="postProcedureInstructions"
            value={formData.postProcedureInstructions || ''}
            onChange={(e) => updateField('postProcedureInstructions', e.target.value)}
            disabled={!isEditable}
            placeholder="Post-procedure care instructions..."
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
