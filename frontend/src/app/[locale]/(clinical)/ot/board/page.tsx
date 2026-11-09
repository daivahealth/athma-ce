'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { AlertTriangle, RefreshCw, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { MetricTile } from '@/components/ui/metric-tile';
import { PatientIdentity } from '@/components/ui/patient-identity';
import { Skeleton } from '@/components/ui/skeleton';
import { ToneBadge, type BadgeTone } from '@/components/ui/tone-badge';
import { TONE_BAR, TONE_TEXT, TONE_WASH } from '@/components/ui/tone-classes';
import { cn } from '@/lib/utils';
import { OtScheduleStatusBadge } from '@/modules/ot/components/ot-status-badge';
import { useOtBoard } from '@/modules/ot/hooks/use-ot';
import type { OtBoardCase, OtBoardRoom, OtBoardState } from '@/modules/ot/types';
import { useSpecialtyLabel } from '@/modules/foundation/hooks/use-specialties';

/** A room's state in the shared tone palette: green live, amber next up, red blocked, grey otherwise. */
const STATE_TONE: Record<OtBoardState, BadgeTone> = {
  IDLE: 'slate',
  OCCUPIED: 'green',
  NEXT_UP: 'amber',
  BLOCKED: 'red',
  INACTIVE: 'slate',
};

const EMPTY_SUMMARY = {
  totalRooms: 0,
  activeRooms: 0,
  occupiedRooms: 0,
  idleRooms: 0,
  blockedRooms: 0,
  inactiveRooms: 0,
  nextUpRooms: 0,
  casesInProgress: 0,
};

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

function CasePanel({ title, item, emptyLabel }: { title: string; item?: OtBoardCase | null; emptyLabel: string }) {
  return (
    <div className={cn('rounded-lg border p-3', item ? 'bg-muted/30' : 'border-dashed')}>
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{title}</div>
      {item ? (
        <div className="mt-1.5 space-y-2">
          <div>
            <div className="line-clamp-2 text-sm font-medium leading-tight text-foreground">{item.procedureName}</div>
            <div className="text-xs tabular-nums text-muted-foreground">
              {formatTime(item.plannedStartTime)} – {formatTime(item.plannedEndTime)}
            </div>
          </div>
          <PatientIdentity source={item} />
          <OtScheduleStatusBadge status={item.scheduleStatus} />
        </div>
      ) : (
        <div className="mt-1.5 text-sm text-muted-foreground">{emptyLabel}</div>
      )}
    </div>
  );
}

function RoomCard({ room }: { room: OtBoardRoom }) {
  const specialtyLabel = useSpecialtyLabel();
  const tone = STATE_TONE[room.state];
  const stats: Array<{ label: string; value: string | number; className?: string }> = [
    { label: 'Scheduled', value: room.summary.scheduledCaseCount },
    { label: 'Completed', value: room.summary.completedCaseCount },
    { label: 'Cancelled', value: room.summary.cancelledCaseCount },
    { label: 'Planned', value: `${room.summary.plannedOccupiedMinutes} min` },
    { label: 'Actual', value: `${room.summary.actualOccupiedMinutes} min` },
    {
      label: 'Delay',
      value: room.summary.hasDelay ? `${room.summary.delayMinutes} min` : 'On time',
      className: room.summary.hasDelay ? TONE_TEXT.amber : undefined,
    },
  ];

  return (
    <article
      data-state={room.state}
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground',
        room.state === 'INACTIVE' && 'opacity-70',
      )}
    >
      <div className={cn('h-1 w-full', TONE_BAR[tone])} aria-hidden="true" />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold leading-tight text-foreground">{room.room.name}</h3>
            <p className="text-xs text-muted-foreground">
              {[room.room.spaceNumber, specialtyLabel(room.room.specialty)].filter(Boolean).join(' · ') ||
                room.room.notes ||
                'OT room'}
            </p>
          </div>
          <ToneBadge tone={tone} withDot>
            {room.stateLabel}
          </ToneBadge>
        </div>

        {room.blockedReason ? (
          <div className={cn('flex items-start gap-2 rounded-lg border px-3 py-2 text-xs', TONE_WASH.red, TONE_TEXT.red)}>
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{room.blockedReason}</span>
          </div>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-2">
          <CasePanel title="Current case" item={room.currentCase} emptyLabel="No case in progress." />
          <CasePanel title="Next case" item={room.nextCase} emptyLabel="No more cases queued for today." />
        </div>
      </div>

      <dl className="mt-auto grid grid-cols-3 gap-x-3 gap-y-2 border-t px-4 py-3 sm:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{stat.label}</dt>
            <dd className={cn('text-sm font-medium tabular-nums text-foreground', stat.className)}>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

/**
 * Room-first theatre board for one day, laid out like the Today dashboard:
 * a toolbar, a plain heading with the attention line, tone-coloured tiles,
 * then a card per OT room.
 */
export default function OtBoardPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'en';
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const { data, isLoading, error, refetch, isFetching } = useOtBoard(date);
  const metrics = data?.summary ?? EMPTY_SUMMARY;

  const boardDay = new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const updatedAt = data?.generatedAt
    ? new Date(data.generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null;

  const tiles: Array<{ key: string; label: string; value: number; note?: string; tone: BadgeTone }> = [
    {
      key: 'active-rooms',
      label: 'Active rooms',
      value: metrics.activeRooms,
      note: metrics.inactiveRooms > 0 ? `${metrics.inactiveRooms} inactive` : `${metrics.totalRooms} configured`,
      tone: metrics.activeRooms > 0 ? 'sky' : 'slate',
    },
    {
      key: 'occupied',
      label: 'Occupied',
      value: metrics.occupiedRooms,
      note: 'Case live now',
      tone: metrics.occupiedRooms > 0 ? 'green' : 'slate',
    },
    {
      key: 'next-up',
      label: 'Next up',
      value: metrics.nextUpRooms,
      note: 'Case booked later today',
      tone: metrics.nextUpRooms > 0 ? 'amber' : 'slate',
    },
    {
      key: 'idle',
      label: 'Idle',
      value: metrics.idleRooms,
      note: 'Nothing more booked',
      tone: 'slate',
    },
    {
      key: 'blocked',
      label: 'Blocked',
      value: metrics.blockedRooms,
      note: metrics.blockedRooms > 0 ? 'Approved block in place' : 'No rooms blocked',
      tone: metrics.blockedRooms > 0 ? 'red' : 'green',
    },
    {
      key: 'cases-in-progress',
      label: 'Cases in progress',
      value: metrics.casesInProgress,
      note: 'In theatre or surgery',
      tone: metrics.casesInProgress > 0 ? 'violet' : 'slate',
    },
  ];

  return (
    <div className="flex flex-col gap-6 page-transition">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="ot-board-date" className="text-xs font-medium text-muted-foreground">
            Board date
          </label>
          <Input
            id="ot-board-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-8 w-auto"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {updatedAt ? <span>Live · updated {updatedAt}</span> : null}
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-8">
            <RefreshCw className={cn('mr-1 h-3.5 w-3.5', isFetching && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">OT Board</h1>
          <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
            {boardDay}
            {!isLoading && data ? (
              metrics.blockedRooms > 0 ? (
                <>
                  {' · '}
                  <span className="font-medium text-warning">
                    {metrics.blockedRooms} {metrics.blockedRooms === 1 ? 'room is' : 'rooms are'} blocked
                  </span>
                </>
              ) : (
                <>
                  {' · '}
                  <span className="font-medium text-success">no rooms blocked</span>
                </>
              )
            ) : null}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="h-8">
            <Link href={`/${locale}/ot/schedules`}>OT Schedules</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8">
            <Link href={`/${locale}/ot/rooms`}>OT Rooms</Link>
          </Button>
        </div>
      </header>

      <section aria-labelledby="ot-board-rooms" className="flex flex-col gap-2">
        <h2 id="ot-board-rooms" className="text-sm font-semibold text-foreground">
          Rooms
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((tile) => (
            <MetricTile
              key={tile.key}
              metricKey={tile.key}
              label={tile.label}
              value={tile.value}
              note={tile.note}
              tone={tile.tone}
              isLoading={isLoading}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="ot-board-theatres" className="flex flex-col gap-2">
        <h2 id="ot-board-theatres" className="text-sm font-semibold text-foreground">
          Theatres
        </h2>
        {isLoading ? (
          <div className="grid gap-3 xl:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-[320px] w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {(error as Error).message}
          </div>
        ) : data && data.rooms.length > 0 ? (
          <div className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
            {data.rooms.map((room) => (
              <RoomCard key={room.room.spaceId} room={room} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed">
            <EmptyState
              icon={Scissors}
              title="No OT rooms configured"
              description="Configure OT rooms first so the board can display room utilization and live case progression."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link href={`/${locale}/ot/rooms`}>Set up OT Rooms</Link>
                </Button>
              }
            />
          </div>
        )}
      </section>
    </div>
  );
}
