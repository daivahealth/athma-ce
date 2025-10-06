import { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { Breadcrumb } from '@/components/layout/breadcrumb';

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

const data: FacilityRow[] = [
  { id: 'fac-1', name: 'DXB Downtown Clinic', type: 'Outpatient', city: 'Dubai', status: 'Active' },
  { id: 'fac-2', name: 'Abu Dhabi Cardio Center', type: 'Specialty', city: 'Abu Dhabi', status: 'Active' },
  { id: 'fac-3', name: 'Sharjah Wellness Hub', type: 'Day Care', city: 'Sharjah', status: 'Under maintenance' },
];

export default function FacilitiesPage({ params }: { params: { locale: string } }) {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
          { href: `/${params.locale}/facilities`, label: 'Facilities' },
        ]}
      />
      <ResourceTable title="Facilities" columns={columns} data={data} />
    </div>
  );
}
