'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogCloseButton } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useBedSearch } from '@/modules/clinical/hooks/use-bed-search';
import { useBedBrowser } from '@/modules/clinical/hooks/use-bed-browser';
import { useMultiWardBedBoard, useTransferPatient, useTransferHistory } from '@/modules/clinical/hooks/use-inpatient';
import { WardPrescriptionDialog } from '@/modules/clinical/components/inpatient/ward-prescription-dialog';
import { WardOrdersDialog } from '@/modules/clinical/components/inpatient/ward-orders-dialog';
import {
  BedCard,
  BedRow,
  BoardSummary,
  WardBoardSkeleton,
  WardSectionHeader,
  bedStatusKey,
  countStatuses,
  patientNameOf,
  type BedAction,
  type BedStatusKey,
  type WardBoardBedEntry,
} from '@/modules/clinical/components/inpatient/ward-board-view';
import { TransferType } from '@/modules/clinical/types/inpatient';
import { getSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, BedDouble, LayoutGrid, List, RefreshCw, Search, SearchX, X } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/api/errors';

type FilterKey = BedStatusKey | 'all';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value?: string) {
  return typeof value === 'string' && uuidPattern.test(value);
}

const transferTypeLabels: Record<TransferType, string> = {
  [TransferType.CLINICAL_NEED]: 'Clinical need',
  [TransferType.BED_AVAILABILITY]: 'Bed availability',
  [TransferType.PATIENT_REQUEST]: 'Patient request',
  [TransferType.INFECTION_CONTROL]: 'Infection control',
};

/** True when the bed's code, room, patient name or MRN contains the search text. */
function matchesSearch(bed: WardBoardBedEntry, query: string) {
  if (!query) return true;
  const haystack = [
    bed.bedCode,
    bed.spaceName,
    bed.admission ? patientNameOf(bed.admission) : '',
    bed.admission?.patientDisplay?.mrn,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export default function InpatientWardsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedWardIds, setSelectedWardIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [transferBed, setTransferBed] = useState<WardBoardBedEntry | null>(null);
  const [transferReason, setTransferReason] = useState('');
  const [transferType, setTransferType] = useState<TransferType>(TransferType.CLINICAL_NEED);
  const [transferNotes, setTransferNotes] = useState('');
  const [targetBedId, setTargetBedId] = useState<string>('');
  const [showTransferHistory, setShowTransferHistory] = useState(false);
  const [prescriptionBed, setPrescriptionBed] = useState<WardBoardBedEntry | null>(null);
  const [prescribedById, setPrescribedById] = useState<string>('');
  const [ordersBed, setOrdersBed] = useState<WardBoardBedEntry | null>(null);
  const [orderedById, setOrderedById] = useState<string>('');
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : 'en';
  const session = getSession();
  const claims = decodeAccessToken(session.accessToken);
  const facilityId = claims?.facilityId ?? claims?.defaultFacilityId ?? '';
  const userId = claims?.userId ?? session.user?.userId ?? '';
  const multiBoardQuery = useMultiWardBedBoard(
    { includeEmptyWards: true },
    { enabled: Boolean(facilityId) }
  );
  const bedBrowserQuery = useBedBrowser({});
  const bedStatusById = useMemo(() => {
    const map = new Map<string, string>();
    bedBrowserQuery.data?.beds?.forEach((bed) => {
      if (bed.bedId && bed.status) {
        map.set(bed.bedId, bed.status);
      }
    });
    return map;
  }, [bedBrowserQuery.data?.beds]);
  const wardsData = useMemo(() => multiBoardQuery.data?.wards ?? [], [multiBoardQuery.data?.wards]);
  const beds = useMemo<WardBoardBedEntry[]>(
    () =>
      wardsData.flatMap((ward) =>
        ward.beds.map((bed) => ({
          bedId: bed.bed?.id ?? '',
          bedCode: bed.bed?.code ?? 'Bed',
          spaceName: bed.bed?.spaceName ?? undefined,
          wardId: ward.ward.id ?? '',
          wardName: ward.ward.name ?? 'Ward',
          occupancy: bed.occupancy ?? 'empty',
          status: bedStatusById.get(bed.bed?.id ?? '') ?? bed.occupancy ?? 'empty',
          admission: bed.admission ?? null,
        }))
      ),
    [wardsData, bedStatusById]
  );
  const transferAdmissionId = transferBed?.admission?.admissionId ?? '';
  const transferMutation = useTransferPatient(transferAdmissionId);
  const transferHistoryQuery = useTransferHistory(transferAdmissionId, {
    enabled: Boolean(showTransferHistory),
  });
  const bedSearchQuery = useBedSearch(
    { facilityId },
    { enabled: Boolean(transferBed && facilityId) }
  );
  const availableBeds = bedSearchQuery.data?.data ?? [];
  const transferCandidates = useMemo(
    () =>
      availableBeds.filter(
        (bed) => bed.isAvailable && (!transferBed || bed.bedId !== transferBed.bedId)
      ),
    [availableBeds, transferBed]
  );
  const wardNameById = useMemo(() => {
    const map = new Map<string, string>();
    beds.forEach((bed) => {
      if (bed.wardId && bed.wardName) {
        map.set(bed.wardId, bed.wardName);
      }
    });
    return map;
  }, [beds]);
  const bedNumberById = useMemo(() => {
    const map = new Map<string, string>();
    bedBrowserQuery.data?.beds?.forEach((bed) => {
      if (bed.bedId && bed.bedNumber) {
        map.set(bed.bedId, bed.bedNumber);
      }
    });
    return map;
  }, [bedBrowserQuery.data?.beds]);
  const bedCodeById = useMemo(() => {
    const map = new Map<string, string>();
    beds.forEach((bed) => {
      if (bed.bedId && bed.bedCode) {
        map.set(bed.bedId, bed.bedCode);
      }
    });
    return map;
  }, [beds]);

  const wardOptions = useMemo(() => {
    const unique = new Map<string, { id: string; name: string; code?: string }>();
    wardsData.forEach((ward) => {
      if (ward.ward.id && ward.ward.name) {
        unique.set(ward.ward.id, { id: ward.ward.id, name: ward.ward.name, code: ward.ward.code });
      }
    });
    return Array.from(unique.values());
  }, [wardsData]);

  const bedsByWard = useMemo(() => {
    const map = new Map<string, WardBoardBedEntry[]>();
    beds.forEach((bed) => {
      const list = map.get(bed.wardId) ?? [];
      list.push(bed);
      map.set(bed.wardId, list);
    });
    return map;
  }, [beds]);

  const bedsForView = useMemo(
    () => (selectedWardIds.length ? beds.filter((bed) => selectedWardIds.includes(bed.wardId)) : beds),
    [beds, selectedWardIds]
  );

  const counts = useMemo(() => countStatuses(bedsForView), [bedsForView]);
  const query = searchText.trim().toLowerCase();

  const visibleWards = useMemo(
    () =>
      wardOptions
        .filter((ward) => selectedWardIds.length === 0 || selectedWardIds.includes(ward.id))
        .map((ward) => {
          const wardBeds = bedsByWard.get(ward.id) ?? [];
          const shownBeds = wardBeds.filter(
            (bed) =>
              (activeFilter === 'all' || bedStatusKey(bed) === activeFilter) && matchesSearch(bed, query)
          );
          return { ward, wardBeds, shownBeds, counts: countStatuses(wardBeds) };
        })
        .filter(({ shownBeds }) => (activeFilter === 'all' && !query) || shownBeds.length > 0),
    [wardOptions, selectedWardIds, bedsByWard, activeFilter, query]
  );

  const lastUpdated = multiBoardQuery.dataUpdatedAt
    ? new Date(multiBoardQuery.dataUpdatedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : null;
  const subtitle = [
    selectedWardIds.length === 0
      ? 'All wards'
      : `${selectedWardIds.length} ward${selectedWardIds.length === 1 ? '' : 's'} selected`,
    `${counts.all} beds`,
    lastUpdated ? `Updated ${lastUpdated}` : '',
  ]
    .filter(Boolean)
    .join(' · ');

  const toggleWard = (wardId: string) =>
    setSelectedWardIds((prev) => (prev.includes(wardId) ? prev.filter((id) => id !== wardId) : [...prev, wardId]));

  const clearFilters = () => {
    setActiveFilter('all');
    setSearchText('');
    setSelectedWardIds([]);
  };

  const admitHrefFor = (bed: WardBoardBedEntry) =>
    bed.bedId && bed.wardId
      ? `/${locale}/inpatient/admissions/new?bedId=${encodeURIComponent(bed.bedId)}&wardId=${encodeURIComponent(bed.wardId)}`
      : undefined;

  const handleBedAction = (action: BedAction, bed: WardBoardBedEntry) => {
    if (action === 'TRANSFER' && bed.admission?.admissionId) {
      setTransferBed(bed);
    } else if (action === 'MEDS') {
      handleOpenMeds(bed);
    } else if (action === 'ORDERS') {
      handleOpenOrders(bed);
    } else if (action === 'DETAILS') {
      handleOpenDetails(bed);
    }
  };

  const resetTransferState = () => {
    setTransferBed(null);
    setTransferReason('');
    setTransferType(TransferType.CLINICAL_NEED);
    setTransferNotes('');
    setTargetBedId('');
    setShowTransferHistory(false);
  };

  const handleTransferSubmit = async () => {
    if (!transferAdmissionId || !targetBedId || !transferReason.trim()) {
      toast({
        title: 'Missing transfer details',
        description: 'Select a destination bed and provide a transfer reason.',
        variant: 'destructive',
      });
      return;
    }
    const selectedTarget = transferCandidates.find((bed) => bed.bedId === targetBedId);
    if (!selectedTarget) {
      toast({
        title: 'Invalid target bed',
        description: 'Please select a valid available bed for the transfer.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await transferMutation.mutateAsync({
        toWardId: selectedTarget.ward.id,
        toBedId: selectedTarget.bedId,
        transferReason: transferReason.trim(),
        transferType,
        notes: transferNotes.trim() || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['inpatient', 'bed-browser'] });
      toast({ title: 'Transfer completed', description: 'Patient moved successfully.', variant: 'success' });
      resetTransferState();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to transfer patient.');
      toast({ title: 'Transfer failed', description: message, variant: 'destructive' });
    }
  };

  const handleOpenMeds = (bed: WardBoardBedEntry) => {
    const admission = bed.admission;
    if (!admission?.encounterId || !admission.patientId) {
      toast({
        title: 'Cannot open Meds',
        description: 'No encounter or patient is linked to this admission.',
        variant: 'destructive',
      });
      return;
    }
    const prescriberId = admission.attendingPhysicianId ?? userId;
    if (!isUuid(prescriberId)) {
      toast({
        title: 'Cannot open Meds',
        description: 'Prescriber identity is missing or invalid.',
        variant: 'destructive',
      });
      return;
    }
    setPrescriptionBed(bed);
    setPrescribedById(prescriberId);
  };

  const handleOpenOrders = (bed: WardBoardBedEntry) => {
    const admission = bed.admission;
    if (!admission?.encounterId || !admission.patientId) {
      toast({
        title: 'Cannot open Orders',
        description: 'No encounter or patient is linked to this admission.',
        variant: 'destructive',
      });
      return;
    }
    const ordererId = admission.attendingPhysicianId ?? userId;
    if (!isUuid(ordererId)) {
      toast({
        title: 'Cannot open Orders',
        description: 'Orderer identity is missing or invalid.',
        variant: 'destructive',
      });
      return;
    }
    setOrdersBed(bed);
    setOrderedById(ordererId);
  };

  const handleOpenDetails = (bed: WardBoardBedEntry) => {
    const admissionId = bed.admission?.admissionId;
    if (!admissionId) {
      toast({
        title: 'Cannot open details',
        description: 'No admission is linked to this bed.',
        variant: 'destructive',
      });
      return;
    }
    router.push(`/${locale}/inpatient/ward-board/${admissionId}`);
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString();
  };

  const formatRelativeTime = (value?: string | null) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
    const absSeconds = Math.abs(diffSeconds);
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

    if (absSeconds < 60) {
      return rtf.format(diffSeconds, 'second');
    }
    const diffMinutes = Math.round(diffSeconds / 60);
    if (Math.abs(diffMinutes) < 60) {
      return rtf.format(diffMinutes, 'minute');
    }
    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) {
      return rtf.format(diffHours, 'hour');
    }
    const diffDays = Math.round(diffHours / 24);
    if (Math.abs(diffDays) < 7) {
      return rtf.format(diffDays, 'day');
    }
    const diffWeeks = Math.round(diffDays / 7);
    if (Math.abs(diffWeeks) < 4) {
      return rtf.format(diffWeeks, 'week');
    }
    const diffMonths = Math.round(diffDays / 30);
    if (Math.abs(diffMonths) < 12) {
      return rtf.format(diffMonths, 'month');
    }
    const diffYears = Math.round(diffDays / 365);
    return rtf.format(diffYears, 'year');
  };

  const isLoading = multiBoardQuery.isLoading;
  const hasFilters = activeFilter !== 'all' || Boolean(query) || selectedWardIds.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ward Board"
        subtitle={subtitle}
        icon={BedDouble}
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-2 rounded-lg"
              onClick={() => {
                multiBoardQuery.refetch();
                bedBrowserQuery.refetch();
              }}
              disabled={multiBoardQuery.isFetching}
            >
              <RefreshCw className={cn('h-4 w-4', multiBoardQuery.isFetching && 'animate-spin')} />
              Refresh
            </Button>
            <div className="flex items-center rounded-lg border border-border bg-card p-0.5 shadow-sm" role="group" aria-label="Layout">
              {(['grid', 'list'] as const).map((mode) => {
                const Icon = mode === 'grid' ? LayoutGrid : List;
                const isActive = viewMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      'flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors',
                      isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {mode === 'grid' ? 'Grid' : 'List'}
                  </button>
                );
              })}
            </div>
          </>
        }
      />

      {isLoading ? (
        <WardBoardSkeleton />
      ) : multiBoardQuery.isError && wardOptions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rose-200 bg-card dark:border-rose-900/60">
          <EmptyState
            icon={AlertTriangle}
            title="Could not load the ward board"
            description={getApiErrorMessage(multiBoardQuery.error, 'The bed board did not load. Try again.')}
            action={
              <Button type="button" variant="outline" size="sm" onClick={() => multiBoardQuery.refetch()}>
                Try again
              </Button>
            }
          />
        </div>
      ) : wardOptions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card">
          <EmptyState
            icon={BedDouble}
            title="No wards yet"
            description="No ward data is available for this facility. Wards and beds are set up under facility administration."
          />
        </div>
      ) : (
        <>
          <BoardSummary counts={counts} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative lg:w-80 lg:shrink-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search patient, MRN or bed"
                  aria-label="Search beds"
                  className="h-10 rounded-lg pl-9 pr-9"
                />
                {searchText && (
                  <button
                    type="button"
                    onClick={() => setSearchText('')}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0" role="group" aria-label="Filter by ward">
                <button
                  type="button"
                  aria-pressed={selectedWardIds.length === 0}
                  onClick={() => setSelectedWardIds([])}
                  className={cn(
                    'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                    selectedWardIds.length === 0
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-background text-muted-foreground hover:border-slate-300 hover:text-foreground'
                  )}
                >
                  All Wards
                </button>
                {wardOptions.map((ward) => {
                  const isSelected = selectedWardIds.includes(ward.id);
                  const wardCounts = countStatuses(bedsByWard.get(ward.id) ?? []);
                  return (
                    <button
                      key={ward.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggleWard(ward.id)}
                      className={cn(
                        'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                          : 'border-border bg-background text-muted-foreground hover:border-slate-300 hover:text-foreground'
                      )}
                    >
                      {ward.name}
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-px text-[10px] tabular-nums',
                          isSelected ? 'bg-white/20' : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {wardCounts.occupied}/{wardCounts.all}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {visibleWards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card">
              <EmptyState
                icon={SearchX}
                title="No beds match"
                description="Nothing on the board matches the current search and filters."
                action={
                  hasFilters ? (
                    <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  ) : undefined
                }
              />
            </div>
          ) : (
            <div className="space-y-6">
              {visibleWards.map(({ ward, shownBeds, counts: wardCounts }) => (
                <section key={ward.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                  <WardSectionHeader name={ward.name} code={ward.code} counts={wardCounts} />
                  {shownBeds.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                      No beds in this ward match the selected filter.
                    </p>
                  ) : viewMode === 'grid' ? (
                    <div className="grid gap-4 bg-muted/20 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                      {shownBeds.map((bed, index) => (
                        <BedCard
                          key={bed.bedId || `${bed.bedCode}-${index}`}
                          bed={bed}
                          index={index}
                          admitHref={admitHrefFor(bed)}
                          onAction={handleBedAction}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {shownBeds.map((bed, index) => (
                        <BedRow
                          key={bed.bedId || `${bed.bedCode}-${index}`}
                          bed={bed}
                          admitHref={admitHrefFor(bed)}
                          onAction={handleBedAction}
                        />
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </>
      )}

      {prescriptionBed &&
        prescriptionBed.admission?.encounterId &&
        prescriptionBed.admission?.patientId &&
        prescribedById && (
        <WardPrescriptionDialog
          open={!!prescriptionBed}
          onOpenChange={(open) => {
            if (!open) {
              setPrescriptionBed(null);
              setPrescribedById('');
            }
          }}
          encounterId={prescriptionBed.admission.encounterId}
          patientId={prescriptionBed.admission.patientId}
          patientName={
            prescriptionBed.admission.patientDisplay?.displayName ??
            prescriptionBed.admission.patientDisplay?.firstName ??
            'Patient'
          }
          prescribedBy={prescribedById}
        />
      )}

      {ordersBed && ordersBed.admission?.encounterId && ordersBed.admission?.patientId && orderedById && (
        <WardOrdersDialog
          open={!!ordersBed}
          onOpenChange={(open) => {
            if (!open) {
              setOrdersBed(null);
              setOrderedById('');
            }
          }}
          encounterId={ordersBed.admission.encounterId}
          patientId={ordersBed.admission.patientId}
          patientName={
            ordersBed.admission.patientDisplay?.displayName ??
            ordersBed.admission.patientDisplay?.firstName ??
            'Patient'
          }
          orderedBy={orderedById}
        />
      )}

      <Dialog open={!!transferBed} onOpenChange={(open) => (!open ? resetTransferState() : null)}>
        <DialogContent className="max-w-3xl">
          <DialogCloseButton />
          <DialogHeader>
            <DialogTitle>Transfer Patient</DialogTitle>
            <DialogDescription>Move the patient to a new available bed.</DialogDescription>
          </DialogHeader>
          {transferBed && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Transfer From</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {transferBed.bedCode ?? bedNumberById.get(transferBed.bedId) ?? 'Bed'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{transferBed.wardName ?? 'Ward'}</p>
                  <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {transferBed.admission?.patientDisplay?.displayName ??
                      transferBed.admission?.patientDisplay?.firstName ??
                      'Patient'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Transfer To</p>
                  <div className="mt-3 space-y-3">
                    <Label htmlFor="target-bed">Select available bed *</Label>
                    <Select value={targetBedId} onValueChange={setTargetBedId}>
                      <SelectTrigger id="target-bed">
                        <SelectValue placeholder="Choose a bed" />
                      </SelectTrigger>
                      <SelectContent>
                        {transferCandidates.map((bed) => (
                          <SelectItem key={bed.bedId} value={bed.bedId}>
                            {(bed.ward?.name ?? 'Ward') +
                              ' · ' +
                              (bed.bedNumber ||
                                bedCodeById.get(bed.bedId) ||
                                bedNumberById.get(bed.bedId) ||
                                'Bed')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {bedSearchQuery.isLoading && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">Loading available beds...</p>
                    )}
                    {!bedSearchQuery.isLoading && transferCandidates.length === 0 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        No available beds found for this facility.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Transfer History</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Review previous transfers for this admission.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => setShowTransferHistory((prev) => !prev)}
                    disabled={!transferAdmissionId}
                  >
                    {showTransferHistory ? 'Hide History' : 'View History'}
                  </Button>
                </div>
                {showTransferHistory && (
                  <div className="mt-4 text-sm">
                    {transferHistoryQuery.isLoading && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">Loading transfer history...</p>
                    )}
                    {!transferHistoryQuery.isLoading &&
                      (!transferHistoryQuery.data || transferHistoryQuery.data.length === 0) && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          No transfers recorded for this admission.
                        </p>
                      )}
                    {transferHistoryQuery.data && transferHistoryQuery.data.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {transferHistoryQuery.data.map((entry) => {
                          const wardLabel = wardNameById.get(entry.wardId) ?? entry.wardId;
                          const bedLabel = bedNumberById.get(entry.bedId) ?? entry.bedId;
                          const assignedAt = formatDateTime(entry.assignedAt);
                          return (
                            <div
                              key={entry.id}
                              className="rounded-xl border border-slate-200/70 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                  {transferTypeLabels[entry.transferType as TransferType] ??
                                    entry.transferType ??
                                    'Transfer'}
                                </p>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {formatRelativeTime(entry.assignedAt)}
                                </span>
                              </div>
                              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Ward: {wardLabel} · Bed: {bedLabel} · Assigned By: {entry.assignedBy}
                              </div>
                              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Released: {formatRelativeTime(entry.releasedAt)} · Assigned: {assignedAt}
                              </div>
                              {entry.transferReason && (
                                <p className="mt-2 text-xs text-slate-700 dark:text-slate-300">
                                  Reason: {entry.transferReason}
                                </p>
                              )}
                              {entry.notes && (
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                  Notes: {entry.notes}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="transfer-type">Transfer Type *</Label>
                  <Select
                    value={transferType}
                    onValueChange={(value) => setTransferType(value as TransferType)}
                  >
                    <SelectTrigger id="transfer-type">
                      <SelectValue placeholder="Select transfer type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TransferType).map((value) => (
                        <SelectItem key={value} value={value}>
                          {transferTypeLabels[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transfer-reason">Transfer Reason *</Label>
                  <Input
                    id="transfer-reason"
                    value={transferReason}
                    onChange={(event) => setTransferReason(event.target.value)}
                    placeholder="Add transfer reason"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transfer-notes">Notes</Label>
                <Textarea
                  id="transfer-notes"
                  value={transferNotes}
                  onChange={(event) => setTransferNotes(event.target.value)}
                  rows={3}
                  placeholder="Optional notes"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <Button type="button" variant="ghost" onClick={resetTransferState}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-sky-500 text-white hover:bg-sky-400"
                  onClick={handleTransferSubmit}
                  disabled={
                    transferMutation.isPending ||
                    !transferAdmissionId ||
                    !targetBedId ||
                    !transferReason.trim()
                  }
                >
                  {transferMutation.isPending ? 'Transferring...' : 'Transfer Patient'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
