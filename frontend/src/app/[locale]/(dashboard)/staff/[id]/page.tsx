'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { staffService } from '@/modules/foundation/services/staff-service';
import { useUsers, useLinkStaff, useUnlinkStaff } from '@/modules/foundation/hooks/use-user';
import type { StaffMember } from '@/modules/foundation/types/staff';
import { ArrowLeft, Mail, Phone, Calendar, FileText, User, Link2, Unlink, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';

export default function StaffDetailPage({ params }: { params: { locale: string; id: string } }) {
  const router = useRouter();
  const session = getSession();
  const claims = decodeAccessToken(session.accessToken);
  const tenantId = claims?.tenantId;

  const [isLinking, setIsLinking] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);

  const { data: staff, isLoading, error } = useQuery<StaffMember>({
    queryKey: ['staff', params.id],
    queryFn: () => staffService.getById(params.id),
  });

  const { data: users = [], isLoading: isLoadingUsers } = useUsers(tenantId);
  const linkStaffMutation = useLinkStaff();
  const unlinkStaffMutation = useUnlinkStaff();

  const availableUsers = users.filter(u => !u.staffId || u.staffId === params.id);

  const handleLinkUser = async () => {
    if (!selectedUserId) return;

    try {
      await linkStaffMutation.mutateAsync({
        userId: selectedUserId,
        staffId: params.id,
      });
      setIsLinking(false);
      setSelectedUserId('');
    } catch (error) {
      console.error('Failed to link user:', error);
    }
  };

  const handleUnlinkUser = async () => {
    if (!staff?.user?.id) return;

    try {
      await unlinkStaffMutation.mutateAsync(staff.user.id);
      setShowUnlinkDialog(false);
    } catch (error) {
      console.error('Failed to unlink user:', error);
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

  if (error || !staff) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">Staff member not found</p>
              <p className="text-sm">The requested staff member could not be loaded.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push(`/${params.locale}/staff`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Staff List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const primarySpecialty = staff.staffSpecialties?.find(s => s.primaryFlag);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${params.locale}/staff`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {staff.displayName || `${staff.firstName} ${staff.lastName}`}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{staff.employeeId}</p>
            </div>
            <Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>
              {staff.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                <p className="mt-1 font-mono">{staff.employeeId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Staff Type</label>
                <p className="mt-1">
                  <Badge variant="outline">{staff.staffType || 'Not specified'}</Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p className="mt-1 capitalize">{staff.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                <p className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(staff.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Qualification</label>
                <p className="mt-1">{staff.qualification || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staff.email && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${staff.email}`} className="text-blue-600 hover:underline">
                      {staff.email}
                    </a>
                  </p>
                </div>
              )}
              {staff.phoneNumber && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${staff.phoneNumber}`} className="text-blue-600 hover:underline">
                      {staff.phoneNumber}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* User Account Mapping */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                User Account
              </h3>
            </div>

            {staff.user ? (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-sm">
                        Linked
                      </Badge>
                      <Badge variant={staff.user.status === 'active' ? 'default' : 'secondary'}>
                        {staff.user.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{staff.user.email}</p>
                    {(staff.user.firstName || staff.user.lastName) && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {staff.user.firstName} {staff.user.lastName}
                      </p>
                    )}
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
                        <p className="text-sm font-medium">No User Account Linked</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Link this staff member to a user account to grant system access
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsLinking(true)}
                        disabled={isLoadingUsers}
                      >
                        <Link2 className="h-4 w-4 mr-2" />
                        Link User
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Select User Account
                      </label>
                      <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a user to link" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{user.email}</span>
                                {(user.firstName || user.lastName) && (
                                  <span className="text-xs text-muted-foreground">
                                    {user.firstName} {user.lastName}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {availableUsers.length === 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          No available users. All users are already linked to other staff members.
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleLinkUser}
                        disabled={!selectedUserId || linkStaffMutation.isPending}
                        size="sm"
                      >
                        {linkStaffMutation.isPending ? 'Linking...' : 'Link User'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsLinking(false);
                          setSelectedUserId('');
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

          {/* Languages */}
          {staff.languages && staff.languages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {staff.languages.map((language) => (
                  <Badge key={language} variant="secondary">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Specialty Information */}
          {primarySpecialty && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Primary Specialty</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-base px-3 py-1">
                  {primarySpecialty.specialty.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ({primarySpecialty.specialty.code})
                </span>
              </div>
            </div>
          )}

          {/* License Information */}
          {staff.licenseNumber && (
            <div>
              <h3 className="text-lg font-semibold mb-3">License Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">License Number</label>
                  <p className="mt-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {staff.licenseNumber}
                  </p>
                </div>
                {staff.licenseExpiry && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">License Expiry</label>
                    <p className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(staff.licenseExpiry).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Created: </span>
                {new Date(staff.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Last Updated: </span>
                {new Date(staff.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unlink Confirmation Dialog */}
      <AlertDialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlink the user account{' '}
              <strong>{staff?.user?.email}</strong> from this staff member? This will
              revoke their system access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnlinkUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {unlinkStaffMutation.isPending ? 'Unlinking...' : 'Unlink'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
