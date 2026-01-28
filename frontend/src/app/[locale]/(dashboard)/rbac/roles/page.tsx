'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { useCreateRole, useRoles } from '@/modules/foundation/hooks/use-roles';
import type { Role } from '@/modules/foundation/types/role';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { getSession } from '@/lib/api/client';

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

const createRoleSchema = z.object({
  code: z.string().min(2, 'Code is required').max(50),
  name: z.string().min(2, 'Name is required').max(100),
  description: z.string().max(255).optional(),
});

type CreateRoleForm = z.infer<typeof createRoleSchema>;

export default function RolesPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const session = getSession();
  const tenantId = session.user?.tenantId;
  const createRoleMutation = useCreateRole();
  const [open, setOpen] = useState(false);
  const { data: roles, isLoading, error } = useRoles();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleForm>({
    resolver: zodResolver(createRoleSchema),
  });

  const handleRowClick = (role: Role) => {
    router.push(`/${params.locale}/rbac/roles/${role.id}`);
  };

  const onSubmit = async (data: CreateRoleForm) => {
    if (!tenantId) {
      toast({
        title: 'Missing tenant',
        description: 'Tenant ID is required to create roles.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const role = await createRoleMutation.mutateAsync({
        tenantId,
        code: data.code.trim(),
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
      });
      toast({ title: 'Role created', description: `${role.name} is ready to configure.` });
      reset();
      setOpen(false);
      router.push(`/${params.locale}/rbac/roles/${role.id}`);
    } catch (err: any) {
      toast({
        title: 'Failed to create role',
        description: err?.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    }
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
          cta={(
            <Button size="sm" onClick={() => setOpen(true)}>
              New Role
            </Button>
          )}
          columns={columns}
          data={roles ?? []}
          onRowClick={handleRowClick}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Role</DialogTitle>
            <DialogDescription>
              Define a custom role and assign permissions in the next step.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="role-code">Role Code</Label>
              <Input id="role-code" placeholder="billing_manager" {...register('code')} />
              {errors.code && (
                <p className="text-xs text-destructive mt-1">{errors.code.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="role-name">Role Name</Label>
              <Input id="role-name" placeholder="Billing Manager" {...register('name')} />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="role-description">Description</Label>
              <Input
                id="role-description"
                placeholder="Describe the role purpose"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRoleMutation.isPending}>
                {createRoleMutation.isPending ? 'Creating...' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
