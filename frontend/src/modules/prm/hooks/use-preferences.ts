import { useMutation, useQuery } from '@tanstack/react-query';
import { preferencesService } from '../services/preferences-service';
import type { PatientPreferences } from '../types/preference';

const PREFERENCES_KEYS = {
  all: ['prm', 'preferences'] as const,
  detail: (patientId: string) => [...PREFERENCES_KEYS.all, patientId] as const,
};

export function usePatientPreferences(patientId: string, enabled: boolean) {
  return useQuery<PatientPreferences>({
    queryKey: PREFERENCES_KEYS.detail(patientId),
    queryFn: () => preferencesService.get(patientId),
    enabled: enabled && !!patientId,
  });
}

export function useUpdatePatientPreferences(patientId: string) {
  return useMutation({
    mutationFn: (payload: PatientPreferences) => preferencesService.update(patientId, payload),
  });
}
