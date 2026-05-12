'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, DoorOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useOtRooms } from '@/modules/ot/hooks/use-ot';

export default function OtRoomsPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const { data: rooms, isLoading, error } = useOtRooms({
    facilityId: undefined,
    includeInactive: true,
  });
  const orderedRooms = useMemo(
    () =>
      [...(rooms ?? [])].sort((a, b) => {
        const aName = a.space?.name || a.spaceId;
        const bName = b.space?.name || b.spaceId;
        return aName.localeCompare(bName);
      }),
    [rooms]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OT Rooms</h1>
          <p className="text-muted-foreground">
            Review configured theatre rooms and manage active scheduling inventory.
          </p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/ot/rooms/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Configure OT Room
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading OT rooms...</div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {(error as Error).message}
            </div>
          ) : orderedRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <DoorOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No OT rooms configured</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Configure the first OT room from a Foundation space.
              </p>
              <Button onClick={() => router.push(`/${params.locale}/ot/rooms/new`)}>
                <Plus className="mr-2 h-4 w-4" />
                Configure OT Room
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Space Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderedRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-medium">
                          <DoorOpen className="h-4 w-4 text-muted-foreground" />
                          {room.space?.name || room.spaceId}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {room.space?.spaceNumber || room.spaceId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{room.space?.facility?.name || 'Facility not loaded'}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {room.space?.floorNumber
                            ? `Floor ${room.space.floorNumber}`
                            : 'Floor not set'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{room.specialty || 'Not set'}</TableCell>
                    <TableCell>{room.space?.spaceType || 'Not available'}</TableCell>
                    <TableCell>{room.isActive ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell className="max-w-[320px]">
                      <span className="line-clamp-2 text-sm text-muted-foreground">
                        {room.notes || 'No notes added'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
