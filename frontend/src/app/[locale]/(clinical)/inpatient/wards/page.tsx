'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBedBrowser } from '@/modules/clinical/hooks/use-bed-browser';
import type { WardBoardFlags } from '@/modules/clinical/types/inpatient';
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
  DETAILS: 'Details',
  ADMIT_PATIENT: 'Admit Patient',
  CONFIRM_DISCHARGE: 'Confirm Discharge',
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

  if (normalized === 'AVAILABLE') {
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

export default function InpatientWardsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedWardIds, setSelectedWardIds] = useState<string[]>([]);
  const bedBrowserQuery = useBedBrowser({});
  const beds = bedBrowserQuery.data?.beds ?? [];

  const wardOptions = useMemo(() => {
    const unique = new Map<string, string>();
    beds.forEach((bed) => {
      if (bed.wardId && bed.wardName) {
        unique.set(bed.wardId, bed.wardName);
      }
    });
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  }, [beds]);

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
      occupied: bedsForView.filter((bed) => bed.status === 'occupied').length,
      available: bedsForView.filter((bed) => bed.status === 'available').length,
      cleaning: bedsForView.filter((bed) => bed.status === 'cleaning').length,
      maintenance: bedsForView.filter((bed) => bed.status === 'maintenance').length,
    };
  }, [bedsForView]);

  const wardName = 'Ward Board';
  const wardCode =
    selectedWardIds.length === 0
      ? 'All wards'
      : `${selectedWardIds.length} ward${selectedWardIds.length === 1 ? '' : 's'} selected`;

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
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
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition ${
                  viewMode === 'grid'
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
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition ${
                  viewMode === 'list'
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
                className={`rounded-full ${
                  selectedWardIds.length === 0
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
            {bedBrowserQuery.isLoading && <p className="text-xs text-slate-400">Loading wards...</p>}
            {!bedBrowserQuery.isLoading && wardOptions.length === 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">No wards found for this facility.</p>
            )}
            {!bedBrowserQuery.isLoading &&
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
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      isSelected
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
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-900/80 dark:text-slate-300 dark:ring-0 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
          })}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">Total Beds</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{filters.all}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">Occupied</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{filters.occupied}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">Available</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{filters.available}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">Maintenance</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{filters.maintenance}</p>
          </div>
        </section>

        {bedBrowserQuery.isLoading && <p className="text-sm text-slate-500 dark:text-slate-400">Loading bed board...</p>}

        {!bedBrowserQuery.isLoading && bedsForView.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
            No ward data available for the selected facility.
          </div>
        )}

        {!bedBrowserQuery.isLoading && bedsForView.length > 0 && (
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
                    return bed.status === 'occupied';
                  }
                  if (activeFilter === 'available') {
                    return bed.status === 'available';
                  }
                  if (activeFilter === 'cleaning') {
                    return bed.status === 'cleaning';
                  }
                  return bed.status === 'maintenance';
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
                        {wardBeds.filter((bed) => bed.status === 'occupied').length} occupied
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {wardBeds.filter((bed) => bed.status === 'available').length} available
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {wardBeds.filter((bed) => bed.status === 'cleaning').length} cleaning
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
              const tone = getStatusTone(bed.status);
              const patientName = bed.occupant?.patientName ?? 'Unassigned';
              const patientMeta = '';
              const flags = getFlagBadges(undefined);
              const visibleFlags = flags.slice(0, 3);
              const extraFlags = flags.length - visibleFlags.length;
              const bedCode = bed.bedNumber ?? 'Bed';
              const roomName = ward.name ?? 'Ward';
              const actions =
                bed.status === 'occupied'
                  ? ['TRANSFER', 'MEDS', 'DETAILS']
                  : bed.status === 'available'
                  ? ['ADMIT_PATIENT']
                  : [];
              const isEmpty = bed.status === 'available';
              const isCleaning = bed.status === 'cleaning';

              return (
                <article
                  key={`${bed.bedId ?? bedCode}-${index}`}
                  className={`group relative overflow-hidden rounded-2xl border border-l-4 ${tone.accent} ${tone.border} bg-white p-5 shadow-md shadow-slate-200/70 transition hover:-translate-y-0.5 hover:border-slate-300 dark:bg-slate-900/70 dark:shadow-black/20 dark:hover:border-slate-500/70 ${
                    isEmpty ? 'border-dashed' : ''
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
                            {patientMeta ? `${patientMeta} · ` : ''}
                            {bed.occupant ? 'Currently admitted' : 'Awaiting admission'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-500 dark:text-slate-500" />
                          {bed.occupant ? 'Assigned team' : 'No assignment'}
                        </span>
                        {bed.status === 'maintenance' && (
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
                              className={`rounded-full px-4 ${
                                isPrimary
                                  ? 'bg-sky-500 text-white hover:bg-sky-400'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                              }`}
                              variant="secondary"
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
                        const tone = getStatusTone(bed.status);
                        const patientName = bed.occupant?.patientName ?? 'Unassigned';
                        const bedCode = bed.bedNumber ?? 'Bed';
                        const roomName = ward.name ?? 'Ward';
                        const actions =
                          bed.status === 'occupied'
                            ? ['TRANSFER', 'MEDS', 'DETAILS']
                            : bed.status === 'available'
                            ? ['ADMIT_PATIENT']
                            : [];
                        const isEmpty = bed.status === 'available';

                        return (
                          <div
                            key={`${bed.bedId ?? bedCode}-${index}`}
                            className={`flex flex-col gap-4 rounded-2xl border ${tone.border} bg-white p-4 shadow-sm shadow-slate-200/60 dark:bg-slate-900/70 dark:shadow-black/20 sm:flex-row sm:items-center ${
                              isEmpty ? 'border-dashed' : ''
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
                                    className={`rounded-full px-4 ${
                                      isPrimary
                                        ? 'bg-sky-500 text-white hover:bg-sky-400'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                    variant="secondary"
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
      </div>
    </div>
  );
}
