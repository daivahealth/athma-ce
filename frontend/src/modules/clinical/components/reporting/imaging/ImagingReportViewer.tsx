'use client';

import { cn } from '@/lib/utils';
import { ResultStatusBadge } from '../ResultStatusBadge';
import { ResultStatusWorkflow } from '../ResultStatusWorkflow';
import { ReportVersionIndicator } from '../ReportVersionIndicator';
import type { ImagingReport } from '../../../types/reporting';

interface ImagingReportViewerProps {
  report: ImagingReport;
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

export function ImagingReportViewer({ report }: ImagingReportViewerProps) {
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

      {/* Critical Finding Banner */}
      {report.criticalFinding && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="font-semibold text-red-700">CRITICAL FINDING</p>
          {report.criticalFindingNotifiedAt && (
            <p className="text-sm text-red-600 mt-1">
              Notified: {new Date(report.criticalFindingNotifiedAt).toLocaleString()}
              {report.criticalFindingAcknowledgedAt &&
                ` | Acknowledged: ${new Date(report.criticalFindingAcknowledgedAt).toLocaleString()}`}
            </p>
          )}
        </div>
      )}

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
          {report.accessionNumber && (
            <div>
              <span className="text-muted-foreground">Accession #:</span>{' '}
              <span className="font-medium">{report.accessionNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Report Sections */}
      <div className="rounded-lg border p-4 space-y-4">
        <Section label="Technique" content={report.technique} />
        <Section label="Comparison" content={report.comparison} />
        <Section label="Findings" content={report.findings} />
        <Section label="Impression" content={report.impression} />
        <Section label="Recommendations" content={report.recommendations} />
      </div>

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
        {report.reviewedAt && <span>Reviewed: {new Date(report.reviewedAt).toLocaleString()}</span>}
      </div>
    </div>
  );
}
