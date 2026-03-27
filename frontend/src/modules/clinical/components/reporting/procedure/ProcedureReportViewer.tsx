'use client';

import { ResultStatusBadge } from '../ResultStatusBadge';
import { ResultStatusWorkflow } from '../ResultStatusWorkflow';
import { ReportVersionIndicator } from '../ReportVersionIndicator';
import type { ProcedureReport } from '../../../types/reporting';

interface ProcedureReportViewerProps {
  report: ProcedureReport;
}

function Section({ label, content }: { label: string; content?: string | null }) {
  if (!content) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
        {label}
      </h4>
      <p className="text-sm whitespace-pre-wrap">{content}</p>
    </div>
  );
}

export function ProcedureReportViewer({ report }: ProcedureReportViewerProps) {
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

      {/* Procedure Details */}
      <div className="rounded-lg border p-4">
        <h3 className="font-medium mb-2">Procedure Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {report.anesthesiaType && (
            <div>
              <span className="text-muted-foreground">Anesthesia:</span>{' '}
              <span className="font-medium capitalize">{report.anesthesiaType}</span>
            </div>
          )}
          {report.estimatedBloodLoss && (
            <div>
              <span className="text-muted-foreground">Est. Blood Loss:</span>{' '}
              <span className="font-medium">{report.estimatedBloodLoss}</span>
            </div>
          )}
          {report.startTime && (
            <div>
              <span className="text-muted-foreground">Start:</span>{' '}
              <span className="font-medium">{new Date(report.startTime).toLocaleString()}</span>
            </div>
          )}
          {report.endTime && (
            <div>
              <span className="text-muted-foreground">End:</span>{' '}
              <span className="font-medium">{new Date(report.endTime).toLocaleString()}</span>
            </div>
          )}
          {report.durationMinutes != null && (
            <div>
              <span className="text-muted-foreground">Duration:</span>{' '}
              <span className="font-medium">{report.durationMinutes} minutes</span>
            </div>
          )}
        </div>
      </div>

      {/* Report Sections */}
      <div className="rounded-lg border p-4 space-y-4">
        <Section label="Indication" content={report.indication} />
        <Section label="Procedure Description" content={report.procedureDescription} />
        <Section label="Findings" content={report.findings} />
        <Section label="Complications" content={report.complications} />
        <Section label="Post-Procedure Instructions" content={report.postProcedureInstructions} />
      </div>

      {/* Specimens */}
      {report.specimens && report.specimens.length > 0 && (
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-2">Specimens</h3>
          <div className="space-y-1">
            {report.specimens.map((spec, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium">{spec.type}</span>
                {spec.sentTo && <span className="text-muted-foreground"> - Sent to: {spec.sentTo}</span>}
                {spec.label && <span className="text-muted-foreground"> ({spec.label})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      {report.comments && (
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-1">Comments</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.comments}</p>
        </div>
      )}

      {/* Authorship */}
      <div className="flex gap-6 text-sm text-muted-foreground">
        {report.reportedAt && <span>Reported: {new Date(report.reportedAt).toLocaleString()}</span>}
      </div>
    </div>
  );
}
