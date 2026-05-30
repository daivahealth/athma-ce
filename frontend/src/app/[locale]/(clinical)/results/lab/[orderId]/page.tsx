'use client';

import { useParams } from 'next/navigation';
import { useLabReportsByOrder, useCreateLabReport, useEncounterResults } from '@/modules/clinical/hooks/use-reporting';
import { useClinicalOrder } from '@/modules/clinical/hooks/use-charting';
import { useLabResultEntryContexts } from '@/modules/clinical/hooks/use-lab-operations';
import { LabResultEntryForm } from '@/modules/clinical/components/reporting/lab/LabResultEntryForm';
import { LabReportViewer } from '@/modules/clinical/components/reporting/lab/LabReportViewer';
import { LabReportContextCard } from '@/modules/clinical/components/reporting/lab/LabReportContextCard';
import { ReportPatientHeader } from '@/modules/clinical/components/reporting/ReportPatientHeader';
import { ReportStatus } from '@/modules/clinical/types/reporting';
import { Button } from '@/components/ui/button';
import { useLabTest, useLabTestResultTemplates } from '@/modules/foundation/hooks/use-catalogs';

export default function LabResultPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const { data: reports, isLoading, refetch } = useLabReportsByOrder(orderId);
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

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  const activeReport = reports?.find(
    (r) =>
      r.reportStatus === ReportStatus.DRAFT || r.reportStatus === ReportStatus.PRELIMINARY,
  );
  const latestFinalReport = reports?.find(
    (r) =>
      r.reportStatus === ReportStatus.FINAL ||
      r.reportStatus === ReportStatus.AMENDED,
  );

  const displayReport = activeReport || latestFinalReport;

  if (!displayReport) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Lab Results</h2>
        <p className="text-muted-foreground mb-4">No lab report exists for this order yet.</p>
        <Button
          onClick={async () => {
            await createReport.mutateAsync({ orderId });
            refetch();
          }}
          disabled={createReport.isPending}
        >
          Create Lab Report
        </Button>
      </div>
    );
  }

  const isEditable =
    displayReport.reportStatus === ReportStatus.DRAFT ||
    displayReport.reportStatus === ReportStatus.PRELIMINARY;

  return (
    <div className="px-6 pb-6 pt-2 space-y-6">
      {!isEditable ? (
        <div className="flex justify-end print:hidden">
          <Button variant="outline" onClick={() => window.print()}>
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
        <LabResultEntryForm report={displayReport} onSaved={() => refetch()} />
      ) : (
        <LabReportViewer
          report={displayReport}
          order={order}
          templateMap={labTestMasterId && labTestTemplates ? { [labTestMasterId]: labTestTemplates } : undefined}
        />
      )}
    </div>
  );
}
