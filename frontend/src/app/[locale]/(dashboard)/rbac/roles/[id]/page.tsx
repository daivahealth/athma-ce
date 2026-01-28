'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useRole, useSetRolePermissions } from '@/modules/foundation/hooks/use-role';
import { useDeleteRole, useUpdateRole } from '@/modules/foundation/hooks/use-roles';
import { usePermissions } from '@/modules/foundation/hooks/use-rbac';
import type { Permission } from '@/modules/foundation/types/role';
import { ArrowLeft } from 'lucide-react';

const updateRoleSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  description: z.string().max(255).optional(),
});

type UpdateRoleForm = z.infer<typeof updateRoleSchema>;

export default function RoleDetailPage({ params }: { params: { locale: string; id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const roleId = params.id;
  const { data: role, isLoading, error } = useRole(roleId);
  const { data: permissions = [], isLoading: permissionsLoading } = usePermissions();
  const setRolePermissionsMutation = useSetRolePermissions();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();
  const [search, setSearch] = useState('');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateRoleForm>({
    resolver: zodResolver(updateRoleSchema),
  });

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description || '',
      });
      setSelectedPermissionIds(role.rolePermissions?.map((rp) => rp.permission.id) ?? []);
    }
  }, [role, reset]);

  const assignedPermissionIds = useMemo(
    () => new Set(role?.rolePermissions?.map((rp) => rp.permission.id) ?? []),
    [role],
  );

  const filteredPermissions = useMemo(() => {
    if (!search.trim()) return permissions;
    const query = search.trim().toLowerCase();
    return permissions.filter((permission) => {
      const haystack = `${permission.code} ${permission.name} ${permission.description ?? ''} ${
        permission.resource ?? ''
      } ${permission.action ?? ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [permissions, search]);

  const groupedPermissions = useMemo(() => {
    const groups = new Map<string, Permission[]>();
    filteredPermissions.forEach((permission) => {
      const key = permission.resource || 'general';
      const current = groups.get(key) ?? [];
      current.push(permission);
      groups.set(key, current);
    });

    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredPermissions]);

  const filteredPermissionIds = useMemo(
    () => new Set(filteredPermissions.map((permission) => permission.id)),
    [filteredPermissions],
  );

  const hasPermissionChanges = useMemo(() => {
    if (!role) return false;
    if (assignedPermissionIds.size !== selectedPermissionIds.length) return true;
    return selectedPermissionIds.some((id) => !assignedPermissionIds.has(id));
  }, [assignedPermissionIds, role, selectedPermissionIds]);

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      }
      return [...prev, permissionId];
    });
  };

  const handleSelectAllVisible = () => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      filteredPermissions.forEach((permission) => next.add(permission.id));
      return Array.from(next);
    });
  };

  const handleClearVisible = () => {
    setSelectedPermissionIds((prev) => prev.filter((id) => !filteredPermissionIds.has(id)));
  };

  const handleSavePermissions = async () => {
    if (!role) return;
    try {
      await setRolePermissionsMutation.mutateAsync({
        roleId: role.id,
        permissionIds: selectedPermissionIds,
      });
      toast({ title: 'Permissions updated', description: 'Role permissions saved.' });
    } catch (err: any) {
      toast({
        title: 'Failed to update permissions',
        description: err?.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRole = async (data: UpdateRoleForm) => {
    if (!role) return;
    try {
      await updateRoleMutation.mutateAsync({
        id: role.id,
        data: {
          name: data.name.trim(),
          description: data.description?.trim() || undefined,
        },
      });
      setShowEditDialog(false);
      toast({ title: 'Role updated', description: 'Role details have been saved.' });
    } catch (err: any) {
      toast({
        title: 'Failed to update role',
        description: err?.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRole = async () => {
    if (!role) return;
    try {
      await deleteRoleMutation.mutateAsync(role.id);
      toast({ title: 'Role deleted', description: 'Role has been removed.' });
      router.push(`/${params.locale}/rbac/roles`);
    } catch (err: any) {
      toast({
        title: 'Failed to delete role',
        description: err?.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border p-6 text-sm text-muted-foreground">Loading role details…</div>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load role: {error ? (error as Error).message : 'Role not found'}
        </div>
      </div>
    );
  }

  const canManageRole = !role.isSystem;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-start gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/${params.locale}/rbac/roles`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{role.name}</h1>
              <p className="text-sm text-muted-foreground">{role.code}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditDialog(true)} disabled={!canManageRole}>
            Edit Role
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={!canManageRole}
          >
            Delete Role
          </Button>
        </div>
      </div>

      {!canManageRole && (
        <div className="rounded-md border border-muted bg-muted/40 p-4 text-sm text-muted-foreground">
          System roles are managed by the platform and cannot be edited.
        </div>
      )}

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
              <div className="text-base">{assignedPermissionIds.size} permission(s)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>
            {assignedPermissionIds.size > 0
              ? `This role has ${assignedPermissionIds.size} permission(s) assigned`
              : 'No permissions assigned to this role'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search permissions by name, code, or resource"
              className="md:max-w-sm"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAllVisible} disabled={!canManageRole}>
                Select Visible
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearVisible} disabled={!canManageRole}>
                Clear Visible
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[420px] rounded-md border">
            <div className="divide-y">
              {permissionsLoading ? (
                <div className="p-6 text-sm text-muted-foreground">Loading permissions…</div>
              ) : groupedPermissions.length ? (
                groupedPermissions.map(([resource, items]) => (
                  <div key={resource} className="p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant="outline">{resource}</Badge>
                      <span className="text-xs text-muted-foreground">{items.length} items</span>
                    </div>
                    <div className="space-y-2">
                      {items.map((permission) => {
                        const isChecked = selectedPermissionIds.includes(permission.id);
                        return (
                          <label
                            key={permission.id}
                            className="flex items-start gap-3 rounded-md border px-3 py-2 text-sm hover:bg-muted/40"
                          >
                            <Checkbox
                              checked={isChecked}
                              onChange={() => togglePermission(permission.id)}
                              disabled={!canManageRole}
                            />
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">{permission.name}</span>
                                <span className="text-xs font-mono text-muted-foreground">
                                  {permission.code}
                                </span>
                              </div>
                              {permission.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {permission.description}
                                </p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-sm text-muted-foreground">No permissions match your search.</div>
              )}
            </div>
          </ScrollArea>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {filteredPermissions.length} permission(s) shown
            </p>
            <Button
              onClick={handleSavePermissions}
              disabled={!hasPermissionChanges || !canManageRole || setRolePermissionsMutation.isPending}
            >
              {setRolePermissionsMutation.isPending ? 'Saving…' : 'Save Permissions'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role name and description.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdateRole)} className="space-y-4">
            <div>
              <Label htmlFor="role-name">Role Name</Label>
              <Input id="role-name" {...register('name')} />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="role-description">Description</Label>
              <Input id="role-description" {...register('description')} />
              {errors.description && (
                <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!canManageRole || updateRoleMutation.isPending}>
                {updateRoleMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting this role will remove it from all users. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRole}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRoleMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
