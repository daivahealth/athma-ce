'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, User, Calendar, FileText, Activity, Edit, Stethoscope } from 'lucide-react';

import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Get primary staff name
  const primaryStaff = staffData?.data?.find((s: any) => s.id === encounter?.primaryStaffId);
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
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update status',
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
        <Breadcrumb
          items={[
            { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
            { href: `/${params.locale}/encounters`, label: 'Encounters' },
            { label: 'Encounter Details' },
          ]}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Encounter Details</h1>
          <p className="text-muted-foreground">
            {encounter.patient?.displayName ||
              `${encounter.patient?.title ? encounter.patient.title + '. ' : ''}${encounter.patient?.firstName} ${encounter.patient?.lastName}`}{' '}
            - MRN: {encounter.patient?.mrn}
          </p>
        </div>
        <div className="flex gap-2">
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

      {/* Clinical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {encounter.chiefComplaint && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">Chief Complaint</div>
              <div className="mt-1">{encounter.chiefComplaint}</div>
            </div>
          )}

          {encounter.presentingSymptoms && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">Presenting Symptoms</div>
              <div className="mt-1 whitespace-pre-wrap">{encounter.presentingSymptoms}</div>
            </div>
          )}

          {encounter.notes && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">Notes</div>
              <div className="mt-1 whitespace-pre-wrap">{encounter.notes}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vital Signs */}
      {encounter.vitalSigns && Object.keys(encounter.vitalSigns).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Vital Signs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {encounter.vitalSigns.temperature && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Temperature</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {encounter.vitalSigns.temperature}°C
                  </div>
                </div>
              )}

              {encounter.vitalSigns.heartRate && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Heart Rate</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {encounter.vitalSigns.heartRate} bpm
                  </div>
                </div>
              )}

              {encounter.vitalSigns.bloodPressureSystolic &&
                encounter.vitalSigns.bloodPressureDiastolic && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Blood Pressure</div>
                    <div className="mt-1 text-2xl font-semibold">
                      {encounter.vitalSigns.bloodPressureSystolic}/
                      {encounter.vitalSigns.bloodPressureDiastolic}
                    </div>
                  </div>
                )}

              {encounter.vitalSigns.respiratoryRate && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Respiratory Rate</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {encounter.vitalSigns.respiratoryRate}/min
                  </div>
                </div>
              )}

              {encounter.vitalSigns.oxygenSaturation && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">O2 Saturation</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {encounter.vitalSigns.oxygenSaturation}%
                  </div>
                </div>
              )}

              {encounter.vitalSigns.weight && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Weight</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {encounter.vitalSigns.weight} kg
                  </div>
                </div>
              )}

              {encounter.vitalSigns.height && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Height</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {encounter.vitalSigns.height} cm
                  </div>
                </div>
              )}

              {encounter.vitalSigns.bmi && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">BMI</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {encounter.vitalSigns.bmi.toFixed(1)}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
