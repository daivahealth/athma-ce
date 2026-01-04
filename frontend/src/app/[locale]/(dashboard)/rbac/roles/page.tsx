'use client';

import { useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { useRoles } from '@/modules/foundation/hooks/use-roles';
import type { Role } from '@/modules/foundation/types/role';

const columns: ColumnDef<Role>[] = [
  { accessorKey: 'code', header: 'Code' },
  { accessorKey: 'name', header: 'Role name' },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ getValue }) => (getValue<string | null>() ? getValue<string>() : '—'),
  },
  {
    accessorKey: 'isSystem',
    header: 'System role',
    cell: ({ getValue }) => ((getValue<boolean>()) ? 'Yes' : 'No'),
  },
];

export default function RolesPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const { data: roles, isLoading, error } = useRoles();

  const handleRowClick = (role: Role) => {
    router.push(`/${params.locale}/rbac/roles/${role.id}`);
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="rounded-md border p-6 text-sm text-muted-foreground">Loading roles…</div>
      ) : error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load roles: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Roles"
          columns={columns}
          data={roles ?? []}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
}
