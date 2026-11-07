'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, ClipboardCheck, Cpu, Inbox, ScanBarcode, Ban, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { ToneBadge } from '@/components/ui/tone-badge';
import { cn } from '@/lib/utils';
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
import { labPriorityTone, labStageTone } from '../../utils/lab-result-tone';
import { LabDateFilter, LabDateTime, SpecimenCode, WorklistSkeleton, useLabDayFilter } from './lab-ui';
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

const stageMeta: Array<{
  value: LabOperationsStage;
  label: string;
  description: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyMessage: string;
}> = [
  {
    value: 'receiving',
    label: 'Receiving',
    description: 'Mark collected specimens as physically received by the lab.',
    icon: Inbox,
    emptyTitle: 'Nothing in transit',
    emptyMessage: 'No specimens are waiting in this stage.',
  },
  {
    value: 'accessioning',
    label: 'Accessioning',
    description: 'Register received specimens into the LIS workflow.',
    icon: ScanBarcode,
    emptyTitle: 'All received specimens are registered',
    emptyMessage: 'No specimens are waiting in this stage.',
  },
  {
    value: 'processing',
    label: 'Processing',
    description: 'Start analyzer or manual processing against accessioned work.',
    icon: Cpu,
    emptyTitle: 'Bench is clear',
    emptyMessage: 'No accessioned work is waiting for processing.',
  },
  {
    value: 'result-entry',
    label: 'Result Entry',
    description: 'Open ordered tests for analyte entry and report drafting.',
    icon: ClipboardCheck,
    emptyTitle: 'No results to enter',
    emptyMessage: 'No processed tests are waiting for result entry.',
  },
];

export function LabOperationsWorkspace({ locale }: LabOperationsWorkspaceProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<LabOperationsStage>('receiving');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedSpecimen, setSelectedSpecimen] = useState<LabSpecimen | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const { date, setDate, range } = useLabDayFilter();
  const receiving = useLabWorklist('receiving', range);
  const accessioning = useLabWorklist('accessioning', range);
  const processing = useLabWorklist('processing', range);
  const resultEntry = useLabWorklist('result-entry', range);

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

  const isStageLoading: Record<LabOperationsStage, boolean> = {
    receiving: receiving.isLoading,
    accessioning: accessioning.isLoading,
    processing: processing.isLoading,
    'result-entry': resultEntry.isLoading,
  };

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Lab Operations"
        subtitle="Receive, register, process and result specimens inside the lab"
        icon={FileText}
        actions={<LabDateFilter value={date} onChange={setDate} label="Collected on" />}
      />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as LabOperationsStage)} className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 lg:grid-cols-4">
          {stageMeta.map((stage, index) => {
            const Icon = stage.icon;
            const count = counts[stage.value];
            return (
              <TabsTrigger
                key={stage.value}
                value={stage.value}
                className={cn(
                  'group relative h-auto justify-start gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 text-left shadow-sm',
                  'hover:border-primary/40 data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-md',
                )}
              >
                <span
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors',
                    'group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Step {index + 1}
                  </span>
                  <span className="block truncate text-sm font-semibold text-foreground">{stage.label}</span>
                </span>
                <span
                  className={cn(
                    'font-display text-2xl font-semibold tabular-nums',
                    count > 0 ? 'text-foreground' : 'text-muted-foreground/50',
                  )}
                  aria-label={`${count} waiting`}
                >
                  {isStageLoading[stage.value] ? '–' : count}
                </span>
                {index < stageMeta.length - 1 ? (
                  <ArrowRight
                    className="absolute -right-[13px] top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 rounded-full bg-background text-muted-foreground lg:block"
                    aria-hidden="true"
                  />
                ) : null}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {stageMeta.map((stage) => (
          <TabsContent key={stage.value} value={stage.value} className="mt-0">
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
                <div>
                  <h2 className="text-base font-semibold text-foreground">{stage.label}</h2>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                </div>
                {counts[stage.value] > 0 ? (
                  <ToneBadge tone="sky">{counts[stage.value]} waiting</ToneBadge>
                ) : null}
              </div>
              {stage.value === 'receiving' && (
                <SpecimenTable
                  items={(receiving.data as LabSpecimen[] | undefined) ?? []}
                  isLoading={receiving.isLoading}
                  actionLabel="Receive"
                  empty={stage}
                  onAction={(specimen) => receiveMutation.mutate({ id: specimen.id })}
                  onReject={openRejectDialog}
                />
              )}
              {stage.value === 'accessioning' && (
                <SpecimenTable
                  items={(accessioning.data as LabSpecimen[] | undefined) ?? []}
                  isLoading={accessioning.isLoading}
                  actionLabel="Accession"
                  empty={stage}
                  onAction={(specimen) => accessionMutation.mutate({ id: specimen.id })}
                  onReject={openRejectDialog}
                />
              )}
              {stage.value === 'processing' && (
                <ProcessingTable
                  items={(processing.data as LabProcessingWorklistItem[] | undefined) ?? []}
                  isLoading={processing.isLoading}
                  isStarting={processingMutation.isPending}
                  empty={stage}
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
                  empty={stage}
                  onOpen={(item) =>
                    router.push(`/${locale}/results/lab/${item.specimen.order.id}`)
                  }
                />
              )}
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

type StageEmpty = { icon: LucideIcon; emptyTitle: string; emptyMessage: string };

function StageEmptyState({ empty }: { empty: StageEmpty }) {
  return <EmptyState icon={empty.icon} title={empty.emptyTitle} description={empty.emptyMessage} />;
}

function OrderCell({ order }: { order: { orderName: string; orderCode: string; priority?: string | null } }) {
  const priority = order.priority?.toLowerCase();
  return (
    <div className="space-y-1">
      <div className="font-medium text-foreground">{order.orderName}</div>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-xs text-muted-foreground">{order.orderCode}</span>
        {priority && priority !== 'routine' ? (
          <ToneBadge tone={labPriorityTone(priority)} className="capitalize">
            {priority}
          </ToneBadge>
        ) : null}
      </div>
    </div>
  );
}

function SpecimenCell({ barcode, specimenType }: { barcode?: string | null; specimenType?: string | null }) {
  return (
    <div className="space-y-1">
      <SpecimenCode value={barcode} />
      <div className="text-xs capitalize text-muted-foreground">{specimenType ?? 'Specimen'}</div>
    </div>
  );
}

function SpecimenTable({
  items,
  isLoading,
  actionLabel,
  empty,
  onAction,
  onReject,
}: {
  items: LabSpecimen[];
  isLoading: boolean;
  actionLabel: string;
  empty: StageEmpty;
  onAction: (item: LabSpecimen) => void;
  onReject: (item: LabSpecimen) => void;
}) {
  if (isLoading) return <WorklistSkeleton />;
  if (items.length === 0) return <StageEmptyState empty={empty} />;

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableHead className="pl-4">Specimen</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Tests</TableHead>
          <TableHead>Collected</TableHead>
          <TableHead className="pr-4 text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="pl-4">
              <SpecimenCell barcode={item.barcode ?? item.id} specimenType={item.specimenType} />
            </TableCell>
            <TableCell>
              <OrderCell order={item.order} />
            </TableCell>
            <TableCell>
              <div className="flex max-w-xs flex-wrap gap-1">
                {item.specimenTests.map((specimenTest) => (
                  <Badge key={specimenTest.id} variant="outline" className="font-normal">
                    {specimenTest.labOrderTest.testName}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <LabDateTime value={item.collectedAt} />
            </TableCell>
            <TableCell className="pr-4 text-right">
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onReject(item)}
                >
                  <Ban className="h-3.5 w-3.5" />
                  Reject
                </Button>
                <Button size="sm" onClick={() => onAction(item)}>
                  {actionLabel}
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
  empty,
  onStart,
}: {
  items: LabProcessingWorklistItem[];
  isLoading: boolean;
  isStarting: boolean;
  empty: StageEmpty;
  onStart: (item: LabProcessingWorklistItem) => void;
}) {
  if (isLoading) return <WorklistSkeleton />;
  if (items.length === 0) return <StageEmptyState empty={empty} />;

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableHead className="pl-4">Specimen</TableHead>
          <TableHead>Test</TableHead>
          <TableHead>Accession</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="pr-4 text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="pl-4">
              <SpecimenCell barcode={item.specimen.barcode ?? item.specimen.id} specimenType={item.specimen.specimenType} />
            </TableCell>
            <TableCell>
              <div className="font-medium text-foreground">{item.labOrderTest.testName}</div>
              <div className="font-mono text-xs text-muted-foreground">{item.labOrderTest.testCode}</div>
            </TableCell>
            <TableCell>
              {item.specimen.accessions[0]?.accessionNumber ? (
                <span className="font-mono text-sm">{item.specimen.accessions[0].accessionNumber}</span>
              ) : (
                <span className="text-xs text-muted-foreground">Pending</span>
              )}
            </TableCell>
            <TableCell>
              <ToneBadge tone={labStageTone(item.status)} withDot className="capitalize">
                {item.status.split('_').join(' ')}
              </ToneBadge>
            </TableCell>
            <TableCell className="pr-4 text-right">
              <Button
                size="sm"
                variant={item.status === 'processing' ? 'outline' : 'default'}
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
  empty,
  onOpen,
}: {
  items: LabProcessingWorklistItem[];
  isLoading: boolean;
  empty: StageEmpty;
  onOpen: (item: LabProcessingWorklistItem) => void;
}) {
  if (isLoading) return <WorklistSkeleton />;
  if (items.length === 0) return <StageEmptyState empty={empty} />;

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableHead className="pl-4">Order</TableHead>
          <TableHead>Test</TableHead>
          <TableHead>Specimen</TableHead>
          <TableHead>Accession</TableHead>
          <TableHead className="pr-4 text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="pl-4">
              <OrderCell order={item.specimen.order} />
            </TableCell>
            <TableCell>
              <div className="font-medium text-foreground">{item.labOrderTest.testName}</div>
              <div className="font-mono text-xs text-muted-foreground">{item.labOrderTest.testCode}</div>
            </TableCell>
            <TableCell>
              <SpecimenCell barcode={item.specimen.barcode ?? item.specimen.id} specimenType={item.specimen.specimenType} />
            </TableCell>
            <TableCell>
              {item.specimen.accessions[0]?.accessionNumber ? (
                <span className="font-mono text-sm">{item.specimen.accessions[0].accessionNumber}</span>
              ) : (
                <span className="text-xs text-muted-foreground">Pending</span>
              )}
            </TableCell>
            <TableCell className="pr-4 text-right">
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
