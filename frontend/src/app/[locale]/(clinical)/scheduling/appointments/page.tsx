'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, startOfDay, endOfDay, addDays } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  XCircle,
  Stethoscope,
} from 'lucide-react';

import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';

import { useCurrentFacilityAppointments, useRescheduleAppointment } from '@/modules/clinical/hooks/use-appointments';
import type { Appointment } from '@/modules/clinical/types/scheduling';

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  checked_in: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  no_show: 'bg-orange-100 text-orange-800',
};

export default function AppointmentsPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const publishToast = useToast();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [rescheduleStartTime, setRescheduleStartTime] = useState('');
  const [rescheduleEndTime, setRescheduleEndTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Calculate date range for query (today by default)
  const startDate = format(startOfDay(selectedDate), "yyyy-MM-dd'T'HH:mm:ss");
  const endDate = format(endOfDay(selectedDate), "yyyy-MM-dd'T'HH:mm:ss");

  const { data: appointments, isLoading, error } = useCurrentFacilityAppointments(
    startDate,
    endDate,
    {
      status: statusFilter !== 'all' ? statusFilter : undefined,
      includeResources: true,
    }
  );
  const rescheduleMutation = useRescheduleAppointment();

  // Filter appointments by search query (patient name, type, etc.)
  const filteredAppointments = appointments?.filter((apt) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
  
const handleRescheduleSubmit = () => {
  if (!rescheduleTarget || !rescheduleDate || !rescheduleStartTime || !rescheduleEndTime) {
    publishToast({
      variant: 'destructive',
      title: 'Incomplete details',
      description: 'Please select a new date and time before rescheduling.',
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

  rescheduleMutation
    .mutateAsync({
      id: rescheduleTarget.id,
      data: {
        newStartTime: newStart.toISOString(),
        newEndTime: newEnd.toISOString(),
        reason: rescheduleReason || undefined,
      },
    })
    .then(() => {
      publishToast({
        title: 'Appointment Rescheduled',
        description: 'The appointment has been successfully rescheduled.',
      });
      setRescheduleDialogOpen(false);
    })
    .catch((error: any) => {
      publishToast({
        variant: 'destructive',
        title: 'Unable to reschedule',
        description: error.response?.data?.message || 'Failed to reschedule appointment.',
      });
    });
};

  return (
      apt.appointmentType.toLowerCase().includes(query) ||
      apt.patientId.toLowerCase().includes(query)
    );
  });

  const handleViewAppointment = (id: string) => {
    router.push(`/${params.locale}/scheduling/appointments/${id}`);
  };

  const handleOpenReschedule = (appointment: Appointment) => {
    const start = new Date(appointment.startTime);
    const end = new Date(appointment.endTime);
    setRescheduleTarget(appointment);
    setRescheduleDate(start);
    setRescheduleStartTime(format(start, 'HH:mm'));
    setRescheduleEndTime(format(end, 'HH:mm'));
    setRescheduleReason('');
    setRescheduleDialogOpen(true);
  };

  const handleCancelAppointment = (_id: string) => {
    publishToast({
      title: 'Cancel Appointment',
      description: 'Cancel functionality will be implemented.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb
          items={[
            { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
            { href: `/${params.locale}/scheduling/appointments`, label: 'Appointments' },
          ]}
        />
        <Button onClick={() => router.push(`/${params.locale}/scheduling/appointments/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>
            View and manage appointments for your facility
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            {/* Date Selection */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(addDays(selectedDate, -1))}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {format(selectedDate, 'MMM dd, yyyy')}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </Button>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              Error loading appointments: {(error as Error).message}
            </div>
          )}

          {/* Appointments Table */}
          {!isLoading && !error && (
            <>
              {filteredAppointments && filteredAppointments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Staff</TableHead>
                        <TableHead>Visit Type</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">
                                  {format(new Date(appointment.startTime), 'HH:mm')}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {format(new Date(appointment.endTime), 'HH:mm')}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono text-xs">
                                {appointment.patientId.substring(0, 8)}...
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="capitalize">
                              {appointment.appointmentType.replace(/_/g, ' ')}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={STATUS_COLORS[appointment.status] || ''}
                            >
                              {appointment.status.replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {appointment.staffId ? (
                              <span className="font-mono text-xs">
                                {appointment.staffId.substring(0, 8)}...
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Not assigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="capitalize">
                              {appointment.visitType || 'In-person'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleViewAppointment(appointment.id)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/${params.locale}/encounters/new?appointmentId=${appointment.id}`
                                    )
                                  }
                                  disabled={appointment.status === 'cancelled'}
                                >
                                  <Stethoscope className="mr-2 h-4 w-4" />
                                  Create Encounter
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleOpenReschedule(appointment)}
                                  disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Reschedule
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
                                  className="text-destructive"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-12 text-center">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No appointments found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Get started by booking your first appointment'}
                  </p>
                  {!searchQuery && statusFilter === 'all' && (
                    <Button
                      className="mt-4"
                      onClick={() => router.push(`/${params.locale}/scheduling/appointments/new`)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>


<Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
  <DialogContent>
    <DialogCloseButton />
    <DialogHeader>
      <DialogTitle>Reschedule Appointment</DialogTitle>
      <DialogDescription>
        Choose a new date and time for this appointment.
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">New Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {rescheduleDate ? format(rescheduleDate, 'MMMM dd, yyyy') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar
              mode="single"
              selected={rescheduleDate}
              onSelect={setRescheduleDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
      <Button onClick={() => handleRescheduleSubmit()} disabled={rescheduleMutation.isPending}>
        {rescheduleMutation.isPending ? 'Rescheduling...' : 'Confirm'}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
}
