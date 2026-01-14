'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import type { AxiosError } from 'axios';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppCalendar as Calendar } from '@/components/ui/app-calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

import { useCreateEncounter } from '@/modules/clinical/hooks/use-encounters';
import { usePatients } from '@/modules/clinical/hooks/use-patients';
import { useStaff } from '@/modules/foundation/hooks/use-staff';
import { useAppointment } from '@/modules/clinical/hooks/use-appointments';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { CreateEncounterInput } from '@/modules/clinical/types/encounter';
import { EncounterClass, EncounterStatus, EncounterPriority, EncounterSource } from '@/modules/clinical/types/encounter';

const createEncounterSchema = z.object({
  patientId: z.string().uuid('Please select a patient'),
  primaryStaffId: z.string().uuid('Please select a staff member'),
  encounterClass: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  encounterSource: z.string().optional(),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
});

type CreateEncounterFormValues = z.infer<typeof createEncounterSchema>;

function NewEncounterPageContent({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');

  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const debouncedSearchQuery = useDebouncedValue(patientSearchQuery, 300);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  // Fetch appointment data if appointmentId is provided
  const { data: appointmentData } = useAppointment(appointmentId || undefined);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateEncounterFormValues>({
    resolver: zodResolver(createEncounterSchema),
    defaultValues: {
      encounterClass: EncounterClass.AMB,
      status: EncounterStatus.PLANNED,
      priority: EncounterPriority.ROUTINE,
      encounterSource: EncounterSource.APPOINTMENT,
    },
  });

  // Pre-fill form when appointment data is loaded
  useEffect(() => {
    if (appointmentData) {
      const appointmentStart = new Date(appointmentData.startTime);
      const startDate = new Date(appointmentStart);
      const startTime = format(appointmentStart, 'HH:mm');

      setValue('patientId', appointmentData.patientId);
      setValue('primaryStaffId', appointmentData.staffId || '');
      setValue('startDate', startDate);
      setValue('startTime', startTime);
      setValue('encounterSource', EncounterSource.APPOINTMENT);
      if (appointmentData.patient) {
        setSelectedPatient(appointmentData.patient);
      }
    }
  }, [appointmentData, setValue]);

  // Fetch patients for search
  const { data: patientsData, isLoading: isPatientsLoading } = usePatients({
    search: debouncedSearchQuery,
    limit: 20,
  });

  const patientResults = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return [];
    return (patientsData?.data as any[] | undefined) ?? [];
  }, [debouncedSearchQuery, patientsData]);

  // Fetch staff for selection
  const { data: staffData } = useStaff({
    status: 'active',
  });

  const createEncounterMutation = useCreateEncounter();

  const onSubmit = async (data: CreateEncounterFormValues) => {
    try {
      // Combine date and time
      const startDateTime = new Date(data.startDate);
      const [startHour, startMinute] = data.startTime.split(':');
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

      const payload: CreateEncounterInput = {
        patientId: data.patientId,
        primaryStaffId: data.primaryStaffId,
        appointmentId: appointmentId || undefined,
        encounterClass: data.encounterClass as any,
        status: data.status as any,
        priority: data.priority as any,
        encounterSource: data.encounterSource as any,
        startTime: startDateTime.toISOString(),
      };

      const result = await createEncounterMutation.mutateAsync(payload);

      toast({
        title: 'Encounter Created',
        description: 'The encounter has been successfully created.',
      });

      router.push(`/${params.locale}/encounters/${result.id}`);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast({
        variant: 'destructive',
        title: 'Error',
        description: axiosError?.response?.data?.message || 'Failed to create encounter',
      });
    }
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

      {appointmentData && (
        <Alert>
          <CalendarIcon className="h-4 w-4" />
          <AlertDescription>
            Creating encounter from appointment scheduled for{' '}
            {format(new Date(appointmentData.startTime), 'PPP p')}. Patient and staff information
            has been pre-filled from the appointment.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient and Staff Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Encounter Details</CardTitle>
            <CardDescription>Select patient and primary staff for this encounter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Patient Selection */}
            <div className="space-y-2">
              <Label htmlFor="patientSearch">Patient *</Label>
              {!selectedPatient && (
                <>
                  <Input
                    id="patientSearch"
                    placeholder="Search by name, MRN, or mobile"
                    value={patientSearchQuery}
                    onChange={(event) => {
                      setPatientSearchQuery(event.target.value);
                      setSelectedPatient(null);
                      setValue('patientId', '');
                    }}
                    disabled={!!appointmentData}
                  />
                  {isPatientsLoading && (
                    <p className="text-xs text-muted-foreground">Searching patients...</p>
                  )}
                  {!isPatientsLoading && debouncedSearchQuery.trim() !== '' && patientResults.length === 0 && (
                    <p className="text-xs text-muted-foreground">No patients found.</p>
                  )}
                  {patientResults.length > 0 && (
                    <div className="max-h-40 overflow-auto rounded-md border p-2">
                      {patientResults.map((patient: any) => (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => {
                            setSelectedPatient(patient);
                            setValue('patientId', patient.id, { shouldValidate: true });
                            setPatientSearchQuery('');
                          }}
                          className="flex w-full flex-col items-start gap-1 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                        >
                          <span className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            MRN: {patient.mrn} · Mobile: {patient.phoneNumber ?? 'N/A'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              {selectedPatient && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/30 p-3 text-sm">
                  <div>
                    <p className="font-medium">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MRN: {selectedPatient.mrn} · Mobile: {selectedPatient.phoneNumber ?? 'N/A'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPatient(null);
                      setPatientSearchQuery('');
                      setValue('patientId', '');
                    }}
                    disabled={!!appointmentData}
                  >
                    Change
                  </Button>
                </div>
              )}
              <input type="hidden" {...register('patientId')} />
              {errors.patientId && (
                <p className="text-sm text-destructive">{errors.patientId.message}</p>
              )}
            </div>

            {/* Primary Staff */}
            <div className="space-y-2">
              <Label htmlFor="primaryStaffId">Primary Staff *</Label>
              <Controller
                name="primaryStaffId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={!!appointmentData}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffData?.data?.map((staff: any) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.displayName || `${staff.firstName} ${staff.lastName}`} - {staff.staffType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.primaryStaffId && (
                <p className="text-sm text-destructive">{errors.primaryStaffId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Encounter Class */}
              <div className="space-y-2">
                <Label>Encounter Class</Label>
                <Controller
                  name="encounterClass"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EncounterClass.AMB}>Ambulatory</SelectItem>
                        <SelectItem value={EncounterClass.EMER}>Emergency</SelectItem>
                        <SelectItem value={EncounterClass.VR}>Virtual</SelectItem>
                        <SelectItem value={EncounterClass.IMP}>Inpatient</SelectItem>
                        <SelectItem value={EncounterClass.HH}>Home Health</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label>Priority</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EncounterPriority.ROUTINE}>Routine</SelectItem>
                        <SelectItem value={EncounterPriority.URGENT}>Urgent</SelectItem>
                        <SelectItem value={EncounterPriority.ASAP}>ASAP</SelectItem>
                        <SelectItem value={EncounterPriority.STAT}>STAT</SelectItem>
                        <SelectItem value={EncounterPriority.ELECTIVE}>Elective</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Start Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={!!appointmentData}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register('startTime')}
                  disabled={!!appointmentData}
                />
                {errors.startTime && (
                  <p className="text-sm text-destructive">{errors.startTime.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${params.locale}/encounters`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Encounter'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewEncounterPage({ params }: { params: { locale: string } }) {
  return (
    <Suspense fallback={null}>
      <NewEncounterPageContent params={params} />
    </Suspense>
  );
}
