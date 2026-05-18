import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { otService } from '../services/ot-service';
import type {
  AmendOtReportInput,
  CheckOtScheduleConflictsInput,
  CreateOtReportInput,
  CreateOtRequestInput,
  CreateOtScheduleInput,
  OtBoardResponse,
  OtReportListFilters,
  OtRequestListFilters,
  OtScheduleListFilters,
  OtTransitionInput,
  TransitionOtScheduleInput,
  UpdateOtReportInput,
  UpdateOtRequestInput,
  UpdateOtRoomConfigInput,
  UpdateOtScheduleInput,
  UpsertOtRoomConfigInput,
} from '../types';

export const otKeys = {
  all: ['ot'] as const,
  board: (date?: string) => [...otKeys.all, 'board', date ?? 'today'] as const,
  requests: (filters?: OtRequestListFilters) => [...otKeys.all, 'requests', filters ?? {}] as const,
  request: (id: string) => [...otKeys.all, 'request', id] as const,
  requestHistory: (id: string) => [...otKeys.all, 'request', id, 'history'] as const,
  schedules: (filters?: OtScheduleListFilters) => [...otKeys.all, 'schedules', filters ?? {}] as const,
  schedule: (id: string) => [...otKeys.all, 'schedule', id] as const,
  scheduleHistory: (id: string) => [...otKeys.all, 'schedule', id, 'history'] as const,
  scheduleConflicts: (payload: CheckOtScheduleConflictsInput) =>
    [...otKeys.all, 'schedule-conflicts', payload] as const,
  reports: (filters?: OtReportListFilters) => [...otKeys.all, 'reports', filters ?? {}] as const,
  report: (id: string) => [...otKeys.all, 'report', id] as const,
  reportVersions: (id: string) => [...otKeys.all, 'report', id, 'versions'] as const,
  rooms: (params?: { facilityId?: string; includeInactive?: boolean }) =>
    [...otKeys.all, 'rooms', params ?? {}] as const,
};

export function useOtBoard(date?: string) {
  return useQuery<OtBoardResponse>({
    queryKey: otKeys.board(date),
    queryFn: () => otService.getBoard(date),
  });
}

export function useOtRequests(filters?: OtRequestListFilters) {
  return useQuery({
    queryKey: otKeys.requests(filters),
    queryFn: () => otService.listRequests(filters),
  });
}

export function useOtRequest(id?: string) {
  return useQuery({
    queryKey: id ? otKeys.request(id) : [...otKeys.all, 'request', 'none'],
    queryFn: () => otService.getRequest(id!),
    enabled: Boolean(id),
  });
}

export function useOtRequestHistory(id?: string) {
  return useQuery({
    queryKey: id ? otKeys.requestHistory(id) : [...otKeys.all, 'request-history', 'none'],
    queryFn: () => otService.getRequestHistory(id!),
    enabled: Boolean(id),
  });
}

export function useCreateOtRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOtRequestInput) => otService.createRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'requests'] });
    },
  });
}

export function useUpdateOtRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOtRequestInput }) =>
      otService.updateRequest(id, data),
    onSuccess: (request) => {
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'requests'] });
      queryClient.invalidateQueries({ queryKey: otKeys.request(request.id) });
    },
  });
}

export function useTransitionOtRequest(action: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: OtTransitionInput }) =>
      otService.transitionRequest(id, action, data),
    onSuccess: (request) => {
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'requests'] });
      queryClient.invalidateQueries({ queryKey: otKeys.request(request.id) });
      queryClient.invalidateQueries({ queryKey: otKeys.requestHistory(request.id) });
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'schedules'] });
    },
  });
}

export function useOtSchedules(filters?: OtScheduleListFilters) {
  return useQuery({
    queryKey: otKeys.schedules(filters),
    queryFn: () => otService.listSchedules(filters),
  });
}

export function useOtSchedule(id?: string) {
  return useQuery({
    queryKey: id ? otKeys.schedule(id) : [...otKeys.all, 'schedule', 'none'],
    queryFn: () => otService.getSchedule(id!),
    enabled: Boolean(id),
  });
}

export function useOtScheduleHistory(id?: string) {
  return useQuery({
    queryKey: id ? otKeys.scheduleHistory(id) : [...otKeys.all, 'schedule-history', 'none'],
    queryFn: () => otService.getScheduleHistory(id!),
    enabled: Boolean(id),
  });
}

export function useCreateOtSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOtScheduleInput) => otService.createSchedule(payload),
    onSuccess: (schedule) => {
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'schedules'] });
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'requests'] });
      queryClient.invalidateQueries({ queryKey: otKeys.schedule(schedule.id) });
    },
  });
}

export function useUpdateOtSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOtScheduleInput }) =>
      otService.updateSchedule(id, data),
    onSuccess: (schedule) => {
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'schedules'] });
      queryClient.invalidateQueries({ queryKey: otKeys.schedule(schedule.id) });
    },
  });
}

export function useTransitionOtSchedule(action: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: TransitionOtScheduleInput }) =>
      otService.transitionSchedule(id, action, data),
    onSuccess: (schedule) => {
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'schedules'] });
      queryClient.invalidateQueries({ queryKey: otKeys.schedule(schedule.id) });
      queryClient.invalidateQueries({ queryKey: otKeys.scheduleHistory(schedule.id) });
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'requests'] });
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'reports'] });
    },
  });
}

export function useCheckOtScheduleConflicts(payload?: CheckOtScheduleConflictsInput) {
  return useQuery({
    queryKey: payload ? otKeys.scheduleConflicts(payload) : [...otKeys.all, 'schedule-conflicts', 'none'],
    queryFn: () => otService.checkScheduleConflicts(payload!),
    enabled: Boolean(payload),
  });
}

export function useOtReports(filters?: OtReportListFilters) {
  return useQuery({
    queryKey: otKeys.reports(filters),
    queryFn: () => otService.listReports(filters),
  });
}

export function useOtReport(id?: string) {
  return useQuery({
    queryKey: id ? otKeys.report(id) : [...otKeys.all, 'report', 'none'],
    queryFn: () => otService.getReport(id!),
    enabled: Boolean(id),
  });
}

export function useOtReportVersions(id?: string) {
  return useQuery({
    queryKey: id ? otKeys.reportVersions(id) : [...otKeys.all, 'report-versions', 'none'],
    queryFn: () => otService.getReportVersions(id!),
    enabled: Boolean(id),
  });
}

export function useCreateOtReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOtReportInput) => otService.createReport(payload),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'reports'] });
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'schedules'] });
      queryClient.invalidateQueries({ queryKey: otKeys.report(report.id) });
    },
  });
}

export function useUpdateOtReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOtReportInput }) =>
      otService.updateReport(id, data),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'reports'] });
      queryClient.invalidateQueries({ queryKey: otKeys.report(report.id) });
      queryClient.invalidateQueries({ queryKey: otKeys.reportVersions(report.id) });
    },
  });
}

export function useSignOtReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: OtTransitionInput }) =>
      otService.signReport(id, data),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'reports'] });
      queryClient.invalidateQueries({ queryKey: otKeys.report(report.id) });
    },
  });
}

export function useAmendOtReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AmendOtReportInput }) =>
      otService.amendReport(id, data),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'reports'] });
      queryClient.invalidateQueries({ queryKey: otKeys.report(report.id) });
      queryClient.invalidateQueries({ queryKey: otKeys.reportVersions(report.id) });
    },
  });
}

export function useCancelOtReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: OtTransitionInput }) =>
      otService.cancelReport(id, data),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'reports'] });
      queryClient.invalidateQueries({ queryKey: otKeys.report(report.id) });
    },
  });
}

export function useOtRooms(params?: { facilityId?: string; includeInactive?: boolean }) {
  return useQuery({
    queryKey: otKeys.rooms(params),
    queryFn: () => otService.listRooms(params),
  });
}

export function useUpsertOtRoomConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertOtRoomConfigInput) => otService.upsertRoomConfig(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'rooms'] });
    },
  });
}

export function useUpdateOtRoomConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ spaceId, data }: { spaceId: string; data: UpdateOtRoomConfigInput }) =>
      otService.updateRoomConfig(spaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...otKeys.all, 'rooms'] });
    },
  });
}
