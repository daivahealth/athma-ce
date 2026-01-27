import { useQuery } from '@tanstack/react-query';
import { schedulingService } from '../services/scheduling-service';
import type { CalendarEvent, StaffCalendarFilters } from '../types/scheduling';

export const calendarKeys = {
  all: ['calendar'] as const,
  staff: (staffId: string, filters?: StaffCalendarFilters) =>
    [...calendarKeys.all, 'staff', staffId, filters ?? {}] as const,
};

export function useStaffCalendar(staffId?: string, filters?: StaffCalendarFilters) {
  return useQuery<CalendarEvent[]>({
    queryKey: staffId ? calendarKeys.staff(staffId, filters) : ['calendar', 'staff', 'none'],
    queryFn: () => schedulingService.getStaffCalendar(staffId!, filters),
    enabled: Boolean(staffId),
  });
}
