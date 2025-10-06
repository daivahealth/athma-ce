import { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { Breadcrumb } from '@/components/layout/breadcrumb';

interface RoleRow {
  id: string;
  code: string;
  name: string;
  sensitive: boolean;
}

const columns: ColumnDef<RoleRow>[] = [
  { accessorKey: 'code', header: 'Code' },
  { accessorKey: 'name', header: 'Role name' },
  {
    accessorKey: 'sensitive',
    header: 'Requires MFA',
    cell: ({ getValue }) => ((getValue() as boolean) ? 'Yes' : 'No'),
  },
];

const data: RoleRow[] = [
  { id: 'role-1', code: 'clinical_admin', name: 'Clinical Administrator', sensitive: true },
  { id: 'role-2', code: 'provider', name: 'Healthcare Provider', sensitive: false },
  { id: 'role-3', code: 'billing_specialist', name: 'Billing Specialist', sensitive: true },
];

export default function RolesPage({ params }: { params: { locale: string } }) {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
          { href: `/${params.locale}/rbac/roles`, label: 'Roles' },
        ]}
      />
      <ResourceTable title="Roles" columns={columns} data={data} />
    </div>
  );
}
