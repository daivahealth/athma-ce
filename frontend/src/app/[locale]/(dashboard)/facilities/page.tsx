'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { useTenantFacilities } from '@/modules/foundation/hooks/use-tenant-facilities';
import { getSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';

interface FacilityRow {
  id: string;
  name: string;
  type: string;
  city: string;
  status: string;
}

const columns: ColumnDef<FacilityRow>[] = [
  { accessorKey: 'name', header: 'Facility' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'status', header: 'Status' },
];

export default function FacilitiesPage({ params }: { params: { locale: string } }) {
  const session = getSession();
  const claims = decodeAccessToken(session.accessToken);
  const tenantId = claims?.tenantId;

  const { data: facilities, isLoading, error } = useTenantFacilities(tenantId);

  const facilityRows: FacilityRow[] = useMemo(() => {
    if (!facilities) return [];
    return facilities.map((facility) => ({
      id: facility.id,
      name: facility.name,
      type: facility.facilityType || 'N/A',
      city: facility.city || 'N/A',
      status: facility.status.charAt(0).toUpperCase() + facility.status.slice(1),
    }));
  }, [facilities]);

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
            { href: `/${params.locale}/facilities`, label: 'Facilities' },
          ]}
        />
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load facilities: {error instanceof Error ? error.message : 'Unknown error'}
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
          { href: `/${params.locale}/facilities`, label: 'Facilities' },
        ]}
      />
      <ResourceTable
        title="Facilities"
        columns={columns}
        data={facilityRows}
        isLoading={isLoading}
      />
    </div>
  );
}
