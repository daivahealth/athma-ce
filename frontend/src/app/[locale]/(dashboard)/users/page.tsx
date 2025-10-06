import { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { Breadcrumb } from '@/components/layout/breadcrumb';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: ColumnDef<UserRow>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
];

const mockUsers: UserRow[] = [
  { id: '1', name: 'Sara Mahmoud', email: 'sara.mahmoud@zeal.health', role: 'Clinical Admin', status: 'Active' },
  { id: '2', name: 'Ahmed Hussain', email: 'ahmed.hussain@zeal.health', role: 'Cardiologist', status: 'Active' },
  { id: '3', name: 'Omar Saeed', email: 'omar.saeed@zeal.health', role: 'Dermatologist', status: 'Invited' }
];

export default function UsersPage({ params }: { params: { locale: string } }) {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
          { href: `/${params.locale}/users`, label: 'Users' },
        ]}
      />
      <ResourceTable title="Users" columns={columns} data={mockUsers} />
    </div>
  );
}
