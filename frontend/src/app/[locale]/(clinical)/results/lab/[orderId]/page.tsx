'use client';

import { useParams } from 'next/navigation';
import {
  useCreateLabReport,
  useCreatePathologyReport,
  useEncounterResults,
  useLabReportsByOrder,
  usePathologyReportsByOrder,
} from '@/modules/clinical/hooks/use-reporting';
import { useClinicalOrder } from '@/modules/clinical/hooks/use-charting';
import { useLabResultEntryContexts } from '@/modules/clinical/hooks/use-lab-operations';
import { LabResultEntryForm } from '@/modules/clinical/components/reporting/lab/LabResultEntryForm';
import { LabReportViewer } from '@/modules/clinical/components/reporting/lab/LabReportViewer';
import { LabReportContextCard } from '@/modules/clinical/components/reporting/lab/LabReportContextCard';
import { PathologyReportForm } from '@/modules/clinical/components/reporting/lab/PathologyReportForm';
import { PathologyReportViewer } from '@/modules/clinical/components/reporting/lab/PathologyReportViewer';
import { ReportPatientHeader } from '@/modules/clinical/components/reporting/ReportPatientHeader';
import { ReportStatus, type LabReport, type PathologyReport } from '@/modules/clinical/types/reporting';
import { FilePlus2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useLabTest, useLabTestResultTemplates } from '@/modules/foundation/hooks/use-catalogs';

export default function LabResultPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const { data: reports, isLoading: isLoadingLabReports, refetch } = useLabReportsByOrder(orderId);
  const { data: pathologyReports, isLoading: isLoadingPathologyReports, refetch: refetchPathology } =
    usePathologyReportsByOrder(orderId);
  const { data: order } = useClinicalOrder(orderId);
  const encounterId = order?.encounterId ?? reports?.[0]?.encounterId ?? '';
  const { data: encounterResults } = useEncounterResults(encounterId);
  const createReport = useCreateLabReport();
  const labOrderTestIds = (order?.labTests ?? [])
    .map((labTest) => labTest.id)
    .filter((id): id is string => Boolean(id));
  const { data: resultContexts } = useLabResultEntryContexts(labOrderTestIds);
  const labTestMasterId = order?.labTests?.find((labTest) => Boolean(labTest.labTestMasterId))?.labTestMasterId;
  const { data: labTest } = useLabTest(labTestMasterId);
  const { data: labTestTemplates } = useLabTestResultTemplates(labTestMasterId);
  const createPathologyReport = useCreatePathologyReport();
  const isNarrativeReport = labTest?.reportStyle === 'narrative';
  const isLoading = isLoadingLabReports || isLoadingPathologyReports;

  if (isLoading) {
    return (
      <div className="space-y-6 px-6 pb-6 pt-2" aria-busy="true" aria-label="Loading lab report">
        <Skeleton className="h-36 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  const sourceReports = isNarrativeReport ? pathologyReports : reports;

  const activeReport = sourceReports?.find(
    (r) =>
      r.reportStatus === ReportStatus.DRAFT || r.reportStatus === ReportStatus.PRELIMINARY,
  );
  const latestFinalReport = sourceReports?.find(
    (r) =>
      r.reportStatus === ReportStatus.FINAL ||
      r.reportStatus === ReportStatus.AMENDED,
  );

  const displayReport = activeReport || latestFinalReport;
  const structuredReport = !isNarrativeReport ? (displayReport as LabReport | undefined) : undefined;
  const narrativeReport = isNarrativeReport ? (displayReport as PathologyReport | undefined) : undefined;

  if (!displayReport) {
    return (
      <div className="px-6 pb-6 pt-2">
        <Card>
          <EmptyState
            icon={FilePlus2}
            title="No lab report yet"
            description="No lab report exists for this order yet. Start one to enter results."
            action={
              <Button
                onClick={async () => {
                  if (isNarrativeReport) {
                    await createPathologyReport.mutateAsync({ orderId });
                    refetchPathology();
                  } else {
                    await createReport.mutateAsync({ orderId });
                    refetch();
                  }
                }}
                disabled={createReport.isPending || createPathologyReport.isPending}
              >
                Create Lab Report
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  const isEditable =
    displayReport.reportStatus === ReportStatus.DRAFT ||
    displayReport.reportStatus === ReportStatus.PRELIMINARY;

  return (
    <div className="space-y-6 px-6 pb-6 pt-2 page-transition">
      {!isEditable ? (
        <div className="flex justify-end print:hidden">
          <Button variant="outline" className="gap-1.5" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print Result
          </Button>
        </div>
      ) : null}
      <ReportPatientHeader
        encounterId={displayReport.encounterId}
        reportType="lab"
        reportStatus={displayReport.reportStatus}
      />
      <LabReportContextCard
        order={order}
        contexts={resultContexts}
        encounterLabResults={encounterResults}
        report={displayReport}
        labTest={labTest}
      />
      {isEditable ? (
        isNarrativeReport ? (
          <PathologyReportForm
            report={narrativeReport!}
            labOrderTestId={labOrderTestIds[0]}
            onSaved={() => refetchPathology()}
          />
        ) : (
          <LabResultEntryForm report={structuredReport!} onSaved={() => refetch()} />
        )
      ) : (
        isNarrativeReport ? (
          <PathologyReportViewer report={narrativeReport!} />
        ) : (
          <LabReportViewer
            report={structuredReport!}
            order={order}
            templateMap={labTestMasterId && labTestTemplates ? { [labTestMasterId]: labTestTemplates } : undefined}
          />
        )
      )}
    </div>
  );
}
