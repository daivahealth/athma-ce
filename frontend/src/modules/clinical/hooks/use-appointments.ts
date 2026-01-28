import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { schedulingService } from '../services/scheduling-service';
import type {
  Appointment,
  BookAppointmentInput,
  RescheduleAppointmentInput,
  CancelAppointmentInput,
  AllocateResourceInput,
  AppointmentFilters,
  AppointmentSeries,
  CreateAppointmentSeriesInput,
} from '../types/scheduling';

export const appointmentKeys = {
  all: ['appointments'] as const,
  detail: (id: string) => [...appointmentKeys.all, 'detail', id] as const,
  patient: (patientId: string, filters?: AppointmentFilters) =>
    [...appointmentKeys.all, 'patient', patientId, filters || {}] as const,
  facility: (facilityId: string, startDate: string, endDate: string, filters?: any) =>
    [...appointmentKeys.all, 'facility', facilityId, startDate, endDate, filters || {}] as const,
  currentFacility: (startDate: string, endDate: string, filters?: any) =>
    [...appointmentKeys.all, 'current-facility', startDate, endDate, filters || {}] as const,
  series: (seriesId: string) => [...appointmentKeys.all, 'series', seriesId] as const,
};

// ========================================
// QUERY HOOKS
// ========================================

export function useAppointment(id?: string) {
  return useQuery<Appointment>({
    queryKey: id ? appointmentKeys.detail(id) : ['appointments', 'detail', 'none'],
    queryFn: () => schedulingService.getAppointment(id!),
    enabled: Boolean(id),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function usePatientAppointments(patientId?: string, filters?: AppointmentFilters) {
  return useQuery<Appointment[]>({
    queryKey: patientId ? appointmentKeys.patient(patientId, filters) : ['appointments', 'patient', 'none'],
    queryFn: () => schedulingService.getPatientAppointments(patientId!, filters),
    enabled: Boolean(patientId),
  });
}

export function useFacilityAppointments(
  facilityId: string,
  startDate: string,
  endDate: string,
  filters?: Omit<AppointmentFilters, 'startDate' | 'endDate'>
) {
  return useQuery<Appointment[]>({
    queryKey: appointmentKeys.facility(facilityId, startDate, endDate, filters),
    queryFn: () => schedulingService.getFacilityAppointments(facilityId, startDate, endDate, filters),
    enabled: Boolean(facilityId && startDate && endDate),
  });
}

export function useCurrentFacilityAppointments(
  startDate: string,
  endDate: string,
  filters?: Omit<AppointmentFilters, 'startDate' | 'endDate'>
) {
  return useQuery<Appointment[]>({
    queryKey: appointmentKeys.currentFacility(startDate, endDate, filters),
    queryFn: () => schedulingService.getCurrentFacilityAppointments(startDate, endDate, filters),
    enabled: Boolean(startDate && endDate),
  });
}

export function useAppointmentSeries(seriesId?: string) {
  return useQuery<AppointmentSeries>({
    queryKey: seriesId ? appointmentKeys.series(seriesId) : ['appointments', 'series', 'none'],
    queryFn: () => schedulingService.getAppointmentSeries(seriesId!),
    enabled: Boolean(seriesId),
  });
}

// ========================================
// MUTATION HOOKS
// ========================================

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BookAppointmentInput) => schedulingService.bookAppointment(input),
    onSuccess: (data) => {
      // Invalidate patient appointments
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.patient(data.patientId)
      });
      // Invalidate facility appointments
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'facility']
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'current-facility']
      });
    },
  });
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RescheduleAppointmentInput }) =>
      schedulingService.rescheduleAppointment(id, data),
    onSuccess: (updated) => {
      // Invalidate specific appointment
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(updated.id)
      });
      // Invalidate patient appointments
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.patient(updated.patientId)
      });
      // Invalidate facility appointments
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'facility']
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'current-facility']
      });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: CancelAppointmentInput }) =>
      schedulingService.cancelAppointment(id, data),
    onSuccess: (updated) => {
      // Invalidate specific appointment
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(updated.id)
      });
      // Invalidate patient appointments
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.patient(updated.patientId)
      });
      // Invalidate facility appointments
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'facility']
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'current-facility']
      });
    },
  });
}

export function useAllocateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AllocateResourceInput) => schedulingService.allocateResource(input),
    onSuccess: (_data, variables) => {
      // Invalidate the appointment detail
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(variables.appointmentId)
      });
    },
  });
}

export function useConfirmResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: string) => schedulingService.confirmResource(resourceId),
    onSuccess: () => {
      // Invalidate all appointment queries
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.all
      });
    },
  });
}

// ========================================
// APPOINTMENT SERIES HOOKS
// ========================================

export function useCreateAppointmentSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAppointmentSeriesInput) =>
      schedulingService.createAppointmentSeries(input),
    onSuccess: (data) => {
      // Invalidate patient appointments
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.patient(data.patientId)
      });
      // Invalidate facility appointments
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'facility']
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'current-facility']
      });
    },
  });
}

export function usePauseAppointmentSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seriesId: string) => schedulingService.pauseAppointmentSeries(seriesId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.series(data.id)
      });
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.patient(data.patientId)
      });
    },
  });
}

export function useResumeAppointmentSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seriesId: string) => schedulingService.resumeAppointmentSeries(seriesId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.series(data.id)
      });
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.patient(data.patientId)
      });
    },
  });
}

export function useCancelAppointmentSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ seriesId, reason }: { seriesId: string; reason: string }) =>
      schedulingService.cancelAppointmentSeries(seriesId, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.series(data.id)
      });
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.patient(data.patientId)
      });
      // Invalidate facility appointments
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'facility']
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'current-facility']
      });
    },
  });
}
