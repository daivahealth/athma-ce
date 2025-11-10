'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';

interface PermissionRow {
  id: string;
  resource: string;
  action: string;
  description: string;
}

const columns: ColumnDef<PermissionRow>[] = [
  { accessorKey: 'resource', header: 'Resource' },
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'description', header: 'Description' },
];

const data: PermissionRow[] = [
  { id: 'perm-1', resource: 'patients', action: 'view', description: 'View patient demographics and history' },
  { id: 'perm-2', resource: 'claims', action: 'submit', description: 'Submit insurance claims to payer' },
  { id: 'perm-3', resource: 'rbac', action: 'manage', description: 'Manage roles and permissions (MFA required)' },
];

export default function PermissionsPage({ params }: { params: { locale: string } }) {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
          { href: `/${params.locale}/rbac/permissions`, label: 'Permissions' },
        ]}
      />
      <ResourceTable title="Permissions" columns={columns} data={data} />
    </div>
  );
}
