'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { useFacilitySpaces } from '@/modules/foundation/hooks/use-facility-spaces';
import { getSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';

interface SpaceRow {
  id: string;
  label: string;
  facility: string;
  capacity: number;
  status: string;
}

const columns: ColumnDef<SpaceRow>[] = [
  { accessorKey: 'label', header: 'Space' },
  { accessorKey: 'facility', header: 'Facility' },
  { accessorKey: 'capacity', header: 'Capacity' },
  { accessorKey: 'status', header: 'Status' },
];

export default function SpacesPage({ params }: { params: { locale: string } }) {
  const session = getSession();
  const claims = decodeAccessToken(session.accessToken);
  const facilityId = claims?.facilityId;

  const { data: spaces, isLoading, error } = useFacilitySpaces(facilityId);

  const spaceRows: SpaceRow[] = useMemo(() => {
    if (!spaces) return [];
    return spaces.map((space) => ({
      id: space.id,
      label: space.spaceNumber ? `${space.name} (${space.spaceNumber})` : space.name,
      facility: space.facility?.name || 'N/A',
      capacity: space.capacity,
      status: space.isActive ? 'Available' : 'Inactive',
    }));
  }, [spaces]);

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
            { href: `/${params.locale}/spaces`, label: 'Spaces' },
          ]}
        />
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load spaces: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
          { href: `/${params.locale}/spaces`, label: 'Spaces' },
        ]}
      />
      <ResourceTable
        title="Spaces"
        columns={columns}
        data={spaceRows}
        isLoading={isLoading}
      />
    </div>
  );
}
