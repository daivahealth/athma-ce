'use client';

import { useState, useMemo, useEffect } from 'react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
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

import { useRescheduleAppointment } from '@/modules/clinical/hooks/use-appointments';
import { useAvailableSlots } from '@/modules/clinical/hooks/use-availability';
import type { Appointment } from '@/modules/clinical/types/scheduling';
import type { TimeSlot } from '@/modules/clinical/services/availability-service';

interface RescheduleAppointmentDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RescheduleAppointmentDialog({
  appointment,
  open,
  onOpenChange,
  onSuccess,
}: RescheduleAppointmentDialogProps) {
  const publishToast = useToast();
  const rescheduleMutation = useRescheduleAppointment();

  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [rescheduleStartTime, setRescheduleStartTime] = useState('');
  const [rescheduleEndTime, setRescheduleEndTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [rescheduleDuration, setRescheduleDuration] = useState(30);
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState<TimeSlot | null>(null);

  // Initialize form when appointment changes or dialog opens
  useEffect(() => {
    if (appointment && open) {
      const start = new Date(appointment.startTime);
      const end = new Date(appointment.endTime);
      const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // minutes

      setRescheduleDate(start);
      setRescheduleStartTime(format(start, 'HH:mm'));
      setRescheduleEndTime(format(end, 'HH:mm'));
      setRescheduleDuration(duration);
      setRescheduleReason('');
      setSelectedRescheduleSlot(null);
    }
  }, [appointment, open]);

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
    !!rescheduleSlotsParams && open
  );

  const handleRescheduleSlotClick = (slot: TimeSlot) => {
    setSelectedRescheduleSlot(slot);
    const startTime = new Date(slot.startTime);
    // Calculate the actual end time based on reschedule duration
    const endTime = new Date(startTime.getTime() + rescheduleDuration * 60 * 1000);
    setRescheduleStartTime(format(startTime, 'HH:mm'));
    setRescheduleEndTime(format(endTime, 'HH:mm'));
  };

  const handleSubmit = async () => {
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
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      publishToast({
        variant: 'destructive',
        title: 'Unable to reschedule',
        description: error.response?.data?.message || 'Failed to reschedule appointment.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
            disabled={rescheduleMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rescheduleMutation.isPending}
          >
            {rescheduleMutation.isPending ? 'Rescheduling...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
