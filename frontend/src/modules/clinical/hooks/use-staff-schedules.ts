import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { schedulingService } from '../services/scheduling-service';
import type {
  CreateStaffScheduleInput,
  CreateWeeklyStaffScheduleInput,
  StaffSchedule,
  StaffScheduleFilters,
  StaffScheduleSummary,
  UpdateStaffScheduleInput,
} from '../types/scheduling';

export const staffScheduleKeys = {
  all: ['staff-schedules'] as const,
  scheduled: (filters?: { facilityId?: string }) =>
    [...staffScheduleKeys.all, 'scheduled', filters?.facilityId ?? 'all'] as const,
  staff: (staffId: string) => [...staffScheduleKeys.all, 'staff', staffId] as const,
  list: (staffId: string, filters?: StaffScheduleFilters) =>
    [...staffScheduleKeys.staff(staffId), filters ?? null] as const,
};

export function useStaffSchedules(staffId?: string, filters?: StaffScheduleFilters) {
  return useQuery<StaffSchedule[]>({
    queryKey: staffId ? staffScheduleKeys.list(staffId, filters) : ['staff-schedules', 'staff', 'none'],
    queryFn: () => schedulingService.getStaffSchedules(staffId!, filters),
    enabled: Boolean(staffId),
  });
}

export function useScheduledStaff(filters?: { facilityId?: string }) {
  return useQuery<StaffScheduleSummary[]>({
    queryKey: staffScheduleKeys.scheduled(filters),
    queryFn: () => schedulingService.listScheduledStaff(filters),
  });
}

export function useCreateStaffSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateStaffScheduleInput) => schedulingService.createStaffSchedule(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: staffScheduleKeys.staff(data.staffId) });
    },
  });
}

export function useUpdateStaffSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffScheduleInput }) =>
      schedulingService.updateStaffSchedule(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: staffScheduleKeys.staff(updated.staffId) });
    },
  });
}

export function useDeleteStaffSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId: string }) =>
      schedulingService.deleteStaffSchedule(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: staffScheduleKeys.staff(variables.staffId) });
    },
  });
}

export function useCreateWeeklyStaffSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWeeklyStaffScheduleInput) =>
      schedulingService.createWeeklyStaffSchedule(input),
    onSuccess: (created, variables) => {
      const staffId = created?.[0]?.staffId || variables.staffId;
      if (staffId) {
        queryClient.invalidateQueries({ queryKey: staffScheduleKeys.staff(staffId) });
      }
    },
  });
}
