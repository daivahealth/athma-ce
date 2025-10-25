import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../services/patient-service';
import type { CreatePatientDto, UpdatePatientDto, SearchPatientsDto } from '../types/patient';

/**
 * React Query hooks for patient management
 */

const PATIENT_KEYS = {
  all: ['patients'] as const,
  lists: () => [...PATIENT_KEYS.all, 'list'] as const,
  list: (params: SearchPatientsDto) => [...PATIENT_KEYS.lists(), params] as const,
  details: () => [...PATIENT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PATIENT_KEYS.details(), id] as const,
};

/**
 * Hook to fetch patients list with search/filter
 */
export function usePatients(params: SearchPatientsDto = {}) {
  return useQuery({
    queryKey: PATIENT_KEYS.list(params),
    queryFn: () => patientService.searchPatients(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch a single patient by ID
 */
export function usePatient(id: string) {
  return useQuery({
    queryKey: PATIENT_KEYS.detail(id),
    queryFn: () => patientService.findOne(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to create a new patient
 */
export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePatientDto) => patientService.registerPatient(data),
    onSuccess: () => {
      // Invalidate all patient lists to refresh data
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() });
    },
  });
}

/**
 * Hook to update a patient
 */
export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePatientDto }) =>
      patientService.updatePatient(id, data),
    onSuccess: (updatedPatient) => {
      // Invalidate specific patient detail and lists
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.detail(updatedPatient.id) });
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() });
    },
  });
}

/**
 * Hook to delete a patient
 */
export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientService.delete(id),
    onSuccess: () => {
      // Invalidate patient lists
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() });
    },
  });
}

/**
 * Hook to deactivate a patient
 */
export function useDeactivatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientService.deactivatePatient(id),
    onSuccess: (updatedPatient) => {
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.detail(updatedPatient.id) });
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() });
    },
  });
}

/**
 * Hook to reactivate a patient
 */
export function useReactivatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientService.reactivatePatient(id),
    onSuccess: (updatedPatient) => {
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.detail(updatedPatient.id) });
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() });
    },
  });
}

/**
 * Hook to get patient history
 */
export function usePatientHistory(patientId: string) {
  return useQuery({
    queryKey: [...PATIENT_KEYS.detail(patientId), 'history'],
    queryFn: () => patientService.getPatientHistory(patientId),
    enabled: !!patientId,
  });
}

/**
 * Hook to get patient appointments
 */
export function usePatientAppointments(patientId: string) {
  return useQuery({
    queryKey: [...PATIENT_KEYS.detail(patientId), 'appointments'],
    queryFn: () => patientService.getPatientAppointments(patientId),
    enabled: !!patientId,
  });
}
