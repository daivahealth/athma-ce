'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { staffService } from '@/modules/foundation/services/staff-service';
import type { StaffMember } from '@/modules/foundation/types/staff';
import { ArrowLeft, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StaffDetailPage({ params }: { params: { locale: string; id: string } }) {
  const router = useRouter();

  const { data: staff, isLoading, error } = useQuery<StaffMember>({
    queryKey: ['staff', params.id],
    queryFn: () => staffService.getById(params.id),
  });

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
    </div>
  );
}
