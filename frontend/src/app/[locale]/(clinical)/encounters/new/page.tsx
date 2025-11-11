'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ArrowLeft, User, Stethoscope } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
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
  chiefComplaint: z.string().optional(),
  presentingSymptoms: z.string().optional(),
  notes: z.string().optional(),
  // Vital Signs
  temperature: z.string().optional(),
  bloodPressureSystolic: z.string().optional(),
  bloodPressureDiastolic: z.string().optional(),
  heartRate: z.string().optional(),
  respiratoryRate: z.string().optional(),
  oxygenSaturation: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
});

type CreateEncounterFormValues = z.infer<typeof createEncounterSchema>;

export default function NewEncounterPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');

  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Fetch appointment data if appointmentId is provided
  const { data: appointmentData, isLoading: isLoadingAppointment } = useAppointment(
    appointmentId || '',
    { enabled: !!appointmentId }
  );

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(patientSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [patientSearchQuery]);

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
    }
  }, [appointmentData]);

  const {
    register,
    control,
    handleSubmit,
    watch,
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

  // Fetch patients for search
  const { data: patientsData } = usePatients({
    search: debouncedSearchQuery,
    limit: 20,
  });

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

      // Build vital signs if any are provided
      const vitalSigns: any = {};
      if (data.temperature) vitalSigns.temperature = parseFloat(data.temperature);
      if (data.bloodPressureSystolic) vitalSigns.bloodPressureSystolic = parseInt(data.bloodPressureSystolic);
      if (data.bloodPressureDiastolic) vitalSigns.bloodPressureDiastolic = parseInt(data.bloodPressureDiastolic);
      if (data.heartRate) vitalSigns.heartRate = parseInt(data.heartRate);
      if (data.respiratoryRate) vitalSigns.respiratoryRate = parseInt(data.respiratoryRate);
      if (data.oxygenSaturation) vitalSigns.oxygenSaturation = parseFloat(data.oxygenSaturation);
      if (data.weight) vitalSigns.weight = parseFloat(data.weight);
      if (data.height) vitalSigns.height = parseFloat(data.height);

      // Calculate BMI if weight and height provided
      if (vitalSigns.weight && vitalSigns.height) {
        const heightInMeters = vitalSigns.height / 100;
        vitalSigns.bmi = vitalSigns.weight / (heightInMeters * heightInMeters);
      }

      const payload: CreateEncounterInput = {
        patientId: data.patientId,
        primaryStaffId: data.primaryStaffId,
        appointmentId: appointmentId || undefined,
        encounterClass: data.encounterClass as any,
        status: data.status as any,
        priority: data.priority as any,
        encounterSource: data.encounterSource as any,
        startTime: startDateTime.toISOString(),
        chiefComplaint: data.chiefComplaint,
        presentingSymptoms: data.presentingSymptoms,
        vitalSigns: Object.keys(vitalSigns).length > 0 ? vitalSigns : undefined,
        notes: data.notes,
      };

      const result = await createEncounterMutation.mutateAsync(payload);

      toast({
        title: 'Encounter Created',
        description: 'The encounter has been successfully created.',
      });

      router.push(`/${params.locale}/encounters/${result.id}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create encounter',
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
              <Label htmlFor="patientId">Patient *</Label>
              <Controller
                name="patientId"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Input
                      placeholder="Search patient by name, MRN..."
                      value={patientSearchQuery}
                      onChange={(e) => setPatientSearchQuery(e.target.value)}
                      disabled={!!appointmentData}
                    />
                    <Select onValueChange={field.onChange} value={field.value} disabled={!!appointmentData}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patientsData?.data?.map((patient: any) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.firstName} {patient.lastName} - MRN: {patient.mrn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
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
                          initialFocus
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

        {/* Clinical Information */}
        <Card>
          <CardHeader>
            <CardTitle>Clinical Information</CardTitle>
            <CardDescription>Record chief complaint and presenting symptoms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chiefComplaint">Chief Complaint</Label>
              <Input
                id="chiefComplaint"
                placeholder="e.g., Fever and cough"
                {...register('chiefComplaint')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presentingSymptoms">Presenting Symptoms</Label>
              <Textarea
                id="presentingSymptoms"
                placeholder="Describe symptoms in detail..."
                rows={3}
                {...register('presentingSymptoms')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes..."
                rows={4}
                {...register('notes')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vital Signs */}
        <Card>
          <CardHeader>
            <CardTitle>Vital Signs (Optional)</CardTitle>
            <CardDescription>Record patient vital signs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="36.5"
                  {...register('temperature')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="72"
                  {...register('heartRate')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodPressureSystolic">BP Systolic (mmHg)</Label>
                <Input
                  id="bloodPressureSystolic"
                  type="number"
                  placeholder="120"
                  {...register('bloodPressureSystolic')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodPressureDiastolic">BP Diastolic (mmHg)</Label>
                <Input
                  id="bloodPressureDiastolic"
                  type="number"
                  placeholder="80"
                  {...register('bloodPressureDiastolic')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  placeholder="16"
                  {...register('respiratoryRate')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  type="number"
                  step="0.1"
                  placeholder="98"
                  {...register('oxygenSaturation')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70"
                  {...register('weight')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  placeholder="170"
                  {...register('height')}
                />
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
