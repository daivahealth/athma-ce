import { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { Breadcrumb } from '@/components/layout/breadcrumb';

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

const data: SpaceRow[] = [
  { id: 'space-1', label: 'Procedure Room 2', facility: 'DXB Downtown Clinic', capacity: 1, status: 'Available' },
  { id: 'space-2', label: 'Consult Room 5', facility: 'Abu Dhabi Cardio Center', capacity: 1, status: 'In use' },
  { id: 'space-3', label: 'Telehealth Pod A', facility: 'Sharjah Wellness Hub', capacity: 1, status: 'Maintenance' },
];

export default function SpacesPage({ params }: { params: { locale: string } }) {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
          { href: `/${params.locale}/spaces`, label: 'Spaces' },
        ]}
      />
      <ResourceTable title="Spaces" columns={columns} data={data} />
    </div>
  );
}
