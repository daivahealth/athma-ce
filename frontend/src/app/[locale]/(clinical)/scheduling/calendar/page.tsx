'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  parseISO,
  isWithinInterval,
  addDays,
} from 'date-fns';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Eye,
  Stethoscope,
  Video,
  AlertCircle,
  Users,
  CalendarDays,
} from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useStaffCalendar } from '@/modules/clinical/hooks/use-calendar';
import { useScheduledStaff } from '@/modules/clinical/hooks/use-staff-schedules';
import type { CalendarEvent } from '@/modules/clinical/types/scheduling';

type ViewMode = 'month' | 'week' | 'day';

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-500',
  confirmed: 'bg-green-500',
  checked_in: 'bg-primary',
  in_progress: 'bg-yellow-500',
  completed: 'bg-gray-400',
  cancelled: 'bg-red-400',
  no_show: 'bg-orange-500',
  arrived: 'bg-primary',
  triaged: 'bg-warning',
  finished: 'bg-gray-400',
  planned: 'bg-blue-400',
  onleave: 'bg-gray-300',
  unknown: 'bg-gray-300',
};

const TYPE_COLORS: Record<string, string> = {
  appointment: 'border-l-blue-500',
  encounter: 'border-l-green-500',
};

const SOURCE_ICONS: Record<string, typeof CalendarIcon> = {
  appointment: CalendarIcon,
  'walk-in': Users,
  emergency: AlertCircle,
  telemedicine: Video,
};

function getEventStatusColor(event: CalendarEvent): string {
  const status = event.type === 'encounter' ? event.encounterStatus : event.appointmentStatus;
  return STATUS_COLORS[status?.toLowerCase() || 'unknown'] || STATUS_COLORS.unknown;
}

function getEventTypeColor(event: CalendarEvent): string {
  return TYPE_COLORS[event.type] || 'border-l-gray-300';
}

interface CalendarEventCardProps {
  event: CalendarEvent;
  locale: string;
  compact?: boolean;
  onClick?: () => void;
}

function CalendarEventCard({ event, locale, compact = false, onClick }: CalendarEventCardProps) {
  const SourceIcon = SOURCE_ICONS[event.source] || CalendarIcon;
  const statusColor = getEventStatusColor(event);
  const typeColor = getEventTypeColor(event);

  const startTime = format(parseISO(event.startTime), 'HH:mm');
  const endTime = event.endTime ? format(parseISO(event.endTime), 'HH:mm') : 'Ongoing';

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`text-xs p-1 rounded cursor-pointer border-l-2 ${typeColor} bg-card hover:bg-accent transition-colors truncate`}
              onClick={onClick}
            >
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
                <span className="font-medium">{startTime}</span>
              </div>
              <div className="truncate text-muted-foreground">
                {event.patientDisplay.displayName}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">{event.patientDisplay.displayName}</p>
              <p className="text-xs text-muted-foreground">
                MRN: {event.patientDisplay.mrn} | {event.patientDisplay.gender || '-'} / {event.patientDisplay.age || '-'}y
              </p>
              <p className="text-xs">
                {startTime} - {endTime}
              </p>
              <p className="text-xs capitalize">
                {event.type}: {event.appointmentType || event.encounterType || '-'}
              </p>
              <Badge variant="secondary" className={`text-xs ${statusColor} text-white`}>
                {(event.appointmentStatus || event.encounterStatus || 'unknown').replace(/_/g, ' ')}
              </Badge>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div
      className={`p-3 rounded-lg border-l-4 ${typeColor} bg-card hover:bg-accent transition-colors cursor-pointer shadow-sm`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <SourceIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-medium truncate">
              {event.patientDisplay.displayName}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mb-1">
            MRN: {event.patientDisplay.mrn} | {event.patientDisplay.gender || '-'} / {event.patientDisplay.age || '-'}y
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {startTime} - {endTime}
            </span>
          </div>
          {(event.appointmentType || event.encounterType) && (
            <div className="text-xs text-muted-foreground mt-1 capitalize">
              {event.appointmentType?.replace(/_/g, ' ') || event.encounterType?.replace(/_/g, ' ')}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge
            variant="secondary"
            className={`text-xs ${statusColor} text-white`}
          >
            {(event.appointmentStatus || event.encounterStatus || 'unknown').replace(/_/g, ' ')}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {event.type}
          </Badge>
        </div>
      </div>
    </div>
  );
}

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  locale: string;
  onEventClick: (event: CalendarEvent) => void;
}

function DayView({ date, events, locale, onEventClick }: DayViewProps) {
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      const eventHour = parseISO(event.startTime).getHours();
      return eventHour === hour;
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b">
        <h3 className="font-semibold">{format(date, 'EEEE, MMMM d, yyyy')}</h3>
      </div>
      <div className="divide-y max-h-[600px] overflow-y-auto">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          return (
            <div key={hour} className="flex">
              <div className="w-20 flex-shrink-0 p-2 text-sm text-muted-foreground border-r bg-muted/30">
                {format(new Date().setHours(hour, 0), 'h:mm a')}
              </div>
              <div className="flex-1 p-2 min-h-[60px]">
                <div className="space-y-1">
                  {hourEvents.map((event) => (
                    <CalendarEventCard
                      key={event.id}
                      event={event}
                      locale={locale}
                      onClick={() => onEventClick(event)}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface WeekViewProps {
  startDate: Date;
  events: CalendarEvent[];
  locale: string;
  onEventClick: (event: CalendarEvent) => void;
}

function WeekView({ startDate, events, locale, onEventClick }: WeekViewProps) {
  const days = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, 6),
  });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.startTime);
      return isSameDay(eventDate, day);
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
      {/* Header */}
      {days.map((day) => (
        <div
          key={day.toISOString()}
          className={`bg-muted p-2 text-center ${
            isSameDay(day, new Date()) ? 'bg-primary/10' : ''
          }`}
        >
          <div className="text-xs text-muted-foreground">{format(day, 'EEE')}</div>
          <div
            className={`text-lg font-semibold ${
              isSameDay(day, new Date()) ? 'text-primary' : ''
            }`}
          >
            {format(day, 'd')}
          </div>
        </div>
      ))}

      {/* Day columns */}
      {days.map((day) => {
        const dayEvents = getEventsForDay(day);
        return (
          <div
            key={day.toISOString()}
            className={`bg-card min-h-[400px] p-1 ${
              isSameDay(day, new Date()) ? 'bg-primary/5' : ''
            }`}
          >
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {dayEvents.map((event) => (
                <CalendarEventCard
                  key={event.id}
                  event={event}
                  locale={locale}
                  compact
                  onClick={() => onEventClick(event)}
                />
              ))}
              {dayEvents.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-4">
                  No events
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface MonthViewProps {
  currentMonth: Date;
  events: CalendarEvent[];
  locale: string;
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
}

function MonthView({ currentMonth, events, locale, onEventClick, onDayClick }: MonthViewProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.startTime);
      return isSameDay(eventDate, day);
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 bg-muted border-b">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] border-b border-r p-1 cursor-pointer hover:bg-accent/50 transition-colors ${
                !isCurrentMonth ? 'bg-muted/50 text-muted-foreground' : ''
              } ${isToday ? 'bg-primary/5' : ''}`}
              onClick={() => onDayClick(day)}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isToday
                    ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center'
                    : ''
                }`}
              >
                {format(day, 'd')}
              </div>
              <div className="space-y-0.5 max-h-[80px] overflow-y-auto">
                {dayEvents.slice(0, 3).map((event) => (
                  <CalendarEventCard
                    key={event.id}
                    event={event}
                    locale={locale}
                    compact
                    onClick={() => onEventClick(event)}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StaffCalendarPage({ params }: { params: { locale: string } }) {
  const router = useRouter();

  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');

  // Fetch staff list
  const { data: staffList, isLoading: isLoadingStaff } = useScheduledStaff();

  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    switch (viewMode) {
      case 'day':
        return {
          startDate: format(currentDate, 'yyyy-MM-dd'),
          endDate: format(currentDate, 'yyyy-MM-dd'),
        };
      case 'week':
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return {
          startDate: format(weekStart, 'yyyy-MM-dd'),
          endDate: format(weekEnd, 'yyyy-MM-dd'),
        };
      case 'month':
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return {
          startDate: format(monthStart, 'yyyy-MM-dd'),
          endDate: format(monthEnd, 'yyyy-MM-dd'),
        };
    }
  }, [currentDate, viewMode]);

  // Fetch calendar events
  const {
    data: events,
    isLoading: isLoadingEvents,
    error,
  } = useStaffCalendar(selectedStaffId || undefined, dateRange);

  const handlePrevious = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(addDays(currentDate, -1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === 'encounter' && event.encounterId) {
      router.push(`/${params.locale}/encounters/${event.encounterId}`);
    } else if (event.appointmentId) {
      router.push(`/${params.locale}/scheduling/appointments/${event.appointmentId}`);
    }
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode('day');
  };

  const getDateRangeLabel = () => {
    switch (viewMode) {
      case 'day':
        return format(currentDate, 'MMMM d, yyyy');
      case 'week':
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
    }
  };

  const selectedStaff = staffList?.find((s) => s.staffId === selectedStaffId);

  return (
    <div className="space-y-4 page-transition">
      <PageHeader
        title="Staff Calendar"
        subtitle="View appointments and encounters for staff members"
        icon={CalendarDays}
      />

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Staff Selector */}
            <div className="flex-1 min-w-[250px]">
              <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                <SelectTrigger>
                  <User className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select a staff member..." />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingStaff ? (
                    <div className="p-2">
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : staffList && staffList.length > 0 ? (
                    staffList.map((staff) => (
                      <SelectItem key={staff.staffId} value={staff.staffId}>
                        <div className="flex items-center gap-2">
                          <span>{staff.staffDisplayName || staff.staffId}</span>
                          {staff.staffType && (
                            <Badge variant="outline" className="text-xs">
                              {staff.staffType}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      No staff members found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('day')}
                className="rounded-r-none"
              >
                Day
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
                className="rounded-none border-x"
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('month')}
                className="rounded-l-none"
              >
                Month
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Current Date Range */}
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted/30">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{getDateRangeLabel()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Content */}
      {!selectedStaffId ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Select a Staff Member</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a staff member from the dropdown above to view their calendar
              </p>
            </div>
          </CardContent>
        </Card>
      ) : isLoadingEvents ? (
        <Card>
          <CardContent className="py-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-6">
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              Error loading calendar: {(error as Error).message}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              {selectedStaff?.staffDisplayName || 'Staff Calendar'}
              {selectedStaff?.staffType && (
                <Badge variant="secondary">{selectedStaff.staffType}</Badge>
              )}
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {events?.length || 0} event{(events?.length || 0) !== 1 ? 's' : ''}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === 'day' && (
              <DayView
                date={currentDate}
                events={events || []}
                locale={params.locale}
                onEventClick={handleEventClick}
              />
            )}
            {viewMode === 'week' && (
              <WeekView
                startDate={startOfWeek(currentDate)}
                events={events || []}
                locale={params.locale}
                onEventClick={handleEventClick}
              />
            )}
            {viewMode === 'month' && (
              <MonthView
                currentMonth={currentDate}
                events={events || []}
                locale={params.locale}
                onEventClick={handleEventClick}
                onDayClick={handleDayClick}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      {selectedStaffId && events && events.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-sm font-medium text-muted-foreground">Legend:</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-l-4 border-l-blue-500 bg-card rounded" />
                <span className="text-sm">Appointment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-l-4 border-l-green-500 bg-card rounded" />
                <span className="text-sm">Encounter</span>
              </div>
              <div className="border-l pl-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Scheduled</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Walk-in</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Emergency</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Telemedicine</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
