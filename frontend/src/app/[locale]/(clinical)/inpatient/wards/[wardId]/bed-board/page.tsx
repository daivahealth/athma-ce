'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWardBedBoard } from '@/modules/clinical/hooks/use-inpatient';
import type { WardBoardBed, WardBoardFlags } from '@/modules/clinical/types/inpatient';
import { AlertTriangle, Circle, LayoutGrid, List, Plus, User } from 'lucide-react';

type FilterKey = 'all' | 'occupied' | 'critical' | 'pending' | 'empty';

const statusOrder: FilterKey[] = ['all', 'occupied', 'critical', 'pending', 'empty'];

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

function formatAdmittedAt(value?: string) {
  if (!value) {
    return 'Admitted recently';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Admitted recently';
  }
  return `Admitted ${date.toLocaleDateString()}`;
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
      className: 'bg-primary/15 text-primary ring-1 ring-primary/30',
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

function getStatusTone(bed: WardBoardBed) {
  const occupancy = normalizeValue(bed.occupancy);
  const acuity = normalizeValue(bed.admission?.acuity);
  const dischargeStatus = normalizeValue(bed.admission?.dischargeStatus);

  if (occupancy === 'EMPTY') {
    return {
      border: 'border-slate-800/60',
      accent: 'border-l-slate-700',
      badge: 'bg-slate-800/70 text-slate-200',
      status: 'Available',
    };
  }

  if (occupancy === 'CLEANING') {
    return {
      border: 'border-amber-500/40',
      accent: 'border-l-amber-400',
      badge: 'bg-amber-500/15 text-amber-200',
      status: 'Cleaning',
    };
  }

  if (dischargeStatus && dischargeStatus !== 'NONE' && dischargeStatus !== 'CANCELLED') {
    return {
      border: 'border-amber-500/60',
      accent: 'border-l-amber-400',
      badge: 'bg-amber-500/15 text-amber-200',
      status: 'Pending Discharge',
    };
  }

  if (acuity === 'CRITICAL') {
    return {
      border: 'border-orange-500/70',
      accent: 'border-l-orange-400',
      badge: 'bg-orange-500/15 text-orange-200',
      status: 'Critical',
    };
  }

  return {
    border: 'border-emerald-500/60',
    accent: 'border-l-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-200',
    status: 'Stable',
  };
}

function getDisplayPhysician(admission: WardBoardBed['admission']) {
  if (!admission) {
    return 'Assigned team';
  }
  return (
    admission.attendingPhysicianName ||
    admission.attendingPhysician ||
    admission.primaryNurse ||
    'Assigned team'
  );
}

export default function BedBoardPage({ params }: { params: { locale: string; wardId: string } }) {
  const [includeDischarged, setIncludeDischarged] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { data, isLoading } = useWardBedBoard(params.wardId, includeDischarged);

  const beds = data?.beds ?? [];
  const summary = data?.summary ?? {};

  const filters = useMemo(() => {
    const totalBeds = summary.totalBeds ?? beds.length;
    return {
      all: totalBeds,
      occupied: summary.occupied ?? beds.filter((bed) => normalizeValue(bed.occupancy) === 'OCCUPIED').length,
      critical:
        summary.critical ??
        beds.filter((bed) => normalizeValue(bed.admission?.acuity) === 'CRITICAL').length,
      pending:
        summary.pendingDischarge ??
        beds.filter((bed) => {
          const status = normalizeValue(bed.admission?.dischargeStatus);
          return status && status !== 'NONE' && status !== 'CANCELLED';
        }).length,
      empty: summary.empty ?? beds.filter((bed) => normalizeValue(bed.occupancy) === 'EMPTY').length,
    };
  }, [beds, summary]);

  const filteredBeds = useMemo(() => {
    if (activeFilter === 'all') {
      return beds;
    }
    if (activeFilter === 'occupied') {
      return beds.filter((bed) => normalizeValue(bed.occupancy) === 'OCCUPIED');
    }
    if (activeFilter === 'critical') {
      return beds.filter((bed) => normalizeValue(bed.admission?.acuity) === 'CRITICAL');
    }
    if (activeFilter === 'pending') {
      return beds.filter((bed) => {
        const status = normalizeValue(bed.admission?.dischargeStatus);
        return status && status !== 'NONE' && status !== 'CANCELLED';
      });
    }
    return beds.filter((bed) => normalizeValue(bed.occupancy) === 'EMPTY');
  }, [activeFilter, beds]);

  const wardName = data?.ward?.name ?? 'Ward Board';
  const wardCode = data?.ward?.code ?? 'Ward';

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_45%),radial-gradient(circle_at_20%_30%,_rgba(148,163,184,0.15),_transparent_50%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Ward Board</p>
            <div>
              <h1 className="text-2xl font-semibold text-white">{wardName}</h1>
              <p className="text-sm text-slate-400">{wardCode}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full bg-slate-900/80 p-1 text-slate-300 shadow-inner shadow-slate-800/50">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition ${
                  viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition ${
                  viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-slate-700 bg-slate-900/70 text-slate-200 hover:border-slate-500 hover:bg-slate-800"
              onClick={() => setIncludeDischarged((prev) => !prev)}
            >
              {includeDischarged ? 'Hide Discharged Today' : 'Include Discharged Today'}
            </Button>
          </div>
        </header>

        <section className="flex flex-wrap gap-2">
          {statusOrder.map((key) => {
            const label =
              key === 'all'
                ? 'All Beds'
                : key === 'occupied'
                ? 'Occupied'
                : key === 'critical'
                ? 'Critical'
                : key === 'pending'
                ? 'Pending Discharge'
                : 'Empty';
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
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </section>

        {isLoading && <p className="text-sm text-slate-400">Loading bed board...</p>}

        {!isLoading && filteredBeds.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/60 p-8 text-center text-sm text-slate-400">
            No beds match the selected filter.
          </div>
        )}

        <section className={viewMode === 'grid' ? 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
          {filteredBeds.map((bed, index) => {
            const tone = getStatusTone(bed);
            const admission = bed.admission;
            const patientDisplay = admission?.patientDisplay;
            const patientName =
              patientDisplay?.displayName
              ?? [patientDisplay?.firstName, patientDisplay?.lastName].filter(Boolean).join(' ')
              ?? 'Unassigned';
            const patientMetaParts = [
              patientDisplay?.age ? `${patientDisplay.age}Y` : null,
              patientDisplay?.gender ?? null,
            ].filter(Boolean);
            const patientMeta = patientMetaParts.join(' · ');
            const flags = getFlagBadges(admission?.boardFlags);
            const visibleFlags = flags.slice(0, 3);
            const extraFlags = flags.length - visibleFlags.length;
            const bedCode = bed.bed?.code ?? bed.bed?.spaceName ?? 'Bed';
            const roomName = bed.bed?.spaceName ?? 'Room';
            const actions = bed.actions ?? [];
            const isEmpty = normalizeValue(bed.occupancy) === 'EMPTY';
            const isCleaning = normalizeValue(bed.occupancy) === 'CLEANING';

            return (
              <article
                key={`${bed.bed?.id ?? bedCode}-${index}`}
                className={`group relative overflow-hidden rounded-2xl border border-l-4 ${tone.accent} ${tone.border} bg-slate-900/70 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-slate-500/70 ${
                  isEmpty ? 'border-dashed' : ''
                } animate-in fade-in-0`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Bed</p>
                    <p className="text-2xl font-semibold text-white">{bedCode}</p>
                    <p className="text-sm text-slate-400">{roomName}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone.badge}`}>{tone.status}</span>
                </div>

                {isEmpty || isCleaning ? (
                  <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/30 px-4 py-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-slate-400">
                      <Circle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        {isCleaning ? 'Bed in Cleaning' : 'Bed Available'}
                      </p>
                      <p className="text-xs text-slate-400">
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
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-200">
                        {getPatientInitials(patientName)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{patientName}</p>
                        <p className="text-xs text-slate-400">
                          {patientMeta ? `${patientMeta} · ` : ''}
                          {formatAdmittedAt(admission?.admittedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-500" />
                        {getDisplayPhysician(admission)}
                      </span>
                      {normalizeValue(admission?.acuity) === 'CRITICAL' && (
                        <span className="flex items-center gap-2 text-orange-200">
                          <AlertTriangle className="h-4 w-4" />
                          Critical
                        </span>
                      )}
                    </div>

                    {visibleFlags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {visibleFlags.map((flag) => (
                          <span key={flag.label} className={`rounded-full px-3 py-1 text-[11px] font-semibold ${flag.className}`}>
                            {flag.label}
                          </span>
                        ))}
                        {extraFlags > 0 && (
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-300">
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
                                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
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
        </section>
      </div>
    </div>
  );
}
