'use client';

import { useState } from 'react';
import { Printer, TestTube, TestTubes } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ToneBadge } from '@/components/ui/tone-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useToast } from '@/components/ui/use-toast';
import { labLabelPrintService } from '../../services/lab-label-print-service';
import { useCollectLabSpecimen, useLabWorklist, usePrepareLabSpecimen, usePrintLabSpecimenLabel } from '../../hooks/use-lab-operations';
import type { LabCollectionWorklistItem, LabSpecimenLabelPayload } from '../../types/lab-operations';
import type { PatientDisplayDTO } from '../../types/patient';
import { LAB_COLLECTION_STATE_LABEL, fastingTone, labCollectionStateTone } from '../../utils/lab-collection-tone';
import { LabDateTime, LabPatientCell, SpecimenCode, WorklistSkeleton } from './lab-ui';

export function LabCollectionWorkspace() {
  const [selectedPatient, setSelectedPatient] = useState<PatientDisplayDTO | null>(null);
  const toast = useToast();
  const collection = useLabWorklist('collection', {
    patientId: selectedPatient?.id,
  });
  const prepareMutation = usePrepareLabSpecimen();
  const collectMutation = useCollectLabSpecimen();
  const printMutation = usePrintLabSpecimenLabel();

  const handlePrintPayload = async (label: LabSpecimenLabelPayload) => {
    const result = await labLabelPrintService.printLabel(label);

    toast({
      title: result.success ? 'Label ready' : 'Label print failed',
      description: result.message ?? (result.success ? 'Barcode label sent to printer.' : 'Unable to print barcode label.'),
      variant: result.success ? 'success' : 'destructive',
    });
  };

  const items = (collection.data as LabCollectionWorklistItem[] | undefined) ?? [];
  const readyCount = items.filter((item) => item.workflowState === 'ready').length;
  const preparedCount = items.length - readyCount;

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Lab Collection"
        subtitle="Prepare labels and draw specimens before they go to the lab"
        icon={TestTubes}
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-md">
            <PatientSearchSelect
              value={selectedPatient}
              onSelect={(patient) => setSelectedPatient(patient as PatientDisplayDTO)}
              onClear={() => setSelectedPatient(null)}
              placeholder="Filter by patient name, MRN or mobile"
            />
          </div>
          {!collection.isLoading && items.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <ToneBadge tone="amber" withDot>
                {readyCount} to prepare
              </ToneBadge>
              <ToneBadge tone="emerald" withDot>
                {preparedCount} labelled, awaiting draw
              </ToneBadge>
            </div>
          ) : null}
        </div>
        <CollectionTable
            items={items}
            isLoading={collection.isLoading}
            onPrepare={async (item) => {
              const prepared = await prepareMutation.mutateAsync({
                orderId: item.orderId,
                labOrderTestIds: item.pendingLabOrderTestIds,
                specimenType: item.specimenType === 'Unspecified' ? undefined : item.specimenType,
              });
              await handlePrintPayload(prepared.label);
            }}
            onPrint={async (item) => {
              if (!item.preparedSpecimenId) return;
              const label = await printMutation.mutateAsync(item.preparedSpecimenId);
              await handlePrintPayload(label);
            }}
            onCollect={(item) => {
              if (!item.preparedSpecimenId) return;
              collectMutation.mutate({
                specimenId: item.preparedSpecimenId,
              });
            }}
          />
      </Card>
    </div>
  );
}

function CollectionTable({
  items,
  isLoading,
  onPrepare,
  onPrint,
  onCollect,
}: {
  items: LabCollectionWorklistItem[];
  isLoading: boolean;
  onPrepare: (item: LabCollectionWorklistItem) => void | Promise<void>;
  onPrint: (item: LabCollectionWorklistItem) => void | Promise<void>;
  onCollect: (item: LabCollectionWorklistItem) => void;
}) {
  if (isLoading) return <WorklistSkeleton />;
  if (items.length === 0) {
    return (
      <EmptyState
        icon={TestTube}
        title="Nothing to collect"
        description="Lab tests that need a specimen drawn will queue here as they are ordered."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableHead className="pl-4">Patient</TableHead>
          <TableHead>Tests</TableHead>
          <TableHead>Specimen</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ordered</TableHead>
          <TableHead className="pr-4 text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.preparedSpecimenId ?? `${item.orderId}:${item.specimenType}:${item.pendingLabOrderTestIds.join(',')}`}>
            <TableCell className="pl-4 align-top">
              <LabPatientCell
                name={item.patientDisplay?.displayName}
                mrn={item.patientDisplay?.mrn}
                age={item.patientDisplay?.age}
                gender={item.patientDisplay?.gender}
              />
            </TableCell>
            <TableCell className="align-top">
              <div className="flex max-w-xs flex-wrap gap-1">
                {item.tests.map((test) => (
                  <Badge key={test.id} variant="outline" className="font-normal">
                    {test.testName}
                  </Badge>
                ))}
              </div>
              <div className="mt-1.5 text-xs text-muted-foreground">
                {item.testCount} {item.testCount === 1 ? 'test' : 'tests'} · {item.orderCount}{' '}
                {item.orderCount === 1 ? 'order' : 'orders'}, one draw
              </div>
            </TableCell>
            <TableCell className="align-top">
              <div className="font-medium capitalize text-foreground">{item.specimenType}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                <Badge variant="secondary" className="font-normal">{item.collectionMethod}</Badge>
                <ToneBadge tone={fastingTone(item.fastingRequired)}>
                  {item.fastingRequired
                    ? `Fasting${item.fastingDurationHours ? ` ${item.fastingDurationHours}h` : ''}`
                    : 'No fasting'}
                </ToneBadge>
              </div>
            </TableCell>
            <TableCell className="align-top">
              <ToneBadge tone={labCollectionStateTone(item.workflowState)} withDot>
                {LAB_COLLECTION_STATE_LABEL[item.workflowState]}
              </ToneBadge>
              {item.preparedBarcode ? (
                <div className="mt-2">
                  <SpecimenCode value={item.preparedBarcode} />
                </div>
              ) : null}
            </TableCell>
            <TableCell className="align-top">
              <LabDateTime value={item.orderedAt} />
            </TableCell>
            <TableCell className="pr-4 text-right align-top">
              <div className="flex justify-end gap-2">
                {item.workflowState === 'prepared' ? (
                  <>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => onPrint(item)}>
                      <Printer className="h-3.5 w-3.5" />
                      Print Label
                    </Button>
                    <Button size="sm" onClick={() => onCollect(item)}>
                      Mark Collected
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="gap-1.5" onClick={() => onPrepare(item)}>
                    <Printer className="h-3.5 w-3.5" />
                    Prepare Label
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
