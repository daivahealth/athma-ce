'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, CalendarClock, CalendarRange, Trash2, Pencil } from 'lucide-react';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import type { StaffMember } from '@/modules/foundation/types/staff';
import {
  useCreateStaffSchedule,
  useCreateWeeklyStaffSchedule,
  useDeleteStaffSchedule,
  useStaffSchedules,
  useUpdateStaffSchedule,
} from '@/modules/clinical/hooks/use-staff-schedules';
import type {
  CreateStaffScheduleInput,
  CreateWeeklyStaffScheduleInput,
  StaffSchedule,
  UpdateStaffScheduleInput,
} from '@/modules/clinical/types/scheduling';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCloseButton,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading';
import { useToast } from '@/components/ui/use-toast';

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type ErrorWithResponse = { response?: { data?: { message?: string } } };
type ErrorWithMessage = { message?: unknown };

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object') {
    if ('response' in error) {
      const response = (error as ErrorWithResponse).response;
      const message = response?.data?.message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }
    }

    if ('message' in error) {
      const message = (error as ErrorWithMessage).message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }
    }
  }

  return 'Something went wrong. Please try again.';
}

interface ScheduleFormProps {
  onSubmit: (values: FormState) => Promise<void>;
  isSubmitting: boolean;
  defaultValues?: Partial<FormState>;
}

interface FormState {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  scheduleType: string;
  facilityId: string;
  effectiveFrom: string;
  effectiveTo: string;
  notes: string;
}

const defaultFormState: FormState = {
  dayOfWeek: '0',
  startTime: '09:00',
  endTime: '17:00',
  isAvailable: true,
  scheduleType: 'regular',
  facilityId: '',
  effectiveFrom: new Date().toISOString().slice(0, 10),
  effectiveTo: '',
  notes: '',
};

function StaffScheduleForm({ onSubmit, isSubmitting, defaultValues }: ScheduleFormProps) {
  const [formState, setFormState] = useState<FormState>(() => ({ ...defaultFormState, ...defaultValues }));

  useEffect(() => {
    setFormState((prev) => ({ ...prev, ...defaultValues }));
  }, [defaultValues]);

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(formState);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dayOfWeek">Day of Week</Label>
          <select
            id="dayOfWeek"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formState.dayOfWeek}
            onChange={(event) => handleChange('dayOfWeek', event.target.value)}
            required
          >
            {DAY_LABELS.map((label, index) => (
              <option key={index} value={index}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheduleType">Schedule Type</Label>
          <Input
            id="scheduleType"
            value={formState.scheduleType}
            onChange={(event) => handleChange('scheduleType', event.target.value)}
            placeholder="regular"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formState.startTime}
            onChange={(event) => handleChange('startTime', event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formState.endTime}
            onChange={(event) => handleChange('endTime', event.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="effectiveFrom">Effective From</Label>
          <Input
            id="effectiveFrom"
            type="date"
            value={formState.effectiveFrom}
            onChange={(event) => handleChange('effectiveFrom', event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="effectiveTo">Effective To</Label>
          <Input
            id="effectiveTo"
            type="date"
            value={formState.effectiveTo}
            onChange={(event) => handleChange('effectiveTo', event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="facilityId">Facility (optional)</Label>
          <Input
            id="facilityId"
            value={formState.facilityId}
            onChange={(event) => handleChange('facilityId', event.target.value)}
            placeholder="Auto-uses current facility if empty"
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch
            id="isAvailable"
            checked={formState.isAvailable}
            onCheckedChange={(checked) => handleChange('isAvailable', checked)}
          />
          <Label htmlFor="isAvailable">Staff available during this slot</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formState.notes}
          onChange={(event) => handleChange('notes', event.target.value)}
          rows={3}
          placeholder="Optional context for schedulers"
        />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save schedule'}
        </Button>
      </DialogFooter>
    </form>
  );
}

function normaliseTime(value: string) {
  if (!value) return value;
  return value.length === 5 ? `${value}:00` : value;
}

function formatDateDisplay(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatTimeDisplay(value: string) {
  if (!value) return '—';
  return value.slice(0, 5);
}

function toDateInput(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

function toTimeInput(value: string) {
  if (!value) return '';
  return value.slice(0, 5);
}

function buildStaffOptions(staff?: StaffMember[]) {
  if (!staff) return [];
  return staff.map((member) => ({
    id: member.id,
    employeeId: member.employeeId,
    displayName:
      member.displayName && member.displayName.length > 0
        ? member.displayName
        : [member.prefix, member.firstName, member.middleName, member.lastName]
            .filter((value) => value && value.trim().length > 0)
            .join(' '),
    staffType: member.staffType,
    qualification: member.qualification ?? undefined,
    languages: member.languages ?? [],
    specialties: member.staffSpecialties?.map((entry) => entry.specialty.name) ?? [],
    raw: member,
  }));
}

function resolveStaffDisplayName(staff?: StaffMember | null) {
  if (!staff) return undefined;
  if (staff.displayName && staff.displayName.trim().length > 0) {
    return staff.displayName.trim();
  }
  return [staff.prefix, staff.firstName, staff.middleName, staff.lastName]
    .filter((value) => value && value.trim().length > 0)
    .join(' ')
    .trim() || undefined;
}

export default function StaffSchedulingPage({ params: _params }: { params: { locale: string } }) {
  const showToast = useToast();
  const { data: staff, isLoading: isLoadingStaff, error: staffError } = useStaffList();
  const staffOptions = useMemo(() => buildStaffOptions(staff), [staff]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const activeStaff = useMemo(
    () => staffOptions.find((member) => member.id === selectedStaffId)?.raw ?? null,
    [staffOptions, selectedStaffId]
  );
  useEffect(() => {
    if (!selectedStaffId && staffOptions.length > 0) {
      setSelectedStaffId(staffOptions[0].id);
    }
  }, [selectedStaffId, staffOptions]);

  const [effectiveDate, setEffectiveDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [includeExpired, setIncludeExpired] = useState<boolean>(false);
  const scheduleFilters = useMemo(() => {
    if (!selectedStaffId) return undefined;
    const filters: { effectiveDate?: string; includeExpired?: boolean } = {};
    if (effectiveDate) {
      filters.effectiveDate = effectiveDate;
    }
    if (includeExpired) {
      filters.includeExpired = true;
    }
    return filters;
  }, [selectedStaffId, effectiveDate, includeExpired]);

  const {
    data: schedules,
    isLoading: isLoadingSchedules,
    error: scheduleError,
    isRefetching,
  } = useStaffSchedules(selectedStaffId, scheduleFilters);

  const createScheduleMutation = useCreateStaffSchedule();
  const updateScheduleMutation = useUpdateStaffSchedule();
  const deleteScheduleMutation = useDeleteStaffSchedule();
  const createWeeklyScheduleMutation = useCreateWeeklyStaffSchedule();

  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isWeeklyDialogOpen, setWeeklyDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<StaffSchedule | null>(null);

  const handleCreateSchedule = async (values: FormState) => {
    if (!selectedStaffId) return;
    const staffDisplayName = resolveStaffDisplayName(activeStaff);
    try {
      const payload: CreateStaffScheduleInput = {
        staffId: selectedStaffId,
        dayOfWeek: parseInt(values.dayOfWeek, 10),
        startTime: normaliseTime(values.startTime),
        endTime: normaliseTime(values.endTime),
        isAvailable: values.isAvailable,
        scheduleType: values.scheduleType || 'regular',
        facilityId: values.facilityId || undefined,
        notes: values.notes || undefined,
        effectiveFrom: values.effectiveFrom,
        effectiveTo: values.effectiveTo || undefined,
      };

      if (activeStaff?.employeeId) {
        payload.employeeId = activeStaff.employeeId;
      }
      if (staffDisplayName) {
        payload.staffDisplayName = staffDisplayName;
      }

      await createScheduleMutation.mutateAsync(payload);

      showToast({
        title: 'Schedule created',
        description: 'Staff availability slot added successfully.',
        variant: 'success',
      });
      setCreateDialogOpen(false);
    } catch (error) {
      showToast({
        title: 'Unable to create schedule',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleUpdateSchedule = async (values: FormState) => {
    if (!editingSchedule) return;
    const staffDisplayName = resolveStaffDisplayName(activeStaff) ?? editingSchedule.staffDisplayName ?? undefined;
    try {
      const data: UpdateStaffScheduleInput = {
        dayOfWeek: parseInt(values.dayOfWeek, 10),
        startTime: normaliseTime(values.startTime),
        endTime: normaliseTime(values.endTime),
        isAvailable: values.isAvailable,
        scheduleType: values.scheduleType || 'regular',
        facilityId: values.facilityId || undefined,
        notes: values.notes || undefined,
        effectiveFrom: values.effectiveFrom,
        effectiveTo: values.effectiveTo || undefined,
      };

      if (activeStaff?.employeeId) {
        data.employeeId = activeStaff.employeeId;
      } else if (editingSchedule.employeeId) {
        data.employeeId = editingSchedule.employeeId;
      }
      if (staffDisplayName) {
        data.staffDisplayName = staffDisplayName;
      }

      await updateScheduleMutation.mutateAsync({
        id: editingSchedule.id,
        data,
      });

      showToast({
        title: 'Schedule updated',
        description: 'The staff schedule was updated successfully.',
        variant: 'success',
      });
      setEditingSchedule(null);
    } catch (error) {
      showToast({
        title: 'Unable to update schedule',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSchedule = async (schedule: StaffSchedule) => {
    try {
      await deleteScheduleMutation.mutateAsync({ id: schedule.id, staffId: schedule.staffId });
      showToast({
        title: 'Schedule removed',
        description: 'The staff schedule slot has been deleted.',
        variant: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Unable to delete schedule',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleWeeklySchedule = async (values: FormState & { days: string[] }) => {
    if (!selectedStaffId) return;
    const staffDisplayName = resolveStaffDisplayName(activeStaff);
    try {
      const weeklyPayload: CreateWeeklyStaffScheduleInput = {
        staffId: selectedStaffId,
        days: values.days.map((day) => parseInt(day, 10)),
        startTime: normaliseTime(values.startTime),
        endTime: normaliseTime(values.endTime),
        isAvailable: values.isAvailable,
        scheduleType: values.scheduleType || 'regular',
        facilityId: values.facilityId || undefined,
        notes: values.notes || undefined,
        effectiveFrom: values.effectiveFrom,
        effectiveTo: values.effectiveTo || undefined,
      };

      if (activeStaff?.employeeId) {
        weeklyPayload.employeeId = activeStaff.employeeId;
      }
      if (staffDisplayName) {
        weeklyPayload.staffDisplayName = staffDisplayName;
      }

      await createWeeklyScheduleMutation.mutateAsync(weeklyPayload);

      showToast({
        title: 'Weekly schedule created',
        description: 'Recurring slots added for selected weekdays.',
        variant: 'success',
      });
      setWeeklyDialogOpen(false);
    } catch (error) {
      showToast({
        title: 'Unable to create weekly schedule',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Staff Scheduling</h1>
          <p className="text-muted-foreground mt-1">
            Configure recurring availability slots for clinical staff.
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog open={isWeeklyDialogOpen} onOpenChange={setWeeklyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={!selectedStaffId || isLoadingSchedules}>
                <CalendarRange className="h-4 w-4 mr-2" />
                Weekly slots
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogCloseButton />
              <DialogHeader>
                <DialogTitle>Create weekly schedule</DialogTitle>
                <DialogDescription>
                  Apply the same slot across multiple weekdays for the selected staff member.
                </DialogDescription>
              </DialogHeader>

              <WeeklyScheduleForm
                isSubmitting={createWeeklyScheduleMutation.isPending}
                onSubmit={handleWeeklySchedule}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!selectedStaffId}>
                <Plus className="h-4 w-4 mr-2" />
                New slot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogCloseButton />
              <DialogHeader>
                <DialogTitle>Create staff schedule</DialogTitle>
                <DialogDescription>
                  Define a single availability window for the chosen staff member.
                </DialogDescription>
              </DialogHeader>
              <StaffScheduleForm
                onSubmit={handleCreateSchedule}
                isSubmitting={createScheduleMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="staff-selector">Staff Member</Label>
            <select
              id="staff-selector"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={selectedStaffId}
              onChange={(event) => setSelectedStaffId(event.target.value)}
              disabled={isLoadingStaff || !staffOptions.length}
            >
              {staffOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.displayName} {option.staffType ? `(${option.staffType})` : ''}
                </option>
              ))}
            </select>
            {staffError && (
              <p className="text-sm text-destructive">Failed to load staff list.</p>
            )}
            {!isLoadingStaff && staffOptions.length === 0 && (
              <p className="text-sm text-muted-foreground">No staff members available.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="effective-date">Effective date</Label>
            <Input
              id="effective-date"
              type="date"
              value={effectiveDate}
              onChange={(event) => setEffectiveDate(event.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <Switch
              id="include-expired"
              checked={includeExpired}
              onCheckedChange={(checked) => setIncludeExpired(checked)}
            />
            <Label htmlFor="include-expired">Include expired slots</Label>
          </div>

          {scheduleError && (
            <div className="col-span-full">
              <p className="text-sm text-destructive">
                Unable to load schedules. {(scheduleError as any)?.response?.data?.message || 'Please try again.'}
              </p>
            </div>
          )}
        </div>
        {activeStaff && (
          <div className="border-t pt-4 text-sm space-y-2">
            <div>
              <span className="font-semibold">{activeStaff.displayName || activeStaff.firstName}</span>
              {activeStaff.staffType && (
                <span className="text-muted-foreground ml-2">({activeStaff.staffType})</span>
              )}
            </div>
            {activeStaff.qualification && (
              <div className="text-muted-foreground">Qualification: {activeStaff.qualification}</div>
            )}
            {activeStaff.languages && activeStaff.languages.length > 0 && (
              <div className="text-muted-foreground">
                Languages: {activeStaff.languages.join(', ')}
              </div>
            )}
            {activeStaff.staffSpecialties && activeStaff.staffSpecialties.length > 0 && (
              <div className="text-muted-foreground">
                Specialties:{' '}
                {activeStaff.staffSpecialties
                  .map((entry) => entry.specialty.name)
                  .filter((name, index, arr) => name && arr.indexOf(name) === index)
                  .join(', ')}
              </div>
            )}
          </div>
        )}
      </Card>

      <Card>
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Weekly availability
          </h2>
          {isRefetching && (
            <span className="text-xs text-muted-foreground">Refreshing…</span>
          )}
        </div>

        {isLoadingStaff || isLoadingSchedules ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner text="Loading schedules..." />
          </div>
        ) : !selectedStaffId ? (
          <div className="p-6 text-center text-muted-foreground">
            Select a staff member to view their availability.
          </div>
        ) : schedules && schedules.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Effective</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{DAY_LABELS[schedule.dayOfWeek] ?? schedule.dayOfWeek}</TableCell>
                  <TableCell>
                    {formatTimeDisplay(schedule.startTime)} – {formatTimeDisplay(schedule.endTime)}
                  </TableCell>
                  <TableCell>
                    {formatDateDisplay(schedule.effectiveFrom)} → {formatDateDisplay(schedule.effectiveTo)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        schedule.isAvailable
                          ? 'inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700'
                          : 'inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700'
                      }
                    >
                      {schedule.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">{schedule.scheduleType}</TableCell>
                  <TableCell className="max-w-xs truncate" title={schedule.notes ?? undefined}>
                    {schedule.notes || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setEditingSchedule({
                            ...schedule,
                            effectiveFrom: schedule.effectiveFrom,
                            effectiveTo: schedule.effectiveTo ?? null,
                          })
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        disabled={deleteScheduleMutation.isPending}
                        onClick={() => handleDeleteSchedule(schedule)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            No schedules found for this staff member.
          </div>
        )}
      </Card>

      <Dialog open={Boolean(editingSchedule)} onOpenChange={(open) => !open && setEditingSchedule(null)}>
        <DialogContent>
          <DialogCloseButton />
          <DialogHeader>
            <DialogTitle>Edit schedule</DialogTitle>
            <DialogDescription>Update the selected availability slot.</DialogDescription>
          </DialogHeader>
          {editingSchedule && (
            <StaffScheduleForm
              onSubmit={handleUpdateSchedule}
              isSubmitting={updateScheduleMutation.isPending}
              defaultValues={{
                dayOfWeek: editingSchedule.dayOfWeek.toString(),
                startTime: toTimeInput(editingSchedule.startTime),
                endTime: toTimeInput(editingSchedule.endTime),
                isAvailable: editingSchedule.isAvailable,
                scheduleType: editingSchedule.scheduleType,
                facilityId: editingSchedule.facilityId ?? '',
                effectiveFrom: toDateInput(editingSchedule.effectiveFrom),
                effectiveTo: toDateInput(editingSchedule.effectiveTo ?? undefined),
                notes: editingSchedule.notes ?? '',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface WeeklyScheduleFormProps {
  onSubmit: (values: FormState & { days: string[] }) => Promise<void>;
  isSubmitting: boolean;
}

function WeeklyScheduleForm({ onSubmit, isSubmitting }: WeeklyScheduleFormProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [formState, setFormState] = useState<FormState>({ ...defaultFormState });

  const toggleDay = (day: string) => {
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((value) => value !== day) : [...current, day]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedDays.length === 0) {
      return;
    }
    await onSubmit({ ...formState, days: selectedDays });
  };

  const updateField = (field: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label>Weekdays</Label>
        <div className="grid grid-cols-2 gap-2">
          {DAY_LABELS.map((label, index) => (
            <button
              key={label}
              type="button"
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                selectedDays.includes(index.toString())
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-background hover:bg-accent'
              }`}
              onClick={() => toggleDay(index.toString())}
            >
              {label}
            </button>
          ))}
        </div>
        {selectedDays.length === 0 && (
          <p className="text-xs text-destructive">Select at least one weekday.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weekly-start">Start Time</Label>
          <Input
            id="weekly-start"
            type="time"
            value={formState.startTime}
            onChange={(event) => updateField('startTime', event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weekly-end">End Time</Label>
          <Input
            id="weekly-end"
            type="time"
            value={formState.endTime}
            onChange={(event) => updateField('endTime', event.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weekly-effective-from">Effective From</Label>
          <Input
            id="weekly-effective-from"
            type="date"
            value={formState.effectiveFrom}
            onChange={(event) => updateField('effectiveFrom', event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weekly-effective-to">Effective To</Label>
          <Input
            id="weekly-effective-to"
            type="date"
            value={formState.effectiveTo}
            onChange={(event) => updateField('effectiveTo', event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weekly-schedule-type">Schedule Type</Label>
          <Input
            id="weekly-schedule-type"
            value={formState.scheduleType}
            onChange={(event) => updateField('scheduleType', event.target.value)}
            placeholder="regular"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weekly-facility">Facility</Label>
          <Input
            id="weekly-facility"
            value={formState.facilityId}
            onChange={(event) => updateField('facilityId', event.target.value)}
            placeholder="Uses current facility if left blank"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="weekly-availability"
          checked={formState.isAvailable}
          onCheckedChange={(checked) => updateField('isAvailable', checked)}
        />
        <Label htmlFor="weekly-availability">Staff available during these slots</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="weekly-notes">Notes</Label>
        <Textarea
          id="weekly-notes"
          value={formState.notes}
          onChange={(event) => updateField('notes', event.target.value)}
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isSubmitting || selectedDays.length === 0}>
          {isSubmitting ? 'Saving...' : 'Create weekly schedule'}
        </Button>
      </DialogFooter>
    </form>
  );
}
