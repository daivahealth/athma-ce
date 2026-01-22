'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';

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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

import { useBookAppointment } from '@/modules/clinical/hooks/use-appointments';
import { usePatients } from '@/modules/clinical/hooks/use-patients';
import { useScheduledStaff } from '@/modules/clinical/hooks/use-staff-schedules';
import { useAvailableSlots } from '@/modules/clinical/hooks/use-availability';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { BookAppointmentInput } from '@/modules/clinical/types/scheduling';
import type { Patient } from '@/modules/clinical/types/patient';
import type { TimeSlot } from '@/modules/clinical/services/availability-service';
import { availabilityService } from '@/modules/clinical/services/availability-service';

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
  const [patientSearch, setPatientSearch] = useState('');
  const debouncedSearchQuery = useDebouncedValue(patientSearch, 300);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

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
  const selectedStaffId = watch('staffId');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [appointmentDuration, setAppointmentDuration] = useState(30); // Default 30 minutes
  const [showAllSlots, setShowAllSlots] = useState(false);

  const { data: patientsData, isLoading: isPatientsLoading } = usePatients({
    search: debouncedSearchQuery,
    limit: 20,
  });

  // Fetch available slots when staff and date are selected
  const slotsParams = useMemo(() => {
    if (!selectedStaffId || !selectedDate) return null;

    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    return {
      resourceType: 'staff' as const,
      resourceId: selectedStaffId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      durationMinutes: appointmentDuration,
      slotInterval: 15, // 15-minute intervals
    };
  }, [selectedStaffId, selectedDate, appointmentDuration]);

  const { data: availableSlots, isLoading: isSlotsLoading } = useAvailableSlots(slotsParams);
  const slotAvailabilityQueries = useQueries({
    queries: (availableSlots ?? []).map((slot) => ({
      queryKey: ['check-slot-availability', selectedStaffId, slot.startTime, appointmentDuration],
      queryFn: () => {
        const start = new Date(slot.startTime);
        const end = new Date(start.getTime() + appointmentDuration * 60 * 1000);
        return availabilityService.checkSlotAvailability({
          resourceType: 'staff',
          resourceId: selectedStaffId ?? '',
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        });
      },
      enabled: Boolean(selectedStaffId && selectedDate),
      staleTime: 1000 * 30,
    })),
  });
  const slotAvailabilityMap = useMemo(() => {
    const map = new Map<string, boolean | undefined>();
    slotAvailabilityQueries.forEach((query, index) => {
      const slot = availableSlots?.[index];
      if (!slot) return;
      map.set(`${slot.startTime}`, query.data?.isAvailable);
    });
    return map;
  }, [availableSlots, slotAvailabilityQueries]);
  const availableCount = useMemo(() => {
    if (!availableSlots) return 0;
    let count = 0;
    availableSlots.forEach((slot) => {
      const key = `${slot.startTime}`;
      if (slotAvailabilityMap.get(key) === true) {
        count += 1;
      }
    });
    return count;
  }, [availableSlots, slotAvailabilityMap]);
  const slotsToDisplay = useMemo(() => {
    if (!availableSlots) return [];
    if (showAllSlots) return availableSlots;
    return availableSlots.filter((slot) => {
      const key = `${slot.startTime}`;
      return slotAvailabilityMap.get(key) === true;
    });
  }, [availableSlots, showAllSlots, slotAvailabilityMap]);

  // Reset selected slot when date or staff changes
  useEffect(() => {
    setSelectedSlot(null);
    setShowAllSlots(false);
  }, [selectedDate, selectedStaffId, appointmentDuration]);

  const patientResults = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return [];
    return (patientsData?.data as Patient[] | undefined) ?? [];
  }, [debouncedSearchQuery, patientsData]);

  const { data: scheduledStaff } = useScheduledStaff();

  const bookAppointmentMutation = useBookAppointment();

  const handleSlotClick = (slot: TimeSlot) => {
    setSelectedSlot(slot);

    // Parse the ISO string times and extract HH:MM
    const startTime = new Date(slot.startTime);

    // Calculate the actual end time based on appointment duration
    const endTime = new Date(startTime.getTime() + appointmentDuration * 60 * 1000);

    const formatTime = (date: Date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    setValue('startTime', formatTime(startTime), { shouldValidate: true });
    setValue('endTime', formatTime(endTime), { shouldValidate: true });
  };

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
                  <Label htmlFor="patientSearch">Search Patient *</Label>
                  {!selectedPatient && (
                    <>
                      <Input
                        id="patientSearch"
                        placeholder="Search by name, MRN, or mobile"
                        value={patientSearch}
                        onChange={(event) => {
                          setPatientSearch(event.target.value);
                          setSelectedPatient(null);
                          setValue('patientId', '');
                        }}
                      />
                      {isPatientsLoading && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">Searching patients...</p>
                      )}
                      {!isPatientsLoading && debouncedSearchQuery.trim() !== '' && patientResults.length === 0 && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">No patients found.</p>
                      )}
                      {patientResults.length > 0 && (
                        <div className="max-h-40 overflow-auto rounded-md border border-slate-200 p-2 dark:border-slate-800">
                          {patientResults.map((patient) => (
                            <button
                              key={patient.id}
                              type="button"
                              onClick={() => {
                                setSelectedPatient(patient);
                                setValue('patientId', patient.id, { shouldValidate: true });
                                setPatientSearch('');
                              }}
                              className="flex w-full flex-col items-start gap-1 rounded-md px-2 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            >
                              <span className="font-medium">
                                {patient.firstName} {patient.lastName}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                MRN: {patient.mrn} · Mobile: {patient.phoneNumber ?? 'N/A'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {selectedPatient && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950/40">
                      <div>
                        <p className="font-medium">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          MRN: {selectedPatient.mrn} · Mobile: {selectedPatient.phoneNumber ?? 'N/A'}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(null);
                          setPatientSearch('');
                          setValue('patientId', '');
                        }}
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

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="staffId">Preferred Staff (Optional)</Label>
                  <Controller
                    name="staffId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedSlot(null); // Reset selected slot when staff changes
                        }}
                        value={field.value}
                      >
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

                <div className="space-y-2">
                  <Label htmlFor="duration">Appointment Duration</Label>
                  <Select
                    value={appointmentDuration.toString()}
                    onValueChange={(value) => {
                      setAppointmentDuration(parseInt(value));
                      setSelectedSlot(null); // Reset selected slot when duration changes
                    }}
                  >
                    <SelectTrigger id="duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                        setSelectedSlot(null); // Reset slot when date changes
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
                {/* Available Slots Section */}
                {selectedStaffId && selectedDate ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Available Time Slots</Label>
                      <div className="flex flex-wrap items-center gap-3">
                        {availableSlots && availableSlots.length > 0 && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {availableCount} available
                          </span>
                        )}
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Switch checked={showAllSlots} onCheckedChange={setShowAllSlots} />
                          <span>Show all slots</span>
                        </div>
                      </div>
                    </div>
                    {isSlotsLoading ? (
                      <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Loading available slots...</p>
                      </div>
                    ) : !availableSlots || availableSlots.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          No available slots
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          The selected staff member has no availability on {selectedDate && format(selectedDate, 'PPP')}
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                        {showAllSlots && (
                          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              Available
                            </span>
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-rose-500" />
                              Booked
                            </span>
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                          {slotsToDisplay.map((slot, index) => {
                            const startTime = new Date(slot.startTime);
                            const availabilityKey = `${slot.startTime}`;
                            const availability = slotAvailabilityMap.get(availabilityKey);
                            const isAvailable = availability === true;
                            const isBooked = availability === false;
                            const isPending = availability === undefined;

                            // Check if this slot is part of the selected range
                            let isSelected = false;
                            if (selectedSlot) {
                              const selectedStartTime = new Date(selectedSlot.startTime).getTime();
                              const selectedEndTime = selectedStartTime + appointmentDuration * 60 * 1000;
                              const slotTime = startTime.getTime();

                              // Slot is selected if it starts within the selected appointment duration
                              isSelected = slotTime >= selectedStartTime && slotTime < selectedEndTime;
                            }

                            return (
                              <button
                                key={`${slot.startTime}-${index}`}
                                type="button"
                                onClick={() => isAvailable && handleSlotClick(slot)}
                                disabled={!isAvailable}
                                className={cn(
                                  'rounded-lg border px-3 py-2.5 text-xs font-medium transition-all',
                                  isBooked
                                    ? 'cursor-not-allowed border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200'
                                    : isPending
                                    ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-500'
                                    : isSelected
                                    ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-blue-950'
                                )}
                              >
                                {startTime.toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                                })}
                              </button>
                            );
                          })}
                        </div>
                        {showAllSlots && slotsToDisplay.length === 0 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">No slots to display.</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  selectedStaffId && !selectedDate && (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                      <CalendarIcon className="h-8 w-8 text-slate-400 dark:text-slate-600" />
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Select a date to view available slots
                      </p>
                    </div>
                  )
                )}

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
