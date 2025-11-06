/**
 * React Query hooks for encounter management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { encounterService } from '../services/encounter-service';
import type {
  CreateEncounterInput,
  UpdateEncounterInput,
  SearchEncounterParams,
} from '../types/encounter';

const ENCOUNTER_KEYS = {
  all: ['encounters'] as const,
  lists: () => [...ENCOUNTER_KEYS.all, 'list'] as const,
  list: (params: SearchEncounterParams) => [...ENCOUNTER_KEYS.lists(), params] as const,
  details: () => [...ENCOUNTER_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ENCOUNTER_KEYS.details(), id] as const,
  patient: (patientId: string) => [...ENCOUNTER_KEYS.all, 'patient', patientId] as const,
  todayFacility: (facilityId: string) => [...ENCOUNTER_KEYS.all, 'today', facilityId] as const,
};

/**
 * Hook to search encounters
 */
export function useEncounters(params: SearchEncounterParams = {}) {
  return useQuery({
    queryKey: ENCOUNTER_KEYS.list(params),
    queryFn: () => encounterService.searchEncounters(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch a single encounter by ID
 */
export function useEncounter(id: string) {
  return useQuery({
    queryKey: ENCOUNTER_KEYS.detail(id),
    queryFn: () => encounterService.getEncounter(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch patient encounters
 */
export function usePatientEncounters(patientId: string) {
  return useQuery({
    queryKey: ENCOUNTER_KEYS.patient(patientId),
    queryFn: () => encounterService.getPatientEncounters(patientId),
    enabled: !!patientId,
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to fetch today's encounters for a facility
 */
export function useTodayEncounters(facilityId: string) {
  return useQuery({
    queryKey: ENCOUNTER_KEYS.todayFacility(facilityId),
    queryFn: () => encounterService.getTodayEncounters(facilityId),
    enabled: !!facilityId,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to create a new encounter
 */
export function useCreateEncounter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEncounterInput) => encounterService.createEncounter(data),
    onSuccess: (data) => {
      // Invalidate encounter lists
      queryClient.invalidateQueries({ queryKey: ENCOUNTER_KEYS.lists() });

      // Invalidate patient encounters
      queryClient.invalidateQueries({
        queryKey: ENCOUNTER_KEYS.patient(data.patientId),
      });

      // Invalidate today's encounters if facility exists
      if (data.facilityId) {
        queryClient.invalidateQueries({
          queryKey: ENCOUNTER_KEYS.todayFacility(data.facilityId),
        });
      }
    },
  });
}

/**
 * Hook to update an encounter
 */
export function useUpdateEncounter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEncounterInput }) =>
      encounterService.updateEncounter(id, data),
    onSuccess: (updatedEncounter) => {
      // Invalidate specific encounter detail
      queryClient.invalidateQueries({
        queryKey: ENCOUNTER_KEYS.detail(updatedEncounter.id),
      });

      // Invalidate encounter lists
      queryClient.invalidateQueries({ queryKey: ENCOUNTER_KEYS.lists() });

      // Invalidate patient encounters
      queryClient.invalidateQueries({
        queryKey: ENCOUNTER_KEYS.patient(updatedEncounter.patientId),
      });
    },
  });
}

/**
 * Hook to update encounter status
 */
export function useUpdateEncounterStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      encounterService.updateEncounterStatus(id, status),
    onSuccess: (updatedEncounter) => {
      // Invalidate specific encounter detail
      queryClient.invalidateQueries({
        queryKey: ENCOUNTER_KEYS.detail(updatedEncounter.id),
      });

      // Invalidate encounter lists
      queryClient.invalidateQueries({ queryKey: ENCOUNTER_KEYS.lists() });

      // Invalidate patient encounters
      queryClient.invalidateQueries({
        queryKey: ENCOUNTER_KEYS.patient(updatedEncounter.patientId),
      });

      // Invalidate today's encounters
      if (updatedEncounter.facilityId) {
        queryClient.invalidateQueries({
          queryKey: ENCOUNTER_KEYS.todayFacility(updatedEncounter.facilityId),
        });
      }
    },
  });
}
