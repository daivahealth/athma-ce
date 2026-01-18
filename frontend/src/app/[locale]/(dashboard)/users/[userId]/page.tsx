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
import { useUser, useLinkStaff, useUnlinkStaff } from '@/modules/foundation/hooks/use-user';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import { ArrowLeft, Mail, Calendar, User as UserIcon, Link2, Unlink, AlertCircle, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserDetailPage({ params }: { params: { locale: string; userId: string } }) {
  const router = useRouter();
  const [isLinking, setIsLinking] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);

  const { data: user, isLoading, error } = useUser(params.userId);
  const { data: staffList = [], isLoading: isLoadingStaff } = useStaffList();
  const linkStaffMutation = useLinkStaff();
  const unlinkStaffMutation = useUnlinkStaff();

  const availableStaff = staffList.filter((s) => !s.user || s.id === user?.staffId);

  const handleLinkStaff = async () => {
    if (!selectedStaffId) return;

    try {
      await linkStaffMutation.mutateAsync({
        userId: params.userId,
        staffId: selectedStaffId,
      });
      setIsLinking(false);
      setSelectedStaffId('');
    } catch (error) {
      console.error('Failed to link staff:', error);
    }
  };

  const handleUnlinkStaff = async () => {
    try {
      await unlinkStaffMutation.mutateAsync(params.userId);
      setShowUnlinkDialog(false);
    } catch (error) {
      console.error('Failed to unlink staff:', error);
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${params.locale}/users`)}
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
          {/* Basic Information */}
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

          {/* Staff Member Mapping */}
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

          {/* Metadata */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Created: </span>
                {new Date(user.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Last Updated: </span>
                {new Date(user.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unlink Confirmation Dialog */}
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
    </div>
  );
}
