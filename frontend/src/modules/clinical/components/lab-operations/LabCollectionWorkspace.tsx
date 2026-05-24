'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useToast } from '@/components/ui/use-toast';
import { labLabelPrintService } from '../../services/lab-label-print-service';
import { useCollectLabSpecimen, useLabWorklist, usePrepareLabSpecimen, usePrintLabSpecimenLabel } from '../../hooks/use-lab-operations';
import type { LabCollectionWorklistItem, LabSpecimenLabelPayload } from '../../types/lab-operations';
import type { PatientDisplayDTO } from '../../types/patient';

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Lab Collection</h1>
          <p className="text-muted-foreground mt-1">
            Specimen collection queue for nurses and phlebotomists before handoff to the lab.
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:max-w-xl">
          <div className="space-y-1">
            <div className="text-sm font-medium">Patient Filter</div>
            <div className="text-xs text-muted-foreground">
              Filter the collection queue to a single patient by name, MRN, or mobile.
            </div>
          </div>
          <PatientSearchSelect
            value={selectedPatient}
            onSelect={(patient) => setSelectedPatient(patient as PatientDisplayDTO)}
            onClear={() => setSelectedPatient(null)}
            placeholder="Search patient by name, MRN, or mobile"
          />
        </div>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <CollectionTable
            items={(collection.data as LabCollectionWorklistItem[] | undefined) ?? []}
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
        </CardContent>
      </Card>
    </div>
  );
}

function formatPatientGender(gender?: string | null) {
  if (!gender) return '—';
  return gender[0].toUpperCase() + gender.slice(1);
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
  if (isLoading) return <div className="text-sm text-muted-foreground">Loading collection worklist...</div>;
  if (items.length === 0) return <EmptyState message="No pending lab tests require specimen collection." />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Specimen Group</TableHead>
          <TableHead>Collection Profile</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tests</TableHead>
          <TableHead>Ordered</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.preparedSpecimenId ?? `${item.orderId}:${item.specimenType}:${item.pendingLabOrderTestIds.join(',')}`}>
            <TableCell>
              <div className="font-medium">
                {item.patientDisplay?.displayName || 'Unknown patient'}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {item.patientDisplay?.age != null ? `${item.patientDisplay.age} yrs` : '—'} ·{' '}
                {formatPatientGender(item.patientDisplay?.gender)}
              </div>
              <div className="mt-1 font-mono text-xs text-muted-foreground">
                MRN {item.patientDisplay?.mrn || '—'}
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {item.testCount} tests across {item.orderCount} {item.orderCount === 1 ? 'order' : 'orders'}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Collect as one specimen requirement for this encounter
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {item.sourceOrders.map((order) => (
                  <Badge key={order.id} variant="outline">
                    {order.orderName}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{item.specimenType}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                <Badge variant="secondary">{item.collectionMethod}</Badge>
                <Badge variant="secondary">
                  {item.fastingRequired
                    ? `Fasting${item.fastingDurationHours ? ` ${item.fastingDurationHours}h` : ''}`
                    : 'No fasting'}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={item.workflowState === 'prepared' ? 'secondary' : 'outline'}>
                {item.workflowState === 'prepared' ? 'Label Prepared' : 'Ready to Prepare'}
              </Badge>
              {item.preparedBarcode ? (
                <div className="mt-2 font-mono text-xs text-muted-foreground">{item.preparedBarcode}</div>
              ) : null}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {item.tests.map((test) => (
                  <Badge key={test.id} variant="outline">
                    {test.testName}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>{formatDateTime(item.orderedAt)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {item.workflowState === 'prepared' ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => onPrint(item)}>
                      Print Label
                    </Button>
                    <Button size="sm" onClick={() => onCollect(item)}>
                      Mark Collected
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => onPrepare(item)}>
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
