'use client';

import { useParams } from 'next/navigation';
import { useImagingReportsByOrder, useCreateImagingReport } from '@/modules/clinical/hooks/use-reporting';
import { ImagingReportForm } from '@/modules/clinical/components/reporting/imaging/ImagingReportForm';
import { ImagingReportViewer } from '@/modules/clinical/components/reporting/imaging/ImagingReportViewer';
import { ReportPatientHeader } from '@/modules/clinical/components/reporting/ReportPatientHeader';
import { ReportStatus } from '@/modules/clinical/types/reporting';
import { Button } from '@/components/ui/button';

export default function ImagingResultPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const { data: reports, isLoading, refetch } = useImagingReportsByOrder(orderId);
  const createReport = useCreateImagingReport();

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
        <h2 className="text-lg font-semibold mb-4">Imaging Report</h2>
        <p className="text-muted-foreground mb-4">No imaging report exists for this order yet.</p>
        <Button
          onClick={async () => {
            await createReport.mutateAsync({ orderId });
            refetch();
          }}
          disabled={createReport.isPending}
        >
          Create Imaging Report
        </Button>
      </div>
    );
  }

  const isEditable =
    displayReport.reportStatus === ReportStatus.DRAFT ||
    displayReport.reportStatus === ReportStatus.PRELIMINARY;

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <ReportPatientHeader
        encounterId={displayReport.encounterId}
        reportType="imaging"
        reportStatus={displayReport.reportStatus}
      />
      {isEditable ? (
        <ImagingReportForm report={displayReport} onSaved={() => refetch()} />
      ) : (
        <ImagingReportViewer report={displayReport} />
      )}
    </div>
  );
}
