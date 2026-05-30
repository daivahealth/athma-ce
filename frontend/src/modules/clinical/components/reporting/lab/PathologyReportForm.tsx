'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ResultStatusBadge } from '../ResultStatusBadge';
import { ResultStatusWorkflow } from '../ResultStatusWorkflow';
import { ReportVersionIndicator } from '../ReportVersionIndicator';
import { ReportStatus, type PathologyReport, type UpdatePathologyReportInput } from '../../../types/reporting';
import {
  useTransitionPathologyReportStatus,
  useUpdatePathologyReport,
} from '../../../hooks/use-reporting';
import { useCompleteLabResultEntry, useLabResultEntryContexts } from '../../../hooks/use-lab-operations';

interface PathologyReportFormProps {
  report: PathologyReport;
  labOrderTestId?: string;
  onSaved?: () => void;
}

export function PathologyReportForm({
  report,
  labOrderTestId,
  onSaved,
}: PathologyReportFormProps) {
  const isEditable =
    report.reportStatus === ReportStatus.DRAFT || report.reportStatus === ReportStatus.PRELIMINARY;

  const [formData, setFormData] = useState({
    specimenType: report.specimenType ?? '',
    collectionDate: report.collectionDate ? report.collectionDate.slice(0, 16) : '',
    receivedDate: report.receivedDate ? report.receivedDate.slice(0, 16) : '',
    clinicalHistory: report.clinicalHistory ?? '',
    specimenReceived: report.specimenReceived ?? '',
    grossDescription: report.grossDescription ?? '',
    microscopicDescription: report.microscopicDescription ?? '',
    diagnosis: report.diagnosis ?? '',
    comment: report.comment ?? '',
    internalNotes: report.internalNotes ?? '',
  });

  const updateReport = useUpdatePathologyReport();
  const transitionStatus = useTransitionPathologyReportStatus();
  const completeResultEntry = useCompleteLabResultEntry();
  const { data: contexts } = useLabResultEntryContexts(labOrderTestId ? [labOrderTestId] : []);
  const specimenId = contexts?.[0]?.specimen.id;

  const buildPayload = useMemo(
    () =>
      (): UpdatePathologyReportInput => ({
        specimenType: formData.specimenType || undefined,
        collectionDate: formData.collectionDate || undefined,
        receivedDate: formData.receivedDate || undefined,
        clinicalHistory: formData.clinicalHistory || undefined,
        specimenReceived: formData.specimenReceived || undefined,
        grossDescription: formData.grossDescription || undefined,
        microscopicDescription: formData.microscopicDescription || undefined,
        diagnosis: formData.diagnosis || undefined,
        comment: formData.comment || undefined,
        internalNotes: formData.internalNotes || undefined,
      }),
    [formData],
  );

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const markWorkflowCompleteIfNeeded = async () => {
    if (!labOrderTestId) return;
    await completeResultEntry.mutateAsync({
      labOrderTestId,
      specimenId,
    });
  };

  const handleSave = async () => {
    await updateReport.mutateAsync({ id: report.id, data: buildPayload() });
    onSaved?.();
  };

  const handleSubmit = async (status: ReportStatus.PRELIMINARY | ReportStatus.FINAL) => {
    await updateReport.mutateAsync({ id: report.id, data: buildPayload() });
    await transitionStatus.mutateAsync({ id: report.id, status });
    await markWorkflowCompleteIfNeeded();
    onSaved?.();
  };

  const isSaving =
    updateReport.isPending || transitionStatus.isPending || completeResultEntry.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Results</h2>
          <ResultStatusBadge status={report.reportStatus} />
          <ReportVersionIndicator
            version={report.version}
            reportStatus={report.reportStatus}
            previousVersionId={report.previousVersionId}
          />
        </div>
        <ResultStatusWorkflow currentStatus={report.reportStatus} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pathology Report Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Specimen Type">
              <Input
                value={formData.specimenType}
                onChange={(event) => updateField('specimenType', event.target.value)}
                disabled={!isEditable}
                placeholder="Biopsy / tissue / aspirate"
              />
            </Field>
            <Field label="Collection Date">
              <Input
                type="datetime-local"
                value={formData.collectionDate}
                onChange={(event) => updateField('collectionDate', event.target.value)}
                disabled={!isEditable}
              />
            </Field>
            <Field label="Received Date">
              <Input
                type="datetime-local"
                value={formData.receivedDate}
                onChange={(event) => updateField('receivedDate', event.target.value)}
                disabled={!isEditable}
              />
            </Field>
          </div>

          <Field label="Clinical History">
            <Textarea
              value={formData.clinicalHistory}
              onChange={(event) => updateField('clinicalHistory', event.target.value)}
              disabled={!isEditable}
              className="min-h-24"
              placeholder="Relevant clinical history, provisional diagnosis, and indication."
            />
          </Field>

          <Field label="Specimen Received">
            <Textarea
              value={formData.specimenReceived}
              onChange={(event) => updateField('specimenReceived', event.target.value)}
              disabled={!isEditable}
              className="min-h-24"
              placeholder="Describe containers, laterality, labeling, and part count."
            />
          </Field>

          <Field label="Gross Description">
            <Textarea
              value={formData.grossDescription}
              onChange={(event) => updateField('grossDescription', event.target.value)}
              disabled={!isEditable}
              className="min-h-32"
              placeholder="Gross specimen description."
            />
          </Field>

          <Field label="Microscopic Description">
            <Textarea
              value={formData.microscopicDescription}
              onChange={(event) => updateField('microscopicDescription', event.target.value)}
              disabled={!isEditable}
              className="min-h-40"
              placeholder="Microscopy findings."
            />
          </Field>

          <Field label="Diagnosis">
            <Textarea
              value={formData.diagnosis}
              onChange={(event) => updateField('diagnosis', event.target.value)}
              disabled={!isEditable}
              className="min-h-28"
              placeholder="Final diagnosis / impression."
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Comment">
              <Textarea
                value={formData.comment}
                onChange={(event) => updateField('comment', event.target.value)}
                disabled={!isEditable}
                className="min-h-24"
                placeholder="Additional comment for the shared report."
              />
            </Field>
            <Field label="Internal Notes">
              <Textarea
                value={formData.internalNotes}
                onChange={(event) => updateField('internalNotes', event.target.value)}
                disabled={!isEditable}
                className="min-h-24"
                placeholder="Internal notes not intended for the printed report."
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {isEditable ? (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            Save Draft
          </Button>
          {report.reportStatus === ReportStatus.DRAFT ? (
            <Button
              variant="secondary"
              onClick={() => handleSubmit(ReportStatus.PRELIMINARY)}
              disabled={isSaving}
            >
              Submit as Preliminary
            </Button>
          ) : null}
          <Button onClick={() => handleSubmit(ReportStatus.FINAL)} disabled={isSaving}>
            Finalize Report
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
