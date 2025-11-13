'use client';

import { useRouter } from 'next/navigation';
import type { AxiosError } from 'axios';
import { format } from 'date-fns';
import { ArrowLeft, User, Calendar, FileText, Stethoscope } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

import { useEncounter, useUpdateEncounterStatus } from '@/modules/clinical/hooks/use-encounters';
import { EncounterStatus } from '@/modules/clinical/types/encounter';
import { useStaff } from '@/modules/foundation/hooks/use-staff';
import type { StaffMember } from '@/modules/foundation/types/staff';

const STATUS_COLORS: Record<string, string> = {
  planned: 'bg-blue-100 text-blue-800',
  arrived: 'bg-purple-100 text-purple-800',
  triaged: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-green-100 text-green-800',
  finished: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function EncounterDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const router = useRouter();
  const toast = useToast();
  const { data: encounter, isLoading } = useEncounter(params.id);
  const updateStatusMutation = useUpdateEncounterStatus();

  // Fetch staff data to get primary staff name
  const { data: staffData } = useStaff({ status: 'active' });

  const staffList = staffData?.data as StaffMember[] | undefined;
  const primaryStaff = staffList?.find((staff) => staff.id === encounter?.primaryStaffId);
  const primaryStaffName = primaryStaff?.displayName ||
    (primaryStaff ? `${primaryStaff.firstName} ${primaryStaff.lastName}` : 'Unknown Staff');

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: params.id,
        status: newStatus,
      });

      toast({
        title: 'Status Updated',
        description: `Encounter status changed to ${newStatus}`,
      });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast({
        variant: 'destructive',
        title: 'Error',
        description: axiosError?.response?.data?.message || 'Failed to update status',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Loading encounter details...</div>
      </div>
    );
  }

  if (!encounter) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">Encounter not found</h3>
        <Button onClick={() => router.push(`/${params.locale}/encounters`)}>
          Back to Encounters
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
    return (
      <Badge variant="outline" className={colorClass}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${params.locale}/encounters`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Encounter Details</h1>
          <p className="text-muted-foreground">
            {encounter.patient?.displayName ||
              `${encounter.patient?.title ? encounter.patient.title + '. ' : ''}${encounter.patient?.firstName} ${encounter.patient?.lastName}`}{' '}
            - MRN: {encounter.patient?.mrn}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Encounter #: <span className="font-mono">{encounter.encounterNumber}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/${params.locale}/encounters/${params.id}/triage`)}>
            Triage
          </Button>
          <Select value={encounter.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EncounterStatus.PLANNED}>Planned</SelectItem>
              <SelectItem value={EncounterStatus.ARRIVED}>Arrived</SelectItem>
              <SelectItem value={EncounterStatus.TRIAGED}>Triaged</SelectItem>
              <SelectItem value={EncounterStatus.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={EncounterStatus.FINISHED}>Finished</SelectItem>
              <SelectItem value={EncounterStatus.CANCELLED}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Encounter Information */}
        <Card>
          <CardHeader>
            <CardTitle>Encounter Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <div className="mt-1">{getStatusBadge(encounter.status)}</div>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium text-muted-foreground">Encounter Class</div>
              <div className="mt-1">
                <Badge variant="secondary">{encounter.encounterClass}</Badge>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">Priority</div>
              <div className="mt-1 capitalize">{encounter.priority}</div>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium text-muted-foreground">Start Time</div>
              <div className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {format(new Date(encounter.startTime), 'PPP p')}
              </div>
            </div>

            {encounter.endTime && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">End Time</div>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(encounter.endTime), 'PPP p')}
                </div>
              </div>
            )}

            <div>
              <div className="text-sm font-medium text-muted-foreground">Source</div>
              <div className="mt-1 capitalize">{encounter.encounterSource}</div>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium text-muted-foreground">Primary Staff</div>
              <div className="mt-1 flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                {primaryStaffName}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div className="mt-1 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {encounter.patient?.displayName ||
                  `${encounter.patient?.title ? encounter.patient.title + '. ' : ''}${encounter.patient?.firstName}${encounter.patient?.middleName ? ' ' + encounter.patient.middleName : ''} ${encounter.patient?.lastName}`}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">MRN</div>
              <div className="mt-1">{encounter.patient?.mrn}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">Date of Birth</div>
              <div className="mt-1">
                {encounter.patient?.dateOfBirth
                  ? format(new Date(encounter.patient.dateOfBirth), 'PPP')
                  : '-'}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">Gender</div>
              <div className="mt-1 capitalize">{encounter.patient?.gender}</div>
            </div>

            {encounter.patient?.phoneNumber && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Phone</div>
                <div className="mt-1">{encounter.patient.phoneNumber}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
