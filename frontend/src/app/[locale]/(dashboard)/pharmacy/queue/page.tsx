'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search, Pill, User, ClipboardCheck, Building2, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResourceTable } from '@/components/tables/resource-table';

import { usePharmacyQueue } from '@/modules/pharmacy/hooks/use-pharmacy-queue';
import { useCreateDispensing } from '@/modules/pharmacy/hooks/use-pharmacy-dispensing';
import { usePharmacyDispensings } from '@/modules/pharmacy/hooks/use-pharmacy-dispensing';
import type { PharmacyQueueItem } from '@/modules/pharmacy/types/queue';
import type { PharmacyDispensing } from '@/modules/pharmacy/types/dispensing';
import { DispensingStatus, DispensingChannel } from '@/modules/pharmacy/types/dispensing';

/* ─── Status / channel display helpers ──────────────────────────────── */
const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [DispensingStatus.QUEUED]: 'outline',
  [DispensingStatus.VERIFIED]: 'secondary',
  [DispensingStatus.DISPENSED]: 'default',
  [DispensingStatus.PARTIALLY_DISPENSED]: 'secondary',
  [DispensingStatus.CANCELLED]: 'destructive',
  [DispensingStatus.RETURNED]: 'outline',
};

const CHANNEL_LABELS: Record<string, string> = {
  [DispensingChannel.OUTPATIENT_COUNTER]: 'Outpatient',
  [DispensingChannel.INPATIENT_WARD]: 'Inpatient Ward',
  [DispensingChannel.INPATIENT_BEDSIDE]: 'Bedside',
  [DispensingChannel.EMERGENCY]: 'Emergency',
};

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function DispensePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  /* ── Queue state ── */
  const [search, setSearch] = useState('');
  const [encounterFilter, setEncounterFilter] = useState<'all' | 'outpatient' | 'inpatient'>('all');

  const queueFilters = {
    ...(encounterFilter !== 'all' && { encounterType: encounterFilter }),
    ...(search && { search }),
  };

  const { data: queue = [], isLoading: queueLoading } = usePharmacyQueue(queueFilters);
  const createDispensing = useCreateDispensing();

  /* ── History state ── */
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const historyFilters = {
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };
  const { data: dispensings = [], isLoading: historyLoading } = usePharmacyDispensings(historyFilters);

  /* ── Handlers ── */
  const handleProcess = async (item: PharmacyQueueItem) => {
    if (item.dispensingId) {
      router.push(`/${locale}/pharmacy/dispensings/${item.dispensingId}`);
      return;
    }
    const channel =
      item.encounterType === 'inpatient'
        ? DispensingChannel.INPATIENT_WARD
        : DispensingChannel.OUTPATIENT_COUNTER;

    const result = await createDispensing.mutateAsync({
      prescriptionOrderId: item.prescriptionOrderId,
      encounterId: item.encounterId,
      patientId: item.patientId,
      dispensingChannel: channel,
    });
    router.push(`/${locale}/pharmacy/dispensings/${result.id}`);
  };

  /* ── History columns ── */
  const historyColumns: ColumnDef<PharmacyDispensing>[] = [
    {
      accessorKey: 'dispensingNumber',
      header: 'Dispensing #',
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.dispensingNumber}</span>
      ),
    },
    {
      accessorKey: 'patientDisplayName',
      header: 'Patient',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.patientDisplayName ?? '—'}</div>
          {row.original.mrn && (
            <div className="text-xs text-muted-foreground">MRN: {row.original.mrn}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'dispensingSource',
      header: 'Source',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize text-xs">
          {row.original.dispensingSource?.replace(/_/g, ' ') ?? '—'}
        </Badge>
      ),
    },
    {
      accessorKey: 'dispensingChannel',
      header: 'Channel',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {CHANNEL_LABELS[row.original.dispensingChannel] ?? row.original.dispensingChannel}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANTS[row.original.status] ?? 'outline'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'dd MMM yyyy HH:mm'),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => router.push(`/${locale}/pharmacy/dispensings/${row.original.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* ── Queue tab ──────────────────────────────────────────────── */}
        <TabsContent value="queue" className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or MRN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button asChild>
              <Link href={`/${locale}/pharmacy/dispensings/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Direct Dispense
              </Link>
            </Button>
          </div>

          <Tabs
            value={encounterFilter}
            onValueChange={(v) => setEncounterFilter(v as typeof encounterFilter)}
          >
            <TabsList>
              <TabsTrigger value="all">All ({queue.length})</TabsTrigger>
              <TabsTrigger value="outpatient">
                Outpatient ({queue.filter((i) => i.encounterType === 'outpatient').length})
              </TabsTrigger>
              <TabsTrigger value="inpatient">
                Inpatient ({queue.filter((i) => i.encounterType === 'inpatient').length})
              </TabsTrigger>
            </TabsList>

            {(['all', 'outpatient', 'inpatient'] as const).map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                {queueLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full rounded-lg" />
                    ))}
                  </div>
                ) : queue.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Pill className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No prescriptions in queue</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {queue.map((item) => (
                      <Card key={item.prescriptionOrderId} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium truncate">
                                  {item.patientDisplayName ?? 'Unknown Patient'}
                                </span>
                                {item.mrn && (
                                  <span className="text-xs text-muted-foreground">MRN: {item.mrn}</span>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {item.encounterType}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2 mb-2">
                                <Pill className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium text-sm">{item.drugName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {item.dosage} — {item.frequency}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Qty: {item.quantity}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>
                                  Prescribed: {format(new Date(item.prescribedAt), 'dd MMM yyyy HH:mm')}
                                </span>
                                {item.wardName && (
                                  <span className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    {item.wardName}
                                    {item.bedNumber && ` — Bed ${item.bedNumber}`}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge variant={STATUS_VARIANTS[item.dispensingStatus] ?? 'outline'}>
                                {item.dispensingStatus}
                              </Badge>
                              <Button
                                size="sm"
                                variant={item.dispensingId ? 'outline' : 'default'}
                                onClick={() => handleProcess(item)}
                                disabled={createDispensing.isPending}
                              >
                                {item.dispensingId ? (
                                  <>
                                    <ClipboardCheck className="h-4 w-4 mr-1" />
                                    View
                                  </>
                                ) : (
                                  <>
                                    <Pill className="h-4 w-4 mr-1" />
                                    Process
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        {/* ── History tab ────────────────────────────────────────────── */}
        <TabsContent value="history" className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Object.values(DispensingStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ResourceTable
            columns={historyColumns}
            data={dispensings}
            isLoading={historyLoading}
            emptyMessage="No dispensing records found"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
