'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';

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
import { useAvailableSlots } from '@/modules/clinical/hooks/use-availability';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { BookAppointmentInput } from '@/modules/clinical/types/scheduling';
import type { Patient } from '@/modules/clinical/types/patient';
import type { TimeSlot } from '@/modules/clinical/services/availability-service';

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
});

type BookAppointmentFormValues = z.infer<typeof bookAppointmentSchema>;

const APPOINTMENT_TYPES = [
  { value: 'general_checkup', label: 'Health Checkup' },
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
      appointmentType: 'consultation',
      visitType: 'in-person',
    },
  });

  const selectedDate = watch('appointmentDate');
  const selectedStaffId = watch('staffId');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [appointmentDuration, setAppointmentDuration] = useState(30); // Default 30 minutes
  const [slotViewMode, setSlotViewMode] = useState<'available' | 'all'>('available'); // Default to available slots

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
  
  // Generate all possible slots for the day and merge with available slots
  const allSlots = useMemo(() => {
    if (!selectedDate || !selectedStaffId) return [];
    
    const slots: TimeSlot[] = [];
    const startDate = new Date(selectedDate);
    startDate.setHours(8, 0, 0, 0); // Start at 8 AM
    const endDate = new Date(selectedDate);
    endDate.setHours(18, 0, 0, 0); // End at 6 PM
    
    const slotInterval = 15; // 15-minute intervals
    const availableSlotsSet = new Set(
      (availableSlots ?? []).map(slot => new Date(slot.startTime).getTime())
    );
    
    let currentTime = new Date(startDate);
    while (currentTime <= endDate) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(currentTime.getTime() + appointmentDuration * 60 * 1000);
      
      // Check if this slot is available
      const isAvailable = availableSlotsSet.has(slotStart.getTime());
      
      slots.push({
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        isAvailable,
        status: isAvailable ? 'available' : 'unavailable',
      });
      
      currentTime = new Date(currentTime.getTime() + slotInterval * 60 * 1000);
    }
    
    return slots;
  }, [selectedDate, selectedStaffId, appointmentDuration, availableSlots]);
  
  const slotsToDisplay = useMemo(() => {
    if (slotViewMode === 'available') {
      return availableSlots ?? [];
    } else {
      return allSlots;
    }
  }, [slotViewMode, availableSlots, allSlots]);

  // Reset selected slot when date or staff changes
  useEffect(() => {
    setSelectedSlot(null);
    setSlotViewMode('available'); // Reset to available slots view
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
                      <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {slotViewMode === 'available' ? 'Available Time Slots' : 'All Time Slots'}
                      </Label>
                      <div className="flex flex-wrap items-center gap-3">
                        <Select value={slotViewMode} onValueChange={(value) => setSlotViewMode(value as 'available' | 'all')}>
                          <SelectTrigger className="h-9 w-[160px] text-xs border-slate-300 bg-white shadow-sm hover:border-indigo-400 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available Slots</SelectItem>
                            <SelectItem value="all">All Slots</SelectItem>
                          </SelectContent>
                        </Select>
                        {slotViewMode === 'available' && availableSlots && availableSlots.length > 0 && (
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                            {availableSlots.length} available
                          </span>
                        )}
                        {slotViewMode === 'all' && (
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                            {allSlots.filter(s => s.isAvailable).length} of {allSlots.length} available
                          </span>
                        )}
                      </div>
                    </div>
                    {isSlotsLoading ? (
                      <div className="flex items-center justify-center rounded-xl border border-slate-200/60 bg-gradient-to-br from-slate-50/50 to-white p-8 shadow-sm dark:border-slate-800/60 dark:from-slate-950/50 dark:to-slate-900">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500 dark:border-slate-600 dark:border-t-indigo-400" />
                          <p className="text-sm font-medium">Loading available slots...</p>
                        </div>
                      </div>
                    ) : slotViewMode === 'available' && (!availableSlots || availableSlots.length === 0) ? (
                      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-gradient-to-br from-slate-50/50 to-white p-8 shadow-sm dark:border-slate-800/60 dark:from-slate-950/50 dark:to-slate-900">
                        <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                          <Clock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          No available slots
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-sm">
                          The selected staff member has no availability on {selectedDate && format(selectedDate, 'PPP')}
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200/60 bg-gradient-to-br from-slate-50/50 to-white p-4 shadow-sm dark:border-slate-800/60 dark:from-slate-950/50 dark:to-slate-900">
                        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
                          {slotsToDisplay.map((slot, index) => {
                            const startTime = new Date(slot.startTime);
                            const isAvailable = slot.isAvailable ?? true;

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
                                  'relative rounded-lg px-3 py-2.5 text-xs font-semibold transition-all duration-200',
                                  'focus:outline-none focus:ring-2 focus:ring-offset-1',
                                  isSelected
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 border-2 border-indigo-400 scale-105 ring-2 ring-indigo-200/50 dark:from-indigo-600 dark:to-purple-700 dark:border-indigo-500 dark:shadow-indigo-600/40 dark:ring-indigo-400/30'
                                    : isAvailable
                                      ? 'bg-white border border-slate-200 text-slate-700 shadow-sm hover:border-indigo-300 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50/30 hover:text-indigo-700 hover:shadow-md hover:scale-105 hover:border-indigo-400 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-200 dark:hover:border-indigo-600 dark:hover:from-indigo-950/30 dark:hover:to-purple-950/20 dark:hover:text-indigo-300 focus:ring-indigo-400/50'
                                      : 'bg-slate-100/50 border border-slate-200/50 text-slate-400 cursor-not-allowed opacity-50 dark:bg-slate-800/30 dark:border-slate-700/30 dark:text-slate-600'
                                )}
                              >
                                {isSelected && (
                                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-white shadow-sm" />
                                )}
                                <span className="relative z-10">
                                  {startTime.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                  })}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        {slotsToDisplay.length === 0 && (
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
