'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { useTenantFacilities } from '@/modules/foundation/hooks/use-tenant-facilities';
import { getSession } from '@/lib/api/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FacilityRow {
  id: string;
  name: string;
  type: string;
  city: string;
  status: string;
}

export default function FacilitiesPage({ params }: { params: { locale: string } }) {
  const session = getSession();
  const tenantId = session.user?.tenantId;

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
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load facilities: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  const columns: ColumnDef<FacilityRow>[] = [
    { accessorKey: 'name', header: 'Facility' },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'city', header: 'City' },
    { accessorKey: 'status', header: 'Status' },
    {
      id: 'details',
      header: 'Details',
      cell: ({ row }) => (
        <Button asChild variant="outline" size="sm">
          <Link href={`/${params.locale}/facilities/${row.original.id}`}>View</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ResourceTable
        title="Facilities"
        cta={(
          <Button asChild size="sm">
            <Link href={`/${params.locale}/facilities/new`}>Create Facility</Link>
          </Button>
        )}
        columns={columns}
        data={facilityRows}
        isLoading={isLoading}
      />
    </div>
  );
}
