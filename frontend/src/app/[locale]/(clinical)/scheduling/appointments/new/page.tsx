'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, User, FileText, ArrowLeft } from 'lucide-react';

import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

import { useBookAppointment } from '@/modules/clinical/hooks/use-appointments';
import { usePatients } from '@/modules/clinical/hooks/use-patients';
import { useScheduledStaff } from '@/modules/clinical/hooks/use-staff-schedules';
import type { BookAppointmentInput } from '@/modules/clinical/types/scheduling';

const bookAppointmentSchema = z.object({
  patientId: z.string().uuid('Please select a patient'),
  appointmentType: z.string().min(1, 'Appointment type is required'),
  appointmentDate: z.date({
    required_error: 'Appointment date is required',
  }),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  staffId: z.string().uuid().optional(),
  visitType: z.string().optional(),
  notes: z.string().optional(),
  autoAllocateResources: z.boolean().default(false),
});

type BookAppointmentFormValues = z.infer<typeof bookAppointmentSchema>;

const APPOINTMENT_TYPES = [
  { value: 'general_checkup', label: 'General Checkup' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'lab_test', label: 'Lab Test' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'emergency', label: 'Emergency' },
];

const VISIT_TYPES = [
  { value: 'in-person', label: 'In-Person' },
  { value: 'telemedicine', label: 'Telemedicine' },
  { value: 'home_visit', label: 'Home Visit' },
];

export default function NewAppointmentPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const publishToast = useToast();
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(patientSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [patientSearchQuery]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookAppointmentFormValues>({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      appointmentType: '',
      visitType: 'in-person',
      autoAllocateResources: false,
    },
  });

  const selectedDate = watch('appointmentDate');

  // Fetch patients for search (using debounced query)
  const { data: patientsData } = usePatients({
    search: debouncedSearchQuery,
    limit: 20,
  });

  // Fetch staff for selection
  const { data: scheduledStaff } = useScheduledStaff();

  const bookAppointmentMutation = useBookAppointment();

  const onSubmit = async (data: BookAppointmentFormValues) => {
    try {
      // Combine date and times
      const startDateTime = new Date(data.appointmentDate);
      const [startHour, startMinute] = data.startTime.split(':');
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

      const endDateTime = new Date(data.appointmentDate);
      const [endHour, endMinute] = data.endTime.split(':');
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

      const payload: BookAppointmentInput = {
        patientId: data.patientId,
        appointmentType: data.appointmentType,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        notes: data.notes,
        visitType: data.visitType,
        autoAllocateResources: data.autoAllocateResources,
      };

      if (data.staffId) {
        payload.staffId = data.staffId;
      }

      const result = await bookAppointmentMutation.mutateAsync(payload);

      publishToast({
        title: 'Appointment Booked',
        description: 'The appointment has been successfully booked.',
      });

      router.push(`/${params.locale}/scheduling/appointments/${result.id}`);
    } catch (error: any) {
      publishToast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to book appointment',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${params.locale}/scheduling/appointments`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Breadcrumb
          items={[
            { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
            { href: `/${params.locale}/scheduling/appointments`, label: 'Appointments' },
            { label: 'Book Appointment' },
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book New Appointment</CardTitle>
          <CardDescription>Schedule a new appointment for a patient</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Selection */}
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient *</Label>
              <Controller
                name="patientId"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Input
                      placeholder="Search patient by name, MRN, or ID..."
                      value={patientSearchQuery}
                      onChange={(e) => setPatientSearchQuery(e.target.value)}
                    />
                    <Select onValueChange={field.onChange} value={field.value}>
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

            {/* Appointment Type */}
            <div className="space-y-2">
              <Label htmlFor="appointmentType">Appointment Type *</Label>
              <Controller
                name="appointmentType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPOINTMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.appointmentType && (
                <p className="text-sm text-destructive">{errors.appointmentType.message}</p>
              )}
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Appointment Date *</Label>
              <Controller
                name="appointmentDate"
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
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.appointmentDate && (
                <p className="text-sm text-destructive">{errors.appointmentDate.message}</p>
              )}
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    className="pl-10"
                    {...register('startTime')}
                  />
                </div>
                {errors.startTime && (
                  <p className="text-sm text-destructive">{errors.startTime.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    className="pl-10"
                    {...register('endTime')}
                  />
                </div>
                {errors.endTime && (
                  <p className="text-sm text-destructive">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {/* Staff Selection */}
            <div className="space-y-2">
              <Label htmlFor="staffId">Preferred Staff (Optional)</Label>
              <Controller
                name="staffId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="No preference - any available staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {scheduledStaff?.map((staff) => {
                        const label = staff.staffDisplayName || staff.employeeId || 'Staff member';
                        const typeLabel = staff.staffType ? ` (${staff.staffType})` : '';
                        return (
                          <SelectItem key={staff.staffId} value={staff.staffId}>
                            {label}{typeLabel}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Visit Type */}
            <div className="space-y-2">
              <Label htmlFor="visitType">Visit Type</Label>
              <Controller
                name="visitType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visit type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISIT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this appointment..."
                rows={4}
                {...register('notes')}
              />
            </div>

            {/* Auto-allocate Resources */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoAllocateResources"
                className="h-4 w-4"
                {...register('autoAllocateResources')}
              />
              <Label htmlFor="autoAllocateResources" className="cursor-pointer">
                Automatically allocate resources (staff, equipment, space)
              </Label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${params.locale}/scheduling/appointments`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
