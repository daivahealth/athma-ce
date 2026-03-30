'use client';

import { useParams } from 'next/navigation';
import { useLabReportsByOrder, useCreateLabReport } from '@/modules/clinical/hooks/use-reporting';
import { LabResultEntryForm } from '@/modules/clinical/components/reporting/lab/LabResultEntryForm';
import { LabReportViewer } from '@/modules/clinical/components/reporting/lab/LabReportViewer';
import { ReportPatientHeader } from '@/modules/clinical/components/reporting/ReportPatientHeader';
import { ReportStatus } from '@/modules/clinical/types/reporting';
import { Button } from '@/components/ui/button';

export default function LabResultPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const { data: reports, isLoading, refetch } = useLabReportsByOrder(orderId);
  const createReport = useCreateLabReport();

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
    <div className="p-6 max-w-7xl space-y-6">
      <ReportPatientHeader
        encounterId={displayReport.encounterId}
        reportType="lab"
        reportStatus={displayReport.reportStatus}
      />
      {isEditable ? (
        <LabResultEntryForm report={displayReport} onSaved={() => refetch()} />
      ) : (
        <LabReportViewer report={displayReport} />
      )}
    </div>
  );
}
