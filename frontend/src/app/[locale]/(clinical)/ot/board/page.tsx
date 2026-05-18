'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Clock3,
  RefreshCw,
  Scissors,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useOtBoard } from '@/modules/ot/hooks/use-ot';
import type { OtBoardCase, OtBoardRoom, OtBoardState } from '@/modules/ot/types';

const STATE_STYLES: Record<
  OtBoardState,
  {
    badge: string;
    border: string;
    accent: string;
    card: string;
    glow: string;
    case: string;
  }
> = {
  IDLE: {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    border: 'border-slate-200',
    accent: 'bg-slate-500',
    card: 'bg-gradient-to-br from-white via-slate-50 to-slate-100/70',
    glow: 'shadow-slate-200/55',
    case: 'bg-white/80 border-slate-200',
  },
  OCCUPIED: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    border: 'border-emerald-200',
    accent: 'bg-emerald-500',
    card: 'bg-gradient-to-br from-emerald-100/80 via-white to-teal-100/65',
    glow: 'shadow-emerald-200/55',
    case: 'bg-white/85 border-emerald-200/80',
  },
  NEXT_UP: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    border: 'border-amber-200',
    accent: 'bg-amber-500',
    card: 'bg-gradient-to-br from-amber-100/80 via-white to-orange-100/65',
    glow: 'shadow-amber-200/55',
    case: 'bg-white/85 border-amber-200/80',
  },
  BLOCKED: {
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    border: 'border-rose-200',
    accent: 'bg-rose-500',
    card: 'bg-gradient-to-br from-rose-100/80 via-white to-red-100/65',
    glow: 'shadow-rose-200/55',
    case: 'bg-white/85 border-rose-200/80',
  },
  INACTIVE: {
    badge: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    border: 'border-zinc-200',
    accent: 'bg-zinc-400',
    card: 'bg-gradient-to-br from-zinc-100/70 via-white to-stone-100/60',
    glow: 'shadow-zinc-200/50',
    case: 'bg-white/80 border-zinc-200',
  },
};

const METRIC_STYLES = [
  {
    label: 'Active rooms',
    icon: Scissors,
    card: 'bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100 text-slate-900 border border-sky-200',
    iconWrap: 'bg-sky-200 text-sky-800',
  },
  {
    label: 'Occupied',
    icon: Activity,
    card: 'bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 text-slate-900 border border-emerald-200',
    iconWrap: 'bg-emerald-200 text-emerald-800',
  },
  {
    label: 'Idle',
    icon: Clock3,
    card: 'bg-gradient-to-br from-slate-100 via-white to-slate-200/80 text-slate-900 border border-slate-300',
    iconWrap: 'bg-slate-200 text-slate-800',
  },
  {
    label: 'Blocked',
    icon: AlertTriangle,
    card: 'bg-gradient-to-br from-rose-100 via-red-50 to-rose-200/80 text-slate-900 border border-rose-200',
    iconWrap: 'bg-rose-200 text-rose-800',
  },
  {
    label: 'Next up',
    icon: CalendarDays,
    card: 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 text-slate-900 border border-amber-200',
    iconWrap: 'bg-amber-200 text-amber-800',
  },
  {
    label: 'Cases in progress',
    icon: Activity,
    card: 'bg-gradient-to-br from-violet-100 via-indigo-50 to-fuchsia-100 text-slate-900 border border-violet-200',
    iconWrap: 'bg-violet-200 text-violet-800',
  },
] as const;

function PatientBlock({ item }: { item: OtBoardCase }) {
  return (
    <div className="space-y-0.5">
      <div className="text-sm font-medium leading-tight">
        {item.patientDisplay?.displayName || 'Unknown patient'}
      </div>
      <div className="text-xs text-muted-foreground">MRN: {item.patientDisplay?.mrn || '—'}</div>
      <div className="text-xs text-muted-foreground">
        {item.patientDisplay?.gender || '—'} / {item.patientDisplay?.age ?? '—'}y
      </div>
    </div>
  );
}

function CaseSection({
  title,
  item,
  emptyLabel,
  tone,
}: {
  title: string;
  item?: OtBoardCase | null;
  emptyLabel: string;
  tone: string;
}) {
  if (!item) {
    return (
      <div className={cn('rounded-xl border border-dashed p-2.5', tone)}>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </div>
        <div className="mt-1.5 text-sm text-muted-foreground">{emptyLabel}</div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border p-2.5 shadow-sm', tone)}>
      <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      <div className="space-y-2">
        <div>
          <div className="line-clamp-2 text-sm font-medium leading-tight">{item.procedureName}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(item.plannedStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
            -{' '}
            {new Date(item.plannedEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <PatientBlock item={item} />
        <Badge variant="outline" className="w-fit">
          {item.scheduleStatus.replace(/_/g, ' ')}
        </Badge>
      </div>
    </div>
  );
}

function RoomCard({ room }: { room: OtBoardRoom }) {
  const styles = STATE_STYLES[room.state];

  return (
    <Card
      className={cn(
        'overflow-hidden border-2 shadow-lg transition-transform duration-200 hover:-translate-y-0.5',
        styles.border,
        styles.card,
        styles.glow,
      )}
    >
      <div className={cn('h-2 w-full', styles.accent)} />
      <CardHeader className="space-y-2 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base leading-tight">{room.room.name}</CardTitle>
            <CardDescription className="text-xs">
              {[room.room.spaceNumber, room.room.specialty].filter(Boolean).join(' • ') ||
                room.room.notes ||
                'OT room'}
            </CardDescription>
          </div>
          <Badge variant="outline" className={cn('text-[11px]', styles.badge)}>
            {room.stateLabel}
          </Badge>
        </div>
        {room.blockedReason ? (
          <div className="flex items-start gap-2 rounded-md bg-rose-50 px-2.5 py-2 text-xs text-rose-700">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />
            <span>{room.blockedReason}</span>
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4 pt-0">
        <div className="grid gap-2 xl:grid-cols-2">
          <CaseSection
            title="Current case"
            item={room.currentCase}
            emptyLabel="No case in progress."
            tone={styles.case}
          />
          <CaseSection
            title="Next case"
            item={room.nextCase}
            emptyLabel="No more cases queued for today."
            tone={styles.case}
          />
        </div>
        <div className="grid gap-x-3 gap-y-2 rounded-xl border border-white/60 bg-white/85 p-2.5 text-sm md:grid-cols-3 xl:grid-cols-6">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Scheduled</div>
            <div className="text-sm font-medium">{room.summary.scheduledCaseCount}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Completed</div>
            <div className="text-sm font-medium">{room.summary.completedCaseCount}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Cancelled</div>
            <div className="text-sm font-medium">{room.summary.cancelledCaseCount}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Planned</div>
            <div className="text-sm font-medium">{room.summary.plannedOccupiedMinutes} min</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Actual</div>
            <div className="text-sm font-medium">{room.summary.actualOccupiedMinutes} min</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Delay</div>
            <div className={cn('text-sm font-medium', room.summary.hasDelay && 'text-amber-700')}>
              {room.summary.hasDelay ? `${room.summary.delayMinutes} min` : 'On time'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OtBoardPage({ params }: { params: { locale: string } }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const { data, isLoading, error, refetch, isFetching } = useOtBoard(date);

  const metrics = useMemo(
    () =>
      data?.summary ?? {
        totalRooms: 0,
        activeRooms: 0,
        occupiedRooms: 0,
        idleRooms: 0,
        blockedRooms: 0,
        inactiveRooms: 0,
        nextUpRooms: 0,
        casesInProgress: 0,
      },
    [data],
  );

  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.08),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.08),_transparent_28%),linear-gradient(to_bottom,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-1">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-100/70 via-white to-sky-100/70 px-6 py-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-800">
            <Activity className="h-4 w-4" />
            Live theatre operations
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">OT Board</h1>
          <p className="mt-1 text-muted-foreground">
            Realtime room utilization for operating theatres, with current and next cases per room.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center">
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Board date
            </label>
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={cn('mr-2 h-4 w-4', isFetching && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {METRIC_STYLES.map((metric) => (
          <Card key={metric.label} className={cn('shadow-lg', metric.card)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-2 pt-4">
              <CardTitle className="text-xs font-medium">{metric.label}</CardTitle>
              <div className={cn('rounded-full p-1.5', metric.iconWrap)}>
                <metric.icon className="h-3.5 w-3.5" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              {isLoading ? (
                <Skeleton className="h-8 w-16 bg-white/30" />
              ) : (
                <div className="text-2xl font-semibold tracking-tight">
                  {{
                    'Active rooms': metrics.activeRooms,
                    Occupied: metrics.occupiedRooms,
                    Idle: metrics.idleRooms,
                    Blocked: metrics.blockedRooms,
                    'Next up': metrics.nextUpRooms,
                    'Cases in progress': metrics.casesInProgress,
                  }[metric.label]}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 text-slate-900 shadow-sm">
        <CardContent className="flex flex-col gap-3 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>
            {data?.generatedAt
              ? `Last updated ${formatDistanceToNow(new Date(data.generatedAt), { addSuffix: true })}`
              : 'Waiting for board data'}
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/${params.locale}/ot/schedules`}>Open OT Schedules</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/${params.locale}/ot/rooms`}>Open OT Rooms</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Skeleton className="h-[360px] w-full" />
          <Skeleton className="h-[360px] w-full" />
          <Skeleton className="h-[360px] w-full" />
          <Skeleton className="h-[360px] w-full" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {(error as Error).message}
        </div>
      ) : data && data.rooms.length > 0 ? (
        <div className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
          {data.rooms.map((room) => (
            <RoomCard key={room.room.spaceId} room={room} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <Scissors className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No OT rooms configured</h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Configure OT rooms first so the board can display room utilization and live case progression.
          </p>
        </div>
      )}
    </div>
  );
}
