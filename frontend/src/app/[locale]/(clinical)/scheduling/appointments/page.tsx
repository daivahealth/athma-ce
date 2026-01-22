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

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useToast } from '@/components/ui/use-toast';

import { useCurrentFacilityAppointments } from '@/modules/clinical/hooks/use-appointments';
import { RescheduleAppointmentDialog } from '@/modules/clinical/components/RescheduleAppointmentDialog';
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

  // Filter appointments by search query (patient name, type, etc.)
  const filteredAppointments = appointments?.filter((apt) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      apt.appointmentType.toLowerCase().includes(query) ||
      apt.patientId.toLowerCase().includes(query)
    );
  });

  const handleViewAppointment = (id: string) => {
    router.push(`/${params.locale}/scheduling/appointments/${id}`);
  };

  const handleOpenReschedule = (appointment: Appointment) => {
    setRescheduleTarget(appointment);
    setRescheduleDialogOpen(true);
  };

  const handleCancelAppointment = (_id: string) => {
    publishToast({
      title: 'Cancel Appointment',
      description: 'Cancel functionality will be implemented.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">View and manage appointments for your facility</p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/scheduling/appointments/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
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
                            <div className="flex items-start gap-2">
                              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div className="flex flex-col gap-0.5">
                                <span className="font-medium">
                                  {(appointment as any).patientDisplay?.displayName ||
                                    appointment.patient?.displayName ||
                                    `${appointment.patient?.firstName || ''} ${appointment.patient?.lastName || ''}`.trim() ||
                                    'Unknown patient'}
                                </span>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-normal">
                                  <span>MRN: {(appointment as any).patientDisplay?.mrn || appointment.patient?.mrn || '—'}</span>
                                  <span>•</span>
                                  <span>
                                    {(appointment as any).patientDisplay?.gender || appointment.patient?.gender || '—'} / {(appointment as any).patientDisplay?.age || '—'}y
                                  </span>
                                </div>
                              </div>
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
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {(appointment as any).staffDisplayName || appointment.staffId || (
                                  <span className="text-muted-foreground">Not assigned</span>
                                )}
                              </span>
                            </div>
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


<RescheduleAppointmentDialog
        appointment={rescheduleTarget}
        open={rescheduleDialogOpen}
        onOpenChange={setRescheduleDialogOpen}
      />

    </div>
  );
}
