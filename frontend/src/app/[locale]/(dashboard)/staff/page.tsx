import { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { Breadcrumb } from '@/components/layout/breadcrumb';

interface StaffRow {
  id: string;
  name: string;
  specialty: string;
  license: string;
  status: string;
}

const columns: ColumnDef<StaffRow>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'specialty', header: 'Specialty' },
  { accessorKey: 'license', header: 'License' },
  { accessorKey: 'status', header: 'Status' },
];

const data: StaffRow[] = [
  { id: 'staff-1', name: 'Dr. Fatima Al Noor', specialty: 'Pediatrics', license: 'DHA-48201', status: 'On duty' },
  { id: 'staff-2', name: 'Dr. Omar Saeed', specialty: 'Dermatology', license: 'DHA-37651', status: 'On leave' },
  { id: 'staff-3', name: 'Dr. Sara Mahmoud', specialty: 'Family Medicine', license: 'DHA-25741', status: 'On duty' },
];

export default function StaffPage({ params }: { params: { locale: string } }) {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
          { href: `/${params.locale}/staff`, label: 'Staff' },
        ]}
      />
      <ResourceTable title="Clinical Staff" columns={columns} data={data} />
    </div>
  );
}
