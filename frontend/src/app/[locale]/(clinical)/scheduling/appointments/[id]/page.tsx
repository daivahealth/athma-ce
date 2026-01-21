'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, startOfDay, endOfDay } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  FileText,
  ArrowLeft,
  Edit,
  XCircle,
  CheckCircle,
  Stethoscope,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AppCalendar as Calendar } from '@/components/ui/app-calendar';
import { useToast } from '@/components/ui/use-toast';

import { useAppointment, useCancelAppointment, useRescheduleAppointment } from '@/modules/clinical/hooks/use-appointments';
import { useAvailableSlots } from '@/modules/clinical/hooks/use-availability';
import type { TimeSlot } from '@/modules/clinical/services/availability-service';

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  checked_in: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  no_show: 'bg-orange-100 text-orange-800',
};

export default function AppointmentDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const router = useRouter();
  const publishToast = useToast();

  const { data: appointment, isLoading, error } = useAppointment(params.id);
  const cancelMutation = useCancelAppointment();
  const rescheduleMutation = useRescheduleAppointment();

  const [isRescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [rescheduleStartTime, setRescheduleStartTime] = useState('');
  const [rescheduleEndTime, setRescheduleEndTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [rescheduleDuration, setRescheduleDuration] = useState(30);
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState<TimeSlot | null>(null);

  // Compute reschedule slots params
  const rescheduleSlotsParams = useMemo(() => {
    if (!rescheduleDate || !appointment?.staffId) return null;

    const startDate = startOfDay(rescheduleDate);
    const endDate = endOfDay(rescheduleDate);

    return {
      resourceType: 'staff' as const,
      resourceId: appointment.staffId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      durationMinutes: rescheduleDuration,
      slotInterval: 15,
    };
  }, [rescheduleDate, appointment?.staffId, rescheduleDuration]);

  const { data: rescheduleSlots, isLoading: slotsLoading } = useAvailableSlots(
    rescheduleSlotsParams,
    !!rescheduleSlotsParams && isRescheduleDialogOpen
  );

  const handleOpenReschedule = () => {
    if (!appointment) return;
    const start = new Date(appointment.startTime);
    const end = new Date(appointment.endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // minutes

    setRescheduleDate(start);
    setRescheduleStartTime(format(start, 'HH:mm'));
    setRescheduleEndTime(format(end, 'HH:mm'));
    setRescheduleDuration(duration);
    setRescheduleReason('');
    setSelectedRescheduleSlot(null);
    setRescheduleDialogOpen(true);
  };

  const handleRescheduleSlotClick = (slot: TimeSlot) => {
    setSelectedRescheduleSlot(slot);
    const startTime = new Date(slot.startTime);
    // Calculate the actual end time based on reschedule duration
    const endTime = new Date(startTime.getTime() + rescheduleDuration * 60 * 1000);
    setRescheduleStartTime(format(startTime, 'HH:mm'));
    setRescheduleEndTime(format(endTime, 'HH:mm'));
  };

  const handleRescheduleSubmit = async () => {
    if (!appointment || !rescheduleDate || !rescheduleStartTime || !rescheduleEndTime) {
      publishToast({
        variant: 'destructive',
        title: 'Incomplete details',
        description: 'Please pick a new date and time before rescheduling.',
      });
      return;
    }

    const [startHour, startMinute] = rescheduleStartTime.split(':');
    const [endHour, endMinute] = rescheduleEndTime.split(':');
    const newStart = new Date(rescheduleDate);
    newStart.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);
    const newEnd = new Date(rescheduleDate);
    newEnd.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);

    if (newStart >= newEnd) {
      publishToast({
        variant: 'destructive',
        title: 'Invalid time range',
        description: 'End time must be after start time.',
      });
      return;
    }

    try {
      await rescheduleMutation.mutateAsync({
        id: appointment.id,
        data: {
          newStartTime: newStart.toISOString(),
          newEndTime: newEnd.toISOString(),
          reason: rescheduleReason || undefined,
        },
      });

      publishToast({
        title: 'Appointment Rescheduled',
        description: 'The appointment has been successfully rescheduled.',
      });
      setRescheduleDialogOpen(false);
    } catch (error: any) {
      publishToast({
        variant: 'destructive',
        title: 'Unable to reschedule',
        description: error.response?.data?.message || 'Failed to reschedule appointment.',
      });
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await cancelMutation.mutateAsync({
        id: params.id,
        data: {
          reason: 'Cancelled by user',
        },
      });

      publishToast({
        title: 'Appointment Cancelled',
        description: 'The appointment has been successfully cancelled.',
      });

      router.push(`/${params.locale}/scheduling/appointments`);
    } catch (error: any) {
      publishToast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to cancel appointment',
      });
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

  if (error || !appointment) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">Appointment not found</p>
              <p className="text-sm">The requested appointment could not be loaded.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push(`/${params.locale}/scheduling/appointments`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Appointments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canModify = appointment.status !== 'cancelled' && appointment.status !== 'completed';

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
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointment Details</h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(appointment.startTime), 'MMMM dd, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          {appointment.status !== 'cancelled' && (
            <Button
              onClick={() =>
                router.push(
                  `/${params.locale}/encounters/new?appointmentId=${appointment.id}`
                )
              }
            >
              <Stethoscope className="mr-2 h-4 w-4" />
              Create Encounter
            </Button>
          )}
          {canModify && (
            <>
              <Button variant="outline" onClick={handleOpenReschedule}>
                <Edit className="mr-2 h-4 w-4" />
                Reschedule
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Appointment
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Main Details */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge
                  variant="secondary"
                  className={STATUS_COLORS[appointment.status] || ''}
                >
                  {appointment.status.replace(/_/g, ' ').toUpperCase()}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Appointment Type
              </label>
              <p className="mt-1 capitalize">
                {appointment.appointmentType.replace(/_/g, ' ')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Start Time</label>
                <p className="mt-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(appointment.startTime), 'hh:mm a')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">End Time</label>
                <p className="mt-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(appointment.endTime), 'hh:mm a')}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">Visit Type</label>
              <p className="mt-1 capitalize">{appointment.visitType || 'In-person'}</p>
            </div>

            {appointment.notes && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="mt-1 text-sm">{appointment.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Patient & Staff Details */}
        <Card>
          <CardHeader>
            <CardTitle>Patient & Staff</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Patient</label>
              <div className="mt-1 space-y-1">
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {appointment.patientDisplay?.displayName ||
                     appointment.patient?.displayName ||
                     `${appointment.patient?.firstName} ${appointment.patient?.lastName}` ||
                     appointment.patientId}
                  </span>
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground pl-6">
                  <span>MRN: {appointment.patientDisplay?.mrn || appointment.patient?.mrn || '—'}</span>
                  <span>•</span>
                  <span>
                    {appointment.patientDisplay?.gender || appointment.patient?.gender || '—'} / {appointment.patientDisplay?.age || '—'}y
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">Assigned Staff</label>
              {appointment.staffId ? (
                <p className="mt-1 flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{(appointment as any).staffDisplayName || appointment.staffId}</span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">Not assigned</p>
              )}
            </div>

            {appointment.facilityId && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Facility</label>
                  <p className="mt-1">{(appointment as any).facilityName || appointment.facilityId}</p>
                </div>
              </>
            )}

            {appointment.spaceId && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Space</label>
                  <p className="mt-1 font-mono text-sm">{appointment.spaceId}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Resources */}
        {appointment.resources && appointment.resources.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Allocated Resources</CardTitle>
              <CardDescription>Resources assigned to this appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointment.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        {resource.resourceType === 'staff' && <User className="h-4 w-4" />}
                        {resource.resourceType === 'equipment' && <FileText className="h-4 w-4" />}
                        {resource.resourceType === 'space' && <CalendarIcon className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{resource.resourceType}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {resource.resourceId.substring(0, 16)}...
                        </p>
                        {resource.resourceRole && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Role: {resource.resourceRole}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={resource.allocationStatus === 'confirmed' ? 'default' : 'secondary'}
                      >
                        {resource.allocationStatus}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(resource.startTime), 'HH:mm')} -{' '}
                        {format(new Date(resource.endTime), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cancellation Details */}
        {appointment.status === 'cancelled' && (
          <Card className="md:col-span-2 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Cancellation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {appointment.cancellationReason && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reason</label>
                  <p className="mt-1">{appointment.cancellationReason}</p>
                </div>
              )}
              {appointment.cancelledAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cancelled At</label>
                  <p className="mt-1">
                    {format(new Date(appointment.cancelledAt), 'MMM dd, yyyy hh:mm a')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-muted-foreground">Created At</label>
                <p className="mt-1">{format(new Date(appointment.createdAt), 'MMM dd, yyyy hh:mm a')}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground">Last Updated</label>
                <p className="mt-1">{format(new Date(appointment.updatedAt), 'MMM dd, yyyy hh:mm a')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isRescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogCloseButton />
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>Pick a new date and time for this appointment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">New Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {rescheduleDate ? format(rescheduleDate, 'MMMM dd, yyyy') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <Calendar
                    mode="single"
                    selected={rescheduleDate}
                    onSelect={(date) => {
                      setRescheduleDate(date);
                      setSelectedRescheduleSlot(null);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Duration</label>
              <Select
                value={rescheduleDuration.toString()}
                onValueChange={(value) => {
                  setRescheduleDuration(Number(value));
                  setSelectedRescheduleSlot(null);
                }}
              >
                <SelectTrigger>
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

            {rescheduleDate && appointment?.staffId && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Available Slots</label>
                {slotsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading available slots...</p>
                ) : rescheduleSlots && rescheduleSlots.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto rounded-md border p-2">
                    <div className="grid grid-cols-3 gap-2">
                      {rescheduleSlots.map((slot, index) => {
                        const slotStart = new Date(slot.startTime);

                        // Check if this slot is part of the selected range
                        let isSelected = false;
                        if (selectedRescheduleSlot) {
                          const selectedStartTime = new Date(selectedRescheduleSlot.startTime).getTime();
                          const selectedEndTime = selectedStartTime + rescheduleDuration * 60 * 1000;
                          const slotTime = slotStart.getTime();

                          // Slot is selected if it starts within the selected appointment duration
                          isSelected = slotTime >= selectedStartTime && slotTime < selectedEndTime;
                        }

                        return (
                          <Button
                            key={index}
                            type="button"
                            size="sm"
                            variant={isSelected ? 'default' : 'outline'}
                            onClick={() => handleRescheduleSlotClick(slot)}
                            className="text-xs"
                          >
                            {format(slotStart, 'HH:mm')}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No available slots for this date</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Start Time</label>
                <Input
                  type="time"
                  value={rescheduleStartTime}
                  onChange={(event) => setRescheduleStartTime(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">End Time</label>
                <Input
                  type="time"
                  value={rescheduleEndTime}
                  onChange={(event) => setRescheduleEndTime(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Reason (optional)</label>
              <Textarea
                value={rescheduleReason}
                onChange={(event) => setRescheduleReason(event.target.value)}
                placeholder="Add a note about why the appointment is moving"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRescheduleDialogOpen(false)}
              disabled={rescheduleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRescheduleSubmit}
              disabled={rescheduleMutation.isPending}
            >
              {rescheduleMutation.isPending ? 'Rescheduling...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
