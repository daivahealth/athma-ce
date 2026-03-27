'use client';

import { useParams } from 'next/navigation';
import { useProcedureReportsByOrder, useCreateProcedureReport } from '@/modules/clinical/hooks/use-reporting';
import { ProcedureReportForm } from '@/modules/clinical/components/reporting/procedure/ProcedureReportForm';
import { ProcedureReportViewer } from '@/modules/clinical/components/reporting/procedure/ProcedureReportViewer';
import { ReportStatus } from '@/modules/clinical/types/reporting';
import { Button } from '@/components/ui/button';

export default function ProcedureResultPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const { data: reports, isLoading, refetch } = useProcedureReportsByOrder(orderId);
  const createReport = useCreateProcedureReport();

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
        <h2 className="text-lg font-semibold mb-4">Procedure Report</h2>
        <p className="text-muted-foreground mb-4">No procedure report exists for this order yet.</p>
        <Button
          onClick={async () => {
            await createReport.mutateAsync({ orderId });
            refetch();
          }}
          disabled={createReport.isPending}
        >
          Create Procedure Report
        </Button>
      </div>
    );
  }

  const isEditable =
    displayReport.reportStatus === ReportStatus.DRAFT ||
    displayReport.reportStatus === ReportStatus.PRELIMINARY;

  return (
    <div className="p-6 max-w-4xl">
      {isEditable ? (
        <ProcedureReportForm report={displayReport} onSaved={() => refetch()} />
      ) : (
        <ProcedureReportViewer report={displayReport} />
      )}
    </div>
  );
}
