'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Search } from 'lucide-react';

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
import { AppCalendar as Calendar } from '@/components/ui/app-calendar';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

import { useBookAppointment } from '@/modules/clinical/hooks/use-appointments';
import { usePatients } from '@/modules/clinical/hooks/use-patients';
import { useScheduledStaff } from '@/modules/clinical/hooks/use-staff-schedules';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
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
  { value: 'telemedicine', label: 'Telehealth' },
  { value: 'home_visit', label: 'Home Visit' },
];

export default function NewAppointmentPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const publishToast = useToast();
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const debouncedSearchQuery = useDebouncedValue(patientSearchQuery, 300);

  const {
    register,
    control,
    handleSubmit,
    setValue,
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

  const { data: patientsData } = usePatients({
    search: debouncedSearchQuery,
    limit: 20,
  });

  const { data: scheduledStaff } = useScheduledStaff();

  const bookAppointmentMutation = useBookAppointment();

  const onSubmit = async (data: BookAppointmentFormValues) => {
    try {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6 py-5">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(`/${params.locale}/scheduling/appointments`)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Book New Appointment</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Schedule a new appointment for a patient with key details in one place.
          </p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <section className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Search Patient *</Label>
                  <Controller
                    name="patientId"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                          <Input
                            placeholder="Search by name, MRN, or ID"
                            value={patientSearchQuery}
                            onChange={(e) => setPatientSearchQuery(e.target.value)}
                            className="pl-9"
                          />
                        </div>
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
                        <p className="text-xs text-slate-400 dark:text-slate-500">Example: John Doe, 102938</p>
                      </div>
                    )}
                  />
                  {errors.patientId && (
                    <p className="text-sm text-destructive">{errors.patientId.message}</p>
                  )}
                </div>

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
              </div>
            </section>

            <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-2 lg:col-span-1">
                <Label>Select Date *</Label>
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{selectedDate ? format(selectedDate, 'PPP') : 'Choose a date'}</span>
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(value) => {
                      if (value) {
                        setValue('appointmentDate', value);
                      }
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="mt-3"
                  />
                </div>
                {errors.appointmentDate && (
                  <p className="text-sm text-destructive">{errors.appointmentDate.message}</p>
                )}
              </div>

              <div className="space-y-6 lg:col-span-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <Input id="startTime" type="time" className="pl-10" {...register('startTime')} />
                    </div>
                    {errors.startTime && (
                      <p className="text-sm text-destructive">{errors.startTime.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <Input id="endTime" type="time" className="pl-10" {...register('endTime')} />
                    </div>
                    {errors.endTime && (
                      <p className="text-sm text-destructive">{errors.endTime.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Visit Type</Label>
                  <Controller
                    name="visitType"
                    control={control}
                    render={({ field }) => (
                      <div className="grid gap-3 sm:grid-cols-3">
                        {VISIT_TYPES.map((type) => {
                          const isActive = field.value === type.value;
                          return (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => field.onChange(type.value)}
                              className={cn(
                                'flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition',
                                isActive
                                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800'
                              )}
                            >
                              <span
                                className={cn(
                                  'h-2.5 w-2.5 rounded-full border',
                                  isActive
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-slate-300 dark:border-slate-600'
                                )}
                              />
                              {type.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

            <section className="grid gap-6 lg:grid-cols-2">
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

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                <input
                  type="checkbox"
                  id="autoAllocateResources"
                  className="h-4 w-4"
                  {...register('autoAllocateResources')}
                />
                <Label htmlFor="autoAllocateResources" className="cursor-pointer text-sm text-slate-600 dark:text-slate-300">
                  Automatically allocate resources (staff, equipment, space)
                </Label>
              </div>
            </section>

            <section className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this appointment..."
                rows={4}
                {...register('notes')}
              />
            </section>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
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
        </div>
      </div>
    </div>
  );
}
