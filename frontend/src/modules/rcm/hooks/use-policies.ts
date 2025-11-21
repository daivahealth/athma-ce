import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { policyService } from '../services/policy-service';
import type { PolicyStatus, CreatePolicyInput } from '../types/policy';
export function usePatientPolicies(patientId?: string, status?: PolicyStatus) {
  return useQuery({
    queryKey: ['patient-policies', patientId, status],
    queryFn: () => policyService.listByPatient(patientId!, status),
    enabled: Boolean(patientId),
  });
}

export function useCreatePolicy(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<CreatePolicyInput, 'patientId'>) =>
      policyService.create({ ...payload, patientId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-policies', patientId] });
    },
  });
}

export function useArchivePolicy(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => policyService.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-policies', patientId] });
    },
  });
}
