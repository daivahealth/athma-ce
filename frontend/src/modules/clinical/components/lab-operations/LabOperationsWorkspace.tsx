'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  useAccessionLabSpecimen,
  useCreateLabProcessingRun,
  useReceiveLabSpecimen,
  useLabWorklist,
  useRejectLabSpecimen,
} from '../../hooks/use-lab-operations';
import type {
  LabProcessingWorklistItem,
  LabSpecimen,
  LabWorklistStage,
} from '../../types/lab-operations';

type LabOperationsWorkspaceProps = {
  locale: string;
};

type LabOperationsStage = Exclude<LabWorklistStage, 'collection'>;

const stageMeta: Array<{ value: LabOperationsStage; label: string; description: string }> = [
  { value: 'receiving', label: 'Receiving', description: 'Mark collected specimens as physically received by the lab.' },
  { value: 'accessioning', label: 'Accessioning', description: 'Register received specimens into the LIS workflow.' },
  { value: 'processing', label: 'Processing', description: 'Start analyzer or manual processing against accessioned work.' },
  { value: 'result-entry', label: 'Result Entry', description: 'Open ordered tests for analyte entry and report drafting.' },
];

export function LabOperationsWorkspace({ locale }: LabOperationsWorkspaceProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<LabOperationsStage>('receiving');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedSpecimen, setSelectedSpecimen] = useState<LabSpecimen | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const receiving = useLabWorklist('receiving');
  const accessioning = useLabWorklist('accessioning');
  const processing = useLabWorklist('processing');
  const resultEntry = useLabWorklist('result-entry');

  const receiveMutation = useReceiveLabSpecimen();
  const accessionMutation = useAccessionLabSpecimen();
  const rejectMutation = useRejectLabSpecimen();
  const processingMutation = useCreateLabProcessingRun();

  const counts = useMemo(
    () => ({
      receiving: Array.isArray(receiving.data) ? receiving.data.length : 0,
      accessioning: Array.isArray(accessioning.data) ? accessioning.data.length : 0,
      processing: Array.isArray(processing.data) ? processing.data.length : 0,
      'result-entry': Array.isArray(resultEntry.data) ? resultEntry.data.length : 0,
    }),
    [receiving.data, accessioning.data, processing.data, resultEntry.data],
  );

  const openRejectDialog = (specimen: LabSpecimen) => {
    setSelectedSpecimen(specimen);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    if (rejectMutation.isPending) return;
    setRejectDialogOpen(false);
    setSelectedSpecimen(null);
    setRejectionReason('');
  };

  const handleReject = async () => {
    if (!selectedSpecimen) return;

    const reason = rejectionReason.trim();
    if (!reason) {
      toast({
        title: 'Rejection reason is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        id: selectedSpecimen.id,
        payload: { rejectionReason: reason },
      });
      closeRejectDialog();
    } catch (error) {
      toast({
        title: 'Failed to reject specimen',
        description: error instanceof Error ? error.message : 'Try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Lab Operations</h1>
          <p className="text-muted-foreground mt-1">
            Lab-internal worklists for receiving, accessioning, processing, and result entry.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as LabOperationsStage)} className="space-y-4">
        <Card className="p-4">
          <TabsList className="grid w-full grid-cols-4">
            {stageMeta.map((stage) => (
              <TabsTrigger key={stage.value} value={stage.value} className="gap-2">
                <span>{stage.label}</span>
                <Badge variant="secondary" className="text-[10px]">
                  {counts[stage.value]}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Card>

        {stageMeta.map((stage) => (
          <TabsContent key={stage.value} value={stage.value} className="space-y-4">
            <Card>
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">{stage.label}</h2>
                <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
              </div>
              <CardContent className="pt-6">
                {stage.value === 'receiving' && (
                  <SpecimenTable
                    items={(receiving.data as LabSpecimen[] | undefined) ?? []}
                    isLoading={receiving.isLoading}
                    actionLabel="Receive"
                    onAction={(specimen) => receiveMutation.mutate({ id: specimen.id })}
                    onReject={openRejectDialog}
                  />
                )}
                {stage.value === 'accessioning' && (
                  <SpecimenTable
                    items={(accessioning.data as LabSpecimen[] | undefined) ?? []}
                    isLoading={accessioning.isLoading}
                    actionLabel="Accession"
                    onAction={(specimen) => accessionMutation.mutate({ id: specimen.id })}
                    onReject={openRejectDialog}
                  />
                )}
                {stage.value === 'processing' && (
                  <ProcessingTable
                    items={(processing.data as LabProcessingWorklistItem[] | undefined) ?? []}
                    isLoading={processing.isLoading}
                    isStarting={processingMutation.isPending}
                    onStart={(item) =>
                      processingMutation.mutate({
                        specimenId: item.specimen.id,
                        labOrderTestId: item.labOrderTest.id,
                        status: 'processing',
                      })
                    }
                  />
                )}
                {stage.value === 'result-entry' && (
                  <ResultEntryTable
                    items={(resultEntry.data as LabProcessingWorklistItem[] | undefined) ?? []}
                    isLoading={resultEntry.isLoading}
                    onOpen={(item) =>
                      router.push(
                        `/${locale}/results/lab/operations/result-entry/${item.labOrderTest.id}?specimenId=${item.specimen.id}`,
                      )
                    }
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={rejectDialogOpen} onOpenChange={(open) => (!open ? closeRejectDialog() : setRejectDialogOpen(true))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Specimen</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting specimen {selectedSpecimen?.barcode ?? selectedSpecimen?.id ?? ''}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pb-2">
            <Label htmlFor="lab-rejection-reason">Rejection reason *</Label>
            <Textarea
              id="lab-rejection-reason"
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Enter rejection reason..."
              className="min-h-[160px]"
              disabled={rejectMutation.isPending}
            />
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={closeRejectDialog} disabled={rejectMutation.isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={rejectMutation.isPending}>
              {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SpecimenTable({
  items,
  isLoading,
  actionLabel,
  onAction,
  onReject,
}: {
  items: LabSpecimen[];
  isLoading: boolean;
  actionLabel: string;
  onAction: (item: LabSpecimen) => void;
  onReject: (item: LabSpecimen) => void;
}) {
  if (isLoading) return <div className="text-sm text-muted-foreground">Loading specimens...</div>;
  if (items.length === 0) return <EmptyState message="No specimens are waiting in this stage." />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Specimen</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Tests</TableHead>
          <TableHead>Collected</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="font-medium">{item.barcode ?? item.id}</div>
              <div className="text-xs text-muted-foreground">{item.specimenType ?? 'Specimen'}</div>
            </TableCell>
            <TableCell>
              <div>{item.order.orderName}</div>
              <div className="text-xs text-muted-foreground">{item.order.orderCode}</div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {item.specimenTests.map((specimenTest) => (
                  <Badge key={specimenTest.id} variant="outline">
                    {specimenTest.labOrderTest.testName}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>{formatDateTime(item.collectedAt)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button size="sm" onClick={() => onAction(item)}>
                  {actionLabel}
                </Button>
                <Button size="sm" variant="outline" onClick={() => onReject(item)}>
                  Reject
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ProcessingTable({
  items,
  isLoading,
  isStarting,
  onStart,
}: {
  items: LabProcessingWorklistItem[];
  isLoading: boolean;
  isStarting: boolean;
  onStart: (item: LabProcessingWorklistItem) => void;
}) {
  if (isLoading) return <div className="text-sm text-muted-foreground">Loading processing worklist...</div>;
  if (items.length === 0) return <EmptyState message="No accessioned work is waiting for processing." />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Specimen</TableHead>
          <TableHead>Test</TableHead>
          <TableHead>Accession</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="font-medium">{item.specimen.barcode ?? item.specimen.id}</div>
              <div className="text-xs text-muted-foreground">{item.specimen.specimenType ?? 'Specimen'}</div>
            </TableCell>
            <TableCell>
              <div>{item.labOrderTest.testName}</div>
              <div className="text-xs text-muted-foreground">{item.labOrderTest.testCode}</div>
            </TableCell>
            <TableCell>{item.specimen.accessions[0]?.accessionNumber ?? 'Pending'}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="capitalize">
                {item.status.split('_').join(' ')}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                size="sm"
                onClick={() => onStart(item)}
                disabled={isStarting || item.status !== 'accessioned'}
              >
                {item.status === 'processing' ? 'Processing Started' : 'Start Processing'}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ResultEntryTable({
  items,
  isLoading,
  onOpen,
}: {
  items: LabProcessingWorklistItem[];
  isLoading: boolean;
  onOpen: (item: LabProcessingWorklistItem) => void;
}) {
  if (isLoading) return <div className="text-sm text-muted-foreground">Loading result-entry worklist...</div>;
  if (items.length === 0) return <EmptyState message="No processed tests are waiting for result entry." />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Test</TableHead>
          <TableHead>Specimen</TableHead>
          <TableHead>Accession</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.specimen.order.orderName}</TableCell>
            <TableCell>
              <div>{item.labOrderTest.testName}</div>
              <div className="text-xs text-muted-foreground">{item.labOrderTest.testCode}</div>
            </TableCell>
            <TableCell>{item.specimen.barcode ?? item.specimen.id}</TableCell>
            <TableCell>{item.specimen.accessions[0]?.accessionNumber ?? 'Pending'}</TableCell>
            <TableCell className="text-right">
              <Button size="sm" onClick={() => onOpen(item)}>
                Open Result Entry
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">{message}</div>;
}

function formatDateTime(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}
