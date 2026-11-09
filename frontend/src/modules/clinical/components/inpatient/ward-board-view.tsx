'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeftRight,
  BedDouble,
  CalendarClock,
  ClipboardList,
  MessageSquareText,
  Pill,
  Plus,
  Sparkles,
  Stethoscope,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToneBadge, type BadgeTone } from '@/components/ui/tone-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { WardBoardAdmission, WardBoardFlags, WardBoardOccupancy } from '@/modules/clinical/types/inpatient';

/**
 * Presentational pieces of the facility Ward Board (`/inpatient/wards`).
 * The page owns data, filters and dialogs; these components only draw.
 */

export type BedStatusKey = 'occupied' | 'available' | 'cleaning' | 'maintenance';

export type WardBoardBedEntry = {
  bedId: string;
  bedCode: string;
  spaceName?: string;
  wardId: string;
  wardName: string;
  occupancy: WardBoardOccupancy;
  status?: string;
  admission?: WardBoardAdmission | null;
};

export type BedAction = 'MEDS' | 'ORDERS' | 'TRANSFER' | 'DETAILS';

export const STATUS_KEYS: BedStatusKey[] = ['occupied', 'available', 'cleaning', 'maintenance'];

export const STATUS_META: Record<BedStatusKey, { label: string; tone: BadgeTone; icon: LucideIcon; bar: string }> = {
  occupied: { label: 'Occupied', tone: 'sky', icon: BedDouble, bar: 'bg-sky-500' },
  available: { label: 'Available', tone: 'emerald', icon: Plus, bar: 'bg-emerald-500' },
  cleaning: { label: 'Cleaning', tone: 'amber', icon: Sparkles, bar: 'bg-amber-400' },
  maintenance: { label: 'Maintenance', tone: 'rose', icon: Wrench, bar: 'bg-rose-400' },
};

/** Maps a bed's status or occupancy to one of the four board states. */
export function bedStatusKey(bed: Pick<WardBoardBedEntry, 'status' | 'occupancy'>): BedStatusKey {
  const value = (bed.status ?? bed.occupancy ?? '').toUpperCase();
  if (value === 'AVAILABLE' || value === 'EMPTY') return 'available';
  if (value === 'CLEANING') return 'cleaning';
  if (value === 'MAINTENANCE') return 'maintenance';
  return 'occupied';
}

export type StatusCounts = Record<BedStatusKey | 'all', number>;

export function countStatuses(beds: WardBoardBedEntry[]): StatusCounts {
  const counts: StatusCounts = { all: beds.length, occupied: 0, available: 0, cleaning: 0, maintenance: 0 };
  beds.forEach((bed) => {
    counts[bedStatusKey(bed)] += 1;
  });
  return counts;
}

export function patientNameOf(admission?: WardBoardAdmission | null) {
  const display = admission?.patientDisplay;
  return (
    display?.displayName ||
    [display?.firstName, display?.lastName].filter(Boolean).join(' ') ||
    'Unnamed patient'
  );
}

function patientMetaOf(admission?: WardBoardAdmission | null) {
  const display = admission?.patientDisplay;
  return [
    display?.age ? `${display.age}Y` : '',
    display?.gender ? display.gender.charAt(0).toUpperCase() + display.gender.slice(1).toLowerCase() : '',
    display?.mrn ? `MRN ${display.mrn}` : '',
  ]
    .filter(Boolean)
    .join(' · ');
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/** Inpatient day count: the day of admission is day 1. */
function stayDayOf(admittedAt?: string) {
  if (!admittedAt) return null;
  const start = new Date(admittedAt);
  if (Number.isNaN(start.getTime())) return null;
  const days = Math.floor((Date.now() - start.getTime()) / 86_400_000) + 1;
  return days > 0 ? days : null;
}

const fallRiskLabels: Record<string, string> = {
  low: 'Low Fall Risk',
  medium: 'Moderate Fall Risk',
  high: 'High Fall Risk',
};

function flagsOf(flags?: WardBoardFlags): { label: string; tone: BadgeTone }[] {
  if (!flags) return [];
  const result: { label: string; tone: BadgeTone }[] = [];
  if (flags.fallRisk) {
    const level = typeof flags.fallRisk === 'string' ? flags.fallRisk.toLowerCase() : 'high';
    result.push({ label: fallRiskLabels[level] ?? 'Fall Risk', tone: 'amber' });
  }
  if (flags.npo) result.push({ label: 'NPO', tone: 'rose' });
  if (flags.telemetry) result.push({ label: 'Telemetry', tone: 'sky' });
  if (flags.isolation) result.push({ label: 'Isolation', tone: 'violet' });
  if (flags.allergies?.length) result.push({ label: 'Allergies', tone: 'orange' });
  return result;
}

const AVATAR_TONES = [
  'from-sky-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-violet-500 to-fuchsia-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-blue-500',
];

/** A stable avatar colour per patient, so one patient keeps one colour across views. */
function avatarToneOf(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length];
}

function PatientAvatar({ name, seed, className }: { name: string; seed: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white shadow-sm',
        avatarToneOf(seed),
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Summary                                                             */
/* ------------------------------------------------------------------ */

function OccupancyRing({ percent }: { percent: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(percent, 0), 100) / 100);
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="40" cy="40" r={radius} fill="none" strokeWidth="8" className="stroke-slate-200 dark:stroke-slate-800" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-sky-500 transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold tabular-nums text-foreground">{percent}%</span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">occupied</span>
      </div>
    </div>
  );
}

const TILE_ACTIVE: Record<BedStatusKey | 'all', string> = {
  all: 'border-primary ring-2 ring-primary/25 bg-primary/5',
  occupied: 'border-sky-400 ring-2 ring-sky-400/25 bg-sky-50 dark:bg-sky-950/40',
  available: 'border-emerald-400 ring-2 ring-emerald-400/25 bg-emerald-50 dark:bg-emerald-950/40',
  cleaning: 'border-amber-400 ring-2 ring-amber-400/25 bg-amber-50 dark:bg-amber-950/40',
  maintenance: 'border-rose-400 ring-2 ring-rose-400/25 bg-rose-50 dark:bg-rose-950/40',
};

const TILE_ICON: Record<BedStatusKey | 'all', string> = {
  all: 'bg-primary/10 text-primary',
  occupied: 'bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-300',
  available: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300',
  cleaning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300',
  maintenance: 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300',
};

export function BoardSummary({
  counts,
  activeFilter,
  onFilterChange,
}: {
  counts: StatusCounts;
  activeFilter: BedStatusKey | 'all';
  onFilterChange: (key: BedStatusKey | 'all') => void;
}) {
  const percent = counts.all ? Math.round((counts.occupied / counts.all) * 100) : 0;
  const tiles: { key: BedStatusKey | 'all'; label: string; icon: LucideIcon }[] = [
    { key: 'all', label: 'All Beds', icon: BedDouble },
    ...STATUS_KEYS.map((key) => ({ key, label: STATUS_META[key].label, icon: STATUS_META[key].icon })),
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-[auto_1fr]">
      <div className="flex items-center gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <OccupancyRing percent={percent} />
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Facility occupancy</p>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {counts.occupied}
            <span className="text-base font-normal text-muted-foreground"> / {counts.all} beds</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {counts.available} ready for admission
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3" role="group" aria-label="Filter beds by status">
        {tiles.map(({ key, label, icon: Icon }) => {
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={isActive}
              onClick={() => onFilterChange(isActive && key !== 'all' ? 'all' : key)}
              className={cn(
                'group flex min-w-0 flex-col justify-between gap-2 rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition-all sm:gap-3 sm:p-4',
                'hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive && TILE_ACTIVE[key],
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs font-medium text-muted-foreground">{label}</span>
                <span className={cn('hidden h-7 w-7 shrink-0 items-center sm:flex lg:hidden 2xl:flex justify-center rounded-lg', TILE_ICON[key])}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <span className="text-xl font-semibold tabular-nums text-foreground sm:text-2xl">{counts[key]}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Ward section                                                        */
/* ------------------------------------------------------------------ */

export function OccupancyBar({ counts, className }: { counts: StatusCounts; className?: string }) {
  return (
    <div className={cn('flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800', className)}>
      {counts.all > 0 &&
        STATUS_KEYS.map((key) =>
          counts[key] > 0 ? (
            <span
              key={key}
              title={`${STATUS_META[key].label}: ${counts[key]}`}
              className={cn('h-full transition-[width] duration-500', STATUS_META[key].bar)}
              style={{ width: `${(counts[key] / counts.all) * 100}%` }}
            />
          ) : null,
        )}
    </div>
  );
}

export function WardSectionHeader({ name, code, counts }: { name: string; code?: string; counts: StatusCounts }) {
  const percent = counts.all ? Math.round((counts.occupied / counts.all) * 100) : 0;
  return (
    <div className="flex flex-col gap-4 border-b border-border px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BedDouble className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-foreground">{name}</h2>
          <p className="text-xs text-muted-foreground">
            {code ? `${code} · ` : ''}
            {counts.all} beds · {percent}% occupied
          </p>
        </div>
      </div>
      <div className="w-full space-y-2 md:max-w-sm">
        <OccupancyBar counts={counts} />
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {STATUS_KEYS.map((key) => (
            <span key={key} className="inline-flex items-center gap-1.5">
              <span className={cn('size-2 rounded-full', STATUS_META[key].bar)} aria-hidden="true" />
              <span className="tabular-nums font-medium text-foreground">{counts[key]}</span>
              {STATUS_META[key].label.toLowerCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Beds                                                                */
/* ------------------------------------------------------------------ */

const ACTION_META: Record<BedAction, { label: string; icon: LucideIcon }> = {
  MEDS: { label: 'Meds', icon: Pill },
  ORDERS: { label: 'Orders', icon: ClipboardList },
  TRANSFER: { label: 'Transfer', icon: ArrowLeftRight },
  DETAILS: { label: 'Channel', icon: MessageSquareText },
};

const SECONDARY_ACTIONS: BedAction[] = ['MEDS', 'ORDERS', 'TRANSFER'];

interface BedViewProps {
  bed: WardBoardBedEntry;
  admitHref?: string;
  onAction: (action: BedAction, bed: WardBoardBedEntry) => void;
  index?: number;
}

const CARD_EDGE: Record<BedStatusKey, string> = {
  occupied: 'before:bg-sky-500',
  available: 'before:bg-emerald-500',
  cleaning: 'before:bg-amber-400',
  maintenance: 'before:bg-rose-400',
};

function BedHeading({ bed, status }: { bed: WardBoardBedEntry; status: BedStatusKey }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="font-mono text-lg font-semibold leading-tight tracking-tight text-foreground">{bed.bedCode}</p>
        <p className="truncate text-xs text-muted-foreground">{bed.spaceName ?? bed.wardName}</p>
      </div>
      <ToneBadge tone={STATUS_META[status].tone} withDot>
        {STATUS_META[status].label}
      </ToneBadge>
    </div>
  );
}

export function BedCard({ bed, admitHref, onAction, index = 0 }: BedViewProps) {
  const status = bedStatusKey(bed);
  const occupied = status === 'occupied' && Boolean(bed.admission);

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 pl-5 shadow-sm transition-all duration-200 animate-fade-in',
        'before:absolute before:inset-y-0 before:left-0 before:w-1',
        CARD_EDGE[status],
        'hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:hover:border-slate-600',
      )}
      style={{ animationDelay: `${Math.min(index, 12) * 30}ms`, animationFillMode: 'backwards' }}
    >
      <BedHeading bed={bed} status={status} />
      {occupied ? (
        <OccupiedBody bed={bed} onAction={onAction} />
      ) : (
        <IdleBody bed={bed} status={status} admitHref={admitHref} />
      )}
    </article>
  );
}

function OccupiedBody({ bed, onAction }: { bed: WardBoardBedEntry; onAction: BedViewProps['onAction'] }) {
  const name = patientNameOf(bed.admission);
  const meta = patientMetaOf(bed.admission);
  const flags = flagsOf(bed.admission?.boardFlags);
  const visibleFlags = flags.slice(0, 3);
  const stayDay = stayDayOf(bed.admission?.admittedAt);
  const physician = bed.admission?.attendingPhysicianName ?? bed.admission?.attendingPhysician;

  return (
    <>
      <div className="mt-4 flex items-center gap-3">
        <PatientAvatar name={name} seed={bed.admission?.patientId ?? name} className="h-11 w-11 text-sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground" title={name}>
            {name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {meta || bed.admission?.admissionStatus || 'Currently admitted'}
          </p>
        </div>
      </div>

      {(stayDay || physician) && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {stayDay && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5" />
              Day {stayDay}
            </span>
          )}
          {physician && (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Stethoscope className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{physician}</span>
            </span>
          )}
        </div>
      )}

      {visibleFlags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleFlags.map((flag) => (
            <ToneBadge key={flag.label} tone={flag.tone}>
              {flag.label}
            </ToneBadge>
          ))}
          {flags.length > visibleFlags.length && (
            <ToneBadge tone="slate">+{flags.length - visibleFlags.length}</ToneBadge>
          )}
        </div>
      )}

      <div className="min-h-4 flex-1" aria-hidden="true" />
      <div className="grid grid-cols-4 gap-1 border-t border-border pt-3">
        {(['MEDS', 'ORDERS', 'TRANSFER', 'DETAILS'] as BedAction[]).map((action) => {
          const { label, icon: Icon } = ACTION_META[action];
          const primary = action === 'DETAILS';
          return (
            <button
              key={action}
              type="button"
              onClick={() => onAction(action, bed)}
              className={cn(
                'flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[11px] font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                primary
                  ? 'bg-primary/10 text-primary hover:bg-primary/15'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

const IDLE_COPY: Record<Exclude<BedStatusKey, 'occupied'> | 'unassigned', { title: string; note: string; icon: LucideIcon; wash: string }> = {
  available: {
    title: 'Bed Available',
    note: 'Ready for patient admission',
    icon: BedDouble,
    wash: 'border-emerald-200 bg-emerald-50/60 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300',
  },
  cleaning: {
    title: 'Bed in Cleaning',
    note: 'Awaiting environmental services',
    icon: Sparkles,
    wash: 'border-amber-200 bg-amber-50/60 text-amber-600 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300',
  },
  maintenance: {
    title: 'Under Maintenance',
    note: 'Out of use until maintenance is done',
    icon: Wrench,
    wash: 'border-rose-200 bg-rose-50/60 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300',
  },
  unassigned: {
    title: 'No patient linked',
    note: 'Marked occupied without an admission',
    icon: BedDouble,
    wash: 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400',
  },
};

function IdleBody({ status, admitHref }: { bed: WardBoardBedEntry; status: BedStatusKey; admitHref?: string }) {
  const copy = IDLE_COPY[status === 'occupied' ? 'unassigned' : status];
  const Icon = copy.icon;
  return (
    <div
      className={cn(
        'mt-4 flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-5 text-center',
        copy.wash,
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm dark:bg-slate-900/80">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{copy.title}</p>
        <p className="text-xs text-muted-foreground">{copy.note}</p>
      </div>
      {status === 'available' && admitHref && (
        <Button asChild size="sm" className="mt-1 h-8 gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-500">
          <Link href={admitHref}>
            <Plus className="h-3.5 w-3.5" />
            Admit Patient
          </Link>
        </Button>
      )}
    </div>
  );
}

export function BedRow({ bed, admitHref, onAction }: BedViewProps) {
  const status = bedStatusKey(bed);
  const occupied = status === 'occupied' && Boolean(bed.admission);
  const name = patientNameOf(bed.admission);
  const flags = flagsOf(bed.admission?.boardFlags);
  const stayDay = stayDayOf(bed.admission?.admittedAt);

  return (
    <div className="flex flex-col gap-3 px-5 py-3 transition-colors hover:bg-muted/40 md:flex-row md:items-center md:gap-4">
      <div className="flex items-center gap-3 md:w-44 md:shrink-0">
        <span className={cn('h-8 w-1 shrink-0 rounded-full', STATUS_META[status].bar)} aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold text-foreground">{bed.bedCode}</p>
          <p className="truncate text-xs text-muted-foreground">{bed.spaceName ?? bed.wardName}</p>
        </div>
      </div>

      <div className="md:w-28 md:shrink-0">
        <ToneBadge tone={STATUS_META[status].tone} withDot>
          {STATUS_META[status].label}
        </ToneBadge>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        {occupied ? (
          <>
            <PatientAvatar name={name} seed={bed.admission?.patientId ?? name} className="h-8 w-8 text-xs" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {[patientMetaOf(bed.admission), stayDay ? `Day ${stayDay}` : ''].filter(Boolean).join(' · ')}
              </p>
            </div>
            {flags.length > 0 && (
              <div className="hidden shrink-0 gap-1 xl:flex">
                {flags.slice(0, 2).map((flag) => (
                  <ToneBadge key={flag.label} tone={flag.tone}>
                    {flag.label}
                  </ToneBadge>
                ))}
                {flags.length > 2 && <ToneBadge tone="slate">+{flags.length - 2}</ToneBadge>}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {IDLE_COPY[status === 'occupied' ? 'unassigned' : status].note}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1">
        {occupied &&
          SECONDARY_ACTIONS.map((action) => {
            const { label, icon: Icon } = ACTION_META[action];
            return (
              <Button
                key={action}
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 gap-1.5 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => onAction(action, bed)}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Button>
            );
          })}
        {occupied && (
          <Button type="button" size="sm" className="h-8 gap-1.5 rounded-lg px-3 text-xs" onClick={() => onAction('DETAILS', bed)}>
            <MessageSquareText className="h-3.5 w-3.5" />
            {ACTION_META.DETAILS.label}
          </Button>
        )}
        {status === 'available' && admitHref && (
          <Button asChild size="sm" className="h-8 gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-500">
            <Link href={admitHref}>
              <Plus className="h-3.5 w-3.5" />
              Admit Patient
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export function WardBoardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading ward board">
      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <Skeleton className="h-32 w-full rounded-2xl lg:w-80" />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <Skeleton className="h-8 w-56" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
