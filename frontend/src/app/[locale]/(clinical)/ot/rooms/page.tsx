'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Building2, DoorOpen, Layers, Plus, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ToneBadge } from '@/components/ui/tone-badge';
import { TONE_BAR } from '@/components/ui/tone-classes';
import { cn } from '@/lib/utils';
import { useOtRooms } from '@/modules/ot/hooks/use-ot';
import {
  OtErrorPanel,
  OtSearchInput,
  OtStatusFilter,
  humanize,
} from '@/modules/ot/components/ot-list';
import type { OtRoomConfig } from '@/modules/ot/types';
import { useSpecialtyLabel } from '@/modules/foundation/hooks/use-specialties';

type RoomState = 'ACTIVE' | 'INACTIVE';
const STATE_OPTIONS = [
  { value: 'ACTIVE' as const, tone: 'emerald' as const },
  { value: 'INACTIVE' as const, tone: 'slate' as const },
];

function RoomCard({ room, specialty }: { room: OtRoomConfig; specialty: string | null }) {
  // Without the Foundation space, name the room by its specialty rather than show a raw id.
  const name = room.space?.name || (specialty ? `${specialty} OT` : 'OT room');
  return (
    <Card
      className={cn(
        'flex flex-col overflow-hidden transition-shadow hover:shadow-md',
        !room.isActive && 'opacity-75',
      )}
    >
      <div
        className={cn('h-1 w-full', TONE_BAR[room.isActive ? 'emerald' : 'slate'])}
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <DoorOpen className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3
                className="truncate text-base font-semibold leading-tight text-foreground"
                title={name}
              >
                {name}
              </h3>
              <p className="truncate text-xs text-muted-foreground">
                {room.space?.spaceNumber ||
                  (room.space ? 'No space number' : `Space ${room.spaceId.slice(0, 8)}`)}
              </p>
            </div>
          </div>
          <ToneBadge tone={room.isActive ? 'emerald' : 'slate'} withDot>
            {room.isActive ? 'Active' : 'Inactive'}
          </ToneBadge>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="min-w-0">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <Stethoscope className="h-3.5 w-3.5" />
              Specialty
            </dt>
            <dd className={cn('mt-1 truncate font-medium', !specialty && 'text-muted-foreground')}>
              {specialty || 'Any specialty'}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <Layers className="h-3.5 w-3.5" />
              Floor
            </dt>
            <dd
              className={cn(
                'mt-1 truncate font-medium',
                !room.space?.floorNumber && 'text-muted-foreground',
              )}
            >
              {room.space?.floorNumber ? `Floor ${room.space.floorNumber}` : 'Not set'}
            </dd>
          </div>
          <div className="col-span-2 min-w-0">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              Facility
            </dt>
            <dd className="mt-1 truncate font-medium">
              {room.space?.facility?.name || (
                <span className="text-muted-foreground">Facility not loaded</span>
              )}
              {room.space?.spaceType ? (
                <span className="font-normal text-muted-foreground">
                  {' '}
                  · {humanize(room.space.spaceType)}
                </span>
              ) : null}
            </dd>
          </div>
        </dl>

        <p
          className={cn(
            'mt-auto line-clamp-2 rounded-lg border border-dashed px-3 py-2 text-xs',
            room.notes ? 'text-foreground/80' : 'text-muted-foreground',
          )}
          title={room.notes ?? undefined}
        >
          {room.notes || 'No notes added'}
        </p>
      </div>
    </Card>
  );
}

export default function OtRoomsPage() {
  const params = useParams() as { locale: string };
  const specialtyLabel = useSpecialtyLabel();
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<'all' | RoomState>('all');
  const {
    data: rooms,
    isLoading,
    error,
  } = useOtRooms({ facilityId: undefined, includeInactive: true });

  const allRooms = useMemo(
    () =>
      [...(rooms ?? [])].sort((a, b) =>
        (a.space?.name || a.specialty || a.spaceId).localeCompare(
          b.space?.name || b.specialty || b.spaceId,
        ),
      ),
    [rooms],
  );
  const counts = useMemo(
    () => ({
      ACTIVE: allRooms.filter((r) => r.isActive).length,
      INACTIVE: allRooms.filter((r) => !r.isActive).length,
    }),
    [allRooms],
  );
  const visibleRooms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allRooms.filter((room) => {
      if (stateFilter === 'ACTIVE' && !room.isActive) return false;
      if (stateFilter === 'INACTIVE' && room.isActive) return false;
      if (!q) return true;
      return [room.space?.name, room.space?.spaceNumber, specialtyLabel(room.specialty), room.notes]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [allRooms, stateFilter, searchQuery, specialtyLabel]);

  const newHref = `/${params.locale}/ot/rooms/new`;

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        icon={DoorOpen}
        title="OT Rooms"
        subtitle="Theatre rooms available for scheduling, built on Foundation spaces."
        actions={
          <Button asChild>
            <Link href={newHref}>
              <Plus className="mr-2 h-4 w-4" />
              Configure OT Room
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <OtSearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search rooms by name, number or specialty"
        />
        <OtStatusFilter
          options={STATE_OPTIONS}
          value={stateFilter}
          onChange={setStateFilter}
          counts={counts}
          total={allRooms.length}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-[230px] w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <OtErrorPanel error={error} />
      ) : visibleRooms.length === 0 ? (
        <Card>
          <EmptyState
            icon={DoorOpen}
            title={allRooms.length ? 'No rooms match' : 'No OT rooms configured'}
            description={
              allRooms.length
                ? 'Try another name or number, or show all rooms.'
                : 'Configure the first OT room from a Foundation space.'
            }
            action={
              allRooms.length ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStateFilter('all');
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button asChild size="sm">
                  <Link href={newHref}>
                    <Plus className="mr-2 h-4 w-4" />
                    Configure OT Room
                  </Link>
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              specialty={room.specialty ? specialtyLabel(room.specialty) || room.specialty : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
