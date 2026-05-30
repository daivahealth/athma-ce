'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportVersionIndicator } from '../ReportVersionIndicator';
import { ResultStatusBadge } from '../ResultStatusBadge';
import type { PathologyReport } from '../../../types/reporting';

interface PathologyReportViewerProps {
  report: PathologyReport;
}

const sections: Array<{ key: keyof PathologyReport; label: string }> = [
  { key: 'clinicalHistory', label: 'Clinical History' },
  { key: 'specimenReceived', label: 'Specimen Received' },
  { key: 'grossDescription', label: 'Gross Description' },
  { key: 'microscopicDescription', label: 'Microscopic Description' },
  { key: 'diagnosis', label: 'Diagnosis' },
  { key: 'comment', label: 'Comment' },
];

export function PathologyReportViewer({ report }: PathologyReportViewerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Results</h2>
          <ResultStatusBadge status={report.reportStatus} />
          <ReportVersionIndicator
            version={report.version}
            reportStatus={report.reportStatus}
            previousVersionId={report.previousVersionId}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/20">
          <CardTitle>Pathology Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {sections
            .filter(({ key }) => Boolean(report[key]))
            .map(({ key, label }) => (
              <div key={key}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </h3>
                <div className="mt-2 whitespace-pre-wrap rounded-lg border bg-background px-4 py-3 text-sm leading-6">
                  {report[key]}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
