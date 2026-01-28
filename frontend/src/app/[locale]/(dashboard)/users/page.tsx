'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { getSession } from '@/lib/api/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/modules/foundation/hooks/use-user';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function UsersPage({ params }: { params: { locale: string } }) {
  const session = getSession();
  const tenantId = session.user?.tenantId;

  const { data: users, isLoading, error } = useUsers(tenantId);

  const userRows: UserRow[] = useMemo(() => {
    if (!users) return [];
    return users.map((user) => ({
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      email: user.email,
      role: user.role || 'User',
      status: user.status || 'active',
      createdAt: user.createdAt,
    }));
  }, [users]);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load users: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  const columns: ColumnDef<UserRow>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'status', header: 'Status' },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    },
    {
      id: 'details',
      header: 'Details',
      cell: ({ row }) => (
        <Button asChild variant="outline" size="sm">
          <Link href={`/${params.locale}/users/${row.original.id}`}>View</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ResourceTable
        title="Users"
        cta={(
          <Button asChild size="sm">
            <Link href={`/${params.locale}/users/new`}>New User</Link>
          </Button>
        )}
        columns={columns}
        data={userRows}
        isLoading={isLoading}
      />
    </div>
  );
}
