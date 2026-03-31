'use client';

import { ResultStatusBadge } from '../ResultStatusBadge';
import { ResultStatusWorkflow } from '../ResultStatusWorkflow';
import { ReportVersionIndicator } from '../ReportVersionIndicator';
import { ReportContentViewer } from '../ReportEditor';
import type { ProcedureReport } from '../../../types/reporting';

interface ProcedureReportViewerProps {
  report: ProcedureReport;
}

export function ProcedureReportViewer({ report }: ProcedureReportViewerProps) {
  const hasLegacyContent =
    report.indication ||
    report.procedureDescription ||
    report.findings ||
    report.complications ||
    report.postProcedureInstructions;

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

      {/* Report Content (Block Editor) */}
      {report.reportContent && (
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-2">Report</h3>
          <ReportContentViewer content={report.reportContent} />
        </div>
      )}

      {/* Legacy Structured Sections (for old reports without reportContent) */}
      {!report.reportContent && hasLegacyContent && (
        <div className="rounded-lg border p-4 space-y-4">
          <LegacySection label="Indication" content={report.indication} />
          <LegacySection label="Procedure Description" content={report.procedureDescription} />
          <LegacySection label="Findings" content={report.findings} />
          <LegacySection label="Complications" content={report.complications} />
          <LegacySection label="Post-Procedure Instructions" content={report.postProcedureInstructions} />
        </div>
      )}

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

function LegacySection({ label, content }: { label: string; content?: string | null }) {
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
