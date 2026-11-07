'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
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
  const requestedKeyRef = useRef<string | null>(null);
  const startResultEntry = useStartLabResultEntry();
  const completeResultEntry = useCompleteLabResultEntry();

  useEffect(() => {
    const requestKey = `${labOrderTestId}:${specimenId ?? 'latest'}`;
    if (requestedKeyRef.current === requestKey) {
      return;
    }
    requestedKeyRef.current = requestKey;

    startResultEntry
      .mutateAsync({
        labOrderTestId,
        specimenId,
      })
      .then(setContext)
      .catch(() => null);
  }, [labOrderTestId, specimenId, startResultEntry]);

  if (startResultEntry.isError) {
    return (
      <div className="p-6">
        <Card>
          <EmptyState
            icon={AlertTriangle}
            title="Unable to open lab result entry for this ordered test."
            description="It may already be resulted, or the specimen is not ready yet."
            action={
              <Button variant="outline" onClick={() => router.push(`/${locale}/results/lab/operations`)}>
                Back to Worklists
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  if (startResultEntry.isPending || !context) {
    return (
      <div className="space-y-6 p-6" aria-busy="true" aria-label="Preparing result entry...">
        <Skeleton className="h-36 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
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
        <CardContent className="space-y-3 p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Ordered Test Context</div>
          <div className="grid gap-2 md:grid-cols-4">
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
          </div>
        </CardContent>
      </Card>

      <LabResultEntryForm report={context.report} onSaved={() => undefined} />

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          className="gap-1.5"
          onClick={() => router.push(`/${locale}/results/lab/operations`)}
        >
          <ArrowLeft className="h-4 w-4" />
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
          className="gap-1.5"
        >
          <CheckCircle2 className="h-4 w-4" />
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
    <div className="min-w-0 space-y-1 rounded-xl border border-border/60 bg-muted/20 p-3">
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="truncate font-medium text-foreground" title={value}>{value}</div>
      {subValue ? (
        <Badge variant="secondary" className="font-normal capitalize">
          {subValue}
        </Badge>
      ) : null}
    </div>
  );
}
