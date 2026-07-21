'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import { FileSearch } from 'lucide-react';
import {
  useLabReportsByOrder,
  usePathologyReportsByOrder,
  useImagingReportsByOrder,
  useProcedureReportsByOrder,
} from '@/modules/clinical/hooks/use-reporting';
import { LabReportViewer } from './lab/LabReportViewer';
import { PathologyReportViewer } from './lab/PathologyReportViewer';
import { ImagingReportViewer } from './imaging/ImagingReportViewer';
import { ProcedureReportViewer } from './procedure/ProcedureReportViewer';
import { ReportStatus } from '../../types/reporting';
import type { PatientResult } from '../../types/reporting';

interface ResultDetailPaneProps {
  result: PatientResult | null;
}

function pickDisplayReport<T extends { reportStatus: ReportStatus }>(reports: T[] | undefined): T | undefined {
  const active = reports?.find(
    (r) => r.reportStatus === ReportStatus.DRAFT || r.reportStatus === ReportStatus.PRELIMINARY,
  );
  const latestFinal = reports?.find(
    (r) => r.reportStatus === ReportStatus.FINAL || r.reportStatus === ReportStatus.AMENDED,
  );
  return active || latestFinal;
}

function EmptyState({ icon: Icon, message }: { icon: typeof FileSearch; message: string }) {
  return (
    <Card className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 p-12 text-center text-muted-foreground">
      <Icon className="h-10 w-10" />
      <p>{message}</p>
    </Card>
  );
}

function DraftNotice({ locale, reportType, orderId }: { locale: string; reportType: string; orderId: string }) {
  return (
    <Card className="p-6 text-center">
      <p className="mb-4 text-muted-foreground">
        This report is still in progress and hasn&apos;t been finalized yet.
      </p>
      <Button asChild>
        <Link href={`/${locale}/results/${reportType}/${orderId}`}>Continue editing</Link>
      </Button>
    </Card>
  );
}

export function ResultDetailPane({ result }: ResultDetailPaneProps) {
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  const orderId = result?.orderId ?? '';
  const isLab = result?.reportType === 'lab';
  const isNarrativeLab = isLab && result?.labSummary?.reportStyle === 'narrative';

  const { data: labReports, isLoading: isLoadingLab } = useLabReportsByOrder(
    isLab && !isNarrativeLab ? orderId : '',
  );
  const { data: pathologyReports, isLoading: isLoadingPathology } = usePathologyReportsByOrder(
    isNarrativeLab ? orderId : '',
  );
  const { data: imagingReports, isLoading: isLoadingImaging } = useImagingReportsByOrder(
    result?.reportType === 'imaging' ? orderId : '',
  );
  const { data: procedureReports, isLoading: isLoadingProcedure } = useProcedureReportsByOrder(
    result?.reportType === 'procedure' ? orderId : '',
  );

  if (!result) {
    return <EmptyState icon={FileSearch} message="Select a result to view details" />;
  }

  const isLoading =
    (isLab && !isNarrativeLab && isLoadingLab) ||
    (isNarrativeLab && isLoadingPathology) ||
    (result.reportType === 'imaging' && isLoadingImaging) ||
    (result.reportType === 'procedure' && isLoadingProcedure);

  if (isLoading) {
    return (
      <Card className="flex h-full min-h-[300px] items-center justify-center p-12">
        <LoadingSpinner size="lg" text="Loading result..." />
      </Card>
    );
  }

  if (isLab) {
    const displayReport = isNarrativeLab
      ? pickDisplayReport(pathologyReports)
      : pickDisplayReport(labReports);

    if (!displayReport) {
      return <EmptyState icon={FileSearch} message="No lab report found for this order." />;
    }

    const isEditable =
      displayReport.reportStatus === ReportStatus.DRAFT ||
      displayReport.reportStatus === ReportStatus.PRELIMINARY;

    if (isEditable) {
      return <DraftNotice locale={locale} reportType="lab" orderId={orderId} />;
    }

    return isNarrativeLab ? (
      <PathologyReportViewer report={displayReport as NonNullable<typeof pathologyReports>[number]} />
    ) : (
      <LabReportViewer report={displayReport as NonNullable<typeof labReports>[number]} />
    );
  }

  if (result.reportType === 'imaging') {
    const displayReport = pickDisplayReport(imagingReports);
    if (!displayReport) {
      return <EmptyState icon={FileSearch} message="No imaging report found for this order." />;
    }
    const isEditable =
      displayReport.reportStatus === ReportStatus.DRAFT ||
      displayReport.reportStatus === ReportStatus.PRELIMINARY;
    if (isEditable) {
      return <DraftNotice locale={locale} reportType="imaging" orderId={orderId} />;
    }
    return <ImagingReportViewer report={displayReport} />;
  }

  if (result.reportType === 'procedure') {
    const displayReport = pickDisplayReport(procedureReports);
    if (!displayReport) {
      return <EmptyState icon={FileSearch} message="No procedure report found for this order." />;
    }
    const isEditable =
      displayReport.reportStatus === ReportStatus.DRAFT ||
      displayReport.reportStatus === ReportStatus.PRELIMINARY;
    if (isEditable) {
      return <DraftNotice locale={locale} reportType="procedure" orderId={orderId} />;
    }
    return <ProcedureReportViewer report={displayReport} />;
  }

  return <EmptyState icon={FileSearch} message="Unsupported result type." />;
}
