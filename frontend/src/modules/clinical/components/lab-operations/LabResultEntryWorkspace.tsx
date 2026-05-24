'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportPatientHeader } from '../reporting/ReportPatientHeader';
import { LabResultEntryForm } from '../reporting/lab/LabResultEntryForm';
import { useCompleteLabResultEntry, useStartLabResultEntry } from '../../hooks/use-lab-operations';
import type { StartLabResultEntryContext } from '../../types/lab-operations';

type LabResultEntryWorkspaceProps = {
  locale: string;
  labOrderTestId: string;
  specimenId?: string;
};

export function LabResultEntryWorkspace({
  locale,
  labOrderTestId,
  specimenId,
}: LabResultEntryWorkspaceProps) {
  const router = useRouter();
  const [context, setContext] = useState<StartLabResultEntryContext | null>(null);
  const startResultEntry = useStartLabResultEntry();
  const completeResultEntry = useCompleteLabResultEntry();

  useEffect(() => {
    startResultEntry
      .mutateAsync({
        labOrderTestId,
        specimenId,
      })
      .then(setContext)
      .catch(() => null);
  }, [labOrderTestId, specimenId]);

  if (startResultEntry.isPending || !context) {
    return <div className="p-6">Preparing result entry...</div>;
  }

  if (startResultEntry.isError) {
    return (
      <div className="p-6 text-sm text-destructive">
        Unable to open lab result entry for this ordered test.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <ReportPatientHeader
        encounterId={context.report.encounterId}
        reportType="lab"
        reportStatus={context.report.reportStatus}
      />

      <Card>
        <CardHeader>
          <CardTitle>Ordered Test Context</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <SummaryCell label="Order" value={context.order.orderName} subValue={context.order.orderCode} />
          <SummaryCell
            label="Test"
            value={context.labOrderTest.testName}
            subValue={context.labOrderTest.testCode}
          />
          <SummaryCell
            label="Specimen"
            value={context.specimen.barcode ?? context.specimen.id}
            subValue={context.specimen.specimenType ?? 'Specimen'}
          />
          <SummaryCell
            label="Accession"
            value={context.accession?.accessionNumber ?? 'Pending'}
            subValue={context.accession?.status ?? context.specimen.status}
          />
        </CardContent>
      </Card>

      <LabResultEntryForm report={context.report} onSaved={() => undefined} />

      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push(`/${locale}/results/lab/operations`)}
        >
          Back to Worklists
        </Button>
        <Button
          onClick={async () => {
            await completeResultEntry.mutateAsync({
              labOrderTestId,
              specimenId: context.specimen.id,
            });
            router.push(`/${locale}/results/lab/operations`);
          }}
          disabled={completeResultEntry.isPending}
        >
          Mark Result Entered
        </Button>
      </div>
    </div>
  );
}

function SummaryCell({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string;
  subValue?: string | null;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
      {subValue ? (
        <Badge variant="secondary" className="capitalize">
          {subValue}
        </Badge>
      ) : null}
    </div>
  );
}
