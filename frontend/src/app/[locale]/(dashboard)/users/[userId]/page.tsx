'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  useAssignFacility,
  useDeleteUser,
  useLinkStaff,
  useRevokeFacility,
  useSetDefaultFacility,
  useUnlinkStaff,
  useUpdateUser,
  useUser,
  useUserFacilities,
} from '@/modules/foundation/hooks/use-user';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import { useRoles } from '@/modules/foundation/hooks/use-roles';
import { useUserRoles, useAssignUserRole, useRemoveUserRole } from '@/modules/foundation/hooks/use-rbac';
import { useTenantFacilities } from '@/modules/foundation/hooks/use-tenant-facilities';
import { getSession } from '@/lib/api/client';
import { ArrowLeft, AlertCircle, Briefcase, Link2, Mail, Unlink } from 'lucide-react';

const editUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  status: z.enum(['active', 'inactive', 'invited', 'suspended']),
});

type EditUserForm = z.infer<typeof editUserSchema>;

export default function UserDetailPage({ params }: { params: { locale: string; userId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const session = getSession();
  const [isLinking, setIsLinking] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [accessLevel, setAccessLevel] = useState<'standard' | 'admin' | 'read_only'>('standard');
  const [setAsDefault, setSetAsDefault] = useState(false);

  const { data: user, isLoading, error } = useUser(params.userId);
  const { data: staffList = [], isLoading: isLoadingStaff } = useStaffList();
  const { data: userFacilities } = useUserFacilities(params.userId, { enabled: Boolean(user) });
  const tenantId = user?.tenantId ?? session.user?.tenantId;
  const { data: tenantFacilities = [] } = useTenantFacilities(tenantId, { enabled: Boolean(tenantId) });
  const { data: roles = [] } = useRoles();
  const { data: userRoles = [] } = useUserRoles(params.userId);
  const linkStaffMutation = useLinkStaff();
  const unlinkStaffMutation = useUnlinkStaff();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const assignRoleMutation = useAssignUserRole();
  const removeRoleMutation = useRemoveUserRole();
  const assignFacilityMutation = useAssignFacility();
  const setDefaultFacilityMutation = useSetDefaultFacility();
  const revokeFacilityMutation = useRevokeFacility();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors: editErrors },
  } = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        status: user.status,
      });
    }
  }, [reset, user]);

  const availableStaff = staffList.filter((staff) => !staff.user || staff.id === user?.staffId);
  const assignedRoleIds = useMemo(() => new Set(userRoles.map((item) => item.role.id)), [userRoles]);
  const availableRoles = roles.filter((role) => !assignedRoleIds.has(role.id));
  const assignedFacilityIds = useMemo(
    () => new Set((userFacilities?.facilities ?? []).map((facility) => facility.id)),
    [userFacilities],
  );
  const availableFacilities = tenantFacilities.filter((facility) => !assignedFacilityIds.has(facility.id));

  const handleLinkStaff = async () => {
    if (!selectedStaffId) return;

    try {
      await linkStaffMutation.mutateAsync({
        userId: params.userId,
        staffId: selectedStaffId,
      });
      setIsLinking(false);
      setSelectedStaffId('');
      toast({ title: 'Staff linked', description: 'User has been linked to staff profile.' });
    } catch (err: any) {
      toast({
        title: 'Failed to link staff',
        description: err?.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUnlinkStaff = async () => {
    try {
      await unlinkStaffMutation.mutateAsync(params.userId);
      setShowUnlinkDialog(false);
      toast({ title: 'Staff unlinked', description: 'Staff profile has been unlinked.' });
    } catch (err: any) {
      toast({
        title: 'Failed to unlink staff',
        description: err?.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateUser = async (data: EditUserForm) => {
    try {
      await updateUserMutation.mutateAsync({
        userId: params.userId,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          status: data.status,
        },
      });
      setShowEditDialog(false);
      toast({ title: 'User updated', description: 'User details have been saved.' });
    } catch (err: any) {
      toast({
        title: 'Failed to update',
        description: err?.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const statusValue = watch('status');

  const handleDeleteUser = async () => {
    try {
      await deleteUserMutation.mutateAsync(params.userId);
      setShowDeleteDialog(false);
      toast({ title: 'User deleted', description: 'User account has been removed.' });
      router.push(`/${params.locale}/users`);
    } catch (err: any) {
      toast({
        title: 'Failed to delete user',
        description: err?.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAssignRole = async () => {
    if (!selectedRoleId) return;
    try {
      await assignRoleMutation.mutateAsync({ userId: params.userId, roleId: selectedRoleId });
      setSelectedRoleId('');
      toast({ title: 'Role assigned', description: 'User role assignment updated.' });
    } catch (err: any) {
      toast({
        title: 'Failed to assign role',
        description: err?.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      await removeRoleMutation.mutateAsync({ userId: params.userId, roleId });
      toast({ title: 'Role removed', description: 'Role has been removed from user.' });
    } catch (err: any) {
      toast({
        title: 'Failed to remove role',
        description: err?.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAssignFacility = async () => {
    if (!selectedFacilityId) return;
    try {
      await assignFacilityMutation.mutateAsync({
        userId: params.userId,
        data: {
          facilityId: selectedFacilityId,
          accessLevel,
          setAsDefault,
        },
      });
      setSelectedFacilityId('');
      setAccessLevel('standard');
      setSetAsDefault(false);
      toast({ title: 'Facility assigned', description: 'Facility access updated.' });
    } catch (err: any) {
      toast({
        title: 'Failed to assign facility',
        description: err?.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefaultFacility = async (facilityId: string) => {
    try {
      await setDefaultFacilityMutation.mutateAsync({
        userId: params.userId,
        data: { facilityId },
      });
      toast({ title: 'Default facility set', description: 'Default facility updated.' });
    } catch (err: any) {
      toast({
        title: 'Failed to set default',
        description: err?.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRevokeFacility = async (facilityId: string) => {
    try {
      await revokeFacilityMutation.mutateAsync({ userId: params.userId, facilityId });
      toast({ title: 'Facility revoked', description: 'Facility access removed.' });
    } catch (err: any) {
      toast({
        title: 'Failed to revoke facility',
        description: err?.response?.data?.message || err.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">User not found</p>
              <p className="text-sm">The requested user could not be loaded.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push(`/${params.locale}/users`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${params.locale}/users`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
            Edit User
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {user.firstName || user.lastName
                  ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                  : user.email}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            </div>
            <Badge
              variant={
                user.status === 'active'
                  ? 'default'
                  : user.status === 'invited'
                  ? 'secondary'
                  : 'destructive'
              }
            >
              {user.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="mt-1 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                    {user.email}
                  </a>
                </p>
              </div>
              {(user.firstName || user.lastName) && (
                <>
                  {user.firstName && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">First Name</label>
                      <p className="mt-1">{user.firstName}</p>
                    </div>
                  )}
                  {user.lastName && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                      <p className="mt-1">{user.lastName}</p>
                    </div>
                  )}
                </>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="mt-1">
                  <Badge
                    variant={
                      user.status === 'active'
                        ? 'default'
                        : user.status === 'invited'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {user.status}
                  </Badge>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Staff Member
              </h3>
            </div>

            {user.staff ? (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-sm">
                        Linked
                      </Badge>
                      {user.staff.staffType && (
                        <Badge variant="secondary">{user.staff.staffType}</Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium">
                      {user.staff.displayName ||
                        `${user.staff.firstName} ${user.staff.lastName}`}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Employee ID: {user.staff.employeeId}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUnlinkDialog(true)}
                    disabled={unlinkStaffMutation.isPending}
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Unlink
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {!isLinking ? (
                  <div className="bg-muted/30 rounded-lg p-4 border-2 border-dashed">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">No Staff Member Linked</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Link this user to a staff member profile
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsLinking(true)}
                        disabled={isLoadingStaff}
                      >
                        <Link2 className="h-4 w-4 mr-2" />
                        Link Staff
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Select Staff Member
                      </label>
                      <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a staff member to link" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStaff.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {staff.displayName ||
                                    `${staff.firstName} ${staff.lastName}`}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {staff.employeeId} - {staff.staffType}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {availableStaff.length === 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          No available staff members. All staff are already linked to other users.
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleLinkStaff}
                        disabled={!selectedStaffId || linkStaffMutation.isPending}
                        size="sm"
                      >
                        {linkStaffMutation.isPending ? 'Linking...' : 'Link Staff'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsLinking(false);
                          setSelectedStaffId('');
                        }}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
          <CardDescription>Assign RBAC roles to control access.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userRoles.length ? (
            <div className="space-y-3">
              {userRoles.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="font-medium">{item.role.name}</div>
                    <div className="text-xs text-muted-foreground">{item.role.code}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveRole(item.role.id)}
                    disabled={removeRoleMutation.isPending}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No roles assigned yet.</p>
          )}

          <div className="border-t pt-4 space-y-3">
            <Label>Assign Role</Label>
            <div className="flex flex-col gap-2 md:flex-row">
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger className="md:w-80">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAssignRole} disabled={!selectedRoleId || assignRoleMutation.isPending}>
                Assign Role
              </Button>
            </div>
            {availableRoles.length === 0 && (
              <p className="text-xs text-muted-foreground">All tenant roles are already assigned.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Facility Access</CardTitle>
          <CardDescription>Manage facility assignments and default access.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userFacilities?.facilities?.length ? (
            <div className="space-y-3">
              {userFacilities.facilities.map((facility) => (
                <div key={facility.id} className="flex flex-col gap-3 rounded-md border p-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-medium">{facility.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {facility.city || '—'} · {facility.emirate || '—'}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">{facility.accessLevel || 'standard'}</Badge>
                      {facility.isDefault && <Badge>Default</Badge>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!facility.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefaultFacility(facility.id)}
                        disabled={setDefaultFacilityMutation.isPending}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeFacility(facility.id)}
                      disabled={revokeFacilityMutation.isPending}
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No facility access assigned yet.</p>
          )}

          <div className="border-t pt-4 space-y-3">
            <Label>Assign Facility</Label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Select value={selectedFacilityId} onValueChange={setSelectedFacilityId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  {availableFacilities.map((facility) => (
                    <SelectItem key={facility.id} value={facility.id}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={accessLevel} onValueChange={(value) => setAccessLevel(value as typeof accessLevel)}>
                <SelectTrigger>
                  <SelectValue placeholder="Access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="read_only">Read only</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                <Switch checked={setAsDefault} onCheckedChange={setSetAsDefault} />
                <span className="text-sm">Set as default</span>
              </div>
            </div>
            <Button
              onClick={handleAssignFacility}
              disabled={!selectedFacilityId || assignFacilityMutation.isPending}
            >
              Assign Facility
            </Button>
            {availableFacilities.length === 0 && (
              <p className="text-xs text-muted-foreground">All tenant facilities are already assigned.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Created: </span>
            {new Date(user.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Last Updated: </span>
            {new Date(user.updatedAt).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlink the staff member{' '}
              <strong>
                {user.staff?.displayName ||
                  `${user.staff?.firstName} ${user.staff?.lastName}`}
              </strong>{' '}
              from this user account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnlinkStaff}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {unlinkStaffMutation.isPending ? 'Unlinking...' : 'Unlink'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update profile details and status.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdateUser)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input id="edit-firstName" {...register('firstName')} />
                {editErrors.firstName && (
                  <p className="text-xs text-destructive mt-1">{editErrors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input id="edit-lastName" {...register('lastName')} />
                {editErrors.lastName && (
                  <p className="text-xs text-destructive mt-1">{editErrors.lastName.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" {...register('email')} />
              {editErrors.email && (
                <p className="text-xs text-destructive mt-1">{editErrors.email.message}</p>
              )}
            </div>
            <div>
              <Label>Status</Label>
              <input type="hidden" {...register('status')} />
              <Select
                value={statusValue ?? user.status}
                onValueChange={(value) => setValue('status', value as EditUserForm['status'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              {editErrors.status && (
                <p className="text-xs text-destructive mt-1">{editErrors.status.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the user account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
