'use client';

import { useMemo } from 'react';
import { FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ToneBadge } from '@/components/ui/tone-badge';
import { TONE_TEXT } from '@/components/ui/tone-classes';
import { interpretationArrow, interpretationLabel, interpretationTone } from '../../../utils/lab-result-tone';
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

  const flagged = report.items.filter((item) => item.abnormalFlag || item.criticalFlag).length;
  const critical = report.items.filter((item) => item.criticalFlag).length;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/60 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-lg font-semibold tracking-tight">Lab Report</h2>
          <ResultStatusBadge status={report.reportStatus} />
          <ReportVersionIndicator
            version={report.version}
            reportStatus={report.reportStatus}
            previousVersionId={report.previousVersionId}
          />
          {critical > 0 ? (
            <ToneBadge tone="red" strong>
              {critical} critical
            </ToneBadge>
          ) : null}
          {flagged - critical > 0 ? <ToneBadge tone="amber">{flagged - critical} abnormal</ToneBadge> : null}
        </div>
        <div className="print:hidden">
          <ResultStatusWorkflow currentStatus={report.reportStatus} />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No result items"
          description="This report was finalised without analyte rows."
          className="py-10"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2.5 pl-5 pr-3 text-left font-medium">Test</th>
                <th className="px-3 py-2.5 text-right font-medium">Result</th>
                <th className="px-3 py-2.5 text-left font-medium">Unit</th>
                <th className="px-3 py-2.5 text-left font-medium">Reference Range</th>
                <th className="px-3 py-2.5 text-left font-medium">Status</th>
                <th className="py-2.5 pl-3 pr-5 text-left font-medium">Comment</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) =>
                row.kind === 'group' ? (
                  <tr key={row.key} className="border-b border-border/60 bg-muted/20">
                    <td className="py-2 pl-5 pr-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground" colSpan={6}>
                      {row.label}
                    </td>
                  </tr>
                ) : (
                  (() => {
                    const item = row.item;
                    const tone = item.criticalFlag ? 'red' : item.abnormalFlag ? 'amber' : null;
                    const arrow = interpretationArrow(item.interpretation);
                    return (
                      <tr
                        key={row.key}
                        className={cn(
                          'border-b border-border/40 last:border-b-0',
                          item.criticalFlag && 'bg-red-50/70 dark:bg-red-950/30',
                          item.abnormalFlag && !item.criticalFlag && 'bg-amber-50/60 dark:bg-amber-950/20',
                        )}
                      >
                        <td
                          className={cn(
                            'border-l-[3px] py-2.5 pl-[17px] pr-3',
                            tone === 'red' ? 'border-l-red-500' : tone === 'amber' ? 'border-l-amber-400' : 'border-l-transparent',
                            row.indentLevel > 0 && 'pl-9',
                          )}
                        >
                          <div className="font-medium text-foreground">{item.testName}</div>
                          {item.testCode ? (
                            <div className="font-mono text-[11px] text-muted-foreground">{item.testCode}</div>
                          ) : null}
                        </td>
                        <td
                          className={cn(
                            'px-3 py-2.5 text-right font-mono text-base tabular-nums',
                            tone ? cn('font-semibold', TONE_TEXT[tone]) : 'text-foreground',
                          )}
                        >
                          {item.valueNumeric != null
                            ? item.valueNumeric
                            : item.valueString || item.valueCode || '-'}
                          {arrow ? <span className="ml-1 text-sm" aria-hidden="true">{arrow}</span> : null}
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">{item.unit || '-'}</td>
                        <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{formatRange(item)}</td>
                        <td className="px-3 py-2.5">
                          {item.interpretation ? (
                            <ToneBadge tone={interpretationTone(item.interpretation)} strong={Boolean(item.criticalFlag)}>
                              {interpretationLabel(item.interpretation)}
                            </ToneBadge>
                          ) : null}
                        </td>
                        <td className="py-2.5 pl-3 pr-5 text-muted-foreground">{item.comment || ''}</td>
                      </tr>
                    );
                  })()
                ),
              )}
            </tbody>
          </table>
        </div>
      )}

      {report.comments && (
        <div className="border-t border-border/60 px-5 py-4">
          <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Comments</h3>
          <p className="whitespace-pre-wrap text-sm text-foreground">{report.comments}</p>
        </div>
      )}

      {(report.reportedAt || report.verifiedAt) && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border/60 bg-muted/20 px-5 py-3 text-xs text-muted-foreground">
          {report.reportedAt && (
            <span>
              Reported <span className="font-medium text-foreground">{new Date(report.reportedAt).toLocaleString()}</span>
            </span>
          )}
          {report.verifiedAt && (
            <span>
              Verified <span className="font-medium text-foreground">{new Date(report.verifiedAt).toLocaleString()}</span>
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
