'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogCloseButton } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useBedSearch } from '@/modules/clinical/hooks/use-bed-search';
import { useBedBrowser } from '@/modules/clinical/hooks/use-bed-browser';
import { useMultiWardBedBoard, useTransferPatient, useTransferHistory } from '@/modules/clinical/hooks/use-inpatient';
import { WardPrescriptionDialog } from '@/modules/clinical/components/inpatient/ward-prescription-dialog';
import { WardOrdersDialog } from '@/modules/clinical/components/inpatient/ward-orders-dialog';
import type {
  WardBoardAdmission,
  WardBoardAction,
  WardBoardFlags,
  WardBoardOccupancy,
} from '@/modules/clinical/types/inpatient';
import { TransferType } from '@/modules/clinical/types/inpatient';
import { getSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Circle, LayoutGrid, List, Plus, User } from 'lucide-react';

type FilterKey = 'all' | 'occupied' | 'available' | 'cleaning' | 'maintenance';

const statusOrder: FilterKey[] = ['all', 'occupied', 'available', 'cleaning', 'maintenance'];

const fallRiskLabels: Record<string, string> = {
  low: 'Low Fall Risk',
  medium: 'Moderate Fall Risk',
  high: 'High Fall Risk',
};

const actionLabels: Record<string, string> = {
  TRANSFER: 'Transfer',
  MEDS: 'Meds',
  ORDERS: 'Orders',
  DETAILS: 'Channel',
  ADMIT_PATIENT: 'Admit Patient',
  CONFIRM_DISCHARGE: 'Confirm Discharge',
};

type WardBoardBedEntry = {
  bedId: string;
  bedCode: string;
  spaceName?: string;
  wardId: string;
  wardName: string;
  occupancy: WardBoardOccupancy;
  status?: string;
  admission?: WardBoardAdmission | null;
  actions?: WardBoardAction[];
};

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

function normalizeValue(value?: string | null) {
  return value ? value.toUpperCase() : '';
}

function getPatientInitials(name?: string) {
  if (!name) {
    return '??';
  }
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getFlagBadges(flags?: WardBoardFlags) {
  if (!flags) {
    return [];
  }
  const badges: { label: string; className: string }[] = [];
  if (flags.fallRisk) {
    const fallRisk = typeof flags.fallRisk === 'string' ? flags.fallRisk : 'high';
    const label = fallRiskLabels[fallRisk.toLowerCase()] ?? 'Fall Risk';
    badges.push({
      label,
      className: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
    });
  }
  if (flags.npo) {
    badges.push({
      label: 'NPO',
      className: 'bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/30',
    });
  }
  if (flags.telemetry) {
    badges.push({
      label: 'Telemetry',
      className: 'bg-sky-500/15 text-sky-200 ring-1 ring-sky-500/30',
    });
  }
  if (flags.isolation) {
    badges.push({
      label: 'Isolation',
      className: 'bg-purple-500/15 text-purple-200 ring-1 ring-purple-500/30',
    });
  }
  if (flags.allergies?.length) {
    badges.push({
      label: 'Allergies',
      className: 'bg-orange-500/15 text-orange-200 ring-1 ring-orange-500/30',
    });
  }
  return badges;
}

function getStatusTone(status: string) {
  const normalized = normalizeValue(status);

  if (normalized === 'AVAILABLE' || normalized === 'EMPTY') {
    return {
      border: 'border-slate-200',
      accent: 'border-l-slate-300',
      badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-200',
      status: 'Available',
    };
  }

  if (normalized === 'CLEANING') {
    return {
      border: 'border-amber-200',
      accent: 'border-l-amber-400',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
      status: 'Cleaning',
    };
  }

  if (normalized === 'MAINTENANCE') {
    return {
      border: 'border-amber-200',
      accent: 'border-l-amber-400',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
      status: 'Maintenance',
    };
  }

  return {
    border: 'border-emerald-200',
    accent: 'border-l-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
    status: 'Occupied',
  };
}

function getOccupancyFilter(occupancy?: WardBoardOccupancy) {
  const normalized = normalizeValue(occupancy);
  if (normalized === 'AVAILABLE' || normalized === 'EMPTY') {
    return 'available';
  }
  if (normalized === 'CLEANING') {
    return 'cleaning';
  }
  if (normalized === 'MAINTENANCE') {
    return 'maintenance';
  }
  return 'occupied';
}

function getBedStatus(bed: WardBoardBedEntry) {
  return bed.status ?? bed.occupancy ?? '';
}

export default function InpatientWardsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedWardIds, setSelectedWardIds] = useState<string[]>([]);
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
  const wardsData = multiBoardQuery.data?.wards ?? [];
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
          actions: bed.actions ?? [],
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
    const unique = new Map<string, string>();
    wardsData.forEach((ward) => {
      if (ward.ward.id && ward.ward.name) {
        unique.set(ward.ward.id, ward.ward.name);
      }
    });
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  }, [wardsData]);

  const filteredWardIds = useMemo(() => {
    if (selectedWardIds.length) {
      return new Set(selectedWardIds);
    }
    return new Set(wardOptions.map((ward) => ward.id));
  }, [selectedWardIds, wardOptions]);

  const bedsForView = useMemo(
    () => beds.filter((bed) => filteredWardIds.size === 0 || filteredWardIds.has(bed.wardId)),
    [beds, filteredWardIds]
  );

  const filters = useMemo(() => {
    const totalBeds = bedsForView.length;
    return {
      all: totalBeds,
      occupied: bedsForView.filter((bed) => getOccupancyFilter(getBedStatus(bed)) === 'occupied').length,
      available: bedsForView.filter((bed) => getOccupancyFilter(getBedStatus(bed)) === 'available').length,
      cleaning: bedsForView.filter((bed) => getOccupancyFilter(getBedStatus(bed)) === 'cleaning').length,
      maintenance: bedsForView.filter((bed) => getOccupancyFilter(getBedStatus(bed)) === 'maintenance').length,
    };
  }, [bedsForView]);

  const wardName = 'Ward Board';
  const wardCode =
    selectedWardIds.length === 0
      ? 'All wards'
      : `${selectedWardIds.length} ward${selectedWardIds.length === 1 ? '' : 's'} selected`;

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
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to transfer patient.';
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

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-400">Ward Board</p>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{wardName}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{wardCode}</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="flex items-center rounded-full bg-white/90 p-1 text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/80 dark:text-slate-300 dark:shadow-inner dark:shadow-slate-800/50 dark:ring-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition ${viewMode === 'grid'
                ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition ${viewMode === 'list'
                ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">Ward Filter</p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              {selectedWardIds.length === 0
                ? 'Showing all wards in the facility'
                : 'Showing selected wards'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              className={`rounded-full ${selectedWardIds.length === 0
                ? 'bg-sky-500 text-white hover:bg-sky-400'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              onClick={() => setSelectedWardIds([])}
            >
              All Wards
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              onClick={() => setSelectedWardIds(wardOptions.map((ward) => ward.id))}
              disabled={wardOptions.length === 0}
            >
              Select All
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {multiBoardQuery.isLoading && <p className="text-xs text-slate-400">Loading wards...</p>}
          {!multiBoardQuery.isLoading && wardOptions.length === 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">No wards found for this facility.</p>
          )}
          {!multiBoardQuery.isLoading &&
            wardOptions.map((ward) => {
              const isSelected = selectedWardIds.includes(ward.id);
              const label = ward.name ?? 'Ward';
              return (
                <button
                  key={ward.id}
                  type="button"
                  onClick={() => {
                    setSelectedWardIds((prev) =>
                      prev.includes(ward.id) ? prev.filter((id) => id !== ward.id) : [...prev, ward.id]
                    );
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${isSelected
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                >
                  {label}
                </button>
              );
            })}
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        {statusOrder.map((key) => {
          const label =
            key === 'all'
              ? 'All Beds'
              : key === 'occupied'
                ? 'Occupied'
                : key === 'available'
                  ? 'Available'
                  : key === 'cleaning'
                    ? 'Cleaning'
                    : 'Maintenance';
          const count = filters[key];
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${isActive
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-900/80 dark:text-slate-300 dark:ring-0 dark:hover:bg-slate-800'
                }`}
            >
              <span>{label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </section>

      {multiBoardQuery.isLoading && <p className="text-sm text-slate-500 dark:text-slate-400">Loading bed board...</p>}

      {!multiBoardQuery.isLoading && bedsForView.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          No ward data available for the selected facility.
        </div>
      )}

      {!multiBoardQuery.isLoading && bedsForView.length > 0 && (
        <section className="space-y-8">
          {wardOptions
            .filter((ward) => filteredWardIds.size === 0 || filteredWardIds.has(ward.id))
            .map((ward, wardIndex) => {
              const wardBeds = bedsForView.filter((bed) => bed.wardId === ward.id);
              const filteredBeds = wardBeds.filter((bed) => {
                if (activeFilter === 'all') {
                  return true;
                }
                if (activeFilter === 'occupied') {
                    return getOccupancyFilter(getBedStatus(bed)) === 'occupied';
                  }
                  if (activeFilter === 'available') {
                    return getOccupancyFilter(getBedStatus(bed)) === 'available';
                  }
                  if (activeFilter === 'cleaning') {
                    return getOccupancyFilter(getBedStatus(bed)) === 'cleaning';
                  }
                  return getOccupancyFilter(getBedStatus(bed)) === 'maintenance';
                });

              if (activeFilter !== 'all' && filteredBeds.length === 0) {
                return null;
              }

              const wardNameLabel = ward.name ?? 'Ward';
              const wardCodeLabel = '';
              return (
                <div key={`${ward.id ?? wardIndex}`} className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">Ward</p>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white">{wardNameLabel}</p>
                      {wardCodeLabel && <p className="text-sm text-slate-500 dark:text-slate-500">{wardCodeLabel}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {wardBeds.filter((bed) => getOccupancyFilter(getBedStatus(bed)) === 'occupied').length} occupied
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {wardBeds.filter((bed) => getOccupancyFilter(getBedStatus(bed)) === 'available').length} available
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {wardBeds.filter((bed) => getOccupancyFilter(getBedStatus(bed)) === 'cleaning').length} cleaning
                      </span>
                    </div>
                  </div>

                  {filteredBeds.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                      No beds match the selected filter.
                    </div>
                  )}

                  {viewMode === 'grid' && (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {filteredBeds.map((bed, index) => {
              const tone = getStatusTone(getBedStatus(bed));
                        const patientDisplay = bed.admission?.patientDisplay;
                        const patientName =
                          patientDisplay?.displayName
                          ?? [patientDisplay?.firstName, patientDisplay?.lastName].filter(Boolean).join(' ')
                          ?? 'Unassigned';
                        const patientMetaParts = [
                          patientDisplay?.age ? `${patientDisplay.age}Y` : '',
                          patientDisplay?.gender ? patientDisplay.gender : '',
                          patientDisplay?.mrn ? `MRN ${patientDisplay.mrn}` : '',
                        ].filter(Boolean);
                        const patientMeta = patientMetaParts.join(' · ');
                        const flags = getFlagBadges(bed.admission?.boardFlags);
                        const visibleFlags = flags.slice(0, 3);
                        const extraFlags = flags.length - visibleFlags.length;
                        const bedCode = bed.bedCode ?? 'Bed';
                        const roomName = bed.spaceName ?? ward.name ?? 'Ward';
              const actions =
                bed.actions && bed.actions.length
                  ? Array.from(
                      new Set([
                        'MEDS',
                        'ORDERS',
                        'TRANSFER',
                        'DETAILS',
                        ...(getOccupancyFilter(bed.occupancy) === 'occupied' ? ['ORDERS'] : []),
                        ...bed.actions,
                      ])
                    )
                  : getOccupancyFilter(getBedStatus(bed)) === 'occupied'
                  ? ['MEDS', 'ORDERS', 'TRANSFER', 'DETAILS']
                  : getOccupancyFilter(getBedStatus(bed)) === 'available'
                  ? ['ADMIT_PATIENT']
                  : [];
              const isEmpty = getOccupancyFilter(getBedStatus(bed)) === 'available';
              const isCleaning = getOccupancyFilter(getBedStatus(bed)) === 'cleaning';

                        return (
                          <article
                            key={`${bed.bedId ?? bedCode}-${index}`}
                            className={`group relative overflow-hidden rounded-2xl border border-l-4 ${tone.accent} ${tone.border} bg-white p-5 shadow-md shadow-slate-200/70 transition hover:-translate-y-0.5 hover:border-slate-300 dark:bg-slate-900/70 dark:shadow-black/20 dark:hover:border-slate-500/70 ${isEmpty ? 'border-dashed' : ''
                              } animate-in fade-in-0`}
                            style={{ animationDelay: `${index * 60}ms` }}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">Bed</p>
                                <p className="text-2xl font-semibold text-slate-900 dark:text-white">{bedCode}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{roomName}</p>
                              </div>
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone.badge}`}>{tone.status}</span>
                            </div>

                            {isEmpty || isCleaning ? (
                              <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center dark:border-slate-800 dark:bg-slate-950/30">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                                  <Circle className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    {isCleaning ? 'Bed in Cleaning' : 'Bed Available'}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {isCleaning ? 'Awaiting environmental services' : 'Ready for patient admission'}
                                  </p>
                                </div>
                                {actions.includes('ADMIT_PATIENT') && !isCleaning && (
                                  <Button className="rounded-full bg-sky-500 text-white hover:bg-sky-400">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Admit Patient
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <div className="mt-6 space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    {getPatientInitials(patientName)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{patientName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {patientMeta || (bed.admission?.admissionStatus ?? 'Currently admitted')}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-slate-500 dark:text-slate-500" />
                                    {bed.admission ? 'Assigned team' : 'No assignment'}
                                  </span>
                        {getOccupancyFilter(getBedStatus(bed)) === 'maintenance' && (
                          <span className="flex items-center gap-2 text-orange-500 dark:text-orange-200">
                            <AlertTriangle className="h-4 w-4" />
                            Maintenance
                          </span>
                        )}
                                </div>

                                {visibleFlags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {visibleFlags.map((flag) => (
                                      <span
                                        key={flag.label}
                                        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${flag.className}`}
                                      >
                                        {flag.label}
                                      </span>
                                    ))}
                                    {extraFlags > 0 && (
                                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        +{extraFlags}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {actions.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {actions.map((action) => {
                                      const label = actionLabels[action] ?? action;
                                      const isPrimary = action === 'DETAILS' || action === 'ADMIT_PATIENT';
                                      return (
                                        <Button
                                          key={action}
                                          size="sm"
                                          className={`rounded-full px-4 ${isPrimary
                                            ? 'bg-sky-500 text-white hover:bg-sky-400'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                          variant="secondary"
                                          onClick={() => {
                                if (action === 'TRANSFER' && bed.admission?.admissionId) {
                                  setTransferBed(bed);
                                }
                                if (action === 'MEDS') {
                                  handleOpenMeds(bed);
                                }
                                if (action === 'ORDERS') {
                                  handleOpenOrders(bed);
                                }
                                if (action === 'DETAILS') {
                                  handleOpenDetails(bed);
                                }
                              }}
                            >
                              {label}
                            </Button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  )}

                  {viewMode === 'list' && (
                    <div className="space-y-3">
                      {filteredBeds.map((bed, index) => {
                        const tone = getStatusTone(getBedStatus(bed));
                        const patientDisplay = bed.admission?.patientDisplay;
                        const patientName =
                          patientDisplay?.displayName
                          ?? [patientDisplay?.firstName, patientDisplay?.lastName].filter(Boolean).join(' ')
                          ?? 'Unassigned';
                        const patientMetaParts = [
                          patientDisplay?.age ? `${patientDisplay.age}Y` : '',
                          patientDisplay?.gender ? patientDisplay.gender : '',
                          patientDisplay?.mrn ? `MRN ${patientDisplay.mrn}` : '',
                        ].filter(Boolean);
                        const patientMeta = patientMetaParts.join(' · ');
                        const bedCode = bed.bedCode ?? 'Bed';
                        const roomName = bed.spaceName ?? ward.name ?? 'Ward';
                        const actions =
                          bed.actions && bed.actions.length
                            ? Array.from(
                                new Set([
                                  'MEDS',
                                  'ORDERS',
                                  'TRANSFER',
                                  'DETAILS',
                                  ...(getOccupancyFilter(bed.occupancy) === 'occupied' ? ['ORDERS'] : []),
                                  ...bed.actions,
                                ])
                              )
                            : getOccupancyFilter(getBedStatus(bed)) === 'occupied'
                            ? ['MEDS', 'ORDERS', 'TRANSFER', 'DETAILS']
                            : getOccupancyFilter(getBedStatus(bed)) === 'available'
                            ? ['ADMIT_PATIENT']
                            : [];
                        const isEmpty = getOccupancyFilter(getBedStatus(bed)) === 'available';

                        return (
                          <div
                            key={`${bed.bedId ?? bedCode}-${index}`}
                            className={`flex flex-col gap-4 rounded-2xl border ${tone.border} bg-white p-4 shadow-sm shadow-slate-200/60 dark:bg-slate-900/70 dark:shadow-black/20 sm:flex-row sm:items-center ${isEmpty ? 'border-dashed' : ''
                              }`}
                          >
                            <div className="flex flex-1 items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                {getPatientInitials(patientName)}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{bedCode}</p>
                                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone.badge}`}>
                                    {tone.status}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{roomName}</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{patientName}</p>
                                {patientMeta && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{patientMeta}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {actions.length === 0 && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">No actions</span>
                              )}
                              {actions.map((action) => {
                                const label = actionLabels[action] ?? action;
                                const isPrimary = action === 'DETAILS' || action === 'ADMIT_PATIENT';
                                return (
                                  <Button
                                    key={action}
                                    size="sm"
                                    className={`rounded-full px-4 ${isPrimary
                                      ? 'bg-sky-500 text-white hover:bg-sky-400'
                                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                                      }`}
                                    variant="secondary"
                                    onClick={() => {
                                      if (action === 'TRANSFER' && bed.admission?.admissionId) {
                                        setTransferBed(bed);
                                      } else if (action === 'MEDS') {
                                        handleOpenMeds(bed);
                                      } else if (action === 'ORDERS') {
                                        handleOpenOrders(bed);
                                      } else if (action === 'DETAILS') {
                                        handleOpenDetails(bed);
                                      }
                                    }}
                                  >
                                    {label}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </section>
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
