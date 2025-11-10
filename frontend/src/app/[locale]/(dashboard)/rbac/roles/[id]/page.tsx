'use client';

import { useParams } from 'next/navigation';
import { useRole } from '@/modules/foundation/hooks/use-role';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function RoleDetailPage({ params }: { params: { locale: string; id: string } }) {
  const roleId = params.id;
  const { data: role, isLoading, error } = useRole(roleId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
            { href: `/${params.locale}/rbac/roles`, label: 'Roles' },
            { href: `/${params.locale}/rbac/roles/${roleId}`, label: 'Loading...' },
          ]}
        />
        <div className="rounded-md border p-6 text-sm text-muted-foreground">Loading role details…</div>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
            { href: `/${params.locale}/rbac/roles`, label: 'Roles' },
            { href: `/${params.locale}/rbac/roles/${roleId}`, label: 'Error' },
          ]}
        />
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load role: {error ? (error as Error).message : 'Role not found'}
        </div>
      </div>
    );
  }

  const permissions = role.rolePermissions?.map((rp) => rp.permission) ?? [];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
          { href: `/${params.locale}/rbac/roles`, label: 'Roles' },
          { href: `/${params.locale}/rbac/roles/${role.id}`, label: role.name },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
            <CardDescription>Basic details about this role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div className="text-base">{role.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Code</div>
              <div className="text-base font-mono">{role.code}</div>
            </div>
            {role.description && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Description</div>
                <div className="text-base">{role.description}</div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-muted-foreground">System Role</div>
              <div>
                {role.isSystem ? (
                  <Badge variant="secondary">System Role</Badge>
                ) : (
                  <Badge variant="outline">Custom Role</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Status</CardTitle>
            <CardDescription>Metadata and timestamps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Created</div>
              <div className="text-base">{new Date(role.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
              <div className="text-base">{new Date(role.updatedAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Permissions Count</div>
              <div className="text-base">{permissions.length} permission(s)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>
            {permissions.length > 0
              ? `This role has ${permissions.length} permission(s) assigned`
              : 'No permissions assigned to this role'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {permissions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-mono text-sm">{permission.code}</TableCell>
                      <TableCell>{permission.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {permission.description || '—'}
                      </TableCell>
                      <TableCell>
                        {permission.resource ? (
                          <Badge variant="outline">{permission.resource}</Badge>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>
                        {permission.action ? (
                          <Badge variant="secondary">{permission.action}</Badge>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
              No permissions have been assigned to this role yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
