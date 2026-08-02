import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nationalIdentityService } from '../services/national-identity-service';
import type {
  CompleteChallengeInput,
  CreateAbhaAddressInput,
  CreatePatientIdentityInput,
  StartChallengeInput,
  UpdatePatientIdentityInput,
} from '../types/national-identity';

export function useIdentityProviders(country?: string) {
  return useQuery({
    queryKey: ['identity-providers', country ?? 'all'],
    queryFn: () => nationalIdentityService.listProviders(country),
    // Provider availability changes only when configuration changes.
    staleTime: 5 * 60 * 1000,
  });
}

export function usePatientIdentities(patientId: string) {
  return useQuery({
    queryKey: ['patient-identities', patientId],
    queryFn: () => nationalIdentityService.listPatientIdentities(patientId),
    enabled: !!patientId,
  });
}

export function useValidateIdentity() {
  return useMutation({
    mutationFn: (payload: { country: string; identityType: string; value: string }) =>
      nationalIdentityService.validate(payload),
  });
}

export function useStartIdentityChallenge() {
  return useMutation({
    mutationFn: (payload: StartChallengeInput) => nationalIdentityService.startChallenge(payload),
  });
}

export function useCompleteIdentityChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ txnId, payload }: { txnId: string; payload: CompleteChallengeInput }) =>
      nationalIdentityService.completeChallenge(txnId, payload),
    onSuccess: (result) => {
      // A successful verification may have attached an identity to the patient.
      if (result.identity) {
        queryClient.invalidateQueries({
          queryKey: ['patient-identities', result.identity.patientId],
        });
        queryClient.invalidateQueries({ queryKey: ['patients', result.identity.patientId] });
      }
    },
  });
}

export function useCreatePatientIdentity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      patientId,
      payload,
    }: {
      patientId: string;
      payload: CreatePatientIdentityInput;
    }) => nationalIdentityService.createPatientIdentity(patientId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patient-identities', variables.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patients', variables.patientId] });
    },
  });
}

export function useUpdatePatientIdentity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      patientId,
      id,
      payload,
    }: {
      patientId: string;
      id: string;
      payload: UpdatePatientIdentityInput;
    }) => nationalIdentityService.updatePatientIdentity(patientId, id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patient-identities', variables.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patients', variables.patientId] });
    },
  });
}

export function useDeletePatientIdentity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, id }: { patientId: string; id: string }) =>
      nationalIdentityService.deletePatientIdentity(patientId, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patient-identities', variables.patientId] });
    },
  });
}

export function useAbhaAddressSuggestions() {
  return useMutation({
    mutationFn: (txnId: string) => nationalIdentityService.getAbhaAddressSuggestions(txnId),
  });
}

export function useCreateAbhaAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAbhaAddressInput) =>
      nationalIdentityService.createAbhaAddress(payload),
    onSuccess: (_, variables) => {
      if (variables.patientId) {
        queryClient.invalidateQueries({ queryKey: ['patient-identities', variables.patientId] });
      }
    },
  });
}
