'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ResultStatusBadge } from '../ResultStatusBadge';
import { ResultStatusWorkflow } from '../ResultStatusWorkflow';
import { ReportVersionIndicator } from '../ReportVersionIndicator';
import type { LabReport } from '../../../types/reporting';
import type { ClinicalOrder } from '../../../types/charting';
import type { LabTestResultTemplate } from '@/modules/foundation/types/catalog';
import { buildLabDisplayRows } from './lab-report-grouping';

interface LabReportViewerProps {
  report: LabReport;
  order?: ClinicalOrder | null;
  templateMap?: Record<string, LabTestResultTemplate[]>;
}

function formatRange(reportItem: LabReport['items'][number]): string {
  return (
    reportItem.refRangeText ||
    (reportItem.refRangeLow != null && reportItem.refRangeHigh != null
      ? `${reportItem.refRangeLow} - ${reportItem.refRangeHigh}`
      : '-')
  );
}

export function LabReportViewer({ report, order, templateMap }: LabReportViewerProps) {
  const rows = useMemo(
    () => buildLabDisplayRows(report.items, order, templateMap),
    [order, report, templateMap],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Lab Report</h2>
          <ResultStatusBadge status={report.reportStatus} />
          <ReportVersionIndicator
            version={report.version}
            reportStatus={report.reportStatus}
            previousVersionId={report.previousVersionId}
          />
        </div>
        <div className="print:hidden">
          <ResultStatusWorkflow currentStatus={report.reportStatus} />
        </div>
      </div>

      {/* Results */}
      <div className="rounded-lg border overflow-hidden">
        {rows.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No result items</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Test Name</th>
                <th className="text-left px-3 py-2 font-medium">Code</th>
                <th className="text-right px-3 py-2 font-medium">Result</th>
                <th className="text-left px-3 py-2 font-medium">Unit</th>
                <th className="text-left px-3 py-2 font-medium">Reference Range</th>
                <th className="text-center px-3 py-2 font-medium">Status</th>
                <th className="text-left px-3 py-2 font-medium">Comment</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) =>
                row.kind === 'group' ? (
                  <tr key={row.key} className="border-t bg-muted/20">
                    <td className="px-3 py-2 font-semibold" colSpan={7}>
                      {row.label}
                    </td>
                  </tr>
                ) : (
                  (() => {
                    const item = row.item;
                    return (
                      <tr
                        key={row.key}
                        className={cn(
                          'border-t',
                          item.criticalFlag && 'bg-red-50',
                          item.abnormalFlag && !item.criticalFlag && 'bg-amber-50',
                        )}
                      >
                        <td className={cn('px-3 py-2 font-medium', row.indentLevel > 0 && 'pl-10')}>
                          {item.testName}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{item.testCode}</td>
                        <td
                          className={cn(
                            'px-3 py-2 text-right font-mono',
                            item.criticalFlag && 'text-red-700 font-bold',
                            item.abnormalFlag && !item.criticalFlag && 'text-amber-700 font-semibold',
                          )}
                        >
                          {item.valueNumeric != null
                            ? item.valueNumeric
                            : item.valueString || item.valueCode || '-'}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{item.unit || '-'}</td>
                        <td className="px-3 py-2 text-muted-foreground">{formatRange(item)}</td>
                        <td className="px-3 py-2 text-center">
                          {item.interpretation && (
                            <span
                              className={cn(
                                'text-xs px-2 py-0.5 rounded-full',
                                item.interpretation === 'normal' && 'bg-green-100 text-green-700',
                                (item.interpretation === 'high' || item.interpretation === 'low') &&
                                  'bg-amber-100 text-amber-700',
                                (item.interpretation === 'critical_high' ||
                                  item.interpretation === 'critical_low') &&
                                  'bg-red-100 text-red-700',
                              )}
                            >
                              {item.interpretation.replace('_', ' ')}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{item.comment || '-'}</td>
                      </tr>
                    );
                  })()
                ),
              )}
            </tbody>
          </table>
        )}
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
        {report.reportedAt && (
          <span>
            Reported: {new Date(report.reportedAt).toLocaleString()}
          </span>
        )}
        {report.verifiedAt && (
          <span>
            Verified: {new Date(report.verifiedAt).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}
