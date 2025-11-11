'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { useFacilityUsers } from '@/modules/foundation/hooks/use-facility-users';
import { getSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';

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

export default function UsersPage({ params }: { params: { locale: string } }) {
  const session = getSession();
  const claims = decodeAccessToken(session.accessToken);
  const facilityId = claims?.facilityId;

  const { data: users, isLoading, error } = useFacilityUsers(facilityId);

  const userRows: UserRow[] = useMemo(() => {
    if (!users) return [];
    return users.map((user) => ({
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      email: user.email,
      role: user.role || user.accessLevel || 'User',
      status: user.isDefault ? 'Default Facility' : 'Active',
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

  return (
    <div className="space-y-6">
      <ResourceTable
        title="Users"
        columns={columns}
        data={userRows}
        isLoading={isLoading}
      />
    </div>
  );
}
